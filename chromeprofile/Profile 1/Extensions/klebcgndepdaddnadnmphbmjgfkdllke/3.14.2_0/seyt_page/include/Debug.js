'use strict';

const DEBUG_MSG = 'debug_msg';

let Debug = {
  // Если true, то будет использоваться API_HOST и API_HOST2 с отладочными серверами.
  workWithFakeData: false,
  // Включит логирование Listener
  logListener: false,
  // Включит логирование StatsService
  logStatsService: false,
  // Включит логирование Player
  logPlayer: false,
  // Включит логирование StatsQueue
  logStatsQueue: false,
  // Включит логирование ответов в опросе бэка
  logResponseFromBack: false,
  // Включит логирование SeytState
  logSeytState: false,
  // отладочная панелька с текущим состоянием.
  showDebugPanel: false,
  // Включит логирование VideoTime
  logVideoTime: false,
  // Включит логирование работы класса Storage
  logStorage: false,
};

class TraceOptions {
  constructor(options = {}) {
    this.label = options.label || '';
    this.traceGetters = options.traceGetters || true;
    this.traceSetters = options.traceSetters || true;
    this.excludeMethods = options.excludeMethods || [];
  }
}

let proxyObjectPropSetterDecorator = function(obj, propToTrace) {
  let handler = {
    set: function (target, key, value) {
      if (propToTrace === key) {
        sevideoConsoleLog(`${key} set to: ${value}`);
      }
      target[key] = value;
      return true;
    },
  };

  return new Proxy(obj, handler);
}

/**
 * Логирование работы класса.
 * Для включения надо сделать (см. class Listener::constructor)
 * let obj = proxyTraceDecorator(new SomeClass(...), options);
 *
 * https://2ality.com/2017/11/proxy-method-calls.html
 *
 * @param obj
 * @param {TraceOptions} options
 * @returns {(function(...[*]=))|any}
 */
let proxyTraceDecorator = function(obj, options) {
  options = Object.assign(new TraceOptions(), options);

  const handler = {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(target, propKey, receiver);
      if (typeof targetValue === 'function') {
        return function (...args) {
          if (options.excludeMethods.length) {
            if (options.excludeMethods.includes(propKey)) {
              return targetValue.apply(this, args);
            }

            for(let method of options.excludeMethods) {
              const testRegex = new RegExp(method);
              if (testRegex.test(propKey)) {
                return targetValue.apply(this, args);
              }
            }
          }

          let label = `${options.label} ${propKey}`;

          if (Array.isArray(args)) {
            label += '(' + args.join(', ') + ')';
          }

          let result = targetValue.apply(this, args);
          let hasResult = ('object' !== typeof result && null !== typeof result && 'undefined' !== typeof result);
          if (hasResult) {
            sevideoConsoleLog(label, result);
          }
          else {
            sevideoConsoleLog(label);
          }

          return result;
        }
      }
      else {
        return targetValue;
      }
    }
  };
  return new Proxy(obj, handler);
}

/**
 * Декоратор логирования работы очереди.
 *
 * @param {Queue} obj
 * @returns {any|(function(...[*]=): *)}
 */
function queueTraceDecorator(obj) {
  const handler = {
    get(target, propKey, receiver) {
      const targetValue = Reflect.get(target, propKey, receiver);
      if (typeof targetValue === 'function') {
        return function (...args) {

          let label = 'queue ' + propKey;

          let result = targetValue.apply(this, args);

          let hasArgs = args.length;
          let arg = null;
          if (hasArgs) {
            label += '(%o)';

            if (args[0] instanceof FormData) {
              arg = formDataToObj(args[0]);
            }
            else {
              arg = args[0];
            }
          }
          let hasResult = (null !== typeof result && 'undefined' !== typeof result);
          if (hasResult) {
            label += ' %o';
          }

          if (!hasArgs && !hasResult) {
            sevideoConsoleLog(label);
          }
          else {
            if (hasArgs && !hasResult) {
              sevideoConsoleLog(label, arg);
            }
            if (!hasArgs && hasResult) {
              if (result instanceof FormData) {
                let dbgResult = formDataToObj(result);
                sevideoConsoleLog(label, dbgResult);
              }
              else {
                sevideoConsoleLog(label, result);
              }
            }
            if (hasArgs && hasResult) {
              if (result instanceof FormData) {
                let dbgResult = formDataToObj(result);
                sevideoConsoleLog(label, arg, dbgResult);
              }
              else {
                sevideoConsoleLog(label, result);
              }
            }
          }
          return result;
        }
      } else {
        return targetValue;
      }
    }
  };

  return new Proxy(obj, handler);
}

class DebugMsgElement {

  constructor(enabled = true) {
    this.enabled = enabled;
    if (this.enabled) {
      this.el = document.createElement('div');
      this.el.id = 'state-msg';
    }
  }

  sendResponse(response) {
    if (!this.enabled) {
      return;
    }

    if (!document.getElementById(this.el.id)) {
      document.body.prepend(this.el);
    }
    this.el.innerHTML = `<div>${response.state}</div>`;
    this.el.style.height = '1.5em';
    this.el.style.width = '250px';
    if (STATE_IS_CANCELED === response.state) {
      this.el.innerHTML += `<div>${response.reason}</div>`;
      this.el.style.height = '3em';
      this.el.style.width = '300px';
    }
  }
}

let debugResponse = (response) => {
  if ('undefined' !== typeof response.reason) {
    sendDebugMsg('state: %o, reason: %o', response.state, response.reason);
  }
  else {
    sendDebugMsg('state: %o', response.state);
  }
};

let sePlayerTraceOptions = {
  label: 'player',
  traceGetters: false,
  excludeMethods: [
    'addObserver',
    'removeObserver',
    'notify',
    '^is',
  ]};

class StatsServiceDebugger {

  /**
   *
   * @param {{}} response
   */
  sendStatsResponseCallback = (response) => {
    sevideoConsoleLog('response from %o: %o', API_CPA_CONTRACT_STATS_URI, response);
  };

  /**
   *
   * @param {Array} data
   */
  beforeSendStatsCallback = (data) => {
    sevideoConsoleLog("sending to %o: %o, %o", API_CPA_CONTRACT_STATS_URI, data['state'], data['current_play_time']/1000);
  };
}

/**
 * Вспомогательная функция конвертирования объекта FormData в нормально логируемый.
 *
 * @param {FormData} formData
 * @returns {{}}
 */
function formDataToObj(formData) {
  let obj = {};
  for (var pair of formData.entries()) {
    obj[pair[0]] = pair[1];
  }
  return obj;
}

class DebugMsg {
  constructor(data) {
    this.type = DEBUG_MSG;
    this.data = data;
  }
}

/**
 * Для отправки отладочных сообщений из контекста контента на бэк.
 * Смысл в том, чтобы смотреть отладку в консоли бэка и из бэка и из фронта.
 * sendDebugMsg('бла-бла %o', object);
 *
 * @param data
 */
let sendDebugMsg = (...data) => {
  chrome.runtime.sendMessage(new DebugMsg(data));
};

/**
 * Данные в консоль с префиксом 'sevideo', чтобы можно было по нему фильтровать.
 * Использование такое же, как и sendDebugMsg, только выводит в консоль (info) контекста.
 * @param data
 */
let sevideoConsoleLog = (...data) => {
  data[0] = 'sevideo ' + data[0];
  console.info.call(console, ...data);
};
