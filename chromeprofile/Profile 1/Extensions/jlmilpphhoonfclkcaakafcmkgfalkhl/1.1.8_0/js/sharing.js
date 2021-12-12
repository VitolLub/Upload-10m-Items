window.DjangoCryptotabSharing = {};

window.DjangoCryptotabSharing.lang ='en';

window.DjangoCryptotabSharing.host = 'https://cryptobrowser.site';

window.DjangoCryptotabSharing.disableVkApi = true

window.DjangoCryptotabSharing.setLinkId = function(linkId) {
  var buttonContainers = document.getElementsByClassName('social-btns');
  for (var i = 0; i < buttonContainers.length; i++) {
      buttonContainers[i].setAttribute('data-linkid', linkId);
  }
};

window.DjangoCryptotabSharing.from = 'extstart';

var Sharing = function() {

    init();

    function init() {
        initMoreEscapeHandler();
        initMoreClickHandler();
        initSocialButtonsHandlers();
    }

    function initMoreEscapeHandler() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                hide();
            }
        });
    }

    function initSocialButtonsHandlers() {
        document.addEventListener('click', function(event) {
            var handlers = {
                eml: clientRedirectHandler,
                vb: clientRedirectHandler,
                vk: window.DjangoCryptotabSharing.disableVkApi ? false : vkHandler
            };
            var btn = closest(event.target, '.social-btn');
            if (btn) {
                var target = btn.getAttribute('data-target');
                var handler = handlers[target] || serverRedirectHandler;
                handler(event);
            }
        });
    }

    function serverRedirectHandler(event) {
        var params = getSharingParams(event.target);
        var url = getSharingURLPath() + '?' + dictToURI(params);
        openPopup(url);
    }

    function clientRedirectHandler(event) {
        var params = getSharingParams(event.target);
        params['technique'] = 'client_redirect';
        var url = getSharingURLPath() + '?' + dictToURI(params);
        callApi(url, function(data) {
            var oldUnload = window.onbeforeunload;
            window.onbeforeunload = null;  // Prevent webapp confirmation window
            window.location = data['redirect_url'];
            setTimeout(function(){
                window.onbeforeunload = oldUnload;
            }, 0);
        });
    }

    function vkHandler(event) {
        var params = getSharingParams(event.target);
        params['technique'] = 'client_api';
        var url = getSharingURLPath() + '?' + dictToURI(params);
        callApi(url, function(data) {
            VK.api(
                'wall.post',
                {
                    'message': data.message.body + ' ' + data.message.hashtag,
                    'attachments': data.message.image.vk_id + ',' + data.preview_url,
                    'v':'5.85'
                },
                function (data) {}
            );
        });
    }

    function callApi(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.send();
        xhr.onreadystatechange = function(data) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                try {
                    var parsedData = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.log(xhr.responseText);
                    return;
                }
                cb(parsedData);
            }
        }
    }

    function getSharingParams(btn) {
        var container = closest(btn, '.social-btns');
        var params = {
            msg: container.getAttribute('data-msg'),
            link_id: container.getAttribute('data-linkid'),
            t: btn.getAttribute('data-target')
        };
        for (var key in params) {
            if (!params[key]) {
                delete params[key];
            }
        }
        if (window.DjangoCryptotabSharing.from) {
            params['src']= window.DjangoCryptotabSharing.from;
        }
        return params;
    }

    function initMoreClickHandler() {
        document.addEventListener('click', function(event) {
            if ( !closest(event.target, '.social-btns') ) {
                hide();
            }
            if ( closest(event.target, '.social-btns__more') ) {
                toggle(event.target);
            }
        });
    }

    function toggle(el) {
        var list = el.parentNode.querySelector('.social-btns__list') || el.parentNode.parentNode.querySelector('.social-btns__list');
        if ( list.classList.contains('active') ) {
            list.classList.remove('active');
        } else {
            list.classList.add('active');
        }
    }

    function hide() {
        var lists = document.querySelectorAll('.social-btns__list');
        for (var i=0; i < lists.length; i++) {
            lists[i].classList.remove('active');
        }
    }

    function openPopup(url) {
        var y = window.outerHeight / 2 + window.screenY - ( 500 / 2);
        var x = window.outerWidth / 2 + window.screenX - ( 400 / 2);
        window.open(url, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=400, height=500, top='+y+', left='+x);
        return false;
    }

    function closest(el, selector) {
        var matches = el.webkitMatchesSelector ? 'webkitMatchesSelector' : (el.msMatchesSelector ? 'msMatchesSelector' : 'matches');
        while (el.parentElement) {
            if (el[matches](selector)) return el;
            el = el.parentElement;
        }
        return null;
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function dictToURI(dict) {
        var str = [];
        for(var p in dict){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
        }
        return str.join("&");
    }

    function getSharingURLPath() {
        return window.DjangoCryptotabSharing.host + '/' + window.DjangoCryptotabSharing.lang + '/cryptotab_sharing/';
    }
}();
