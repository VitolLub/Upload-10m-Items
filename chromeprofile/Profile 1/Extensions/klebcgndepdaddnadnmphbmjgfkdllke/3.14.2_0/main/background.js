class SeytState {
  constructor() {
    this.isRunning = false;
  }

  run() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }
}

const CPA_NEXT_URI = 'https://s3.surfearner.com/api/cpa_contract/next';

window.seytPageState = window.seytPageState || new SeytState();


/**
 * Управление баннерами.
 * @typedef {Banners} Banners
 */
let banners = new Banners();
let cm = new CommonMemory();

window.tab = null;
window.token = null;
window.link = null;
window.url = null;
window.fail = false;
window.start = 0;
window.state = null;

window.userBlocks = [];
window.blockedHosts = [];
window.blockedHostsTabs = [];

window.linkVersion = '?ver=' + chrome.runtime.getManifest().version.replace(new RegExp(/\./, 'g'), '_');
window.inited = false;
window.initStarted = false;

/**
 * Заблокирован ли URL
 *
 * @param {URL} url
 *
 * @return {boolean}
 */
function urlBlocked(url) {
  var blocked = false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    blocked = true;
  } else {
    for (var i in window.blockedHosts) {
      if (url.hostname === window.blockedHosts[i]) {
        blocked = true;
      } else {
        var re = new RegExp('(.*)\\.' + window.blockedHosts[i] + '$', 'i');
        if (url.hostname.match(re)) {
          blocked = true;
        }
      }
      if (blocked) {
        break;
      }
    }
    if (!blocked) {
      for (var i in window.userBlocks) {
        if (url.hostname === window.userBlocks[i]) {
          blocked = true;
        } else {
          var re = new RegExp('(.*)\\.' + window.userBlocks[i] + '$', 'i');
          if (url.hostname.match(re)) {
            blocked = true;
          }
        }
        if (blocked) {
          break;
        }
      }
    }
  }

  return blocked;
}

/**
 * Заблокирована ли вкладка
 * @param {int} tabId ID вкладки
 * @return {boolean}
 */
function tabBlocked(tabId) {
  tabId = parseInt(tabId);
  for (var i in window.blockedHostsTabs) {
    if (tabId === parseInt(i)) return window.blockedHostsTabs[i];
  }
  return false;
}

chrome.storage.local.get('state', function (v) {
  window.state = v.state === 'false' ? 'off' : 'on';
  banners.extensionEnabled = v.state === 'false' ? false : true;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//****************************************************
  if (request.reset) {
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
    sendResponse({success: true});
  } else
//****************************************************
  if (request.__se_icon) {
    chrome.browserAction.setIcon({path: request.__se_icon});
    if ('img/icon24.png' === request.__se_icon) {
      window.state = 'on';
      banners.extensionEnabled = true;
    } else {
      window.state = 'off';
      banners.extensionEnabled = false;
    }
    sendResponse({success: true});
  } else
//****************************************************
  if (request.token) {
    window.link = document.createElement('a');
    window.link.href = request.dest;
    window.token = request.token;
    window.start = (new Date()).valueOf() + 2000;
    chrome.tabs.create({
      url: request.link
    }, function (t) {
      window.tab = t;
    });
    sendResponse({success: true});
  } else
//****************************************************
  if (request.unpause) {
    window.start = request.unpause;
    sendResponse({success: true});
  } else
//****************************************************
  if (request.visit_finish) {
    window.tab = null;
    window.token = null;
    window.link = null;
    window.url = null;
    window.fail = false;
    window.start = 0;
    sendResponse({success: true});
  } else
// AJAX запросы
  if (request.query) {
    let success = false;
    switch (request.query) {
//****************************************************
      case 'checkState':
        if (window.seytPageState.isRunning) {
          sendResponse({success: false});
          break;
        }
        var link = serverUrl() + '/ext/check' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            success = true;
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              if (0 in tabs) {
                chrome.tabs.sendMessage(
                  tabs[0].id, {
                    query:   'checkState',
                    success: true,
                    data:    d
                  }
                );
              }
            });
          },
          function (d) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
              if (0 in tabs) {
                chrome.tabs.sendMessage(
                  tabs[0].id, {
                    query:   'checkState',
                    success: false,
                    data:    d
                  }
                );
              }
            });
          }
        );
        sendResponse({success: true});
        break;
//****************************************************

      case 'checkSeytPageState':
        sendResponse({isRunning: window.seytPageState.isRunning});
        break;

//****************************************************
      case 'extConnect':
        var link = 'https://surfearner.com/ext/connect' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            success = true;
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'loadInfo':
        var link = 'https://surfearner.com/ext/info2' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            success = true;
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
      //****************************************************
      case 'getCpa':
        ajax(CPA_NEXT_URI, request.data,
          function (response) {
            success = true;
            sendResponse({success: true, data: response});
          },
          function (d) {
            sendResponse({success: false, data: response});
          }
        );
        break;

