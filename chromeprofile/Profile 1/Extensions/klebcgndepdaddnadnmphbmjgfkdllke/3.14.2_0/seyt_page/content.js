'use strict';

/**
 * @param {CPAData} cpa
 * @param {TimerElement} timerEl
 */
let init = async (cpa, timerEl) => {
  let watchers = null;

  try {
    watchers = new DomWatchers();
  } catch (e) {
    return;
  }

  let playerNode = document.getElementById('movie_player');
  chrome.runtime.sendMessage(new PlayerSizeRequest(playerNode.getBoundingClientRect()));

  let stateMsgEl = new DebugMsgElement(Debug.showDebugPanel);

  let notifiers = new NotifiersCpa();
  notifiers.fillItemsMessageByCpa(cpa);
  let notifier = new Notifier(notifiers);

  let playbackRateEl = document.getElementsByClassName('html5-main-video')[0];

  let videoType = new VideoType();
  timerEl.start(playerNode);

  // Счетчик от "дребезга контактов" - когда пользователь кликает на кнопку "Следующее" в плеере,
  // то возникает событие "перемотка", а затем уже "другое видео".
  // Вот чтобы пропустить причину отмены "была перемотка" и вводим счетчик - он позволит сделать ещё запрос состояния
  // и получить корректную причину отмены.
  let countCanceledRequests = 0;

  // Таймер должен иметь возможность возникать с тем же периодом
  // и в случае, если он поставлен на паузу (просто обновления значения не будет).
  // Для того, чтобы после снятия с паузы периодичность была по тем же временным моментам.
  let timerIsRunning = true;

  // Цикл обновления таймера
  let timerInterval = setInterval(() => {
    if (timerIsRunning) {
      // Если у таймера времени больше, чем осталось всего на выполнение задания.
      let timerSeconds = timerEl.getSeconds();
      let remainSeconds = cpa.expiresAt - currentTimestamp();
      if (timerSeconds > remainSeconds) {
        sendCancelAction(CANCEL_REASON_TIME_IS_OVER);
      }
      else {
        timerEl.update();
      }
    }
  }, 1000);

  // И отдельный таймер на максимальное время выполнения задания.
  // Если когда он истечет задание будет в отмененном состоянии,
  // то будет выведен пуш об истечении времени.
  let timeoutTimer = setTimeout(() => {
    let cancelStates = [
      CANCEL_REASON_WAS_REWIND,
      CANCEL_REASON_ANOTHER_VIDEO,
      CANCEL_REASON_ANOTHER_PAGE,
      CANCEL_REASON_PAGE_CLOSED,
      CANCEL_REASON_FOCUS_LOST,
      CANCEL_REASON_SPEED_CHANGED,
    ];

    if (notifier.isNotifyShowedByStates(cancelStates)) {
      notifier.push(CANCEL_REASON_TIME_IS_OVER);
    }
    clearTimeout(timeoutTimer);
  }, cpa.maxTotalSeconds * 1000);

  if (cpa.isFirstTime) {
    notifier.push(STATE_IS_INITIAL);
  }
  if (cpa.isCaptchaEnabled) {
    notifier.push(CAPTCHA_ENABLED);
  }

  // Цикл опроса клиентом состояния на бэке.
  let getStateInterval = setInterval(() => {
    // Скорость воспроизведения.
    if (1 !== playbackRateEl.playbackRate) {
      sendPlayerAction(PLAYER_SPEED_CHANGED);
    }

    chrome.runtime.sendMessage(new StateRequest(), (response) => {
      if (Debug.logResponseFromBack) {
        debugResponse(response);
      }

      videoType.check(timerEl);

      let notifyState = response.state;
      if (STATE_IS_CANCELED === notifyState) {
        notifyState = response.reason;
      }
      switch(notifyState) {
        case STATE_FOCUS_RESTORED:
          notifier.removeByState(STATE_IS_OUT_FOCUS);
          break;

        case STATE_PLAYER_SIZE_TOO_SMALL:
          timerEl.pause();
          notifier.push(notifyState);
          break;

        case STATE_PLAYER_SIZE_RESTORED:
          notifier.removeByState(STATE_PLAYER_SIZE_TOO_SMALL);
          playerSizeTooSmallTime.reset();
          if (timerEl.isEnoughToVideoRemains()) {
            timerEl.run();
          }
          else {
            sendCancelAction(CANCEL_REASON_NOT_ENOUGH_VIDEO_REMAINS);
          }
          break;

        case STATE_IS_PLAYING:
          notifier.removeByState(STATE_IS_PAUSED);
          break;

        case STATE_IS_PAUSED:
          let seconds = cpa.expiresAt - currentTimestamp();
          notifier.push(notifyState, secondsToTaskExpireFormatted(seconds));
          break;

        case STATE_IS_FINISHED:
          clearInterval(getStateInterval);
          clearInterval(timerInterval);
          timerEl.hide();

          if (!cpa.isCaptchaEnabled) {
            sendSuccessAction();
            notifier.push(STATE_IS_COMPLETED);
          }
          else {
            notifier.push(STATE_IS_FINISHED);
          }
          break;

        default:
          notifier.push(notifyState);
          break;
      }

      stateMsgEl.sendResponse(response);

      switch (response.state) {
        case STATE_IS_CANCELED:
          countCanceledRequests++;
          if (countCanceledRequests > 1) {
            notifier.removeByState(STATE_IS_PAUSED);
            clearInterval(getStateInterval);
            clearInterval(timerInterval);
            sendClearAction();
          }
          timerEl.hide();
          break;

        case STATE_IS_JOB_ERROR:
          clearInterval(getStateInterval);
          clearInterval(timerInterval);
          sendClearAction();
          timerEl.hide();
          break;

        case STATE_IS_OUT_FOCUS:
          timerEl.pause();
          break;

        case STATE_FOCUS_RESTORED:
          if (timerEl.isEnoughToVideoRemains()) {
            timerEl.run();
          }
          else {
            sendCancelAction(CANCEL_REASON_NOT_ENOUGH_VIDEO_REMAINS);
          }
          break;

        default:
          if (timerEl.getSeconds() === 0) {
            sendPlayerAction(PLAYER_STOP);
          }
          break;
      }

      let playingStates = [
        STATE_IS_PLAYING,
        STATE_IS_OUT_FOCUS,
      ];
      let isPlayingState = playingStates.includes(response.state);
      timerIsRunning = isPlayingState && timerEl.getSeconds() > 0;
    });
  }, 200);

  let onCaptchaMsg = (msg) => {
    let data = msg.data;
    if ('undefined' === typeof data.se_captcha) {
      return;
    }
    let captcha = data.se_captcha;
    let captchaData = captcha.data;
    if (captchaData.code === cpa.contractCode && captchaData.user_id === cpa.userId) {

      // Чистим.
      window.removeEventListener('message', onCaptchaMsg);
      if (watchers) {
        watchers.clear();
      }
      let captchaNotify = notifiers.notifyByKey('captcha');
      if (captchaNotify) {
        notifier.remove(captchaNotify.nid);
      }

      if ('success' === captcha.status) {
        if (captchaNotify) {
          notifier.push(STATE_IS_COMPLETED);
        }

        // Чтобы пуш о зачислении вознаграждения успел появиться на экране.
        setTimeout(() => {
          sendSuccessAction(captchaData.captcha_token);
        }, 200);
      }
      else {
        if (captchaNotify) {
          sendCancelAction(CANCEL_REASON_CAPTCHA_TIMEOUT);
          notifier.push(STATE_CAPTCHA_TIMEOUT);
        }
      }
    }
  };

  if (cpa.isCaptchaEnabled) {
    window.addEventListener('message', onCaptchaMsg, false);
  }

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if ('undefined' === typeof msg.type) {
      return;
    }

    if (CMD_TO_BACKEND !== msg.type ) {
      return;
    }

    switch(msg.cmd) {
      case BG_ACTION_RELOAD:
        clearInterval(getStateInterval);
        clearInterval(timerInterval);
        sendClearAction();
        timerEl.hide();
        window.removeEventListener('message', onCaptchaMsg);
        if (watchers) {
          watchers.clear();
        }
        let youtubeUrl = new YoutubeUrl(location.href);
        location.href = youtubeUrl.getWithoutRenewParam();
        break;

      case BG_ACTION_CLEAR:
        sendClearAction();
        break;

      default:
        break;
    }
  });
};

