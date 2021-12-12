'use strict';

const UNDEFINED = 'undefined';
const PLAYING = 'playing';
const PAUSED = 'paused';
const FINISHED = 'finished';
const CANCELED = 'canceled';
const OUT_OF_FOCUS = 'out_of_focus';

class Player {

  constructor(maxTotalSeconds, maxOutFocusSeconds) {
    this.maxTotalSeconds = maxTotalSeconds;
    this.maxOutFocusSeconds = maxOutFocusSeconds;
    this.reset();
  }

  reset() {
    this.currentState = this.prevState = UNDEFINED;
    this.timestampStarted = 0;
    this.timestamp = 0;
    this.time = 0;
    this.cancelReason = null;

    this.observers = [];

    return this;
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notify() {
    if (this.observers.length > 0) {
      this.observers.forEach(observer => observer.notify(this));
    }
  }

  start(ts = null) {
    if (UNDEFINED === this.currentState) {
      this.currentState = PLAYING;
      this.timestamp = ts ? ts : currentTimestamp();
      this.timestampStarted = this.timestamp;
      this.notify();
    }
    else {
      this.prevState = this.currentState;
    }

    return this;
  }

  pause(ts = null) {
    if (this.isLive()) {
      this.prevState = this.currentState;
      this.currentState = PAUSED;
      let timestamp = ts ? ts : currentTimestamp();
      this.time += (timestamp - this.timestamp);
      this.timestamp = timestamp;
      this.notify();
    }
    else {
      this.prevState = this.currentState;
    }

    return this;
  }

  play(ts = null) {
    if (this.isLive()) {
      this.prevState = this.currentState;
      this.currentState = PLAYING;
      this.timestamp = ts ? ts : currentTimestamp();
      this.notify();
    }
    else {
      this.prevState = this.currentState;
    }

    return this;
  }

  stop(ts = null) {
    if (PLAYING === this.currentState || PAUSED === this.currentState) {
      this.prevState = this.currentState;
      this.currentState = FINISHED;
      let timestamp = ts ? ts : currentTimestamp();
      this.time += (timestamp - this.timestamp);
      this.timestamp = timestamp;
      this.notify();
    }

    return this;
  }

  /**
   * Превышение максимального времени выполнения задания.
   * Отключение звука во время воспроизведения.
   * Перемотка видео.
   * Переключение на просмотр другого видео.
   * Переход на другую страницу.
   * Закрытие страницы.
   * Переключение фокуса страницы во время воспроизведения на срок более разрешенного.
   *
   * @param reason
   * @param ts
   * @returns {Player}
   */
  cancel(reason, ts = null) {
    if (this.isClosed()) {
      return this;
    }
    this.prevState = this.currentState;
    this.currentState = CANCELED;
    this.cancelReason = reason;
    this.timestamp = ts ? ts : currentTimestamp();
    this.notify();
  }

  focusLost(ts = null) {
    if (OUT_OF_FOCUS !== this.currentState) {
      // Разрешено:
      // Переключение фокуса страницы во время паузы.
      // Переключение фокуса страницы во время воспроизведения не более чем на разрешенный срок.
      // И если плеер инициализировался в фоновой вкладке.
      if (this.isPaused() || this.isPlaying() || UNDEFINED === this.currentState) {
        this.prevState = this.currentState;
        this.currentState = OUT_OF_FOCUS;
        this.timestamp = ts ? ts : currentTimestamp();
        this.notify();
      }
    }

    return this;
  }

  focusRestored(ts = null) {
    if (OUT_OF_FOCUS !== this.currentState) {
      return this;
    }
    // Разрешено:
    // Переключение фокуса страницы во время паузы.
    if (!ts) {
      ts = currentTimestamp();
    }

    if (PAUSED === this.prevState) {
      this.prevState = this.currentState;
      this.currentState = PAUSED;
      this.timestamp = ts;
      this.notify();

      return this;
    }

    // Переключение фокуса страницы во время воспроизведения не более чем на разрешенный срок.
    if (PLAYING === this.prevState) {
      // Если время без фокуса еще не вышло,
      // то просто возвращаем состояние проигрывания.
      // Время изменять не надо, пусть остается "играющее".
      // Уведомлять тоже никого не надо - это штатный момент,
      // играющее состояние, по сути, не изменлось.
      this.currentState = this.prevState;
      this.prevState = OUT_OF_FOCUS;
      this.timestamp = ts;
      this.notify();
    }

    return this;
  }

  changeStateByAction(action, ts) {
    switch (action) {
      case PLAYER_START:
        return this.start(ts);

      case PLAYER_PAUSE:
        return this.pause(ts);

      case PLAYER_PLAY:
        return this.play(ts);

      case PLAYER_REWIND:
        return this.cancel(CANCEL_REASON_WAS_REWIND);

      case PLAYER_SPEED_CHANGED:
        return this.cancel(CANCEL_REASON_SPEED_CHANGED);

      default:
        return this.stop(ts);
    }
  }

  isLive() {
    return FINISHED !== this.currentState
      && UNDEFINED !== this.currentState
      && CANCELED !== this.currentState;
  }

  isClosed() {
    return this.isFinished() || this.isCanceled();
  }

  isPlaying() {
    return (PLAYING === this.currentState || (PLAYING === this.prevState && this.isOutOfFocus()));
  };

  isPaused() {
    return (PAUSED === this.currentState || (PAUSED === this.prevState && this.isOutOfFocus()));
  };

  isCanceled() {
    return CANCELED === this.currentState;
  }

  isChanged() {
    return this.currentState !== this.prevState;
  }

  isFinished() {
    return FINISHED === this.currentState;
  }

  isOutOfFocus() {
    return OUT_OF_FOCUS === this.currentState;
  }

  /**
   *
   * @param logger в playerTraceDecorator будет, нужен для посмотреть детали вызова.
   * @returns {boolean}
   */
  isExceededMaxTotalTime(logger = null) {
    if (UNDEFINED === this.currentState) {
      return false;
    }
    let passed = this.timestampStarted ? (currentTimestamp() - this.timestampStarted) : 0;
    if (logger) {
      logger('player isExceededMaxTotalTime(): %o > %o', passed, this.maxTotalSeconds);
    }

    let exceeded = passed > this.maxTotalSeconds;
    if (exceeded) {
      this.cancel(CANCEL_REASON_TIME_IS_OVER);
    }
    return exceeded;
  }
}
