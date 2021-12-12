(function (w, d, n) {
  if (typeof w[n] !== 'undefined') return;

  w[n] = {

    tpl: {
      "tag": "div", "class": "surfearner_notification", "id": "se_ntf-${nid}", "data-top": "", "children": [
        {
          "tag": "div", "class": "_se-img", "children": [
            {"tag": "img", "src": "${img}", "alt": "", "width": "100%", "height": "100%", "html": ""}
          ]
        },
        {"tag": "div", "class": "_se-title", "html": "${title}"},
        {"tag": "div", "class": "_se-msg", "html": "${msg}"},
        {"tag": "div", "class": "_se-close_btn", "data-nid": "${nid}"}
      ]
    },

    init: function (visiter) {
      visiter.init(this);
    },

    // show notification
    push:  function (o) {
      if (typeof o === 'string')
        o = this.msg[o];
      if (d.querySelector('#se_ntf-' + o.nid)) return;

      // if any notif is showing now
      var div = d.getElementById('surfearner_ntf_wrap');
      if (!div) {
        div = d.createElement('div');
        div.id = 'surfearner_ntf_wrap';
        d.body.insertBefore(div, d.body.firstChild);
      }

      var se = d.getElementById('surfearner');
      var banner = null;
      if (se && se.classList.contains('se_top')) {
        banner = d.getElementById('surfearner_frame');
      }
      var offsetY = (banner ? banner.offsetHeight : 0);

      var last_ntf = false,
          top      = 15 + offsetY;
      console.log('sepush:', top);

      for (var i in div.childNodes) {
        if (!(parseInt(i) >= 0)) break;
        if (div.childNodes[i].style && div.childNodes[i].style.display === 'none')
          continue;
        if (!div.childNodes[i].attributes['data-top'])
          continue;
        last_ntf = div.childNodes[i];
      }

      if (last_ntf !== false)
        top = parseInt(last_ntf.attributes['data-top'].value) + last_ntf.offsetHeight + 15;

      var parser = new DOMParser(),
          doc    = parser.parseFromString(json2html.transform(o, o.tpl ? o.tpl : this.tpl), "text/html");

      top = top + 'px';

      div.appendChild(doc.querySelector('.surfearner_notification'));


      if (!div) {
        var top = '15px';
        div = d.createElement('div');
        div.id = 'surfearner_ntf_wrap';
        div.innerHTML = json2html.transform(o, o.tpl ? o.tpl : this.tpl);
        d.body.insertBefore(div, d.body.firstChild);
      }

      var index = div.childNodes.length - 1;

      // close button
      div.childNodes[index].querySelector('._se-close_btn').onclick = function (e) {
        w[n].close(e.target.attributes['data-nid'].value);
      };

      // show animation
      setTimeout(function () {
        var div = d.getElementById('surfearner_ntf_wrap');
        div.childNodes[index].style.top = top;
      }, 200);

      div.childNodes[index].attributes['data-top'].value = parseInt(top);

      // special style
      if (o.css) {
        var style = d.createElement('style');
        style.textContent = o.css;
        d.head.appendChild(style);
      }

    },
    close: function (id) {
      if (id) {
        var el = document.getElementById('se_ntf-' + id);
        if (el) el.parentNode.removeChild(el);
      } else {
        var all = d.querySelectorAll('.surfearner_notification');
        for (var i in all) {
          if (i === 'length') break;
          var el = document.getElementById(all[i].id);
          if (el) el.parentNode.removeChild(el);
        }
      }
      w[n].move();
    },
    move:  function (no_anim) {
      var banner = d.getElementById('surfearner_frame');
      var ntfs = d.querySelectorAll('.surfearner_notification'),
          top  = 15 + (banner ? banner.offsetHeight : 0);
      for (var i in ntfs) {
        if (!(parseInt(i) >= 0)) break;
        if (ntfs[i].style.display === 'none') continue;
        if (no_anim) ntfs[i].className = 'surfearner_notification noamin';
        ntfs[i].style.top = top + 'px';
        ntfs[i].attributes['data-top'].value = top;
        top += ntfs[i].offsetHeight + 15;
        if (no_anim) ntfs[i].className = 'surfearner_notification';
      }
    },

    msg: {
      visit_start:           {
        nid:   100,
        img:   '//static.surfearner.com/images/svg/icon_push_money_bag.svg',
        title: '\u041A\u0430\u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u043D\u0438\u0435:',
        msg:   '1. \u041D\u0435 \u043F\u043E\u043A\u0438\u0434\u0430\u0439\u0442\u0435 \u044D\u0442\u043E\u0442 \u0441\u0430\u0439\u0442 \u0434\u043E \u0438\u0441\u0442\u0435\u0447\u0435\u043D\u0438\u044F \u0442\u0430\u0439\u043C\u0435\u0440\u0430<br>\
        2. \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u0430\u043F\u0447\u0443 \u0434\u043B\u044F \u0437\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0435\u043D\u0438\u044F',
        css:   false,
        tpl:   false
      },
      visit_fail:            {
        nid:   101,
        img:   '//static.surfearner.com/images/svg/icon_push_warning.svg',
        title: '\u0417\u0430\u0434\u0430\u043D\u0438\u0435 \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E!',
        msg:   '\u0412\u044B \u043F\u043E\u043A\u0438\u043D\u0443\u043B\u0438 \u0441\u0430\u0439\u0442 \u0434\u043E \u0438\u0441\u0442\u0435\u0447\u0435\u043D\u0438\u044F \u0442\u0430\u0439\u043C\u0435\u0440\u0430',
        css:   false,
        tpl:   false
      },
      visit_captcha:         {
        nid:   102,
        img:   '//static.surfearner.com/images/svg/icon_push_money_bag.svg',
        title: '\u0414\u043B\u044F \u0437\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u0438\u044F \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0435\u043D\u0438\u044F \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u0430\u043F\u0447\u0443:',
        msg:   '\u041A\u043B\u0438\u043A\u043D\u0438\u0442\u0435 \u043F\u043E \u043D\u0443\u0436\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0435 \u0438 \u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u201D\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C\u201D<br>',
        css:   false,
        tpl:   false
      },
      visit_captcha_timeout: {
        nid:   103,
        img:   '//static.surfearner.com/images/svg/icon_push_warning.svg',
        title: '\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0435\u043D\u0438\u0435 \u043D\u0435 \u0437\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u043E!',
        msg:   '\u0412\u044B \u043D\u0435 \u0443\u0441\u043F\u0435\u043B\u0438 \u0432\u0432\u0435\u0441\u0442\u0438 \u043A\u0430\u043F\u0447\u0443 \u0437\u0430 \u043E\u0442\u0432\u0435\u0434\u0435\u043D\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F',
        css:   false,
        tpl:   false
      },
      visit_success:         {
        nid:   104,
        img:   '//static.surfearner.com/images/svg/icon_push_money_bag.svg',
        title: '\u0412\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0435\u043D\u0438\u0435 \u0437\u0430\u0447\u0438\u0441\u043B\u0435\u043D\u043E!',
        msg:   '',
        css:   false,
        tpl:   false
      },
      // Ошибка авторизации
      visit_error_auth:      {
        nid:   105,
        img:   '//static.surfearner.com/images/svg/icon_push_warning.svg',
        title: '\u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438',
        msg:   '',
        css:   false,
        tpl:   false
      },
      // Ошибка задания
      visit_error_task:      {
        nid:   105,
        img:   '//static.surfearner.com/images/svg/icon_push_warning.svg',
        title: '\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0434\u0430\u043D\u0438\u044F',
        msg:   '',
        css:   false,
        tpl:   false
      },
    }

  };


  var visiter = {

    config:     false,
    pusher:     false,
    time_start: false,
    timer_id:   false,
    tpause:     false,

    // загружаем конфигурацию задания
    init: function (p) {

      if (d.querySelector('#surf-fail')) {
        p.push('visit_fail');
        return;
      }
      if (d.querySelector('#surf-visit')) {
        window._se_uid = d.querySelector('#surf-visit').attributes['data-token'].value;
      }
      if (!window._se_uid)
        return;
      console.log('SE VISITER: init');
      this.pusher = p;
      this.ajax('//s3.surfearner.com/ext/surf',
        {uid: window._se_uid || 0},
        function (d) {
          try {
            var config = JSON.parse(d);
          } catch (e) {
            visiter.break();
            return;
          }
          if (!config) {
            visiter.break();
            return;
          }

          if (config === -1) {
            visiter.pusher.push('visit_error_auth');
            visiter.break();
            return;
          }

          if (config === -2 || config === -3) {
            visiter.pusher.push('visit_error_task');
            visiter.break();
            return;
          }

          if (config.cmd && config.cmd === "connect") {
            visiter.pusher.push('visit_error_auth');
            visiter.break();
            return;
          }
          //surfearner.connect();

          config.first_push = parseInt(config.first_push);
          config.key = config.key.replace(/<[^>]*>?/g, '');
          config.price = parseFloat(config.price);
          config.time = parseInt(config.time);

          visiter.config = config;

          visiter.pusher.msg.visit_captcha.msg += '<iframe id="_se_visit_frame" src="//s3.surfearner.com/ext/surf?key=' + config.key + '"></iframe>';
          visiter.pusher.msg.visit_success.msg = '<span style="color:#56A848">+ ' + config.price + ' RUB</span>';
          visiter.pusher.msg.visit_start.img = '//static.surfearner.com/images/svg/icon_push_timer' + config.time + '.svg';
          // visiter.pusher.msg.visit_captcha_timeout.msg += '<br><a href="//surfearner.com/user/abuse/task/'+window._se_tid+'" target="_blank">\u0421\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435</a>'

          if (config.time > 3 && config.first_push)
            visiter.pusher.push('visit_start');
          visiter.start();
        });
    },

    start: function () {
      if (this.time_start)
        return;

      console.log('SE VISITER: start');

      // размещаем и запускаем таймер
      var elem = d.createElement('style');
      elem.textContent = '#_se_visit_timer {position: fixed;left:30px;bottom: 25px;background: #fff;border: 3px solid #28b7fb;\
        border-radius: 50px;width: 80px;height: 80px;color:#F22074;font-family: Arial;font-size:32px;\
        text-align: center;line-height: 80px;z-index: 1000000;}\
      #_se_visit_frame {border:0;width:375px;height:230px;}\
      #_se_visit_timer img {width:24px;height:24px;padding: 28px;}';
      d.body.appendChild(elem);

      var elem = d.createElement('div');
      elem.id = '_se_visit_timer';
      d.body.appendChild(elem);


      this.time_start = (new Date()).valueOf();

      if (d.querySelector('#surf-visit')) {
        this.time_start = parseInt(d.querySelector('#surf-visit').attributes['data-start'].value);
      }

      this.timer();
      setTimeout(function () {
        visiter.break();
      }, 300000);
    },


    timer: function () {
      if (!visiter.time_start) return;

      var time = (new Date()).valueOf();

      var left = parseInt(visiter.config.time - parseInt((time - visiter.time_start) / 1000)) + 1;

      if (left > 0) {
        document.querySelector('#_se_visit_timer').textContent = --left;

        visiter.timer_id = setTimeout(function () {
          visiter.timer();
        }, 1000);

      } else {
        window.onbeforeunload = true;
        visiter.time_start = false;
        document.querySelector('#_se_visit_timer').innerHTML = '<img src="//static.surfearner.com/images/svg/check.svg" />'; // green check

        // отобразить капчу, передав ключ
        visiter.pusher.close();
        visiter.pusher.push('visit_captcha');
        setTimeout(function () {
          document.querySelector('#_se_visit_timer').remove();
        }, 5000);
        w.postMessage({
          type: "toBackground",
          data: {visit_finish: 1}
        }, "*");
      }

    },

    break: function () {
      window.onbeforeunload = true;
      if (!visiter.time_start) return;
      document.querySelector('#_se_visit_timer').innerHTML = '<img src="//static.surfearner.com/images/svg/times.svg" />'; // red cross
      visiter.time_start = false;
      visiter.config = false;
      visiter.pusher.close();
      visiter.pusher.push('visit_fail');
    },

    // working with timer
    pause: function () {
      if (visiter.tpause) return;
      visiter.tpause = (new Date()).valueOf();
    },

    unpause: function () {
      if (!visiter.tpause) return;

      var time = visiter.tpause ? visiter.tpause : (new Date()).valueOf();
      var left = parseInt(visiter.config.time - parseInt((time - visiter.time_start) / 1000)) + 1;


      if (left > 0) {
        visiter.time_start += (new Date()).valueOf() - visiter.tpause;
        visiter.tpause = 0;
        w.postMessage({
          type: "toBackground",
          data: {unpause: visiter.time_start}
        }, "*");
      }
    },

    ajax: function (adr, args, handl, errf) {
      var oXmlHttp = new XMLHttpRequest();

      oXmlHttp.withCredentials = true;
      oXmlHttp.open("POST", adr, true);
      oXmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      oXmlHttp.onreadystatechange = function () {
        if (oXmlHttp.readyState == 4) {
          if (oXmlHttp.status == 200 && handl && handl.constructor === Function) {
            handl(oXmlHttp.responseText);
          } else if (errf !== undefined && errf.constructor === Function) {
            errf(oXmlHttp.status, oXmlHttp.statusText);
          }
          delete oXmlHttp;
        }
      };
      if (typeof args == 'object') {
        var _args = [];
        for (var n in args) {
          _args.push(n + '=' + encodeURIComponent(args[n]));
        }
        args = _args.join('&');
      }

      oXmlHttp.send(args);
    },

  };


  w[n].init(visiter);


  w.addEventListener('blur', function (e) {
    clearTimeout(visiter.timer_id);
    visiter.pause();

    if (visiter.time_start && !document.querySelectorAll('#se-nofocus').length) {
      var div = document.createElement('div');
      div.id = 'se-nofocus';
      div.style = 'position:fixed;width:100%;height:100%;\
      background:#ffffffee;text-align:center;isplay: block;\
      z-index: 111111111111;top: 0;padding: 20% 0;';
      div.innerHTML = '<div style="font-size:48px;">\u0424\u043E\u043A\u0443\u0441 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0443\u0442\u0435\u0440\u044F\u043D!</div>\
      <div style="margin: 30px 0;">\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E \u0441\u043E\u0431\u044B\u0442\u0438\u0435, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0432\u044B\u0437\u0432\u0430\u043B\u043E<br> \
\u043E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0443 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F \u0437\u0430\u0434\u0430\u043D\u0438\u044F.</div>\
      <div style="padding: 10px 16px;font-size: 18px;line-height: 1.3333333;\
    border-radius: 6px;text-align: center;white-space: nowrap;vertical-align: middle;\
    touch-action: manipulation;cursor: pointer;user-select: none;\
    color: #fff;background-color: #337ab7;border-color: #2e6da4;    display: inline-block;">\u0412\u0435\u0440\u043D\u0443\u0442\u044C\u0441\u044F \u043A \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044E \u0437\u0430\u0434\u0430\u043D\u0438\u044F</div>';

      document.body.appendChild(div);
    }

  });
  w.addEventListener('focus', function (e) {
    var el = document.getElementById('se-nofocus');
    if (el) el.parentNode.removeChild(el);
    visiter.unpause();
    visiter.timer_id = setTimeout(function () {
      visiter.timer();
    }, 1000);
  });

  w.addEventListener("message", function (e) {
    if (e.data.push && e.data.push === 'visit_success') {
      if (e.data.tid) {
        window.postMessage({cont: 'sepush', cmd: 'close', arg: e.data.tid}, "*");
      }
      w[n].close();
      w[n].push(e.data.push);
      setTimeout(function () {
        w[n].close();
      }, 3000);
    }
  }, false);

  // w.onbeforeunload = function (e) {
  //   var d=document,
  //   i=d.createElement('img');
  //   i.src='//s3.surfearner.com/visitinit.php?t=e&tid='+window._se_tid;
  //   d.body.appendChild(i);
  //   var e = e || window.event;
  //   e.returnValue = 'Вы действительно хотите покинуть страницу?';
  //   return e.returnValue;
  // };

  w['_se_plural'] = function (n, f) {
    n %= 100;
    if (n > 10 && n < 20)
      return f[2];
    n %= 10;
    return f[n > 1 && n < 5 ? 1 : n == 1 ? 0 : 2];
  };
})(window, document, '_se_push');
