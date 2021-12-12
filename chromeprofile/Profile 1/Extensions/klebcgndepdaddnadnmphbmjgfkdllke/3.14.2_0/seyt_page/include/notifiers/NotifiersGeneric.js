'use strict';

class NotifiersGeneric{

  constructor() {
    this.icons_host = 'https://static.surfearner.com/images';
    this.tpl = {
      'tag':      'div',
      'class':    'surfearner_notification',
      'id':       '${nid}',
      'data-top': '',
      'children': [
        {
          'tag': 'div', 'class': '_se-img', 'children': [
            {
              'tag':    'img',
              'src':    '${img}',
              'alt':    '',
              'width':  '100%',
              'height': '100%',
              'html':   '',
            },
          ],
        },
        {'tag': 'div', 'class': '_se-title', 'html': '${title}'},
        {'tag': 'div', 'class': '_se-msg', 'html': '${msg}'},
        {'tag': 'div', 'class': '_se-close_btn', 'data-nid': '${nid}'},
      ],
    };

    let listCpasLink = `<a href=https://surfearner.com/cpa>Посмотрите доступные задания >></a>`;
    let listCpasLink2 = `<a href=https://surfearner.com/cpa>Открыть список доступных заданий >></a>`;

    this.items = {
      manual:          {
        img:   'svg/icon_push_timer15.svg',
        title: 'Как выполнить задание:',
        msg:   '1. Смотрите это видео до истечения таймера<br>2. Введите капчу для зачисления вознаграждения',
        autoclose_seconds: 10,
      },
      timeout:         {
        img:   'svg/icon_push_warning.svg',
        title: 'Задание не выполнено!',
        msg:   `Вы не успели выполнить задание за отведенное время<br>${listCpasLink}`,
        is_solo: true,
      },
      limit_is_over: {
        img: 'svg/icon_push_warning.svg',
        title: 'Лимит исчерпан.',
        msg:   `Это задание более недоступно для выполнения.<br>${listCpasLink2}`,
        is_solo: true,
      },
      error_auth:      {
        img:   'svg/icon_push_warning.svg',
        title: 'Ошибка авторизации',
        msg:   '',
      },
    };

    this.stateNotifyMap = {};
    this.stateNotifyMap[STATE_IS_INITIAL] = 'manual';
    this.stateNotifyMap[STATE_LIMIT_IS_OVER] = 'limit_is_over';
    this.stateNotifyMap[STATE_AUTH_ERROR] = 'error_auth';

    this.addGenericItemsData();
  }

  addGenericItemsData() {
    // Генерация nid (с префиксом модуля) и урлов картинок.
    for (let key in this.items) {
      if ('undefined' === typeof this.items[key].nid) {
        this.items[key].nid = `seyt-page-${key}`;
        this.items[key].img = `${this.icons_host}/${this.items[key].img}`;
      }
    }
  }

  notifyByState(state) {
    let notifyKey = ('undefined' !== typeof this.stateNotifyMap[state]) ? this.stateNotifyMap[state] : 'job_error';

    if ('undefined' === typeof this.items[notifyKey]) {
      return null;
    }

    return this.items[notifyKey];
  }

  notifyByKey(key) {
    if ('undefined' === typeof this.items[key]) {
      return null;
    }

    return this.items[key];
  }

  isErrorNotify(id) {
    for (let key in this.items) {
      if (this.items[key].nid === id && this.items[key].img.includes('icon_push_warning.svg')) {
        return true;
      }
    }
    return false;
  }
}
