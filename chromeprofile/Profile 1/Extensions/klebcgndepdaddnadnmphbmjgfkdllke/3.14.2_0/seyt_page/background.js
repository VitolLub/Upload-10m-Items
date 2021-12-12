'use strict';

let listener = null;
// Задание запрашивается на этапе загрузки страницы,
// поэтому надо его сохранить для следующих этапов.
let cpa = null;

window.seHistory = window.seHistory || new History();

/**
 *
 * @param {String} videoCode
 */
let findCpaContractData = (videoCode) => {
  if (!videoCode) {
    return null;
  }

  let target = new URL(API_CPA_CONTRACT_FIND);
  let params = new URLSearchParams();
  params.set('video_code', videoCode);
  target.search = params.toString();

  let xhr = new XMLHttpRequest();
  // Синхронный запрос, поскольку без cpa нам делать нечего.
  xhr.open('GET', target, false);
  let cpaData = null;
  xhr.onreadystatechange = () => {
    if (200 === xhr.status && XHR_STATE_DONE === xhr.readyState) {
      let response = JSON.parse(xhr.response);
      let data = response.data;
      if ('success' === response.status) {
        cpaData = new CPAData(data, videoCode);
      } else if ('error' === response.status && 'no_authentication' === data.codename) {
        return STATE_AUTH_ERROR;
      } else {
        throw data.message;
      }
    } else {
      throw xhr.statusText;
    }
  };
  xhr.send();

  return cpaData;
};

/**
 *
 * @param {CPAData} cpa
 */
let getRenewCpaData = (cpa) => {
  let target = new URL(API_CPA_CONTRACT_RENEW);
  let params = new URLSearchParams();
  params.set('code', cpa.contractCode);
  params.set('token', cpa.token);
  target.search = params.toString();

  let xhr = new XMLHttpRequest();
  // Синхронный запрос, поскольку без cpa нам делать нечего.
  xhr.open('GET', target, false);
  let cpaData = null;
  xhr.onreadystatechange = () => {
    if (200 === xhr.status && XHR_STATE_DONE === xhr.readyState) {
      let response = JSON.parse(xhr.response);
      let data = response.data;
      if ('success' === response.status) {
        cpaData = new CPAData(data, cpa.videoCode);
      } else if ('error' === response.status && 'no_authentication' === data.codename) {
        return STATE_AUTH_ERROR;
      } else {
        throw data.message;
      }
    } else {
      throw xhr.statusText;
    }
  };
  xhr.send();

  return cpaData;
};

let getTransitionSiteModalHtml = (tabId, transitionDomain) => {
  let target = new URL(API_CPA_TRANSITION_MSG);
  let params = new URLSearchParams();
  params.set('domain', transitionDomain);
  target.search = params.toString();

  let xhr = new XMLHttpRequest();
  xhr.open('GET', target);

  xhr.onreadystatechange = () => {
    if (200 === xhr.status && XHR_STATE_DONE === xhr.readyState) {
      let response = JSON.parse(xhr.response);
      let data = response.data;
      if ('success' === response.status && data) {
        chrome.tabs.sendMessage(tabId, new CommandToFrontMsg(FG_ACTION_TRANSITION, data.message));
      } else if ('error' === response.status) {
        throw data.message;
      }
    }
  };
  xhr.send();
};

let historyTabOnUpdated = (changeInfo, tab) => {
  let url = 'undefined' !== typeof changeInfo.url ? changeInfo.url : tab.url;
  let youtubeUrl = new YoutubeUrl(url);

  let searchValue = youtubeUrl.getSearchValue();
  if (searchValue) {
    // При каждом поиске сбрасываем цепочку и начинаем набирать заново.
    window.seHistory.clear();
    window.seHistory.push(searchValue);
  } else if (1 === window.seHistory.size()) {
    let channel = youtubeUrl.getChannel();
    if (channel) {
      window.seHistory.push(channel);
    }
  } else if (2 === window.seHistory.size()) {
    let videoCode = youtubeUrl.getVideoCode();
    if (videoCode) {
      window.seHistory.push(videoCode);
    }
  }
};

let videoAdsRedirectSuccessHandler = (tabId, redirectUrl) => {
  chrome.tabs.update(tabId, {url: redirectUrl});
};

let videoAdsRedirectError = null;
let videoAdsRedirectErrorHandler = (tabId, error) => {
  videoAdsRedirectError = error;
};