//****************************************************
      case 'extBlock':
        var link = 'https://surfearner.com/ext/block' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'extHideStat':
        var link = 'https://surfearner.com/ext/hide_stat' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'connectPush':
        var link = 'https://s2.surfearner.com/push_connect' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'finish':
        var link = serverUrl() + '/ext/finish' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'cssList':
        var link = serverUrl() + '/css_inject.json';
        ajax(
          link, request.data,
          function (d) {
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'subscribe':
        var link = serverUrl() + '/ext/subscribe' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            if ("banner" === request.data.sub) {
              banners.subscribed = request.data.state;
            }
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'vacation':
        var link = serverUrl() + '/ext/vacation' + window.linkVersion;
        ajax(
          link, request.data,
          function (d) {
            sendResponse({success: true, data: d});
          },
          function (d) {
            sendResponse({success: false, data: d});
          }
        );
        break;
//****************************************************
      case 'SEReady':
        var blocked =
              (sender.tab.id in window.blockedHostsTabs)
              && window.blockedHostsTabs[sender.tab.id];
        banners.activeTab(sender.tab.id, !blocked).catch(noop);
        sendResponse({success: true, blocked: blocked});
        console.log('SEReady', sender.tab.id, !blocked);
        break;
//****************************************************
      case 'accessControl':
        sendResponse({success: !tabBlocked(sender.tab.id)});
        break;
//****************************************************
      case 'bannerClick':
        banners.userClick();
        sendResponse({success: true});
        break;
//****************************************************
      case 'bannerClose':
        banners.userClose();
        sendResponse({success: true});
        break;
//****************************************************
      case 'bannerPreview':
        if (inited) {
          banners.add(request.data);
          sendResponse({success: true});
        } else {
          sendResponse({success: false});
        }
        break;
//****************************************************
      case 'bannerPosition':
        banners.position(request.position);
        sendResponse({success: true});
        break;
//****************************************************
      case 'userActivity':
        window.lastUserActivity = Date.now() / 1000 | 0;
        break;
//****************************************************
      default:
        console.log('Unholded query', request, sender);
        break;
    }
    // Если еще не прошла инициализация
    // и не запущен повтор - пробуем снова
    if (success && !inited && !initStarted) init();

    return true;
  }
});

chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if (sender.url == blocklistedWebsite)
    return;  // don't allow this web page access
  if (request.openUrlInEditor)
    openUrl(request.openUrlInEditor);
});

chrome.tabs.onActivated.addListener(function (tb) {
  chrome.tabs.get(tb.tabId, function (tab) {
    if (!tab.url.length) {
      return;
    }
    var url = new URL(tab.url);
    var val = 0;
    if ('surfearner.com' === url.hostname) {
      val = 1;
    }
    cm.set('onSurfearner', val, 86400000);
    window.blockedHostsTabs[tb.tabId] = urlBlocked(url);
    banners.activeTab(tb.tabId, !window.blockedHostsTabs[tb.tabId])
      // Для разрешенной вкладки
      .then(function () {
        banners.refresh();
      })
      // Для блокированной  вкладки
      .catch(function () {
        banners.refresh();
      });
  });
});

chrome.tabs.onUpdated.addListener(function (tabId, change, t) {
  if (t.active && "loading" === t.status) {
    // console.log("onUpdated: pause()");
    banners.pause();
  }
  if (change.status && 'complete' === change.status && t.status == 'complete' && t.url != undefined) {
    var host = new URL(t.url).hostname;
    var bg_sites = cm.get('bg.sites');
    if (!bg_sites || bg_sites.length > 100) {
      bg_sites = {};
    }
    if (!bg_sites [host]) bg_sites [host] = 0;
    bg_sites [host]++;
    cm.set('bg.sites', bg_sites);
    if (host === 'surfearner.loc' || host === 'surfearner.com') {
      var manifest = chrome.runtime.getManifest();
      var code = '';
      code += "var el = document.getElementById('_se_ext_version');";
      code += "if( el ){";
      code += "el.parentNode.removeChild(el);";
      code += "}";
      code += "el = document.createElement('div');";
      code += "el.id = '_se_ext_version';";
      code += "el.setAttribute('data-version','" + manifest.version + "');";
      code += "el.setAttribute('data-state','" + window.state + "');";
      code += "document.getElementsByTagName('body')[0].appendChild(el);";
      // chrome.tabs.executeScript(tabId, {code: code});
      chrome.tabs.sendMessage(
        tabId,
        {
          query: "__se_execute_script",
          data:  {code: code}
        },
        noop
      );
    }
  }
  if (t.active && "complete" === t.status) {
    setTimeout(() => {
      // console.log("onUpdated: resume()");
      window.blockedHostsTabs[tabId] = urlBlocked(new URL(t.url));
      banners.resume();
      banners.activeTab(tabId, !window.blockedHostsTabs[tabId]).catch(noop);
    }, 1000);
  }
  var _t = window.tab;
  if (_t && _t.id === tabId) {
    if (change.status === 'loading' && change.url) {
      url = document.createElement('a');
      url.href = change.url;
      if (url.hostname !== window.link.hostname
        && (new Date()).valueOf() - window.start > 1000) {
        // разрушаем таймер
        // отправляем метку на сервак о том что задание не выполнено
        /*
        chrome.tabs.executeScript(window.tab.id, {
          code: "var img = new Image();\
        img.src = '//s3.surfearner.com/ext/surf?fail=" + window.token + "';"
        });
        */
        var code =
              "var img = new Image();"+
              "img.src = '//s3.surfearner.com/ext/surf?fail=" + window.token + "';";
        chrome.tabs.sendMessage(
          window.tab.id,
          {
            query: "__se_execute_script",
            data:  {code: code}
          },
          noop
        );
        window.token = null;
        window.link = null;
        window.url = null;
        window.fail = true;
        window.start = 0;
        return;
      }
    }
    if (change.status === 'complete' && !window.fail && window.tab) {
      insertSurfJs(false);
    }
    if (change.status === 'complete' && window.fail) {
      window.fail = false;
      insertSurfJs(true);
      window.tab = null;
    }
  }
});

