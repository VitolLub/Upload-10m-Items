/*
 * Общие фукции для бекграунда
 */

/**
 * AJAX-запрос
 *
 * @param {String} link Адрес
 * @param {Object} data Параметры POST
 * @param {Function} cbOK Коллбек при успешном выполнении
 * @param {Function} cbError Коллбек при ошибке
 * @param {XMLHttpRequestResponseType} responseType Тип ожидаемого ответа
 *
 * @return {void}
 */
function ajax(link, data, cbOK, cbError, responseType) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("POST", link, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  if (responseType !== undefined) {
    xhr.responseType = responseType;
  } else {
    xhr.responseType = "text";
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 && cbOK !== undefined && typeof cbOK === "function") {
        cbOK(xhr.response);
      } else if (cbError !== undefined && typeof cbError === "function") {
        cbError(xhr.status, xhr.statusText);
      }
    }
  };
  var dataSend = null;
  if (typeof data === 'object') {
    var _args = [];
    for (var n in data) {
      if (data.hasOwnProperty(n))
        _args.push(n + '=' + encodeURIComponent(data[n]));
    }
    dataSend = _args.join('&');
  }
  xhr.send(dataSend);
}

/**
 * Функция - заглушка.
 *
 * @returns {{}}
 */
const noop = () => ({});

/**
 * Возвращает урл случайного сервера
 *
 * @returns {string}
 */
function serverUrl() {
  // return Math.random() > 2 ? 'https://s3.surfearner.com' : 'https://s4.surfearner.com';
  return Math.random() > 0.5 ? 'https://s3.surfearner.com' : 'https://s4.surfearner.com';
}

/**
 * Внедряет свойства в класс.
 *
 * @param instance
 * @param properties
 *
 * @returns {Promise}
 */
function injectProperties(instance, properties) {
  return new Promise(function (resolve, reject) {
    for (var i in properties) {
      if (instance.hasOwnProperty(i) || !properties.hasOwnProperty(i)) {
        return reject();
      }
      instance[i] = properties[i];
    }
    return resolve();
  });
}