let run = () => {
  chrome.runtime.sendMessage(new CPARequest(), (response) => {
    if (response) {
      // Особый случай, когда renew вернуло null. И другой, с авторизацией.
      if (STATE_LIMIT_IS_OVER === response || STATE_AUTH_ERROR === response) {
        let notifiers = new NotifiersGeneric();
        let notifier = new Notifier(notifiers);
        notifier.push(response);
        sendClearAction();
      }
      // Особый случай - ошибка. Ничего не создаём, кроме отдельного типа уведомлений и уведомлятора.
      else if ('undefined' !== typeof response.errorType) {
        switch(response.errorType) {

          case ERROR_RECEIVING_CPA:
            let notifiers = new NotifiersVideoCode(response.msg);
            let notifier = new Notifier(notifiers);
            notifier.push(STATE_IS_JOB_ERROR);
            sendClearAction();
            break;

          default:
            break;
        }
      }
      else {
        let timerEl = new TimerElement(response);
        init(response, timerEl);
      }
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if ('undefined' === typeof msg.type) {
    return;
  }

  if (CMD_TO_FRONT !== msg.type ) {
    return;
  }

  switch(msg.cmd) {
    case FG_ACTION_INIT:
      // Бэк хочет, чтобы мы запустились. Но мы не можем взять и просто запуститься,
      // потому что сейчас DOM еще не полностью готов.
      // Поэтому подождем, когда сможем определить время ролика и тогда запустимся.
      let interval = setInterval(() => {
        let playerNode = document.getElementById('movie_player');
        if (null !== playerNode) {
          clearInterval(interval);
          run();
        }
      }, 300);
      break;

    case FG_ACTION_CLEAR_SUCCESS:
      let notifiers = new NotifiersCpa();
      let notifier = new Notifier(notifiers);
      notifier.removeByState(STATE_IS_COMPLETED);
      break;

    case ERROR_VIDEO_ADS_REDIRECT:
      let videoAdsNotifiers = new NotifiersVideoAdsError(msg.data.error, msg.data.tabId);
      let videoAdsNotifier = new Notifier(videoAdsNotifiers);
      videoAdsNotifier.push(ERROR_VIDEO_ADS_REDIRECT);
      break;

    case FG_ACTION_TRANSITION:
      let div = document.createElement('div');
      div.innerHTML = msg.data.trim();
      document.body.append(div);
      break;

    default:
      break;
  }
});

run();
