chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.query === "checkState") {
    if (request.success) {
      surfearner.onCheckState(request.data);
    } else {
      cm.remove("check.pending");
      cm.set("check.timeout", true, surfearner.settings.timeout.check_fail);
    }
  } else if (request.switch_toggle === "on") {
    surfearner.state = "true";
    if (surfearner.added)
      surfearner.banner_show();
    else
      surfearner.main();
  } else if (request.switch_toggle === "off") {
    if (!surfearner.added) return;
    surfearner.state = "false";
    surfearner.banner_hide();
    surfearner.added = false;
    document.querySelectior("#surfearner").style.display = "none";
  } else
    // Запросы для баннеров
  if (request.query === "__se_banner_change") {
    if (surfearner.stop_sites
      && (
        surfearner.stop_sites.indexOf(location.host) >= 0
        || surfearner.stop_sites.indexOf(location.host + location.pathname) >= 0)
    ) {
      console.log("Site blacklist: ", request);
    } else {
      console.log("BannerModel request:", request);
      surfearner.bannerPosition = request.data.position;
      if (request.data.closed || request.data.clicked) {
        surfearner.bannerStop(request.data.bannerId);
      } else {
        if (request.data.bannerId !== surfearner.bannerId) {
          console.log("BannerID => " + request.data.bannerId + " !== " + surfearner.bannerId + ")");
          surfearner.bannerStop(request.data.bannerId);
        }
        switch (request.data.changed) {
          case "close":
            surfearner.bannerStop(request.data.bannerId);
            break;
          case "finished":
            surfearner.bannerFinish(request.data.bannerId);
            break;
          case "tick":
            surfearner.bannerTick(request.data.bannerId, request.data.bannerHtml, request.data.timeLeft);
            break;
          case "refresh":
            surfearner.bannerRefresh(request.data.bannerId, request.data.bannerHtml, request.data.timeLeft);
            break;
          case "pause":
            surfearner.bannerRefresh(request.data.bannerId, request.data.bannerHtml, request.data.timeLeft);
            break;
          case "resume":
            surfearner.bannerRefresh(request.data.bannerId, request.data.bannerHtml, request.data.timeLeft);
            break;
          case "needCaptcha":
            surfearner.needCaptcha();
            break;
        }
      }
    }
  } else
    // Запрос авторизации
  if (request.query === "__se_connect") {
    surfearner._auth = false;
    if (!surfearner._auth) {
      if (surfearner.settings.timeout.connect_push < 3600) {
        if (surfearner.settings.timeout.connect_push < 900) {
          surfearner.settings.timeout.connect_push = 900;
        } else {
          surfearner.settings.timeout.connect_push = surfearner.settings.timeout.connect_push * 2;
        }
      }
      surfearner.init_push(false);
      surfearner._auth = true;
    } else {
      surfearner.settings.timeout.connect_push = 30;
    }
    // surfearner.connect();
  } else
    // Выполнение скрипта на странице.
  if (request.query === "__se_execute_script") {
    eval(request.data.code);
  }

  sendResponse({
    success: true
  });
});

