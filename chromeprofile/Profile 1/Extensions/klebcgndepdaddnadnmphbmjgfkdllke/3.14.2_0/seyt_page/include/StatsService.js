'use strict';

const XHR_STATE_DONE = 4;

const API_HOST = Debug.workWithFakeData ? 'http://local.se' : 'https://surfearner.com';
const API_HOST2 = Debug.workWithFakeData ? 'http://local.se' : 'https://s3.surfearner.com';

const API_CPA_CONTRACT_STATS_URI = API_HOST + '/api/cpa_contract/stats';
const API_CPA_CONTRACT_FIND = API_HOST2 + '/api/cpa_contract/find';
const API_CPA_CONTRACT_CHANGE_STATE = API_HOST2 + '/api/cpa_contract/change_state';
const API_CPA_CONTRACT_RENEW = API_HOST2 + '/api/cpa_contract/renew';
const API_CPA_CONTRACT_REDIRECT = API_HOST2 + '/api/cpa_contract/redirect';
const API_CPA_TRANSITION_MSG = API_HOST2 + '/api/cpa_transition_site/message';

/**
 * Сервис работы с сервером.
 *
 * Отправляет три вида запросов:
 *  - получение токена по данным задания
 *  - отправка состояния задания
 *  - получение состояния задания
 *
 * Запросы асинхронные, поэтому в момент отправки состояния задания
 * (где обязательно должен быть токен) токена может не быть.
 * Поэтому данные для отправки сохраняются в очередь, которая будет разгребаться сразу по получении токена.
 */
class StatsService {

  /**
   *
   * @param {CPAData} cpa
   * @param wrongHttpStatusHandler
   * @param {StatsServiceDebugger} dbg
   */
  constructor(cpa, wrongHttpStatusHandler, dbg = null) {
    this.cpa = cpa;

    this.wrongHttpStatusHandler = wrongHttpStatusHandler;
    this.dbg = dbg;

    this.token = null;

    if (Debug.logStatsQueue) {
      this.statsQueue = queueTraceDecorator(new Queue());
    }
    else {
      this.statsQueue = new Queue();
    }

    this.logQueue = new Queue();

    // Запрос токена.
    let target = new URL(API_CPA_CONTRACT_STATS_URI + '/token');
    let params = new URLSearchParams();
    params.set('user_id', this.cpa.userId);
    params.set('contract_code', this.cpa.contractCode);
    params.set('min_play_seconds', this.cpa.minToPlaySeconds);
    params.set('max_total_seconds', this.cpa.maxTotalSeconds);
    target.search = params.toString();

    let xhr = new XMLHttpRequest();

    xhr.open('GET', target, true);

    // Начинать отправлять статистику мы можем только после того,
    // как получили токен.
    // Однако между запросом токена и ответом от сервера существует временной лаг,
    // если делать такой запрос синхронно (у меня локально он был стабильно в районе 5 секунд).
    xhr.onreadystatechange = () => {
      if (200 !== xhr.status) {
        // Если сервер не дал получить токен,
        // то просто уведомляем об этом вызывающий код - пусть он там разбирается, что с этим делать.
        this.wrongHttpStatusHandler(new HttpStatus(xhr.status, xhr.statusText));
      }
      else if (XHR_STATE_DONE === xhr.readyState) {
        this.token = JSON.parse(xhr.response);
        this._sendStatsFromQueue();
        this._sendLogsFromQueue();
      }
    };
    xhr.send();
  }

  sendStatusChanged(status, cancelReason = '', captchaToken = '') {
    let formData = new FormData();
    formData.append('code', this.cpa.contractCode);
    formData.append('token', this.cpa.token);
    formData.append('state', status);

    if (captchaToken) {
      formData.append('captcha_token', captchaToken);
    }
    if (cancelReason) {
      formData.append('rejection_reason_codename', cancelReason);
    }
    this.logQueue.enqueue(formData);
    this._sendLogsFromQueue();
  }

  sendPlayerSize(width, height) {
    let formData = new FormData();
    formData.append('width', width);
    formData.append('height', height);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', API_CPA_CONTRACT_STATS_URI + '/player_size', true);
    xhr.setRequestHeader('X-Token', this.token);

    xhr.send(formData);
  }

  /**
   *
   * @param {Player} player
   */
  notify = (player) => {
    if (!player.isChanged()) {
      return;
    }

    let formData = new FormData();
    formData.append('ts', player.timestamp);
    formData.append('ts_started', player.timestampStarted);
    formData.append('state', player.currentState);
    formData.append('current_play_time', player.time);
    if (player.isCanceled()) {
      formData.append('cancel_reason', player.cancelReason);
    }

    // Запросы асинхронные, поэтому токен мы могли еще не получить,
    // поэтому данные для покладания в сервер откладаем в очередь.
    this.statsQueue.enqueue(formData);

    if (this.token) {
      this._sendStatsFromQueue();
    }
  };

  _sendStatsFromQueue() {
    // Токен может оказать сброшенным в какой-то итерации
    // (если сервер ответил ошибкой).
    while(this.token && !this.statsQueue.isEmpty()) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', API_CPA_CONTRACT_STATS_URI, true);
      xhr.setRequestHeader('X-Token', this.token);
      xhr.onreadystatechange = () => {
        if (200 !== xhr.status) {
          // Если сервер дал ошибку, то это всё, конец.
          // Передаем её наверх, запрещаем сервису отправку каких-либо данных
          // и прерываем текущее разгребание очереди.
          this.wrongHttpStatusHandler(new HttpStatus(xhr.status, xhr.statusText));
          this.token = null;
        }
        else {
          if (XHR_STATE_DONE === xhr.readyState) {
            if (this.dbg) {
              let response = JSON.parse(xhr.response);
              this.dbg.sendStatsResponseCallback(response);
            }
          }
        }
      };

      let formData = this.statsQueue.dequeue();
      if (this.dbg) {
        let data = formDataToObj(formData);
        this.dbg.beforeSendStatsCallback(data);
      }

      xhr.send(formData);
    }
  }

  _sendLogsFromQueue() {
    while(!this.logQueue.isEmpty()) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', API_CPA_CONTRACT_CHANGE_STATE, true);

      // Для отладки всего лишь.
      // Логи шлем асинхронно и, по сути, нам здесь всё равно что там с ними дальше.
      // Если сервер их принял - для нас не меняется ничего,
      // если сервер их не принял - тоже, потому что логи вещь вспомогательная.
      xhr.onreadystatechange = () => {
        if (200 === xhr.status && XHR_STATE_DONE === xhr.readyState) {
          let response = JSON.parse(xhr.response);
        }
      };
      let formData = this.logQueue.dequeue();
      xhr.send(formData);
    }
  }

  get = (responseCallback) => {
    let target = new URL(this.apiUrl);
    let params = new URLSearchParams();
    params.set('user_id', this.cpa.userId);
    params.set('contract_code', this.cpa.contractCode);
    target.search = params.toString();

    let xhr = new XMLHttpRequest();
    xhr.open('GET', target, true);
    xhr.onreadystatechange = function () {
      if (XHR_STATE_DONE === xhr.readyState) {
        let response = JSON.parse(xhr.response);
        responseCallback(response);
      }
    };
    xhr.send();
  };
}
