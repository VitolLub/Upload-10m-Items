//#####################################################
//#####################################################
//#####################################################

/**
 * Выводить лог в консоль
 *
 * @type {boolean}
 */
const log = false;

/**
 * Список вида Тип => Шаблон для генерации html-кода баннера.
 *
 * @type {Array|null}
 */
let bannerTemplates = null;

/**
 * Время последнего обновления шаблонов.
 *
 * @type {number}
 */
let bannerTemplatesUpdatedAt = 0;

/**
 * Шаблон Push-сообщения о зачислении денег за просмотр баннера.
 *
 * @type {Object}
 */
const bannerPushTemplate = {
  "type": "ntf",
  "ntf":  {
    "nid":   1020,
    "ttl":   5,
    "conf":  false,
    "img":   "\/\/static.surfearner.com\/images\/svg\/icon_push_money_bag.svg",
    "title": "\u0412\u043e\u0437\u043d\u0430\u0433\u0440\u0430\u0436\u0434\u0435\u043d\u0438\u0435 \u0437\u0430\u0447\u0438\u0441\u043b\u0435\u043d\u043e!",
    "msg":   "\u0411\u0430\u043d\u043d\u0435\u0440 {{ $time }} \u0441\u0435\u043a. \/ <span style=\"color:#56A848\">+{{ $price }} RUB<\/span>",
    "css":   "#se_ntf-1020{width:300px;}",
    "tpl":   {
      "tag":      "div",
      "class":    "surfearner_notification",
      "id":       "se_ntf-${nid}",
      "data-top": "",
      "children": [{
        "tag":      "div",
        "class":    "_se-img",
        "children": [{"tag": "img", "src": "${img}", "alt": "", "width": "100%", "height": "100%", "html": ""}]
      }, {"tag": "div", "class": "_se-title", "html": "${title}"}, {
        "tag":   "div",
        "class": "_se-msg",
        "html":  "${msg}"
      }, {"tag": "div", "class": "_se-close_btn", "data-nid": "${nid}"}]
    }
  },
};

//#####################################################
//#####################################################
//#####################################################

/**
 * Модель текущего баннера.
 *
 * @type {BannerModel}
 */
class BannerModel {
  /**
   * Конструктор класса.
   *
   * @param {Banners} parent Уравляющий класс
   * @param {Object} data Данные баннера из БД
   */
  constructor(parent, data) {
    let $this = this;
    this.parent = parent;
    injectProperties(this, {
      /**
       * Данные из БД загружены.
       *
       * @type {boolean}
       */
      loaded: false,

      /**
       * ID баннера.
       *
       * @type {number|null}
       */
      adid: null,

      /**
       * Тип баннера.
       *
       * @type {number|null}
       */
      type: null,

      /**
       * Цена баннера за показ.
       *
       * @type {number|null}
       */
      price: null,

      /**
       * Время показа баннера.
       *
       * @type {number|null}
       */
      time: null,

      /**
       * Ссылка баннера.
       *
       * @type {string|null}
       */
      link: null,

      /**
       * Имя файла картнки или основной текст ссылки баннера.
       *
       * @type {string|null}
       */
      file: null,

      /**
       * Ширина графического баннера
       *
       * @type {number|null}
       */
      size: null,

      /**
       * Дополнительный текст баннера.
       *
       * @type {number|null}
       */
      alt_text: null,

      /**
       * Баннер 18+.
       *
       * @type {number|null}
       */
      adult: null,

      /**
       * Предпросмотр баннера создателем.
       *
       * @type {boolean}
       */
      preview: false,

      /**
       * Упакованные данные о просмотре.
       *
       * @type {string|null}
       */
      key: null,

      //
      // Состояния баннера.
      //

      /**
       * На паузе.
       *
       * @type {boolean}
       */
      paused: false,

      /**
       * Окончен отсчет времени показа.
       *
       * @type {boolean}
       */
      finished: false,

      /**
       * Показ оплачен.
       *
       * @type {boolean}
       */
      paid: false,

      /**
       * По баннеру кликнули.
       *
       * @type {boolean}
       */
      clicked: false,

      /**
       * Баннер закрыт.
       *
       * @type {boolean}
       */
      closed: false,

      /**
       * Позиция баннера.
       *
       * @type {("top"|"bottom")}
       */
      position: "top",

      /**
       * Баннер имеет html-код.
       *
       * @type {boolean}
       */
      htmlGenerated: false,

      //
      // Времена запущенного баннера.
      //

      /**
       * Время отсчета. UnixTime.
       *
       * @type {number|null}
       */
      started: null,

      /**
       * Осталось секунд до окончания показа баннера.
       *
       * @type {number|null}
       */
      timeLeft: null,

      //
      // Свои свойства.
      //

      /**
       * Имя класса ссылки в html-коде баннера.
       *
       * @type {string}
       */
      linkClass: "",

      /**
       * Html-код баннера.
       *
       * @type {string|null}
       */
      html: null,

      /**
       * Идентефикатор таймаута для отправки оплаты показа.
       *
       * @type {number}
       */
      sendPayHandler: 0,

    })
      .then(() => {
        $this.loadDBData(data)
          .then(() => {
            if (this.adult)
              $this.linkClass = "adult";
            $this.loaded = true;
          })
          .catch(noop);
      })
      .catch(noop);
  }

