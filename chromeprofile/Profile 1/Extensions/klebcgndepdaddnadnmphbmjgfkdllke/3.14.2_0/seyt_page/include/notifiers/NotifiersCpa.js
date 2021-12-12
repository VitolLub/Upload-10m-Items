'use strict';

class NotifiersCpa extends NotifiersGeneric {
  constructor() {
    super();

    this.items.initial = {
      img:   'svg/icon_push_video.svg',
      title: 'Просмотр видео на сайте YouTube',
    };
    this.items.captcha_enabled = {
      img:   'svg/icon_push_timer60_yellow.svg',
      title: 'Не забудьте ввести капчу',
      msg:   'Дождитесь истечения таймера<br>и введите капчу для зачисления вознаграждения.',
      autoclose_seconds: 5,
    };
    this.items.captcha = {
      img:   'svg/icon_push_money_bag.svg',
      title: 'Для зачисления вознаграждения введите капчу:',
    };
    this.items.captcha_timeout = {
      img:   'svg/icon_push_warning.svg',
      title: 'Вознаграждение не зачислено!',
    };
    this.items.focus_lost = {
      img:     'svg/icon_push_warning.svg',
      title:   'Задание не выполнено!',
      is_solo: true,
    };
    this.items.was_rewind = {
      img:     'svg/icon_push_warning.svg',
      title:   'Задание не выполнено!',
      is_solo: true,
    };
    this.items.speed_changed = {
      img:     'svg/icon_push_warning.svg',
      title:   'Задание не выполнено!',
      is_solo: true,
    };
    this.items.another_page = {
      img:     'svg/icon_push_warning.svg',
      title:   'Задание не выполнено!',
      is_solo: true,
    };
    this.items.not_enough_video_remains = {
      img:     'svg/icon_push_warning.svg',
      title:   'Задание не может быть выполнено!',
      is_solo: true,
    };
    this.items.success = {
      img:   'svg/icon_push_money_bag.svg',
      title: 'Вознаграждение зачислено!',
    };
    this.items.paused = {
      img:   'push/icon_push_inform.svg',
      title: 'Включите видео, чтобы снова запустить таймер',
    };
    this.items.out_focus = {
      img:   'push/icon_push_inform.svg',
      title: 'Фокус страницы утерян!',
      msg: 'Сделайте окно с видео активным, чтобы запустить таймер<br>и продолжить выполнение задания.',
    };
    this.items.job_error = {
      img:   'svg/icon_push_warning.svg',
      title: 'Возникла ошибка',
    };
    this.items.player_size_too_small = {
      img: 'svg/icon_push_warning.svg',
      title: 'Размер плеера меньше допустимого!',
      msg: 'Увеличьте размер окна, чтобы запустить таймер<br>и продолжить выполнение задания.',
    };

    this.addGenericItemsData();

    this.stateNotifyMap[STATE_IS_PAUSED] = 'paused';
    this.stateNotifyMap[STATE_IS_OUT_FOCUS] = 'out_focus';
    this.stateNotifyMap[STATE_PLAYER_SIZE_TOO_SMALL] = 'player_size_too_small';
    this.stateNotifyMap[STATE_IS_PLAYING] = null;
    this.stateNotifyMap[CANCEL_REASON_TIME_IS_OVER] = 'timeout';
    this.stateNotifyMap[CANCEL_REASON_WAS_REWIND] = 'was_rewind';
    this.stateNotifyMap[CANCEL_REASON_FOCUS_LOST] = 'focus_lost';
    this.stateNotifyMap[CANCEL_REASON_SPEED_CHANGED] = 'speed_changed';
    this.stateNotifyMap[CANCEL_REASON_ANOTHER_PAGE] = 'another_page';
    this.stateNotifyMap[CANCEL_REASON_NOT_ENOUGH_VIDEO_REMAINS] = 'not_enough_video_remains';
    this.stateNotifyMap[STATE_IS_FINISHED] = 'captcha';
    this.stateNotifyMap[STATE_IS_COMPLETED] = 'success';
    this.stateNotifyMap[STATE_IS_JOB_ERROR] = 'job_error';
    this.stateNotifyMap[STATE_CAPTCHA_TIMEOUT] = 'captcha_timeout';
    this.stateNotifyMap[CAPTCHA_ENABLED] = CAPTCHA_ENABLED;
  }

  fillItemsMessageByCpa(cpa) {
    let minToPlayTime = cpa.minToPlaySeconds;
    let rewardAmount = `<span class="reward">+${cpa.rewardAmount} RUB</span>`;
    let tryAgainLink = `<a href=https://www.youtube.com/watch?v=${cpa.videoCode}&renew=1>Попробовать ещё раз >></a>`;

    let captchaUrl = `https://s3.surfearner.com/api/cpa_contract/captcha?token=${cpa.token}&code=${cpa.contractCode}`;

    this.items.initial.msg = `${minToPlayTime} / ${rewardAmount}<br>Выполнить задание`;
    this.items.captcha.msg = 'Кликните по нужной картинке и нажмите "Продолжить"<br><iframe id="_se_visit_frame" src="' + captchaUrl + '"></iframe>';
    this.items.captcha_timeout.msg = `Вы не успели ввести капчу за отведенное время<br>${tryAgainLink}`;
    this.items.focus_lost.msg = `Вы покинули сайт до истечения таймера.<br>Ставьте видео на паузу, чтобы избежать этой ошибки.<br>${tryAgainLink}`;
    this.items.was_rewind.msg = `Вы использовали перемотку в плеере - это запрещено<br>${tryAgainLink}`;
    this.items.speed_changed.msg = `Вы изменили скорость воспроизведения в плеере - это запрещено<br>${tryAgainLink}`;
    this.items.another_page.msg = `Вы покинули сайт до истечения таймера.<br>Ставьте видео на паузу, чтобы избежать этой ошибки.<br>${tryAgainLink}`;
    this.items.not_enough_video_remains.msg = `До конца ролика осталось времени меньше, чем на таймере.<br>${tryAgainLink}`;
    this.items.success.msg = rewardAmount;
    this.items.paused.msg = `Учтите, что на выполнение задания отведено не более {VALUE}`;
    this.items.job_error.msg = `${tryAgainLink}`;
  }
}
