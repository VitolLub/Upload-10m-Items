'use strict';

class NotifiersVideoCode extends NotifiersGeneric {
  constructor(videoCode) {
    super();

    let tryAgainLink = `<a href=https://www.youtube.com/watch?v=${videoCode}>Попробовать ещё раз >></a>`;

    this.items.job_error = {
      img:   'svg/icon_push_warning.svg',
      title: 'Возникла ошибка',
      msg:   `${tryAgainLink}`,
    };

    this.addGenericItemsData();

    this.stateNotifyMap[STATE_IS_JOB_ERROR] = 'job_error';
  }
}