  /**
   * Считывает данные из БД.
   *
   * @param {Object} data
   *
   * @returns {Promise}
   */
  loadDBData(data) {
    return new Promise((resolve, reject) => {
      if (data && typeof data === "object") {
        this.adid = parseInt(data.adid);
        this.type = parseInt(data.type);
        this.price = parseFloat(data.price);
        this.time = parseInt(data.time) + 1;
        this.link = data.link.trim();
        this.file = data.file.trim();
        this.size = parseInt(data.size);
        this.alt_text = data.alt_text ? data.alt_text.trim() : "";
        this.adult = data.adult;
        this.key = data.key.trim();
        this.preview = undefined === data.preview ? false : data.preview;
        if (this.size > 728) {
          this.size = 728;
        }
        return resolve();
      } else {
        return reject();
      }
    });
  }

  /**
   * Инициализация класса.
   *
   * @returns {Promise}
   * @throws {Promise}
   */
  init() {
    let $this = this;
    return new Promise(function (resolve, reject) {
      $this.loadTemplates()
        .then(() => {
          $this.generateHtml()
            .then(() => {
              $this.htmlGenerated = true;
              return resolve();
            })
            .catch(() => {
              return reject();
            });
        })
        .catch(() => {
          return reject();
        });
    });
  }

  /**
   * Начало показа баннера.
   *
   * @returns {undefined}
   */
  start() {
    this.started = Date.now() / 1000 | 0;
    this.timeLeft = this.time;
    log && console.log("BannerModel::start()", this);
  }

  /**
   * При клике по баннеру.
   *
   * @returns {undefined}
   */
  click() {
    if (!this.clicked) {
      this.clicked = true;
      this.timeLeft = -1;
      this.pay(this.timeLeft, 1);
    }
  }

  /**
   * Время показа баннера истекло.
   *
   * @returns {undefined}
   */
  finish() {
    if (!this.finished) {
      this.timeLeft = -1;
      this.finished = true;
      if (!this.preview) {
        this.pay(this.timeLeft, 1);
      }
    }
    this.parent.addStatistics("finished");
  }

  /**
   * Запрос к серверу на оплату показа.
   *
   * @param {Object} data
   * @param {Function} cbOk
   * @param {Function} cbError
   *
   * @returns {undefined}
   */
  sendPayRequest(data, cbOk, cbError) {
    let link = serverUrl() + "/advert/bannerFinish?ver=" + this.parent.version;
    ajax(
      link,
      data,
      function (response) {
        cbOk(response);
      },
      function (response) {
        cbError(response);
      },
      "json"
    );
  }