chrome.tabs.onRemoved.addListener(function (tabId, change) {
  if (window.tab && window.tab.id === tabId) {
    window.tab = null;
  }
  window.blockedHostsTabs.splice(tabId, 1);
  banners.removeTab(tabId);
});

function insertSurfJs(fail) {

  if (tabBlocked(window.tab.id)) return;

  var src = chrome.runtime.getURL('/main/content/surf.js');
  var src2 = chrome.runtime.getURL('/main/content/json2html.js');
  var code = '(function(n){';
  if (fail) {
    code += 'window._se_started = ' + window.start + ';';
  }
  code += 'var tag = n.getElementsByTagName("body")[0],';
  code += 'elem2 = n.createElement("script"),';
  code += 'elem = n.createElement("script");';

  code += 'elem2.type = "text/javascript";';
  code += 'elem2.async = true;';
  code += 'elem2.src = "' + src2 + '";';
  code += 'elem2.onload = function(){';
  code += 'tag.appendChild(elem);';
  code += '};';

  code += 'elem.type = "text/javascript";';
  code += 'elem.async = true;';
  code += fail ? 'elem.id = "surf-fail";' : 'elem.id = "surf-visit";';
  if (!fail) {
    code += 'elem.setAttribute("data-token","' + window.token + '");elem.setAttribute("data-start","' + window.start + '");';
  }
  code += 'elem.src = "' + src + '";';
  code += 'tag.appendChild(elem2);';
  code += '})(document);';
  // chrome.tabs.executeScript(window.tab.id, {code: code});
  chrome.tabs.sendMessage(
    window.tab.id,
    {
      query: "__se_execute_script",
      data:  {code: code}
    },
    noop
  );
}

chrome.runtime.onInstalled.addListener(function () {
  var timeout = 60;
  if (!cm.get('onInstalledShowPage')) {
    chrome.tabs.create({
      url:    'https://surfearner.com/page/ext/',
      active: true
    });
    cm.set('onInstalledShowPage', true, 31556926);
  }
  // Блокировка деятельности - см. функцию surfearner::main()
  cm.set('onInstallTimeout', timeout, timeout);

  return false;
});

/**
 * Запрос параметров при загрузке
 */
init = function () {
  initStarted = true;
  // Инициализация
  ajax(
    'https://surfearner.com/ext/initParams' + window.linkVersion, null,
    function (d) {
      var initData = JSON.parse(d);
      // Если не зареган - откладываем (повторный вызов из onMessage)
      if (!initData.hasOwnProperty('extauth')) {
        // Анализируем параметры инициализации
        if (initData.hasOwnProperty('blockedHosts')) {
          window.blockedHosts = initData.blockedHosts;
        }
        if (initData.hasOwnProperty('userBlocks')) {
          window.userBlocks = initData.userBlocks;
        }
        inited = true;
        // Проанализируем все вкладки на доступность
        chrome.windows.getAll({populate: true}, function (windows) {
          windows.forEach(function (win) {
            win.tabs.forEach(function (tab) {
              if (tab.url && tab.url.length > 0) {
                var url = new URL(tab.url);
                window.blockedHostsTabs[tab.id] = urlBlocked(url);
                banners.addTab(tab.id, !window.blockedHostsTabs[tab.id]);
              }
            });
          });
          initStarted = false;
        });
        setTimeout(() => {
          banners.run();
        }, 10000);
      }
      initStarted = false;
    },
    function (d) {
      initStarted = false;
    },
  );
};
init();

/**
 * Определяем видимость браузера
 */
setInterval(() => {
  chrome.windows.getCurrent(null, (win) => {
    window.visible = win.focused;
  });
}, 500);

// Показать страницу при удалении расширения
chrome.runtime.setUninstallURL("https://surfearner.com/page/ext_delete/", null);