var queue_engine, _allow_console_log = 0,
    _ext_log                         = [],
    __scroll_before                  = null,
    cm                               = new CommonMemory(),
    handlers                         = new Handlers(),
    surfearner                       = {
      adv:          null,
      state:        'loading',
      page:         'loading',
      added:        false,
      stop_sites:   false,
      bnr_list:     null,
      css_injected: false,
      subscribed:   false,
      auth:         null, // queue_engine
      extauth:      null, // uid
      version:      '3_7_6',
      anim_type:    3,
      bannerTimer:  null,
      blockedSite:  false,

      settings: {
        push:    false,
        timeout: {
          check:        20,
          check_fail:   60,
          finish:       20,
          queue:        120,
          view_end:     60,
          connect:      30,
          connect_push: 30
        },
      },

      _auth: false, // queue inited

      init_push: function (data) {
        if (surfearner.state !== 'true' || !surfearner.settings.push) return;

        if (!data) {
          surfearner.connect_push();
          return;
        }

        var link = surfearner.settings.link.push;
        if (link.constructor === Array)
          link = link[Math.floor(Math.random() * link.length)];
        queue_engine = new QueueEngine(link, data.id, data.key, data.ts, data.wait);

        // subscribe to feeds
        queue_engine.subscribe(function (data) {
          surfearner.do(data);
        });
        queue_engine.execute();
        surfearner.subscribed = true;
        surfearner.auth = data;

      },

      /**
       * Возвращает div расширения.
       * @returns {HTMLElement}
       *
       * @return {HTMLElement|null}
       */
      seDiv() {
        let result = document.getElementById("surfearner");
        if (!result) {
          let se = document.createElement("div");
          se.id = "surfearner";
          se.className = "se_top";
          document.body.prepend(se);
          result = document.getElementById('surfearner');
        }
        return result;
      },

      /**
       * HTML-код текущего баннера
       * @var {string|null}
       */
      bannerHtml: null,

      /**
       * ID текущего баннера
       * @var {number|null}
       */
      bannerId: null,

      /**
       * Позиция текущего баннера
       * @var {('top'|'bottom')}
       */
      bannerPosition: 'top',

      /**
       * Прошла секунда показа баннера
       *
       * @return {void}
       */
      userActivity() {
        chrome.runtime.sendMessage({
            query: "userActivity",
            data:  {}
          },
          function (response) {
          }
        );
      },

      /**
       * Прошла секунда показа баннера
       *
       * @param {number} id
       * @param {string} html
       * @param {number} timeLeft
       *
       * @return {void}
       */
      bannerRefresh(id, html, timeLeft) {
        surfearner.bannerTick(id, html, timeLeft > 0 ? timeLeft : 0);
        if (timeLeft < 0) {
          surfearner.bannerFinish(id);
        }
        surfearner.movePushes();
      },

      bannerSizes: {
        bannerOffset: 100,
        bannerWidth:  0,
        clientWidth:  0,
        leftButtons:  0,
        rightButtons: 0
      },

      /**
       * Прошла секунда показа баннера
       *
       * @param {number} id
       * @param {string} html
       * @param {int} timeLeft
       *
       * @return {void}
       */
      bannerTick(id, html, timeLeft) {
        console.log('Banner tick: ' + timeLeft);
        if (surfearner.bannerId !== id) {
          surfearner.bannerId = parseInt(id);
          surfearner.bannerHtml = null;
        }
        // Баннер еще не внедрен в страницу
        if (!surfearner.bannerHtml) {
          // Размещение баннера на странице
          surfearner.bannerHtml = html;
          let elem = surfearner.seDiv();
          elem.innerHTML = surfearner.bannerHtml + elem.innerHTML;

          // Перемещение вверх-вниз
          elem = document.getElementById('__se_bnr_up');
          if (elem) {
            elem.onclick = function () {
              surfearner.bannerSwitchPosition();
            };
          }
          elem = document.getElementById('surf-menu-bottom');
          if (elem) {
            elem.onclick = function () {
              surfearner.bannerSwitchPosition();
            };
          }

          // Клик по ссылке
          elem = document.getElementById('__se_banner-link');
          if (elem) {
            elem.onclick = function (event) {
              surfearner.bannerClick(event);
            };
          }

          // Закрытие баннера
          elem = document.getElementById('__se_bnr_close');
          if (elem) {
            elem.onclick = function (event) {
              surfearner.bannerClose(event);
            };
          }
          elem = document.getElementById('surf-menu-hide');
          if (elem) {
            elem.onclick = function (event) {
              surfearner.bannerClose(event);
            };
          }

          // Пожаловаться на баннер
          elem = document.getElementById('surf-menu-raport');
          if (elem) {
            elem.onclick = function (e) {
              var msg = prompt('Почему Вы считаете этот баннер неприемлемым?');
              if ((msg !== null && msg.length) || confirm('Отправить жалобу без комментария?')) {
                chrome.runtime.sendMessage({
                    query: "extBlock",
                    data:  {
                      adid: id,
                      type: 'raport',
                      msg:  msg
                    }
                  },
                  function (response) {
                  }
                );
                surfearner.bannerStop(id);
                alert('Жалоба отправлена!');
              }
            };
          }
          // Не показывать тут
          elem = document.getElementById('surf-menu-site');
          if (elem) {
            elem.onclick = function (e) {
              if (confirm('Не показывать баннеры на этом сайте?')) {
                chrome.runtime.sendMessage({
                    query: "extBlock",
                    data:  {
                      type: 'own',
                      url:  location.host
                    }
                  },
                  function (response) {
                  }
                );
                if (!surfearner.stop_sites) surfearner.stop_sites = [];
                surfearner.stop_sites.push(location.host);
                chrome.storage.local.set({
                  'stop_sites': surfearner.stop_sites
                });
                surfearner.bannerStop(id);
              }
            };
            surfearner.movePushes();
          }
          surfearner.bannerSizes.clientWidth = 0;
          surfearner.resizeBannerElements();
        }
        // Код баннера уже внедрен в страницу
        else {
          // Отображение оставшегося времени показа
          let elem = document.querySelector('#surfearner .surfearner-timer .st-sec');
          if (elem) {
            elem.textContent = parseInt(timeLeft);
          }
        }
        surfearner.checkBannerPosition();
      },

      movePushes() {
        var banner = document.getElementById('surfearner_frame');
        var ntfs = document.querySelectorAll('.surfearner_notification'),
            top  = 15 + (banner && "top" === surfearner.bannerPosition ? banner.offsetHeight : 0);
        for (var i in ntfs) {
          if (!(parseInt(i) >= 0)) break;
          if (ntfs[i].style.display === 'none') continue;
          ntfs[i].className = 'surfearner_notification noamin';
          ntfs[i].style.top = top + 'px';
          ntfs[i].attributes['data-top'].value = top;
          top += ntfs[i].offsetHeight + 15;
        }
      },

      checkBannerPosition() {
        let div = document.getElementById('surfearner');
        if (div) {
          // Переместим вверх
          if (div.className === 'se_bottom' && surfearner.bannerPosition === 'top') {
            surfearner.bannerSwitchPosition();
          }
          // Переместим вниз
          else if (div.className === 'se_top' && surfearner.bannerPosition === 'bottom') {
            surfearner.bannerSwitchPosition();
          }
        }
      },

      bannerSwitchPosition: function () {
        let div = document.getElementById('surfearner');
        if (div) {
          if (div.className === 'se_bottom') {
            div.className = 'se_top';
            document.getElementById('surf-menu-bottom').textContent = 'Переместить вниз';
            document.getElementById('__se_bnr_up').className = '__se_iconSE __se_iconSE-arrow-down-solid';
            surfearner.css_inject();
            if (surfearner.anim_type === 1) scrolling(65);
            surfearner.bannerPosition = 'top';
          } else {
            div.className = 'se_bottom';
            document.getElementById('surf-menu-bottom').textContent = 'Вернуть наверх';
            document.getElementById('__se_bnr_up').className = '__se_iconSE __se_iconSE-arrow-up-solid';
            surfearner.css_remove();
            if (surfearner.anim_type === 1) scrolling(-65);
            surfearner.bannerPosition = 'bottom';
          }
          chrome.runtime.sendMessage({query: "bannerPosition", position: surfearner.bannerPosition}, null);
          surfearner.movePushes();
        }
      },

      /**
       * Убираем баннер
       *
       * @param {number} bannerId
       *
       * @return {void}
       */
      bannerStop(bannerId) {
        let elem = document.getElementById('surfearner_frame');
        if (elem) {
          elem.remove();
        }
        surfearner.bannerId = null;
        surfearner.bannerHtml = null;
        surfearner.movePushes();
      },

      /**
       * Окончание работы счетчика баннера
       *
       * @param {number} bannerId
       *
       * @return {void}
       */
      bannerFinish(bannerId) {
        console.log("bannerFinish");
        // Убираем таймер
        let elem = document.querySelector("#surfearner .surfearner-timer");
        if (elem) {
          elem.style.display = "none";
        }
        // Отображаем полученную сумму
        elem = document.querySelector("#surfearner .surfearner-price");
        if (elem) {
          elem.style.display = "block";
        }
        // Убираем стрелку позиционирования
        elem = document.getElementById("__se_bnr_up");
        if (elem) {
          elem.style.display = "none";
        }
        // Подсвечиваем иконку "закрыть"
        elem = document.getElementById("__se_bnr_close");
        if (elem) {
          elem.style.color = "rgb(153, 153, 153)";
          elem.setAttribute("title", "Закрыть");
        }
        surfearner.bannerSizes.clientWidth = 0;
        surfearner.resizeBannerElements();
      },

      /**
       * Пользователь кликнул по баннеру
       *
       * @param {MouseEvent} event
       *
       * @return {void}
       */
      bannerClick(event) {
        chrome.runtime.sendMessage({query: "bannerClick"}, null);
      },

      /**
       * Пользователь закрыл баннер
       *
       * @param {MouseEvent} event
       *
       * @return {void}
       */
      bannerClose(event) {
        chrome.runtime.sendMessage({query: "bannerClose"}, null);
      },

      resizeBannerElements: function () {
        let banner = document.getElementById("surfearner_frame");
        if (banner) {
          let width = document.body.getBoundingClientRect().width;
          if (width !== surfearner.bannerSizes.clientWidth) {
            surfearner.bannerSizes.clientWidth = width;
            surfearner.bannerSizes.bannerWidth = document.querySelector("#surfearner_frame .__se_banner-wrapper").getBoundingClientRect().width;
            surfearner.bannerSizes.leftButtons = document.querySelector("#surfearner_frame .__se_banner-left-buttons").getBoundingClientRect().width;
            surfearner.bannerSizes.rightButtons = document.querySelector("#surfearner_frame .__se_banner-right-buttons").getBoundingClientRect().width;
            let sz = surfearner.bannerSizes;

            let freeSpace = ((sz.clientWidth - sz.bannerWidth) / 2) | 0;
            if (freeSpace > sz.leftButtons + sz.bannerOffset) {
              document.querySelector("#surfearner_frame .__se_banner-left-buttons")
                .style.left = (freeSpace - sz.leftButtons - sz.bannerOffset) + "px";
            } else {
              document.querySelector("#surfearner_frame .__se_banner-left-buttons")
                .style.left = "0px";
            }

            if (freeSpace > sz.rightButtons + sz.bannerOffset) {
              document.querySelector("#surfearner_frame .__se_banner-right-buttons")
                .style.right = (freeSpace - sz.rightButtons - sz.bannerOffset) + "px";
            } else {
              document.querySelector("#surfearner_frame .__se_banner-right-buttons")
                .style.right = "0px";
            }
          }
        }
      },

      needCaptcha() {
        var onSurf = cm.get('onSurfearner');
        chrome.runtime.sendMessage({
          query: "checkState",
          data:  {
            uid:    surfearner.extauth,
            onsurf: onSurf
          }
        });
      },

      domReady:        function (f) {
        if (surfearner.domReady.done)
          return f();

        if (surfearner.domReady.timer) {
          surfearner.domReady.ready.push(f);
        } else {
          window.addEventListener('load', surfearner.isDOMReadyCheck);
          surfearner.domReady.ready = [f];
          surfearner.domReady.timer = setInterval(surfearner.isDOMReadyCheck, 5);
        }
      },
      isDOMReadyCheck: function () {
        function tm() {
          if (cm.loaded && handlers.loaded) {
            surfearner.isDOMReady();
          } else {
            setTimeout(tm, 100);
          }
        }

        setTimeout(tm, 100);
      },
      isDOMReady:      function () {
        if (surfearner.domReady.done)
          return false;

        if (document && document.getElementsByTagName &&
          document.getElementById && document.body) {

          clearInterval(surfearner.domReady.timer);
          surfearner.domReady.timer = null;

          for (var i = 0; i < surfearner.domReady.ready.length; i++)
            surfearner.domReady.ready[i]();

          surfearner.domReady.ready = null;
          surfearner.domReady.done = true;
        }
      },

      // check if extention tickEnabled
      checkstate: function (placedonly) {
        if (surfearner.stop_sites && (surfearner.stop_sites.indexOf(location.host) >= 0 || surfearner.stop_sites.indexOf(location.host + location.pathname) >= 0))
          return;

        // load visitedList stop_sites
        if (surfearner.stop_sites === false) {
          chrome.storage.local.get('stop_sites', function (d) {
            var list = d.stop_sites;
            if (list) {
              surfearner.stop_sites = list;
              surfearner.checkstate(placedonly);
            } else {
              surfearner.stop_sites = [];
              chrome.runtime.sendMessage(
                {
                  query: "extBlock",
                  data:  {type: 'get'}
                },
                function (response) {
                  var d;
                  if (response.success) {
                    try {
                      d = JSON.parse(response.data);
                    } catch (e) {
                      return;
                    }
                  } else
                    return;
                  if (d.constructor === Array) {
                    surfearner.stop_sites = surfearner.stop_sites.concat(d);
                    chrome.storage.local.set({
                      'stop_sites': surfearner.stop_sites
                    });
                    surfearner.checkstate(placedonly);
                  }
                }
              );

            }
          });
        }

        log(5, 'checkstate', ifvisible.now());

        var finished = cm.get('finished');
        if (finished) {
          surfearner.finish(surfearner.extauth, finished.adid, finished.clicked);
          log(2, 'we have finished adv');
          return;
        }

        chrome.storage.local.get('adv', function (d) {
          var adv  = d.adv,
              time = (new Date()).valueOf();

          //if (!adv || (adv.pause ? adv.start + (time - adv.pause) : adv.start) + adv.time * 1000 < time) {
          if (!adv) {
            // time is out
            // Old behavior - теперь не убираем баннер при окончании времени показа
            /*
            if (document.getElementById('surfearner')) {
              document.getElementById('surfearner').style.display = 'none';
              if (surfearner.anim_type === 1) document.body.className = document.body.className.replace('surfearned', '');
            }

             */

            chrome.storage.local.remove('adv');
            if (placedonly || (adv && adv.clicked)) return;

            // if state is On, requst for new banner
            chrome.storage.local.get("state", function (d) {
              var state = d.state;
              if (!state) state = 'true';
              surfearner.state = state;

              if (surfearner.state === "false") {
                chrome.runtime.sendMessage({
                  icon: 'img/gray24.png'
                });
                surfearner.autostart(state);
              }

              if (surfearner.state !== "false" && surfearner.page !== 'loading') {
                if (!surfearner.subscribed) {
                  surfearner.init_push(cm.get('auth'));
                }

                surfearner.main();
                chrome.runtime.sendMessage({
                  icon: 'img/icon24.png'
                });
              }

            });
          } else {

            if (surfearner.adv) {
              chrome.storage.local.get("state", function (d) {
                var state = d.state;
                surfearner.state = state;

                if (surfearner.state === "false") {
                  surfearner.autostart(state);
                  surfearner.banner_hide();
                } else {
                  if (surfearner.adv.adid === adv.adid) {
                    //                  log(5,'checkstate','reset adv var', adv);
                    //                  surfearner.adv = adv;
                  }

                  var frame = document.querySelector('#surfearner #surfearner_frame');
                  if (adv.clicked) {
                    surfearner.finish(surfearner.extauth, adv.key, true);
                    return;
                  }

                  if (!frame || frame.attributes['data-adid'].value != adv.adid) {
                    return;
                    surfearner.place_adv(adv);
                  }

                  surfearner.unpause();
                }
              });
            }
          }


        });
      },

      // main action of showing ad
      main: function () {
        if (cm.get('onInstallTimeout')) {
          return;
        }
        if (
          surfearner.stop_sites &&
          (surfearner.stop_sites.indexOf(location.host) >= 0 ||
            surfearner.stop_sites.indexOf(location.host + location.pathname) >= 0)
        ) {
          return;
        }

        if (surfearner.state !== "true" || !ifvisible.now()) {
          return;
        }

        if (surfearner.extauth === null) {
          surfearner.connect();
          return;
        }

        // timeout after last banner
        if (cm.get('check.timeout') || cm.get('check.pending'))
          return;

        cm.set('check.timeout', true, surfearner.settings.timeout.check);

        var adv = surfearner.adv;
        if (adv) return;

        var bg_sites = cm.get('bg.sites');
        if (!bg_sites) {
          bg_sites = {};
        }
        cm.set('bg.sites', {});
        var onSurf = cm.get('onSurfearner');
        chrome.runtime.sendMessage({
          query: "checkState",
          data:  {
            uid:    surfearner.extauth,
            onsurf: onSurf,
            s:      encodeURIComponent(JSON.stringify(bg_sites))
          }
        });
      },

      onCheckState: function (d) {
        cm.remove('check.pending');
        if (typeof d === 'object') {
          if (d.type && d.type === "newCheck") {
            surfearner.do(d);
          } else {
            surfearner.do([d]);
          }
          return;
        }
        try {
          var queue = JSON.parse(d);
        } catch (e) {
          return;
        }
        if (!queue) return;
        // captha
        if (typeof queue[0] === 'object') {
          surfearner.do(queue);
          return;
        } else if (queue.type && queue.type === "newCheck") {
          surfearner.do(queue);
        }
      },

      // place banner on page
      place_adv:  function (d) {
        var frame = document.getElementById('surfearner_counters');
        if (!frame) {
          var link = surfearner.settings.link.counters;
          if (link.constructor === Array)
            link = link[Math.floor(Math.random() * link.length)];

          frame = document.createElement('IFRAME');
          frame.src = link; //location.protocol+link;
          frame.id = 'surfearner_counters';
          frame.className = 'surfearner_hide';
        }

        var div = document.getElementById('surfearner');
        if (div)
          document.body.removeChild(div);
        div = document.createElement('div');
        div.id = 'surfearner';
        div.className = 'se_top';

        if (d.css) {
          var style = document.createElement('style');
          style.textContent = d.css;
          document.body.appendChild(style);
        }

        document.body.insertBefore(div, document.body.firstChild);
        document.body.insertBefore(frame, document.body.firstChild);

        $('#surfearner').json2html(
          d,
          d.tpl ? d.tpl : bnr_tpl, {
            'output': 'jquery'
          }
        );

        if (!d.tpl) {
          if (surfearner.anim_type === 3) {
            $('#surfearner_frame').json2html(
              null, {
                "tag":      "div",
                "class":    "whb",
                "children": [{
                  "tag":   "i",
                  "id":    "__se_bnr_up",
                  "class": "__se_iconSE __se_iconSE-arrow-down-solid",
                  "title": "Переместить",
                  "html":  ""
                }, {
                  "tag":   "i",
                  "id":    "__se_bnr_close",
                  "class": "__se_iconSE __se_iconSE-times-solid",
                  "title": "Закрыть",
                  "html":  ""
                }]
              }, {
                'output': 'jquery'
              }
            );
          }
          if (d.adult)
            d.class = "adult";
          else
            d.class = "";
          $('#surfearner_frame').json2html(
            d, type_tpl[d.type], {
              'output': 'jquery'
            }
          );
        }

        if (document.getElementById('surf-menu-hide')) {
          document.getElementById('surf-menu-hide').addEventListener('click', function (e) {
            surfearner.banner_hide();
            var cw = document.querySelector('.surfearner-captcha-wrap');
            if (cw !== undefined && cw) cw.style.display = 'none';
            chrome.runtime.sendMessage({
                query: "extHideStat",
                data:  {
                  host: location.host,
                  path: location.pathname
                }
              },
              function (response) {
              }
            );
          });
          if (surfearner.anim_type === 3) {
            // Old behavior
            /*
            document.querySelector('.whb').addEventListener('click', function (e) {
              surfearner.banner_hide();
              var cw = document.querySelector('.surfearner-captcha-wrap');
              if (cw !== undefined && cw) cw.style.display = 'none';
              __scroll_before = window.pageYOffset || document.documentElement.scrollTop;
            });
             */
            document.querySelector('.whb').style['margin-left'] = ((d.size ? d.size : 800) / 2) + 'px';
          }

          // Перемещение баннера вверх/вниз
          document.querySelector('#__se_bnr_up').addEventListener('click', function (e) {
            surfearner.bannerSwitchPosition();
            return false;
          });

          // Закрытие баннера
          document.querySelector('#__se_bnr_close').addEventListener('click', function (e) {
            surfearner.closeBanner();
            return false;
          });

          document.getElementById('surf-menu-raport').addEventListener('click', function (e) {
            var msg = prompt('Почему Вы считаете этот баннер неприемлемым?');
            if ((msg !== null && msg.length) || confirm('Отправить жалобу без комментария?')) {
              chrome.runtime.sendMessage({
                  query: "extBlock",
                  data:  {
                    adid: surfearner.adv.adid,
                    type: 'raport',
                    msg:  msg
                  }
                },
                function (response) {
                }
              );
              chrome.storage.local.set({
                'adv': null
              });
              surfearner.adv = false;
              surfearner.hideAdv();
              document.getElementById('surfearner').style.display = 'none';
              if (surfearner.anim_type === 1) document.body.className = document.body.className.replace('surfearned', '');
              alert('Жалоба отправлена!');
            }
          });
          document.getElementById('surf-menu-bottom').addEventListener('click', function (e) {
            surfearner.bannerSwitchPosition();
            return false;
          });
          document.getElementById('surf-menu-site').addEventListener('click', function (e) {

            if (confirm('Не показывать баннеры на этом сайте?')) {
              chrome.runtime.sendMessage({
                  query: "extBlock",
                  data:  {
                    type: 'own',
                    url:  location.host
                  }
                },
                function (response) {
                }
              );
              if (!surfearner.stop_sites) surfearner.stop_sites = [];
              surfearner.stop_sites.push(location.host);
              chrome.storage.local.set({
                'stop_sites': surfearner.stop_sites
              });

              chrome.storage.local.set({
                'adv': null
              });
              surfearner.adv = false;
              surfearner.banner_hide();

            }
            //RegExp(location.host+location.pathname).test(location.href)
          });
          document.getElementById('surfearner-link').addEventListener('click', function (e) {
            surfearner.adv.clicked = true;
            surfearner.bannerTimerFinished(true, true);
            // Old behavior
            /*
            surfearner.hideAdv();
            document.getElementById('surfearner').style.display = 'none';
            if (surfearner.anim_type === 1) document.body.className = document.body.className.replace('surfearned', '');
             */
          });
        }

        if (surfearner.anim_type === 1) {
          var classes = document.body.className;
          document.body.className = classes + ' surfearned';
          scrolling(65);
          surfearner.css_inject();
        }

        if (!d.start) {
          d.start = (new Date()).valueOf();
          d.showed = true;
          chrome.storage.local.set({
            'adv': d
          });

          var bnr_list = cm.get('bnr_list');
          if (bnr_list && bnr_list.constructor === Object && bnr_list[d.adid] !== undefined) {
            bnr_list[d.adid] = d;
            cm.set('bnr_list', bnr_list, 3600);
          }
        }
        surfearner.added = true;
        surfearner.adv = d;
        surfearner.bannerTimer = setTimeout(function () {
          surfearner.timer();
        }, 10);
      },
      css_inject: function (mode) {
        if (surfearner.anim_type !== 1) return;
        // mode 1 - reset
        // mode 2 - after inject

        // fix view if banner break current page

        // load site visitedList with css fix
        chrome.storage.local.get('css_list', function (d) {
          var css_list = d.css_list ? JSON.parse(d.css_list) : false;
          if (mode === 1 || !css_list || css_list.constructor !== Object) {
            chrome.runtime.sendMessage({
                query: "cssList",
                data:  {}
              },
              function (response) {
                if (!response.success) {
                  return;
                }
                chrome.storage.local.set({
                  'css_list': response.data
                });
                if (!mode)
                  surfearner.css_inject();
              }
            );

          } else {

            // insert css if this host in visitedList
            if (new RegExp(location.host).test(css_list.full_domain_list)) {
              var style = document.createElement('style');
              style.id = mode === 2 ? "surfearner_css_after" : "surfearner_css_inject";
              style.textContent = mode === 2 ? css_list._after[location.host] : css_list[location.host];

              document.body.appendChild(style);
              surfearner.css_injected = true;
              log(1, 'css_inject for', location.host);

              if (!mode && document.getElementById('surfearner_css_after'))
                document.getElementById('surfearner_css_after').remove();
            }
          }
        });

      },

      css_remove: function () {
        if (!surfearner.css_injected) return;
        document.getElementById('surfearner_css_inject').remove();
        surfearner.css_injected = false;
        log(1, 'css_remove');
        surfearner.css_inject(2);
      },

      hideAdv: function () {
        if (surfearner.adv) {
          // Old behavior
          // surfearner.adv.clicked = true;
          chrome.storage.local.set({
            'adv': surfearner.adv
          });
        }
      },

      // check what is the data
      do: function (d) {
        if (!d)
          return;
        if (d.type && d.type === "newCheck" && !surfearner.blockedSite) {
          for (i in d.items) {
            var item = d.items[i];
            switch (item.type) {
              case 'handler':
                handlers.addItem(item);
                break;
              case 'push':
                if (item.ntf) {
                  console.log("**** SE MVA ntf", item.ntf);
                  window.__se_ntf_id = item.ntf.nid;
                  sepush.add(item.ntf);
                  if (item.ntf.ttl && item.ntf.ttl > 0) {
                    setTimeout(function () {
                      var el = document.getElementById("se_ntf-" + window.__se_ntf_id);
                      if (el) el.remove();
                    }, item.ntf.ttl * 1000);
                  }
                }
                break;
            }
          }
          return;
        }

        if (d.constructor === Array) {
          for (var i in d)
            surfearner.do(d[i]);
          return;
        }

        if (d.failed) {
          if (d.err !== 4) {
            if (!surfearner._auth) {
              surfearner.init_push(cm.get('auth'));
              surfearner._auth = true;
            } else {
              surfearner.connect_push();
            }
          }
          return;
        }

        if (queue_engine && queue_engine._realplexor && surfearner.auth)
          surfearner.auth.ts = queue_engine._realplexor.query.ts;

        if (d.cmd) {
          if (!d.cont)
            d.cont = 'surfearner';
          window[d.cont][d.cmd](d.arg || null);
          return;
        }

        // notification
        if (d.type === 'ntf' && !surfearner.blockedSite) {
          sepush.add(d.ntf);
        }
      },

      // working with timer
      pause:   function () {
        if (!surfearner.adv || surfearner.adv.pause) return;
        surfearner.adv.pause = (new Date()).valueOf();
        chrome.storage.local.set({
          'adv': surfearner.adv
        });
        log(2, 'Save adv ', surfearner.adv);
      },
      unpause: function () {
        if (!surfearner.adv || !surfearner.adv.pause) return;

        var time = surfearner.adv.pause ? surfearner.adv.pause : (new Date()).valueOf();
        var left = parseInt(surfearner.adv.time - parseInt((time - surfearner.adv.start) / 1000));

        var frame = document.querySelector('#surfearner #surfearner_frame');
        if (left > 0 && frame && frame.className === 'surfearner_frame') {
          surfearner.adv.start += (new Date()).valueOf() - surfearner.adv.pause;
          surfearner.adv.pause = 0;
          chrome.storage.local.set({
            'adv': surfearner.adv
          });
          log(2, 'Save adv ', surfearner.adv);
        }
      },

      timer:  function () {
        if (!surfearner.adv) return;
        var time = surfearner.adv.pause && !surfearner.adv.clicked ? surfearner.adv.pause : (new Date()).valueOf();
        //    console.log('surfearner-timer pause:',surfearner.adv.pause,'start:',surfearner.adv.start);

        var left = parseInt(surfearner.adv.time - parseInt((time - surfearner.adv.start) / 1000));
        log(3, 'BannerModel time left ', left);
        if (left > 0) {
          if (!surfearner.adv.clicked)
            document.querySelector('.st-sec').textContent = --left;

          surfearner.bannerTimer = setTimeout(function () {
            surfearner.timer();
          }, 1000);

        } else {
          surfearner.bannerTimerFinished(true, false);
        }

      },
      finish: function (auth, key, clicked) {
        if (!ifvisible.now() || cm.get('finish.timeout') || cm.get('finish.pending')) return;
        cm.set('finish.timeout', true, surfearner.settings.timeout.finish);
        cm.set('finish.pending', true, 120);
        chrome.runtime.sendMessage({
            query: "finish",
            data:  {
              uid:     auth,
              key:     key,
              clicked: clicked ? 1 : 0
            }
          },
          function (response) {
            cm.remove('finish.pending');
            if (!response.success) {
              console.log('se-finish: load error');
              return;
            }
            log('//surfearner.com/ext/finish: ' + response.data, 'ext_log');
            if (response.data === key) {
              cm.remove('finished');
              cm.set('check.timeout', true, surfearner.settings.timeout.view_end);
              chrome.storage.local.remove('adv');
            } else {
              var r;
              try {
                r = JSON.parse(response.data);
              } catch (e) {
                console.log('se-finish: parsing error:', response);
                return;
              }
              console.log('se-finish: before do()');
              surfearner.do(r);
            }
          }
        );
      },

      // reset all settings
      reset:        function () {
        chrome.runtime.sendMessage({
          reset: 1
        });
        surfearner.bnr_list = null;
        surfearner.stop_sites = [];
        surfearner.auth = null;
        surfearner.extauth = null;
        surfearner._auth = false;
        surfearner.adv = null;
        _ext_log = [];

        this.banner_hide();
      },
      reset_css:    function () {
        surfearner.css_inject(1);
      },
      connect:      function () {
        if (surfearner.state !== 'true' || cm.get('connect.timeout'))
          return;
        cm.set('connect.timeout', true, surfearner.settings.timeout.connect);
        chrome.runtime.sendMessage({
            query: "extConnect",
            data:  {
              id: surfearner.extauth
            }
          },
          function (response) {
            if (response.success) {
              d = JSON.parse(response.data);
              surfearner.do(d);
              if (!d.extauth) return;
              cm.set('extauth', 'id_' + d.extauth, 86400);
              surfearner.extauth = 'id_' + d.extauth;
            } else {
              console.log('extConnect error', response);
            }
          }
        );
      },
      connect_push: function () {
        if (
          surfearner.state !== 'true' ||
          cm.get('connect_sepush.timeout') ||
          !surfearner.settings.push
        )
          return;

        cm.set('connect_sepush.timeout', true, surfearner.settings.timeout.connect_push);
        chrome.runtime.sendMessage({
            query: "connectPush",
            data:  {
              id: surfearner.extauth
            }
          },
          function (response) {
            var d;
            if (response.success) {
              try {
                d = JSON.parse(response.data);
              } catch (e) {
                return;
              }
            } else
              return;
            surfearner.do(d);
            if (!d.auth)
              return;
            cm.set("auth", d.auth, 43200);
            surfearner.init_push(d.auth);
          }
        );
      },
      autostart:    function (state) {
        chrome.storage.local.get("ext_autostart", function (d) {
          var _time = d.ext_autostart;
          var time = parseInt((_time - (new Date()).valueOf()) / 1000);
          if (state === 'false' && _time !== null && time < 1) {
            chrome.storage.local.set({
              'state': 'true'
            });
          }
        });
      },

      bannerTimerFinished: function (finished, clicked) {
        if (surfearner.bannerTimer) {
          clearTimeout(surfearner.bannerTimer);
        }
        surfearner.bannerTimer = null;
        if (surfearner.adv && surfearner.adv.key) {
          cm.set('check.timeout', true, surfearner.settings.timeout.view_end);
          if (finished) {
            surfearner.finish(surfearner.extauth, surfearner.adv.key, clicked);
            cm.set('finished',
              {adid: surfearner.adv.key, clicked},
              3600
            );
          }
        }
        document.getElementById('__se_bnr_up').style.display = 'none';
        document.querySelector('.surfearner-timer').style.display = 'none';
        document.querySelector('.surfearner-price').style.display = 'block';
      },

      closeBanner: function () {
        surfearner.bannerTimerFinished(false, false);
        surfearner.hideAdv();
        document.getElementById('surfearner').style.display = 'none';
        if (surfearner.anim_type === 1) {
          document.body.className = document.body.className.replace('surfearned', '');
        }
      }

      // END OF surfearner class
    };