  /**
   * Оплата показа.
   *
   * @param {number} timeout Сколько осталось до завершения отсчета баннера.
   * @param {number} attempt Номер попытки оплаты.
   *
   * @returns {undefined}
   */
  pay(timeout, attempt) {
    // Если осуществляется повторная отправка - остановим.
    if (this.sendPayHandler) {
      clearTimeout(this.sendPayHandler);
      this.sendPayHandler = 0;
    }
    if (10 < attempt) {
      this.paid = true;
      this.parent.addStatistics("notPaid");
      return;
    }
    if (!this.paid) {
      let $this = this;
      this.sendPayHandler = setTimeout(() => {
        $this.sendPayHandler = 0;
        $this.sendPayRequest(
          {
            uid:     cm.get("extauth"),
            key:     $this.key,
            clicked: $this.clicked ? 1 : 0,
            stats:   this.parent.stats,
            timeout: this.parent.nextRunTimeout
          },
          function (response) {
            $this.sendPayHandler = 0;
            if (response.success && response.key && response.key === $this.key) {
              $this.paid = true;
              $this.parent.addStatistics("paid");
              if (response.hasOwnProperty("nextQuery")) {
                $this.parent.nextRunTimeout = parseInt(response.nextQuery) * 1000;
              }
            } else {
              log && console.error("BannerModel.pay(FAILED).", response);
              $this.pay(3 + attempt * 2, attempt + 1);
            }
          },
          function (response) {
            log && console.error("BannerModel.pay(ERROR).", response);
            $this.sendPayHandler = 0;
            $this.pay(3 + attempt * 2, attempt + 1);
          }
        );
      }, timeout * 1000);
    }
  }

  /**
   *  Ожидание завершения оплаты показа баннера.
   *
   * @returns {Promise}
   */
  waitForPayment() {
    return new Promise((resolve, reject) => {
      if ((this.finished || this.clicked) && !this.paid) {
        return reject();
      } else {
        return resolve();
      }
    });
  }

  /**
   * Push-сообщение об оплате.
   *
   * @returns {Object}
   */
  getPushPaid() {
    let push = bannerPushTemplate;
    let fields = {time: this.time - 2, price: this.price};
    for (let field in fields) {
      if (fields.hasOwnProperty(field)) {
        let re = new RegExp("\\{\\{ \\$" + field + " \\}\\}", "g");
        push.ntf.msg = push.ntf.msg.replace(re, fields[field]);
      }
    }
    return push;
  }

  /**
   * Прошла секунда показа баннера.
   *
   * @returns undefined
   */
  tick() {
    if (this.finished || this.clicked || this.closed || this.paused || !this.loaded) {
      return;
    }
    this.timeLeft--;
    // Нужен отсчет
    if (this.timeLeft >= 0) {
      this.generateHtml().then(() => {
        this.parent.sendMessage("tick", null);
      }).catch(() => {
        this.parent.stop();
      });
    }
    // Отсчет закончен
    else {
      this.finish();
      this.parent.sendMessage("finished", null);
    }
  }

  /**
   * Генерация html-кода баннера.
   *
   * @returns {Promise}
   */
  generateHtml() {
    let $this = this;
    return new Promise(function (resolve, reject) {
      $this.html = $this.parseTemplate($this, bannerTemplates[$this.type]);
      if ($this.html)
        return resolve();
      else
        return reject();
    });
  }

  /**
   * Обработка шаблона.
   *
   * @param {BannerModel} $this
   * @param {string} template
   * @returns {string}
   */
  parseTemplate($this, template) {
    let dbFields = ["adid", "type", "price", "timeLeft", "link", "file", "size", "alt_text", "linkClass"];
    for (let i in dbFields) {
      let val = $this[dbFields[i]];
      let re = new RegExp("\\{\\{ \\$" + dbFields[i] + " \\}\\}", "g");
      template = template.replace(re, val);
    }
    return template;
  }

  /**
   * Загрузка темплейтов.
   *
   * @returns {Promise}
   */
  loadTemplates() {
    let $this = this;
    return new Promise(function (resolve, reject) {
      let tm = Date.now() / 1000 | 0;
      if (bannerTemplates && bannerTemplatesUpdatedAt + 86400 > tm) {
        return resolve();
      }
      let link = serverUrl() + "/advert/getBannerTemplates?ver=" + $this.parent.version;
      ajax(link, null,
        function (response) {
          if (response.hasOwnProperty("templates")) {
            bannerTemplates = response.templates;
            bannerTemplatesUpdatedAt = tm;
            return resolve();
          } else {
            return reject();
          }
        },
        function (status, text) {
          log && console.log("XHTTP " + link + " (" + status + "): " + text);
          return reject();
        },
        "json"
      );
    });
  }

  /**
   * Постановка баннера на паузу.
   *
   * @returns {undefined}
   */
  pause() {
    this.paused = true;
  }

