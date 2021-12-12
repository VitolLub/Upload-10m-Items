'use strict';

const PLAYER_MSG = 'player_msg';
const STATE_REQUEST = 'state_request';
const CPA_REQUEST = 'cpa_request';
const INFO_REQUEST = 'info_request';
const PLAYER_SIZE_REQUEST = 'player_size_request';
const CMD_TO_BACKEND = 'cmd_to_backend';
const CMD_TO_FRONT = 'cmd_to_front';

const BG_ACTION_CLEAR = 'bg_action_clear';
const BG_ACTION_RELOAD = 'bg_action_reset';
const BG_ACTION_CANCEL = 'bg_action_cancel';
const BG_ACTION_SUCCESS = 'bg_action_success';
const BG_ACTION_CLOSE_TAB = 'bg_action_close_tab';

const FG_ACTION_INIT = 'fg_action_init';
const FG_ACTION_CLEAR_SUCCESS = 'fg_action_clear_success';
const FG_ACTION_TRANSITION = 'fg_action_transition';

const TIMER_CORRECTION_SECONDS = 3;


/**
 * Timestamp в секундах.
 *
 * @returns {number}
 */
let currentTimestamp = () => {
  return Math.floor(new Date().getTime() / 1000);
};

let sendPlayerAction = (action) => {
  // @debug: запись в консоль лога сообщений плееру.
  //sendDebugMsg('sevideo sendPlayerAction(' + action.toUpperCase() + ')');
  chrome.runtime.sendMessage(new PlayerMsg(action));
};

let sendClearAction = () => {
  chrome.runtime.sendMessage(new CommandToBackendMsg(BG_ACTION_CLEAR));
};

let sendCancelAction = (cancelReason) => {
  //sendDebugMsg('sevideo sendCancelAction(' + cancelReason + ')');
  chrome.runtime.sendMessage(new CommandToBackendMsg(BG_ACTION_CANCEL, cancelReason));
};

let sendSuccessAction = (captcha_token = '') => {
  chrome.runtime.sendMessage(new CommandToBackendMsg(BG_ACTION_SUCCESS, captcha_token));
};

let sendCloseTabAction = (tabId) => {
  chrome.runtime.sendMessage(new CommandToBackendMsg(BG_ACTION_CLOSE_TAB, tabId));
}

let isAds = () => {
  // Это для отслеживания классов
  //let playerEl = document.querySelector('.html5-video-player');
  //sendDebugMsg('playerEl: %o', playerEl.className);
  // А это классы, замеченные в добавлении в когда рекламные вставки.
  //ad-showing ad-interrupting
  //sendDebugMsg('ad-showing: %o', null !== document.querySelector('.ad-showing'));
  //sendDebugMsg('ad-interrupting: %o', null !== document.querySelector('.ad-interrupting'));

  return null !== document.querySelector('.ad-interrupting');
};

/**
 * Склонение для чисел.
 *
 * @param {Number} number
 * @param {String} form1 форма для числа 1
 * @param {String} form2 форма для числа 2
 * @param {String} form5 форма для числа 5
 * @returns {String}
 */
let morphRu = function (number, form1, form2, form5) {
  let modulo = Math.abs(parseInt(number)) % 100;
  if (modulo > 10 && modulo < 20) {
    return `${number} ${form5}`;
  }
  modulo = number % 10;
  if (modulo > 1 && modulo < 5) {
    return `${number} ${form2}`;
  }
  if (modulo === 1) {
    return `${number} ${form1}`;
  }

  return `${number} ${form5}`;
};

/**
 * Возвращает отформатированное значение отведенного на задание времени.
 *
 * @param {Number|String} value
 * @returns {String}
 */
let secondsToTaskExpireFormatted = function (value) {
  let seconds = parseInt(value);

  if (seconds <= 120) {
    return morphRu(seconds, 'секунды', 'секунд', 'секунд');
  }

  let minutes = Math.trunc(seconds / 60);
  seconds = seconds % 60;

  let str = morphRu(minutes, 'минуты', 'минут', 'минут');
  if (0 !== seconds) {
    str += ' ' + morphRu(seconds, 'секунды', 'секунд', 'секунд');
  }
  return str;
};

/**
 * Возвращает отформатированное значение секунд как времени.
 *
 * @param {Number|String} value
 * @returns {String}
 */
let secondsFormatted = function (value) {
  let seconds = parseInt(value);

  if (seconds <= 120) {
    return morphRu(seconds, 'секунда', 'секунды', 'секунд');
  }

  let minutes = Math.trunc(seconds / 60);
  seconds = seconds % 60;

  let str = morphRu(minutes, 'минута', 'минуты', 'минут');
  if (0 !== seconds) {
    str += ' ' + morphRu(seconds, 'секунда', 'секунды', 'секунд');
  }
  return str;
};

/**
 * С минутами, если секунд больше 60.
 *
 * @param value
 * @returns {String}
 */