/// initialize subscribe to adv server
surfearner.domReady(function () {
  surfearner.page = 'ready';
  chrome.storage.local.get("allow_console_log", function (d) {
    var allow_console_log = d.allow_console_log;
    if (allow_console_log)
      _allow_console_log = allow_console_log;
  });
  chrome.storage.local.get("anim_type", function (d) {
    var anim_type = d.anim_type;
    if (anim_type)
      surfearner.anim_type = parseInt(anim_type);
    surfearner.checkstate(1);
  });

  if (window.location.host === 'surfearner.com' && document.getElementById('notify_ext_install'))
    document.getElementById('notify_ext_install').remove();

  // check extensoin state
  chrome.storage.local.get("state", function (d) {
    var state = d.state;
    if (!state) state = 'true';
    surfearner.state = state;
    // if we need enable extension
    surfearner.autostart(state);
    surfearner.init_push(cm.get('auth'));
    surfearner.extauth = cm.get('extauth');
    if (state === 'true')
      sepush.init();
  });

  if (location.href === 'https://surfearner.com/ext/auth') {
    surfearner.blockedSite = true;
    surfearner.extauth = document.getElementById('status').attributes['data-extauth'].value;
    cm.set('extauth', surfearner.extauth, 86400);
    var url = new URL(location.href);
    var noAlert = url.searchParams.get("noalert");
    if (!noAlert) {
      alert('Успешно!');
    }
    window.close();
  } else {
    chrome.runtime.sendMessage({query: "SEReady"},
      function (response) {
        if (response.success) {
          surfearner.blockedSite = response.blocked;
          if (!response.blocked)
            handlers.apply();
        }
      }
    );
  }
});