chrome.runtime.onInstalled.addListener((details) => {
  SeytStorage.clear();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  let youtubeUrl = new YoutubeUrl(tab.url);
  if ('loading' === changeInfo.status) {

    // Первоначальная загрузка страницы ютуба.
    if (!cpa) {
      if (youtubeUrl.isYoutubeVideoPage() && !youtubeUrl.isRenew()) {
        let videoCode = youtubeUrl.getVideoCode();
        cpa = findCpaContractData(videoCode);

        // Сбрасываем метку времени, если она есть.
        if (youtubeUrl.hasTimestamp()) {
          chrome.tabs.update(tabId, {url: youtubeUrl.getWithoutTimestamp()});
        }
      }

      if (youtubeUrl.isRenew()) {
        cpa = getRenewCpaData(cpa);
        if (!cpa) {
          cpa = STATE_LIMIT_IS_OVER;
          return;
        }
      }
      else if (youtubeUrl.isVideoAdsPage()) {
        youtubeUrl.getRedirectUrl(tabId, videoAdsRedirectSuccessHandler, videoAdsRedirectErrorHandler);
        return;
      }
    }
  }

  if (!listener) {
    // Слушателя еще нет, значит мы первый раз на странице ролика.
    // Но при этом, если мы здесь, то content.js уже загружен и больше загружаться не будет.
    if ('complete' === changeInfo.status) {
      // Хотелось бы как можно раньше перевести вкладку на другой адрес,
      // но не получится - фронт не получит уведомление об ошибке (если такая будет),
      // пока страница полностью не загрузится.
      // Поэтому проверку на video-ads приходится делать здесь, а не в 'loading' вкладки.
      if (videoAdsRedirectError) {
        chrome.tabs.sendMessage(tabId, new CommandToFrontMsg(ERROR_VIDEO_ADS_REDIRECT, {error: videoAdsRedirectError, tabId: tabId}));
        videoAdsRedirectError = null;
      }

      chrome.tabs.sendMessage(tabId, new CommandToFrontMsg(FG_ACTION_CLEAR_SUCCESS));
      if (youtubeUrl.isYoutubeVideoPage()) {
        // Отправим сообщение в контент о необходимости запуска.
        chrome.tabs.sendMessage(tabId, new CommandToFrontMsg(FG_ACTION_INIT));
      }
      else {
        let transitionUrl = new URL(tab.url);
        getTransitionSiteModalHtml(tabId, transitionUrl.hostname);
      }
    }
    return;
  }

  listener.activeWindowId = tab.windowId;

  let isNotCurrentUrl = (youtubeUrl.url !== listener.currentTabUrl && !youtubeUrl.isRenew());

  listener.sameTab = listener.tabId === tabId;

  if (listener.tabId) {

    // Если это другая вкладка
    if (listener.sameTab) {
      // Другая страница, если:
      // - это не просмотр ютуба ИЛИ
      // - урл отличается от текущего (и при этом это не renew-урл).
      if (listener.videoCode && (!youtubeUrl.isYoutubeVideoPage() || isNotCurrentUrl)) {
        listener.player.cancel(CANCEL_REASON_ANOTHER_PAGE);
        return;
      }

      let newVideoCode = youtubeUrl.getVideoCode();
      if (listener.videoCode && listener.videoCode !== newVideoCode) {
        listener.player.cancel(CANCEL_REASON_ANOTHER_VIDEO);
      }
    }
  } else {
    // Вкладка именно наша: она активна, это ютуб и звук включен.
    if (!listener.isRunning) {
      return;
    }
    let videoCode = youtubeUrl.getVideoCode();
    if (videoCode) {
      listener.videoCode = videoCode;
      listener.tabId = tabId;
      listener.currentTabUrl = youtubeUrl.url;
    }
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (!listener || !listener.isRunning || !listener.tabId) {
    return;
  }

  listener.toggleFocus(listener.tabId === activeInfo.tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (!listener || !listener.isRunning) {
    return;
  }

  if (listener.player.isPlaying() || listener.player.isPaused()) {
    listener.toggleFocus(listener.activeWindowId === windowId);
  }
});

chrome.tabs.onRemoved.addListener((tabId, info) => {
  if (!listener) {
    return;
  }

  if (listener.tabId === tabId) {
    listener.onClosedPage();
    listener = null;
    cpa = null;
  }
});



chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if ('undefined' === typeof msg.type) {
    return;
  }

  if (DEBUG_MSG === msg.type) {
    sevideoConsoleLog.apply(null, msg.data);
  }

  // Инициализации не было, поэтому не принимаем никакие сообщения,
  // кроме инициализации и команд к бэку.
  if (!listener && CPA_REQUEST !== msg.type && CMD_TO_BACKEND !== msg.type) {
    sendResponse(null);
    return;
  }

  switch (msg.type) {
    case CPA_REQUEST:
      // Бэк один, а вот фронт на каждой странице заново.
      // Если сюда пришел этот запрос и у нас уже есть videoCode,
      // то это запрос с дубля страницы - не разрешаем фронту запускаться.
      // А если не с дубля, то это перезагрузка текущей вкладки с тем же видео,
      // поэтому даём фронту отработать уже установленные состояния
      // (точнее - ошибку из-за другой страницы, мы её выставили на ранней стадии загрузки).
      if (listener && listener.videoCode && listener.isRunning) {
        sendResponse(listener.sameTab ? listener.cpa : null);
        return;
      }

      if (cpa) {
        if (Debug.logListener) {
          listener = proxyTraceDecorator(new Listener(cpa), {
            label: 'listener',
            excludeMethods: [
              'getStateResponse'
            ]
          });
          listener = proxyObjectPropSetterDecorator(listener, 'tabId');
        } else {
          listener = new Listener(cpa);
        }

        listener.isRunning = true;
        sendResponse(cpa);
      } else {
        sendResponse(null);
      }
      break;

    case PLAYER_MSG:
      if (!sender.tab.active) {
        break;
      }

      listener.runPlayerAction(msg.action, msg.timestamp);
      break;

    case STATE_REQUEST:
      sendResponse(listener.getStateResponse());
      break;

    case INFO_REQUEST:
      sendResponse(new InfoResponse(listener.tabId, listener.activeWindowId));
      break;

    case PLAYER_SIZE_REQUEST:
      listener.sendPlayerSize(msg.playerRect.width, msg.playerRect.height);
      break;

    case CMD_TO_BACKEND:
      switch (msg.cmd) {
        case BG_ACTION_CLEAR:
          listener.clear();
          listener = null;
          cpa = null;
          break;

        case BG_ACTION_CANCEL:
          listener.player.cancel(msg.data);
          listener.onCanceled(msg.data);
          break;

        case BG_ACTION_SUCCESS:
          listener.onCompleted(msg.data);
          listener.clear();
          listener = null;
          cpa = null;
          break;

        case BG_ACTION_CLOSE_TAB:
          chrome.tabs.remove(msg.data);
          break;

        default:
          break;
      }
      break;

    default:
      break;
  }
});