  /**
   * Восстановление работы баннера после паузы.
   *
   * @returns {undefined}
   */
  resume() {
    this.paused = false;
  }

}

//#####################################################
//#####################################################
//#####################################################

/**
 * Класс для работы с баннерами.
 *
 * @type {Banners}
 */
class Banners {
  //
  // Конструктор класса.
  //
  constructor() {
    let $this = this;
    injectProperties(this, {
      /**
       * Список готовых для приема вкладок.
       *
       * @type {Array}
       */
      tabs: [],

      /**
       * Список показанных баннеров.
       *
       * @type {Object}
       */
      visitedList: {},

      /**
       * Сколько времени хранить показанный баннер в списке.
       *
       * @type {number}
       */
      visitedListTtl: 604800, // 7 дней

      /**
       * Текущая вкладка.
       *
       * @type {number}
       */
      activeTabId: 0,

      /**
       * Текущий баннер.
       *
       * @type {BannerModel|null}
       */
      current: null,

      /**
       * Показ приостановлен.
       *
       * @type {boolean}
       */
      paused: false,

      /**
       * Текущий баннер закрыт юзером.
       *
       * @type {boolean}
       */
      closed: false,

      /**
       * Актуальна ли последняя введенная капча.
       *
       * @type {boolean}
       */
      actualCaptcha: true,

      /**
       * Пользователь подписан на показ баннеров.
       *
       * @type {boolean}
       */
      subscribed: true,

      /**
       * Расширение включено.
       *
       * @type {boolean}
       */
      extensionEnabled: false,

      /**
       * Идентефикатор таймаута для следующего запуска run().
       *
       * @type {number}
       */
      nextRunHandler: 0,

      /**
       * Время таймаута для следующего запуска run().
       *
       * @type {number}
       */
      nextRunTimeout: 10000,

      /**
       * Текущая версия расширения.
       *
       * @type {string}
       */
      version: "undefined",

      /**
       * Количество неудачных отправок сообщений
       *
       * @type {number|null}
       */
      sendAttempts: 0,

      /**
       * Максимальное количество ошибок отправки
       *
       * @type {number}
       */
      maxSendingErrors: 10,

      /**
       * Идентефикатор таймаута для повторных отправок сообщений.
       *
       * @type {number}
       */
      sendHandler: 0,

      /**
       * Идентефикатор таймаута тиков запущенного баннера.
       *
       * @type {number}
       */
      tickHandler: 0,

      /**
       * Идентефикатор таймаута запуска баннера.
       *
       * @type {number}
       */
      startHandler: 0,

      /**
       * Информация о просмотренных за сутки баннерах.
       *
       * @type {{date: number, closed: number, finished: number, clicked: number, sent: number, paid: number}}
       */
      stats: {
        date:     Date.now() / 86400000 | 0,
        sent:     0,
        clicked:  0,
        closed:   0,
        finished: 0,
        paid:     0,
        notPaid:  0
      },

      /**
       * ID таймера перезапуск запроса баннера.
       */
      bannerRequestResetTimerId:false,

      /**
       * Время таймера перезапуск запроса баннера.
       */
      bannerRequestResetTimerTime:3*60*1000,

    })
      .then(() => {
        chrome.storage.local.get("visitedBannersIdsList", function (storage) {
          if (storage.hasOwnProperty("bannersList") && storage.bannersList) {
            let time = Date.now() / 1000 | 0;
            let list = JSON.parse(storage.bannersList);
            for (let i in list) {
              if (list.hasOwnProperty(i) && time < list[i]) {
                $this.visitedList[i] = list[i];
              }
            }
          }
          $this.saveVisitedList();
        });
        let manifest = chrome.runtime.getManifest();
        $this.version = manifest.version.replace(new RegExp(/\./, "g"), "_");
      })
      .catch(noop);
  }

  //
  // Функции работы с текущим баннером.
  //