ifvisible.setIdleDuration(10);
var interval = ifvisible.onEvery(2, function () {
  log(2, 'ifvisible.onEvery', true);
  surfearner.checkstate();
});

ifvisible.blur();

window.addEventListener('click', function (e) {
  surfearner.userActivity();
});

window.addEventListener('focus', function (e) {
  surfearner.userActivity();
});

window.addEventListener('blur', function (e) {
  surfearner.userActivity();
});

window.addEventListener('resize', () => {
  surfearner.resizeBannerElements();
  surfearner.userActivity();
});

document.addEventListener("mousemove", function (e) {
  surfearner.userActivity();
  if (!document.getElementById('surfearner') || surfearner.anim_type !== 2) return;
  if (e.isTrusted && document.body.scrollTop < 5 && e.clientY < 113 && (parseInt(document.getElementById('surfearner').style.top) || 0) + 93 < e.clientY) {
    var top = e.clientY - 113;
    if (top > -75)
      document.getElementById('surfearner').style.top = top + 'px';

    document.getElementById('surfearner').style.opacity = '.5';
  } else
    document.getElementById('surfearner').style.top = '0px';

});

window.addEventListener('scroll', function () {
  surfearner.userActivity();
  if (!document.getElementById('surfearner') || surfearner.anim_type === 1) return;
  var scrolled = window.pageYOffset || document.documentElement.scrollTop;
  if (surfearner.anim_type === 2) {
    if (!scrolled)
      document.getElementById('surfearner').style.opacity = '.5';
    else
      document.getElementById('surfearner').style.opacity = '1';
  }
  if (surfearner.anim_type === 3) {
    if (__scroll_before !== null && scrolled > __scroll_before) {
      __scroll_before = null;
      surfearner.banner_show();
    } else if (__scroll_before !== null)
      __scroll_before = scrolled;
  }
});

