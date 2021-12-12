'use strict';

class NotifiersVideoAdsError extends NotifiersGeneric {
  constructor(error, tabId) {
    super();

    this.items[ERROR_VIDEO_ADS_REDIRECT] = {
      img:   'svg/icon_push_warning.svg',
      title: 'Возникла ошибка',
      msg:   error,
      onCloseCallback: () => {
        sendCloseTabAction(tabId);
      }
    };

    this.addGenericItemsData();

    this.stateNotifyMap[ERROR_VIDEO_ADS_REDIRECT] = ERROR_VIDEO_ADS_REDIRECT;
  }
}