  /**
   * Учитывает в статистике указанный параметр.
   *
   * @param {string} attr Параметр.
   *
   * @returns {undefined}
   */
  addStatistics(attr) {
    if (!this.current || this.current.preview) {
      return;
    }
    // Учитываем стату только в том дне где показали баннер.
    // Не позволяем данным по баннеру "расплескаться" в разные дня.
    if ("sent" === attr) {
      let dt = Date.now() / 86400000 | 0;
      if (dt !== this.stats.date) {
        this.stats = {
          date:     dt,
          sent:     0,
          clicked:  0,
          closed:   0,
          finished: 0,
          paid:     0,
          notPaid:  0
        };
      }
    }
    if (this.stats.hasOwnProperty(attr)) {
      this.stats[attr]++;
      log && console.log("Stats(" + attr + "):", this.stats);
    } else {
      log && console.warn("Stats(" + attr + "): property not found!");
    }
  }

  /**
   * Добавляет активную вкладку в доступные для работы.
   *
   * @param {number} tabId
   * @param {boolean} enabled
   *
   * @returns {Promise}
   */
  activeTab(tabId, enabled) {
    let $this = this;
    return new Promise(function (resolve, reject) {
      $this.activeTabId = tabId;
      $this.tabs[$this.activeTabId] = enabled;
      if (enabled) {
        $this.current.resume();
        $this.tick();
        return resolve();
      } else {
        $this.current.pause();
        return reject();
      }
    });
  }

  /**
   * Добавляет вкладку в доступные для работы.
   *
   * @param {number} tabId
   * @param {boolean} enabled
   *
   * @returns {Promise}
   */
  addTab(tabId, enabled) {
    this.tabs[tabId] = enabled;
  }

  /**
   * Удаляет вкладку из списка доступных
   *
   * @param {number} tabId
   *
   * @returns {undefined}
   */
  removeTab(tabId) {
    if (tabId === this.activeTabId) {
      this.activeTabId = 0;
    }
    if (tabId in this.tabs) {
      this.tabs.splice(tabId, 1);
    }
  }

  /**
   * Добавление новго баннера.
   *
   * @param {Array} bannerData
   *
   * @returns {undefined}
   */
  add(bannerData) {
    if (bannerData.hasOwnProperty("refreshTemplates") && bannerData.refreshTemplates) {
      bannerTemplates = null;
    }
    if (bannerData.hasOwnProperty("subscribed")) {
      this.subscribed = bannerData.subscribed;
    }
    if (bannerData.hasOwnProperty("nextQuery")) {
      this.nextRunTimeout = parseInt(bannerData.nextQuery) * 1000;
    }
    if (!this.current && bannerData.hasOwnProperty("item") && bannerData.item) {
      let $this = this;

      this.startBannerRequestResetTimer();

      this.current = new BannerModel(this, bannerData.item);
      this.current.init()
        .then(() => {
          $this.addStatistics("sent");
          $this.start();
        })
        .catch(() => {
          $this.stop();
          $this.clearCurrent();
        });
    } else {
      this.nextRun();
    }
  }

  /**
   * Запуска/пере запуска таймера сброса ожидания запроса следующего баннера.
   */
  startBannerRequestResetTimer(){
    let self = this;
    this.bannerRequestResetTimerId = setTimeout(()=>{
      if (self.current) {
        self.stop();
        self.clearCurrent();
        self.nextRun();
      }
    }, self.bannerRequestResetTimerTime);
  }

  /**
   * Постановка баннера на паузу.
   *
   * @returns {undefined}
   */
  pause() {
    if (this.current) {
      this.paused = true;
      this.current.pause();
      this.sendMessage("pause", null);
    }
  }

  /**
   * Можно получить следующий баннер.
   *
   * @returns {boolean}
   */
  getNextBannerEnabled() {
    if (window.lastUserActivity === undefined) {
      window.lastUserActivity = Date.now() / 1000 | 0;
    }
    let userIsActive = ((Date.now() / 1000 | 0) - window.lastUserActivity) < 300;
    log && console.log(`SE BANNER. Method: getNextBannerEnabled. userIsActive "${userIsActive}".`);
    return !this.current && this.subscribed && this.extensionEnabled && userIsActive;
  }