window.addEventListener("message", function (e) {
  if (e.data.type === "toBackground") {
    chrome.runtime.sendMessage(e.data.data);
    return;
  }
  if (e.data.type === 'adv') {
    console.log("adv Message", e);
    let banner = e.data.adv;
    chrome.runtime.sendMessage({
        query: "bannerPreview",
        data:  {
          item: {
            preview:  true,
            adid:     banner.adid,
            adult:    banner.adult ? banner.adult : false,
            alt_text: banner.alt_text,
            file:     banner.file,
            key:      "",
            link:     banner.link,
            price:    banner.price,
            size:     banner.size,
            time:     banner.time,
            type:     banner.type
          }
        }
      },
      function (response) {
        console.log("Banner preview response:", response);
      }
    );
    return;
  }
  if (e.data.type === 'reset') {
    surfearner.reset();
    return;
  }
  if (e.data.type === "extauth") {
    cm.set("extauth", e.data.extauth, 86400);
    surfearner.extauth = 'id_' + e.data.extauth;
    var intInt = document.getElementById('int');
    if (intInt)
      clearInterval(intInt.attributes['data-int'].value);
    var url = new URL(location.href);
    var noAlert = url.searchParams.get("noalert");
    if (!noAlert) {
      alert('Успешно!');
    }
    window.close();
    return;
  }
  if (e.data.type === "save_log") {
    if (!/^https?:\/\/surfearner\.com/.test(e.origin))
      return;

    chrome.storage.local.get('ext_log', function (b) {
      if (/^https?:\/\/surfearner\.com./.test(location.href) && b.ext_log.length) {
        chrome.storage.local.set({
          'ext_log': []
        });
        var suport = document.getElementById('ext_log');
        if (!suport) {
          suport = document.createElement('input');
          suport.type = 'hidden';
          suport.id = 'ext_log';
          suport.name = 'ext_log';
          suport.value = '';
          for (var i in b.ext_log) {
            suport.value += b.ext_log[i] + " \n\
";
          }
          document.getElementById('support').appendChild(suport);
        }
      }
    });
    return;
  }

  if (e.data.type === "ntf")
    return;

  surfearner.do(e.data);

}, false);

