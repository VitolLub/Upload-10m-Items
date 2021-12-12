'use strict';

/**
 * Статическая обертка над хранилищем.
 * Установка, получение, удаление и время жизни
 * (последнее на случай, когда браузер закрывается).
 */
class SeytStorage {

  static #EXPIRATION_TIME = 10 * 60 * 1000;

  /**
   *
   * @param key
   * @returns {string}
   */
  static #key(key) {
    return `seyt${key}`;
  }

  /**
   *
   * @param key
   * @param data
   */
  static set(key, data) {
    let _key = SeytStorage.#key(key);

    const now = new Date();

    const item = {
      data: data,
      expires_at: now.getTime() + this.#EXPIRATION_TIME,
    };
    localStorage.setItem(_key, JSON.stringify(item));
    if (Debug.logStorage) {
      sevideoConsoleLog('SeytStorage::set(%o, %o)', _key, data);
    }
  }

  /**
   *
   * @param key
   * @returns {null|data}
   */
  static get(key) {
    let _key = SeytStorage.#key(key);

    const _data = localStorage.getItem(_key);

    if (Debug.logStorage && !_data) {
      sevideoConsoleLog('SeytStorage::get() null (do not exists), key: %o', _key);
    }

    if (!_data) {
      return null;
    }
    const item = JSON.parse(_data);
    const now = new Date();
    if (now.getTime() > item.expires_at) {
      if (Debug.logStorage) {
        sevideoConsoleLog('SeytStorage::get() null (expired), key: %o', _key);
      }
      SeytStorage.remove(key);
      return null;
    }
    return item.data;
  }

  /**
   *
   * @param key
   */
  static remove(key) {
    let _key = SeytStorage.#key(key);
    if (Debug.logStorage) {
      sevideoConsoleLog('SeytStorage::remove(), key: %o', _key);
    }
    localStorage.removeItem(_key);
  }

  /**
   *
   */
  static clear() {
    localStorage.clear();
  }
}
