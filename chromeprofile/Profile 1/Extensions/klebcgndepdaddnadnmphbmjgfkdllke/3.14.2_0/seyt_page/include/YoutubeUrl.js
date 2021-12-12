'use strict';

class YoutubeUrl {

  constructor(url) {
    this._url = url;
    this._urlObj = new URL(this._url);
    this._params = new URLSearchParams(this._urlObj.search.slice(1));
  }

  /**
   *
   * @returns {string}
   */
  get url() {
    return this._url;
  }

  /**
   *
   * @returns {boolean}
   */
  isYoutubeWatchPage() {
    return this._url.includes('https://www.youtube.com/watch?v=');
  }

  /**
   *
   * @returns {boolean}
   */
  isYoutubeShortVideoPage() {
    return this._url.includes('https://www.youtube.com/shorts/');
  }

  /**
   *
   * @returns {boolean}
   */
  isYoutubeVideoPage() {
    return this.isYoutubeWatchPage() || this.isYoutubeShortVideoPage();
  }

  /**
   *
   * @returns {boolean}
   */
  isVideoAdsPage() {
    return this._url.includes('video-ads.surfearner.com');
  }

  /**
   *
   * @param tabId
   * @param successHandler
   * @param errorHandler
   */
  getRedirectUrl(tabId, successHandler, errorHandler) {
    let token = this._params.get('token');

    let target = new URL(API_CPA_CONTRACT_REDIRECT);
    let params = new URLSearchParams();
    params.set('token', token);
    target.search = params.toString();

    let xhr = new XMLHttpRequest();

    xhr.open('GET', target, false);

    xhr.onreadystatechange = () => {
      if (200 !== xhr.status) {
        errorHandler(tabId, 'Неизвестная ошибка');
      }
      else if (XHR_STATE_DONE === xhr.readyState) {
        let response = JSON.parse(xhr.response);
        if ('error' === response.status) {
          errorHandler(tabId, `Неизвестная ошибка "${response.data.message}"`);
        }
        else {
          successHandler(tabId, response.data.url);
        }
      }
    };
    xhr.send();
  };

  /**
   *
   * @returns {string|null}
   */
  getVideoCode() {
    if (!this.isYoutubeVideoPage()) {
      return null;
    }

    if (this.isYoutubeWatchPage()) {
      return this._params.get('v');
    }

    return this.url.replace('https://www.youtube.com/shorts/', '');
  };

  /**
   *
   * @returns {boolean}
   */
  isRenew() {
    if (!this.isYoutubeVideoPage()) {
      return false;
    }

    return '1' === this._params.get('renew');
  };

  /**
   *
   * @returns {boolean}
   */
  hasTimestamp() {
    return this._params.has('t');
  }

  /**
   *
   * @returns {URL}
   */
  getWithoutTimestamp() {
    let urlObj = new URL(this._url);
    let params = new URLSearchParams(urlObj.search.slice(1));
    params.delete('t');
    urlObj.search = params.toString();
    return urlObj;
  }

  /**
   *
   * @returns {URL}
   */
  getWithoutRenewParam() {
    let urlObj = new URL(this._url);
    let params = new URLSearchParams(urlObj.search.slice(1));
    params.delete('renew');
    urlObj.search = params.toString();
    return urlObj;
  };

  /**
   *
   * @returns {string|null}
   */
  getSearchValue() {
    if (!this._url.includes('https://www.youtube.com/results')) {
      return null;
    }

    return this._params.get('search_query');
  };

  /**
   *
   * @returns {string|null}
   */
  getChannel() {
    if (!this._url.includes('https://www.youtube.com/channel/')) {
      return null;
    }

    var pattern = new RegExp("^https:\/\/www.youtube.com\/channel\/(.+)\/*");
    var matches = this._url.match(pattern);
    if (matches) {
      return matches[1];
    }

    return null;
  };
}