chrome.storage.onChanged.addListener(function (changes) {
  if (changes.adv) surfearner.adv = changes.adv.newValue;
  if (changes.state) surfearner.state = changes.state.newValue;
  if (changes._cm_extauth) surfearner.extauth = changes._cm_extauth.newValue;
  if (changes.anim_type) surfearner.anim_type = changes.anim_type.newValue;
  for (var key in changes) {
    var storageChange = changes[key];
    log(5, 'storage.onChanged', key, storageChange.newValue);
  }
});

function scrolling(to) {

  var current_position = document.all ? document.body.scrollTop : window.pageYOffset;
  //  console.log('scrolling ',current_position,to);
  setTimeout(function () {
    window.scroll(0, current_position + to);
  }, 20);
  //  window.scroll(0, current_position+to);

}

function log() {
  if (_allow_console_log >= arguments[0])
    console.log((new Date()).valueOf(), 'SE-ext: ', arguments);
  if (_allow_console_log >= 10)
    console.log(stackTrace());

  function stackTrace() {
    var err = new Error();
    return err.stack;
  }
}

var bnr_tpl = {
  "tag":       "div",
  "class":     "surfearner_frame",
  "id":        "surfearner_frame",
  "data-adid": "${adid}",
  "children":  [{
    "tag":      "div",
    "class":    "surfearner-timer",
    "style":    "display: block;",
    "children": [{
      "tag": "i", "class": "__se_iconSE __se_iconSE-clock-regular", "html": ""
    }, {
      "tag":   "span",
      "class": "st-sec",
      "html":  ""
    }, {
      "tag":  "span",
      "html": " сек."
    }]
  }, {
    "tag":      "div",
    "class":    "surfearner-price",
    "style":    "display: none;",
    "html":     "",
    "children": [{
      "tag": "i", "class": "__se_iconSE __se_iconSE-check-solid", "html": ""
    }, {
      "tag":   "span",
      "class": "__se_bnr_price",
      "html":  "+${price}"
    }, {
      "tag":  "span",
      "html": " RUB"
    }]
  }, {
    "tag":      "div",
    "class":    "surfearner-menu",
    "children": [{
      "tag":      "ul",
      "class":    "surf dropdown",
      "children": [{
        "tag":      "li",
        "children": [{
          "tag": "i", "class": "__se_iconSE __se_iconSE-ellipsis-h-solid", "html": ""
        }, {
          "tag":      "ul",
          "children": [{
            "tag":      "li",
            "children": [{
              "tag":  "span",
              "id":   "surf-menu-hide",
              "html": "Свернуть"
            }]
          }, {
            "tag":      "li",
            "children": [{
              "tag":  "span",
              "id":   "surf-menu-bottom",
              "html": "Переместить вниз"
            }]
          }, {
            "tag":      "li",
            "children": [{
              "tag":  "span",
              "id":   "surf-menu-raport",
              "html": "Пожаловаться"
            }]
          }, {
            "tag":      "li",
            "children": [{
              "tag":  "span",
              "id":   "surf-menu-site",
              "html": "Не показывать тут"
            }]
          }]
        }]
      }]
    }]
  }]
};
var type_tpl = {
  "3": {
    "tag":      "div",
    "class":    "banner-preview",
    "children": [{
      "tag":    "a",
      "href":   "${link}",
      "id":     "surfearner-link",
      "target": "_blank",
      "class":  "${class}",
      "html":   ""
    }, {
      "tag":      "div",
      "class":    "bp-html",
      "children": [{
        "tag":   "div",
        "class": "bph-title",
        "html":  "${file}"
      }, {
        "tag":   "div",
        "class": "bph-text",
        "html":  "${alt_text}"
      }]
    }]
  },
  "2": {
    "tag":      "div",
    "class":    "surfearner-b-swf",
    "style":    "width:${size}px",
    "children": [{
      "tag":      "a",
      "href":     "${link}",
      "class":    "${class}",
      "id":       "surfearner-link",
      "title":    "${alt_text}",
      "target":   "_blank",
      "children": [{
        "tag":    "object",
        "data":   "https://surfearner.com/files/${uid}/${file}",
        "alt":    "${alt_text}",
        "width":  "${size}",
        "height": "90",
        "id":     "",
        "type":   "application/x-shockwave-flash",
        "html":   ""
      }]
    }]
  },
  "1": {
    "tag":      "div",
    "class":    "surfearner-b-img",
    "style":    "width:${size}px",
    "children": [{
      "tag":      "a",
      "href":     "${link}",
      "id":       "surfearner-link",
      "title":    "${alt_text}",
      "class":    "${class}",
      "target":   "_blank",
      "children": [{
        "tag":  "img",
        "src":  "https://surfearner.com/files/${uid}/${file}",
        "alt":  "${alt_text}",
        "html": ""
      }]
    }]
  }
};

function insertLocalScript(file, tag, attr) {
  var
    n = document.getElementsByTagName(tag)[0],
    s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", chrome.runtime.getURL(file));
  if (undefined !== typeof attr)
    for (i in attr)
      if ("id" === i) s.id = attr[i];
      else s.setAttribute(i, attr[i]);
  n.appendChild(s);
}

function insertLocalStyle(file, tag, attr) {
  var
    n = document.getElementsByTagName(tag)[0],
    s = document.createElement("link");
  s.setAttribute("rel", "stylesheet");
  s.setAttribute("href", chrome.runtime.getURL(file));
  if (undefined !== typeof attr)
    for (i in attr)
      if ("id" === i) s.id = attr[i];
      else s.setAttribute(i, attr[i]);
  n.appendChild(s);
}