let timeCpaFormatted = function (value) {
  let seconds = parseInt(value);

  if (seconds <= 60) {
    return morphRu(seconds, 'секунда', 'секунды', 'секунд');
  }

  let minutes = Math.trunc(seconds / 60);
  seconds = seconds % 60;

  let str = morphRu(minutes, 'минута', 'минуты', 'минут');
  if (0 !== seconds) {
    str += ' ' + morphRu(seconds, 'секунда', 'секунды', 'секунд');
  }
  return str;
}

let secondsFromString = function (strTime) {
  return strTime.split(':').reduce((acc, time) => (60 * acc) + +time);
};

class HttpStatus {
  constructor(statusCode, statusText) {
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

class CPAData {
  /**
   *
   * @param {Object} data
   * @param {String} videoCode
   */
  constructor(data, videoCode) {
    this.contractCode = data.code;
    this.userId = data.user_id;
    this.videoCode = videoCode;
    this.token = data.token;
    this.expiresAt = data.expires_at;
    this.maxTotalSeconds = data.expiration_time;
    this.minToPlaySeconds = data.required_viewing_time;
    this.maxOutFocusSeconds = data.max_focus_switching_time;
    this.rewardAmount = data.remuneration_amount;
    this.isFirstTime = data.is_first_time;
    this.isCaptchaEnabled = data.is_captcha_enabled;
  }
}

class ErrorMessage {
  /**
   *
   * @param {string} errorType
   * @param {string} msg
   * @param data
   */
  constructor(errorType, msg, data) {
    this.errorType = errorType;
    this.msg = msg;
    this.data = data;
  }
}

class PlayerMsg {
  constructor(action) {
    this.timestamp = currentTimestamp();
    this.type = PLAYER_MSG;
    this.action = action;
  }
}

class StateRequest {
  constructor() {
    this.type = STATE_REQUEST;
  }
}

class CPARequest {
  constructor() {
    this.type = CPA_REQUEST;
  }
}

class CommandToBackendMsg {
  /**
   *
   * @param {String} cmd BG_ACTION_*
   * @param {String} data необязательные дополнительные данные
   */
  constructor(cmd, data = '') {
    this.type = CMD_TO_BACKEND;
    this.cmd = cmd;
    this.data = data;
  }
}

class CommandToFrontMsg {
  /**
   *
   * @param {String} cmd FG_ACTION_*
   * @param {String} data необязательные дополнительные данные
   */
  constructor(cmd, data = '') {
    this.type = CMD_TO_FRONT;
    this.cmd = cmd;
    this.data = data;
  }
}

class InfoRequest {
  constructor() {
    this.type = INFO_REQUEST;
  }
}

class InfoResponse {
  constructor(tabId, windowId) {
    this.tabId = tabId;
    this.windowId = windowId;
  }
}

class PlayerSizeRequest {
  constructor(playerRect) {
    this.type = PLAYER_SIZE_REQUEST;
    this.playerRect = playerRect;
  }
}

class VideoType {
  // Буфер, поскольку пока инициализируется DOM
  // можно определить не один раз реклама / не реклама
  // (определение происходит несколько раз в секунду).
  static get COUNT_TO_TOGGLE() {
    return 4;
  }

  constructor() {
    this.isAds = isAds();
    this.counter = 0;
  }

  /**
   *
   * @param {TimerElement} timerEl
   */
  check(timerEl) {
    if (!isAds() && this.isAds) {
      this.counter++;
      if (this.counter === VideoType.COUNT_TO_TOGGLE) {
        this.isAds = false;
        this.counter = 0;
        timerEl.onVideoStarted();
      }
    }

  }
}

class VideoTime {

  constructor(playerNode) {
    this.playerNode = playerNode;
    this.updateVideoLength();
  }

  get durationInSeconds() {
    return this._durationInSeconds;
  }

  get currentTime() {
    return this._currentTime;
  }

  get isAds() {
    return this._isAds;
  }

  updateVideoLength = () => {
    this._durationInSeconds = this.getVideoLength();
    this._currentTime = this.getCurrentTime();
    this._isAds = isAds();
    if (Debug.logVideoTime) {
      sendDebugMsg('updatedVideoLength: %o', {
        durationInSeconds: this._durationInSeconds,
        currentTime:       this._currentTime,
        isAds:             this._isAds,
      });
    }
  };

  getCurrentTime() {
    let elements = document.getElementsByClassName('video-stream');
    if (!elements.length) {
      return 0;
    }

    return Math.round(elements[0].currentTime);
  };

  getVideoLength() {
    let durationEl = this.playerNode.querySelector('.ytp-time-duration');
    if (null === durationEl) {
      return 0;
    }
    return secondsFromString(durationEl.textContent);
  };

  getRemainSeconds() {
    return this.durationInSeconds - this.getCurrentTime();
  }
}

class TimerElement {

  #CREATED = 'created';
  #RUNNING = 'running';
  #PAUSED = 'paused';

  /**
   *
   * @param {CPAData} cpa
   */
  constructor(cpa) {
    this.cpa = cpa;
    this.state = this.#CREATED;
    this.el = document.createElement('div');
    this.el.id = '_se_visit_timer';
    if (cpa.isCaptchaEnabled) {
      this.el.classList.add('captcha-enabled');
    }
    this.el.innerHTML = '<img src="//static.surfearner.com/images/hourglass.gif" />';
    document.body.append(this.el);
  }

  start(playerNode) {
    this.videoTime = new VideoTime(playerNode);
    if (Debug.logVideoTime) {
      sendDebugMsg('this.videoTime: %o', this.videoTime);
    }
    // Таймер должен быть проинициализирован, возможные коррекции будут потом.
    this.seconds = this.cpa.minToPlaySeconds;
    if (Debug.logVideoTime) {
      sendDebugMsg('this.seconds from minToPlaySeconds: %o', this.seconds);
    }
    // Возможные коррекции.
    this._correctSeconds();
    this.state = this.#RUNNING;
  }

  _correctByRemains() {
    let remainSeconds = this.videoTime.getRemainSeconds();

    if (this.seconds > (remainSeconds - TIMER_CORRECTION_SECONDS)) {
      // - 1 - компенсация, поскольку мы реагируем на ровно 0.
      this.seconds = remainSeconds - 1 - TIMER_CORRECTION_SECONDS;
      if (Debug.logVideoTime) {
        sendDebugMsg('this.seconds corrected by remains to %o', this.seconds);
      }
    }
  }

  _correctSeconds() {
    // Корректировку таймера на непревышение таймера над оставшимся временем ролика
    // делаем только для настоящего видео, не рекламной вставки.
    if (!this.videoTime.isAds) {
      this._correctByRemains();
    }

    // Корректируем таймер для учета уже прошедшего времени (если оно есть).
    if (this.videoTime.currentTime > 0) {
      this.seconds = this.seconds - this.videoTime.currentTime;
      if (this.seconds > 0) {
        if (Debug.logVideoTime) {
          sendDebugMsg('this.seconds corrected by passed time to %o', this.seconds);
        }
      }
      else {
        if (Debug.logVideoTime) {
          sendDebugMsg('this.seconds < 1 %o', this.seconds);
        }
        this.seconds = this.cpa.minToPlaySeconds;
        if (Debug.logVideoTime) {
          sendDebugMsg('this.seconds corrected to original time %o', this.seconds);
        }
        this._correctByRemains();
      }
    }
  }

  run() {
    this.state = this.#RUNNING;
  }

  pause() {
    this.state = this.#PAUSED;
  }

  isPaused() {
    return this.#PAUSED === this.state;
  }

  isEnoughToVideoRemains() {
    if (Debug.logVideoTime) {
      sendDebugMsg('isEnoughToVideoRemains, this.seconds: %o, remain: %o', this.seconds, this.videoTime.getRemainSeconds());
    }
    if (this.videoTime.isAds) {
      return true;
    }
    return this.seconds < this.videoTime.getRemainSeconds();
  }

  /**
   *
   */
  update() {
    if (!document.getElementById(this.el.id)) {
      document.body.append(this.el);
    }

    if (this.#RUNNING !== this.state) {
      return;
    }

    if (--this.seconds > 0) {
      this.el.innerText = `${this.seconds}`;
    } else {
      this.el.innerHTML = '<img class="se-timer-check" src="//static.surfearner.com/images/svg/check.svg" />';
    }
  }

  /**
   *
   */
  hide() {
    if (!this.el.classList.contains('closed')) {
      this.el.classList.add('closed');
    }
  }

  /**
   *
   */
  onVideoStarted() {
    this.videoTime.updateVideoLength();
    this._correctSeconds();
  }

  /**
   *
   * @returns {Number}
   */
  getSeconds() {
    return this.seconds;
  }
}

class AlertTime {
  /**
   *
   * @param timeoutSeconds секунды обратного счетчика.
   * @param elId id элемента со строкой оставшихся секунд.
   * @param cancelReason одна из CANCEL_REASON_* констант, причина отмены, которая будет указана, если счетчик истечет.
   */
  constructor(timeoutSeconds, elId, cancelReason) {
    this.initSeconds = timeoutSeconds;
    this.seconds = this.initSeconds;
    this.elId = elId;
    this.cancelReason = cancelReason;
  }

  update() {
    let el = document.getElementById(this.elId);
    if (!el) {
      return;
    }

    if (--this.seconds > 0) {
      el.innerText = secondsFormatted(this.seconds);
    }
    else {
      sendCancelAction(this.cancelReason);
    }
  }

  reset() {
    this.seconds = this.initSeconds;
  }
}