  /**
   * Отсчет времени показа баннера разрешен.
   *
   * @returns {boolean}
   */
  tickEnabled() {
    // let result = this.current
    return this.current
      && window.visible
      && this.activeTabId > 0
      && (this.activeTabId in this.tabs)
      && (this.tabs[this.activeTabId] || this.current.preview)
      && !this.paused
      && !this.closed;
    /*

    if (log && !result) {
      !this.current && console.log("===> tickEnabled(current): false");
      this.activeTabId <= 0 && console.log("===> tickEnabled(activeTabId): false");
      !(this.activeTabId in this.tabs) && console.log("===> tickEnabled(activeTabId in tabs): false");
      !this.tabs[this.activeTabId] && console.log("===> tickEnabled(tabs[activeTabId]): false");
      this.paused && console.log("===> tickEnabled(!paused): false");
      !this.subscribed && console.log("===> tickEnabled(subscribed): false");
      !this.extensionEnabled && console.log("===> tickEnabled(extensionEnabled): false");
    }

    return result;
    */
  }

  /**
   * Восстановление работы баннера после паузы.
   *
   * @returns {undefined}
   */
  resume() {
    if (this.current) {
      this.paused = false;
      this.current.resume();
      if (this.tickEnabled()) {
        this.sendMessage("resume", null);
      }
    }
  }

  /**
   * Восстановление баннера после активирования вкладки.
   *
   * @returns {undefined}
   */
  refresh() {
    if (this.tickEnabled()) {
      this.sendMessage(this.current.closed ? "close" : "refresh", null);
    }
  }

  /**
   * Начало показа баннера.
   *
   * @returns {undefined}
   */
  start() {
    let $this = this;
    // Прошлый раз не сработало
    if (this.startHandler) {
      clearTimeout(this.startHandler);
      this.startHandler = 0;
      log && console.log("!!!!! Старый таймаут start().");
    }
    // Остался (?) от прошлого баннера
    if (this.tickHandler) {
      clearInterval(this.tickHandler);
      this.tickHandler = 0;
      log && console.log("!!!!! Старый таймаут тика.");
    }
    this.current.start();
    this.tickHandler = setInterval(function () {
      $this.tick();
    }, 1000);
  }

  /**
   * Очищает данные текущего баннера.
   *
   * @returns {undefined}
   */
  clearCurrent() {
    if (this.sendHandler) {
      clearTimeout(this.sendHandler);
      this.sendHandler = 0;
    }
    if (this.tickHandler) {
      clearInterval(this.tickHandler);
      this.tickHandler = 0;
    }
    if (this.current) {
      this.current = null;
    }
    this.closed = false;
    this.paused = false;
    this.sendAttempts = 0;
  }

  /**
   * Прекращение показа баннера.
   *
   * @returns {undefined}
   */
  stop() {
    log && console.trace("Stop banner");
    this.closed = true;
    if (this.tickHandler) {
      clearTimeout(this.tickHandler);
      this.tickHandler = 0;
    }
    this.sendMessageToAllTabs("close", null);
    if (this.current.clicked && !this.current.finished) {
      this.sendPushPaidMessage(this.current.getPushPaid());
    }
    if (!this.current.preview) {
      this.visitedList [this.current.adid] = (Date.now() / 1000 | 0) + this.visitedListTtl;
      this.saveVisitedList();
      this.waitForPayment();
    } else {
      this.clearCurrent();
      this.nextRun();
    }
  }

