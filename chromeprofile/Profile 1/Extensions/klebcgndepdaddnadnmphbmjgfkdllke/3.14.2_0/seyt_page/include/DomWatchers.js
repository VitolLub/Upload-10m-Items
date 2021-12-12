'use strict';

// https://stackoverflow.com/a/53914092

/**
 * Отслеживает изменения состояний воспроизведение/невоспроизведение.
 */
class PlayWatcher {

  constructor(targetNode,
              classToWatch,
              classAddedCallback,
              classRemovedCallback,
  ) {
    this.targetNode = targetNode;
    this.classToWatch = classToWatch;
    this.classAddedCallback = classAddedCallback;
    this.classRemovedCallback = classRemovedCallback;
    this.observer = null;
    this.lastClassState = targetNode.classList.contains(this.classToWatch);

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    this.observer.observe(this.targetNode, {attributes: true});
  }

  disconnect() {
    this.observer.disconnect();
  }

  mutationCallback = mutationsList => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        let currentClassState = mutation.target.classList.contains(this.classToWatch);
        if (this.lastClassState !== currentClassState) {
          this.lastClassState = currentClassState;
          currentClassState ? this.classAddedCallback() : this.classRemovedCallback();
        }
      }
    }
  };
}

/**
 * Отслеживает изменения в прогресс-баре, для перемоток.
 */
class ProgressBarWatcher {
  constructor(progressBarNode, controlPanelNode, changedCallback) {
    this.progressBarNode = progressBarNode;
    this.controlPanelNode = controlPanelNode;
    this.changedCallback = changedCallback;
    this.observer = null;

    this.init();
  }

  init() {
    this.observer = new MutationObserver(this.mutationCallback);
    this.observe();
  }

  observe() {
    let config = {
      attributes: true,
      characterData: false,
      childList: false,
      subtree: false,
      attributeOldValue: true,
      characterDataOldValue: false
    };
    this.observer.observe(this.progressBarNode, config);
  }

  disconnect() {
    this.observer.disconnect();
  }

  /**
   * Вспомогательный метод, помогает определить именно события перемотки.
   *
   * @returns {boolean}
   */
  isControlPanelActive() {
    let style = getComputedStyle(this.controlPanelNode);

    let opacity = ('undefined' !== style.opacity) ? parseInt(style.opacity) : 0;

    return 0 !== opacity;
  }

  mutationCallback = mutationsList => {
    for (let mutation of mutationsList) {
      let attrName = 'aria-valuenow';
      // Изменения прогресс-бара ловятся через изменения атрибута текущего значения,
      // это позволяет отловить и клики и изменения клавишами (шаг в 5 секунд).
      // Но помимо этого атрибут изменяется и от просто всплытия
      // (прогресс был скрыт, просмотр шел, навели мышь - надо обновить атрибут)
      // и мы этот момент отфильтровываем - учитываем только те изменения,
      // которые произошли на уже видимом прогресс-баре.
      if (mutation.type === 'attributes'
        && mutation.attributeName === attrName
        && this.isControlPanelActive()) {

        let value = parseInt(mutation.target.getAttribute(attrName));
        let absDiff = Math.abs(value - parseInt(mutation.oldValue));

        // Фильтруем перемотку. Она возникает на изменение прогресс-бара,
        // а прогресс-бар сбрасывается в 0 при запуске следующего ролика
        // (рекламная вставка -> ролик, например).
        if (absDiff > 1 && value !== 0) {
          this.changedCallback();
        }
      }
    }
  };
}


class DomWatchers {

  constructor() {
    let miniPlayerButton = document.querySelector('.ytp-miniplayer-button');
    if (miniPlayerButton) {
      miniPlayerButton.remove();
    }

    this.playerNode = document.getElementById('movie_player');
    if (!this.playerNode) {
      throw new Error('Player node not found.');
    }

    // Запускаем счет если ролик проигрывается и проигрывается со звуком.
    let isPlaying = this.playerNode.classList.contains('playing-mode');
    if (!isPlaying) {
      return;
    }

    sendPlayerAction(PLAYER_START);

    this.playWatcher = new PlayWatcher(this.playerNode, 'playing-mode', this.playingClassAdded, this.playingClassRemoved);

    if (SE_PLAYER_REWIND_CHECK_ENABLED) {
      let progressBarNode = document.getElementsByClassName('ytp-progress-bar')[0];
      let controlPanelNode = document.getElementsByClassName('ytp-chrome-bottom')[0];
      this.progressBarWatcher = new ProgressBarWatcher(progressBarNode, controlPanelNode, this.progressBarChanged);
    }
  }

  playingClassAdded = () => {
    sendPlayerAction(PLAYER_PLAY);
  };

  playingClassRemoved = () => {
    sendPlayerAction(PLAYER_PAUSE);
  };

  progressBarChanged = () => {
    sendPlayerAction(PLAYER_REWIND);
  };

  clear() {
    this.playWatcher.disconnect();
    this.playWatcher = null;
    if (SE_PLAYER_REWIND_CHECK_ENABLED) {
      this.progressBarWatcher.disconnect();
      this.progressBarWatcher = null;
    }
  }
}
