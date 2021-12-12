'use strict';

/**
 * Класс помогает упростить работу со страницей,
 * чтобы вызывающий код работал не напрямую с деталями реализаций
 * разных моментов.
 */
class Listener {

  /**
   * @param {CPAData} cpa
   */
  constructor(cpa) {
    this.cpa = cpa;

    this.videoCode = null;
    this.isRunning = false;
    this.focusCheckInterval = null;

    // Ловля закрытия вкладки: сначала сохраним tabId,
    // чтобы потом при закрытии знать, что именно наша вкладка закрылась.
    this.tabId = null;
    this.currentTabUrl = null;
    this.activeWindowId = null;
    this.sameTab = false;

    this.isJobError = false;

    this.isRunOutFocus = false;
    this.isFocusRestored = false;

    if (Debug.logStatsService) {
      this.statsService = new StatsService(cpa, new StatsServiceDebugger());
    }
    else {
      this.statsService = new StatsService(this.cpa, this._wrongHttpStatusHandler);
    }

    this.player = new Player(this.cpa.maxTotalSeconds, this.cpa.maxOutFocusSeconds);

    if (Debug.logPlayer) {
      this.player = proxyTraceDecorator(this.player, sePlayerTraceOptions);
    }

    window.seytPageState.run();

    let isFocused = true;

    this.focusCheckInterval = setInterval(() => {
      chrome.windows.getCurrent((window) => {
        if (this.activeWindowId !== window.id) {
          isFocused = false;
          this.toggleFocus(false);
        }
        else if (isFocused !== window.focused) {
          isFocused = window.focused;
          this.toggleFocus(isFocused);
        }
      });

      if (this.currentTabUrl) {
        chrome.tabs.query({ active: true }, (tabs) => {
          let videoTab = tabs.find(tab => tab.url === this.currentTabUrl);
          if (!videoTab) {
            isFocused = false;
            this.toggleFocus(false);
          }
        });
      }
    }, 1000);
  }

  /**
   *
   * @param {HttpStatus} httpStatus
   * @private
   */
  _wrongHttpStatusHandler = (httpStatus) => {
    this.isJobError = true;
  };

  /**
   *
   * @param {String} action
   * @param {Number} timestamp
   */
  runPlayerAction(action, timestamp) {
    this.player.changeStateByAction(action, timestamp);
  }

  /**
   *
   * @param {Boolean} has
   */
  toggleFocus(has) {
    if (has) {
      this.isRunOutFocus = false;
      this.isFocusRestored = true;
      this.player.focusRestored();
    }
    else {
      this.isRunOutFocus = true;
      this.isFocusRestored = false;
      this.player.focusLost();
    }
  }

  sendPlayerSize(width, height) {
    this.statsService.sendPlayerSize(width, height);
  }

  /**
   *
   */
  onClosedPage() {
    this.player.cancel(CANCEL_REASON_PAGE_CLOSED);
    this.onCanceled(CANCEL_REASON_PAGE_CLOSED);
    this.clear();
  }

  onCanceled(cancelReason) {
    this.statsService.sendStatusChanged('failure', cancelReason);
  }

  onCompleted(captchaToken = '') {
    this.statsService.sendStatusChanged('success', '', captchaToken);
  }

  /**
   * Фронт получает текущее состояние бэка через этот метод.
   *
   * @returns {{reason: null, state: string}|{state: string}}
   */
  getStateResponse() {
    if (this.isJobError) {
      return {state: STATE_IS_JOB_ERROR};
    }

    if (this.player.isFinished()) {
      this.clearContext();
      return {
        state: STATE_IS_FINISHED,
      };
    }
    if (this.player.isExceededMaxTotalTime()) {
      this.player.cancel(CANCEL_REASON_TIME_IS_OVER);
      this.clearContext();
    }

    if (this.player.isCanceled()) {
      return {
        state:  STATE_IS_CANCELED,
        reason: this.player.cancelReason,
      };
    }

    let state = STATE_IS_PLAYING;
    if (this.player.isPaused()) {
      state = STATE_IS_PAUSED;
    }
    // Поскольку мы должны игнорировать потерю фокуса,
    // когда юзер поставил на паузу (поставил и увел фокус).
    else {
      if (this.isRunOutFocus) {
        this.isRunOutFocus = false;
        state = STATE_IS_OUT_FOCUS;
      }
    }

    // А возврат фокуса мы можем и не игнорировать,
    // здесь это всего лишь работа с пушами и возврат просто попытается убрать пуш.
    if (this.isFocusRestored) {
      this.isFocusRestored = false;
      state = STATE_FOCUS_RESTORED;
    }

    if (this.isPlayerSizeRestored) {
      this.isPlayerSizeRestored = false;
      state = STATE_PLAYER_SIZE_RESTORED;
    }

    return {
      state: state,
    };
  }

  /**
   *
   */
  clear() {
    window.seytPageState.stop();
    clearInterval(this.focusCheckInterval);
    this.player.reset();
    this.clearContext();
  }

  clearContext() {
    this.videoCode = null;
    this.isRunning = false;
    this.tabId = null;
    this.currentTabUrl = null;
    this.activeWindowId = null;
    this.sameTab = false;
    this.cpa = null;
  }
}