  /**
   * Отправка пуша об оплате.
   *
   * @param {Object} push
   *
   * @returns {undefined}
   */
  sendPushPaidMessage(push) {
    let $this = this;
    log && console.log("send PushPaid(0)");
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      log && console.log("send PushPaid(1)");
      if (0 in tabs) {
        log && console.log("send PushPaid(2)");
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            query:   "checkState",
            success: true,
            data:    push
          },
          (response) => {
            if (chrome.runtime.lastError) {
              log && console.error("send PushPaid(ERROR):", chrome.runtime.lastError);
              setTimeout(() => {
                $this.sendPushPaidMessage(push);
              }, 1000);
            } else {
              log && console.log("send PushPaid(OK):", response);
            }
          }
        );
      }
    });
  }

  /**
   *  Ожидание оплаты показа баннера.
   *
   * @returns {undefined}
   */
  waitForPayment() {
    this.current.waitForPayment()
      // Оплата прошла
      .then(() => {
        this.clearCurrent();
        this.nextRun();
      })
      // Оплата еще не завершена
      .catch(() => {
        let $this = this;
        setTimeout(() => {
          $this.waitForPayment();
        }, 1000);
      });
  }

  /**
   * Прошла секунда показа баннера.
   *
   * @returns {undefined}
   */
  tick() {
    if (this.tickEnabled()) {
      this.current.tick();
    }
  }

  /**
   * Устанавливает позицию текущего баннера.
   *
   * @param {String} position
   *
   * @returns {undefined}
   */
  position(position) {
    if (position === "top" || position === "bottom") {
      if (this.current) {
        this.current.position = position;
      }
    } else {
      log && console.log("Invalid banner position: ", position);
    }
  }

  /**
   * Пользователь закрыл баннер
   */
  userClick() {
    this.addStatistics("clicked");
    this.current.click();
    this.stop();
  }

  /**
   * Пользователь закрыл баннер
   */
  userClose() {
    this.addStatistics("closed");
    this.stop();
  }

  //
  // Служебные функции
  //

  /**
   * Сохранение списка ID просмотренных баннеров.
   *
   * @returns {undefined}
   */
  saveVisitedList() {
    chrome.storage.local.set({"visitedBannersIdsList": JSON.stringify(this.visitedList)});
  }

  /**
   * Отправка сообщения баннера в текущую вкладку.
   *
   * @param {string} changedProperty Измененное свойство текущего баннера.
   * @param {Function} cbResponse Коллбек после отправки
   *
   * @returns {undefined}
   */
  sendMessage(changedProperty, cbResponse) {
    let $this = this;
    log && console.log("Send message: " + changedProperty);
    // Если осуществляется повторная отправка - остановим.
    if (this.sendHandler) {
      clearTimeout(this.sendHandler);
      this.sendHandler = 0;
    }
    // Получаем текущую вкладку
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      // Убеждаемся что вкладка готова к приему сообщения
      let tabId = 0;
      if (tabs[0] && tabs[0].id) {
        for (let id in $this.tabs) {
          if (($this.tabs[id] || $this.current.preview) && tabs[0].id === parseInt(id)) {
            tabId = parseInt(id);
            break;
          }
        }
      }
      // Если текущая вкладка готова - отправляем сообщение
      if (tabId) {
        log && console.log("Ready tab(" + tabId + ")", $this.tabs[tabId]);
        $this.sendBannerMessage(tabId, changedProperty, function (response) {
          $this.sendAttempts = 0;
          if (cbResponse !== undefined && typeof cbResponse === "function") {
            cbResponse(response);
          }
        });
      } else
        // Если текущая вкладка не готова
      {
        // Если баннер остановлен - не отправляем повторно
        if ("close" === changedProperty) {
          if (cbResponse !== undefined && typeof cbResponse === "function") {
            cbResponse(null);
          }
        } else {
          // Если много ошибок - прекращаем повторную отправку
          if (++$this.sendAttempts > $this.maxSendingErrors) {
            log && console.warn(
              "Banners.sendMessage(tabId:" + tabs[0].id + "). Repeat failed.",
              changedProperty,
              $this.sendAttempts
            );
          } else
            // Попробуем отправть позже
          {
            log && console.log(
              "Banners.sendMessage(tabId:" + (tabs[0] ? tabs[0].id : '???') + "). Repeat.", tabs,
              changedProperty,
              $this.sendAttempts
            );
            $this.sendHandler = setTimeout(function () {
              $this.sendHandler = 0;
              $this.sendMessage(changedProperty, cbResponse);
            }, 3000);
          }
        }
      }
    });
  }

  /**
   * Отправка сообщения баннера во все вкладки.
   *
   * @param {string} changedProperty Измененное свойство текущего баннера.
   * @param {Function} cbResponse Коллбек после отправки
   *
   * @returns {undefined}
   */
  sendMessageToAllTabs(changedProperty, cbResponse) {
    for (let id in this.tabs) {
      let tabId = parseInt(id);
      // Если вкладка готова и не блокирована
      if (tabId && (this.tabs[tabId] || this.current.preview)) {
        let $this = this;
        this.sendBannerMessage(tabId, changedProperty, function (response) {
          $this.sendAttempts = 0;
          if (cbResponse !== undefined && typeof cbResponse === "function") {
            cbResponse(response);
          }
        });
      }
    }
  }

  /**
   * Отправка сообщения во вкладку.
   *
   * @param {number} tabId
   * @param {String} changedProperty
   * @param {Function} cbResponse
   *
   * @returns {undefined}
   */
  sendBannerMessage(tabId, changedProperty, cbResponse) {
    let data = {};
    if (this.current) {
      data = {
        changed:    changedProperty,
        bannerId:   this.current.adid,
        bannerHtml: this.current.html,
        timeLeft:   this.current.timeLeft,
        position:   this.current.position,
        clicked:    this.current.clicked,
        closed:     this.closed
      };
    } else {
      data = {changed: changedProperty};
    }
    chrome.tabs.sendMessage(
      tabId,
      {
        query: "__se_banner_change",
        data:  data
      },
      function (response) {
        if (cbResponse !== undefined && typeof cbResponse === "function") {
          cbResponse(response);
        }
      }
    );
  }

  /**
   * Событие, если для получения нового баннера нужен ввод капчи.
   *
   * @param needCaptcha Капча нужна
   * @param needCaptchaMessage Ножен пуш о вводе капчи
   *
   * @returns {undefined}
   */
  needCaptcha(needCaptcha, needCaptchaMessage) {
    if (undefined !== typeof needCaptcha) {
      this.actualCaptcha = !needCaptcha;
      if (needCaptcha && needCaptchaMessage) {
        this.sendMessage('needCaptcha', null);
      }
    }
  }

  /**
   * Получение нового баннера.
   *
   * @returns {undefined}
   */
  nextBanner() {
    log && console.log(
      `SE BANNER. Method: nextBanner.`
      + ` seytPageState "${window.seytPageState.isRunning}".`
      + ` getNextBannerEnabled "${this.getNextBannerEnabled()}".`
    );
    if (window.seytPageState.isRunning) {
      this.nextRun();
      return;
    }
    if (this.getNextBannerEnabled()) {
      log && console.log(`SE BANNER. Method: nextBanner. Action: request banner.`);
      let $this = this;
      let link =
            this.actualCaptcha
              ? serverUrl() + "/advert/getBanner?ver=" + this.version
              : serverUrl() + "/advert/needCaptcha?ver=" + this.version;
      let data =
            this.actualCaptcha
              ? {
                list:    JSON.stringify(this.visitedList),
                enabled: this.extensionEnabled,
                stats:   this.stats,
                timeout: this.nextRunTimeout
              }
              : {};
      ajax(
        link,
        data,
        function (response) {
          // Добавление баннера
          $this.add(response);
          if (response.hasOwnProperty('needCaptcha')) {
            $this.needCaptcha(response.needCaptcha, response.needCaptchaMessage);
          }
        },
        function (status, text) {
          log && console.log("XHTTP " + link + " (" + status + "): " + text);
          $this.nextRun();
        },
        "json"
      );
    } else {
      log && console.log(`SE BANNER. Method: nextBanner. Action: nextRun.`);
      this.nextRun();
    }
  }

  /**
   * Инициирует следующий вызов run().
   *
   * @returns {undefined}
   */
  nextRun() {
    log && console.log(`SE BANNER. Method: nextRun.`);
    let $this = this;
    if (this.nextRunHandler) {
      clearTimeout(this.nextRunHandler);
    }
    this.nextRunHandler = setTimeout(function () {
      $this.nextRunHandler = 0;
      if (!$this.current) {
        // Пускаем следующий баннер
        log && console.log(`SE BANNER. Method: nextRun. Action: run.`);
        $this.run();
      }else {
        // Ожидаем окончания показа баннера
        log && console.log(`SE BANNER. Method: nextRun. Action: nextRun.`);
        $this.nextRun();
      }
    }, this.nextRunTimeout);
  }

  /**
   * Основная функция (точка входа).
   *
   * @returns {undefined}
   */
  run() {
    // Если нет текущего баннера и разрешен показ
    if (!this.current) {
      // Получаем следующий баннер
      log && console.log(`SE BANNER. Method: run. Action: nextBanner.`);
      this.nextBanner();
    }
    // Если баннер уже загружен или не разрешен показ
    else {
      // Запускаем позже
      log && console.log(`SE BANNER. Method: run. Action: nextRun.`);
      this.nextRun();
    }
  }

}

//#####################################################
//#####################################################
//#####################################################
