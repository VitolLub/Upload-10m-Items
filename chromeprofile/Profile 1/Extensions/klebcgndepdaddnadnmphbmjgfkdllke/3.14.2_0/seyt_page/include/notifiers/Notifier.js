'use strict';

/**
 * @todo: на рефакторинг всё расширение целиком,
 * тогда этот класс разобьется на поведение (методы push, close, move etc.)
 * и устанавливаемые через конструктор определения данных (tpl, notifies etc.).
 * Часть переменных уйдут в конкретные реализации, часть - в общий класс.
 */
class Notifier {
  /**
   * @param {NotifiersGeneric} notifiers
   */
  constructor(notifiers) {
    this.notifiers = notifiers;
    this.wrapperId = 'surfearner_ntf_wrap';
    this.bannerId = 'surfearner_frame';
    this.notifyClass = notifiers.tpl.class;
    this.topMargin = 15;
  }


  push = (state, value = null) => {
    let notify = this.notifiers.notifyByState(state);
    if (null === notify) {
      return;
    }

    if (document.getElementById(notify.nid)) {
      return;
    }

    // Инструкцию удаляем при любом новом пуше после неё.
    if (this.isNotifyShowedByStates([STATE_IS_INITIAL])) {
      this.removeByState(STATE_IS_INITIAL);
    }

    // if any notify is showing now
    let wrapperEl = document.getElementById(this.wrapperId);
    if (!wrapperEl) {
      wrapperEl = document.createElement('div');
      wrapperEl.id = this.wrapperId;
      document.body.insertBefore(wrapperEl, document.body.firstChild);
    }

    if ('undefined' !== typeof notify.is_solo) {
      while (wrapperEl.firstChild) {
        this.remove(wrapperEl.firstChild.id);
      }
    }

    let se = document.getElementById('surfearner');
    let banner = null;
    if (se && se.classList.contains('se_top')) {
      banner = document.getElementById(this.bannerId);
    }
    let offsetY = (banner ? banner.offsetHeight : 0);

    let last_ntf = false;
    let top = this.topMargin + offsetY;

    for (let i in wrapperEl.childNodes) {
      if (!(parseInt(i) >= 0)) {
        break;
      }
      let childEl = wrapperEl.childNodes[i];
      if ((childEl.style && childEl.style.display === 'none') || !childEl.attributes['data-top']) {
        continue;
      }

      last_ntf = childEl;
    }

    if (last_ntf !== false) {
      top = parseInt(last_ntf.attributes['data-top'].value) + last_ntf.offsetHeight + this.topMargin;
    }

    let notifyClone = Object.assign({}, notify);

    let parser = new DOMParser();
    if (value) {
      notifyClone.msg = notify.msg.replace('{VALUE}', value);
    }
    let doc = parser.parseFromString(json2html.transform(notifyClone, this.notifiers.tpl), 'text/html');

    wrapperEl.appendChild(doc.querySelector('.' + this.notifyClass));

    let index = wrapperEl.childNodes.length - 1;
    let lastChild = wrapperEl.childNodes[index];

    // close button
    let el = document.getElementById(notify.nid);
    if (el) {
      el.querySelector('._se-close_btn').addEventListener('click', (event) => {
        this.close(notifyClone.nid);
        if ('undefined' !== typeof notify.onCloseCallback) {
          notify.onCloseCallback();
        }
      });
    }

    // show animation
    setTimeout(() => {
      lastChild.style.top = top + 'px';
    }, 200);

    lastChild.attributes['data-top'].value = top;

    if ('undefined' !== typeof notifyClone.autoclose_seconds) {
      setTimeout(() => {
        this.close(notifyClone.nid);
      }, notifyClone.autoclose_seconds * 1000);
    }
  };

  close = (id) => {
    if (id) {
      let el = document.getElementById(id);
      if (el) {
        el.parentNode.removeChild(el);
      }
    } else {
      let all = document.querySelectorAll('.' + this.notifyClass);
      for (let i in all) {
        if (i === 'length') {
          break;
        }
        let el = document.getElementById(all[i].id);
        if (el) {
          el.parentNode.removeChild(el);
         }
      }
    }
    this.move();
  };

  remove = (id) => {
    if (id) {
      let el = document.getElementById(id);
      if (el) {
        el.parentNode.removeChild(el);
      }
    } else {
      let all = document.querySelectorAll('.' + this.notifyClass);
      for (let i in all) {
        if (i === 'length') {
          break;
        }
        let el = document.getElementById(all[i].id);
        if (el) {
          el.parentNode.removeChild(el);
        }
      }
    }
    this.move();
  };

  removeByState = (state) => {
    let notify = this.notifiers.notifyByState(state);
    if (null === notify) {
      return;
    }

    this.remove(notify.nid);
  };

  isNotifyShowedByStates = (states) => {
    for(let state of states) {
      let notify = this.notifiers.notifyByState(state);
      if (notify && !!document.getElementById(notify.nid)) {
        return true;
      }
    }

    return false;
  };

  move = (no_anim) => {
    let banner = document.getElementById(this.bannerId);
    let ntfs = document.querySelectorAll('.' + this.notifyClass);
    let top = this.topMargin + (banner ? banner.offsetHeight : 0);
    for (let i in ntfs) {
      if (!(parseInt(i) >= 0)) {
        break;
      }
      if (ntfs[i].style.display === 'none') {
        continue;
      }
      if (no_anim) {
        ntfs[i].className = `${this.notifyClass} noamin`;
      }
      ntfs[i].style.top = top + 'px';
      ntfs[i].attributes['data-top'].value = top;
      top += ntfs[i].offsetHeight + this.topMargin;
      if (no_anim) {
        ntfs[i].className = this.notifyClass;
      }
    }
  };
}
