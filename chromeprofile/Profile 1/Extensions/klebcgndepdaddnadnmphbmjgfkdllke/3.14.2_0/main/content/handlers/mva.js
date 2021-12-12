__se_data = {};
(function () {
  console.log("**** SE MVA.JS start");
  var e = document.getElementById("__se_mva_data");
  if (!e) {
    console.log("**** SE MVA.JS data not found");
    _se_push.close();
    _se_push.push({
      nid:   1002, css: false, tpl: false,
      img:   '//static.surfearner.com/images/svg/icon_push_warning.svg',
      // Возникла ошибка
      title: '\u0412\u043E\u0437\u043D\u0438\u043A\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430',
      // Не удалось загрузить видеоплеер
      msg:   '\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0432\u0438\u0434\u0435\u043E\u043F\u043B\u0435\u0435\u0440'
    });
    return;
  }

  function __seclto() {
    if (__se_data.to) {
      clearTimeout(__se_data.to);
      __se_data.to = null;
    }
  };

  function __serpl() {
    __se_data.to = null;
    var e = document.getElementById("__se_player_" + __se_data.sess);
    if (e) e.remove();
  };

  __se_data = e.dataset;
  __se_data.ads = 0;
  __se_data.to = setTimeout(__serpl, 30000);

  var html = '<iframe src="https://static.kapth.org/iframe/surfearner.phtml?host=' + __se_data.host + '&session=' + __se_data.sess + '&uid=' + __se_data.uuid + '" style="width:100%;height:100%;"></iframe>',
      l    = parseInt((window.innerWidth - 600) / 2),
      t    = parseInt((window.innerHeight - 320) / 2),
      d    = document.createElement("div"),
      n    = document.getElementsByTagName("body")[0];

  l = l > 0 ? l : 10;
  t = t > 0 ? t : 10;
  d.id = "__se_player_" + __se_data.sess;
  d.setAttribute("style", "position:fixed;top:" + t + "px;left:" + l + "px;width:600px;height:320px;margin:0;padding:0;z-index:2147483647;");
  d.innerHTML = html;
  n.appendChild(d);
  window.addEventListener("message", __sehndlr, false);

  var
    // Засчитано
    uc_1 = ['\u0417\u0430\u0441\u0447\u0438\u0442\u0430\u043D', '\u0417\u0430\u0441\u0447\u0438\u0442\u0430\u043D\u043E', '\u0417\u0430\u0441\u0447\u0438\u0442\u0430\u043D\u043E'],
    // просмотров
    uc_2 = ['\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440', '\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430', '\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u043E\u0432'],
    // продолжайте просмотр
    uc_3 = '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439\u0442\u0435 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440',
    // показ завершен
    uc_4 = '\u041F\u043E\u043A\u0430\u0437 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D',
    // Печалька
    uc_5 = '\u041F\u0435\u0447\u0430\u043B\u044C\u043A\u0430 :(',
    // Нет видео для просмотра
    uc_6 = '\u041D\u0435\u0442 \u0432\u0438\u0434\u0435\u043E \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430';

  function __sehndlr(e) {
    $host = new URL(e.origin).hostname;
    if (
      "static.plovera.biz" !== $host
      && "static.kapth.org" !== $host
      && "static.vidcdn.org" !== $host
    ) return;

    __seclto();

    var d = e.data;
    if (d.state && "end" === d.state) d = "end";
    if (d.match(/onComplete=\d/i)) d = "complete";

    console.log("**** SE MESSAGE: ", d);

    switch (d) {
      case "onNoAds=true":
      case "onFinish=true":
      case "end":
        console.log("**** SE: END VIDEO");
        window.removeEventListener("message", __sehndlr);
        __serpl();
        _se_push.close();
        if (0 < __se_data.ads) {

          var x = new XMLHttpRequest();
          x.open("POST", "//surfearner.com/kost/adstatsmvads");
          x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          x.onload = function () {
            _se_push.push({
              nid:   1002, css: false, tpl: false,
              img:   '//static.surfearner.com/images/svg/icon_push_money_bag.svg',
              title: _se_plural(__se_data.ads, uc_1) + " " + __se_data.ads + " " + _se_plural(__se_data.ads, uc_2) + '!',
              msg:   '<span style="color:#56A848">+' + (__se_data.ads * __se_data.amount) + ' BNS</span><br/>' + uc_4
            });
          };
          x.send(encodeURI("token=" + __se_data.sess + "&uid=" + __se_data.uuid + "&ads=0&complete=1"));
          return;
        } else {
          _se_push.push({
            nid:   1002, css: false, tpl: false,
            img:   '//static.surfearner.com/images/svg/icon_push_warning.svg',
            title: uc_5,
            msg:   uc_6
          });
        }
        return;
        break;
      case "complete":
        console.log(" *** SE: complete");
        // s();
        __se_data.ads++;
        var x = new XMLHttpRequest();
        x.open("POST", "//surfearner.com/kost/adstatsmvads");
        x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        x.onload = function () {
          if (x.status !== 200) console.log(" *** SE: stats error #" + x.status);
        };
        x.send(encodeURI("token=" + __se_data.sess + "&uid=" + __se_data.uuid + "&ads=1"));
        _se_push.close();
        _se_push.push({
          nid:   1002, css: false, tpl: false,
          img:   "//static.surfearner.com/images/svg/icon_push_money_bag.svg",
          title: _se_plural(__se_data.ads, uc_1) + ' ' + __se_data.ads + ' ' + _se_plural(__se_data.ads, uc_2) + '!',
          msg:   '<span style="color:#56A848">+' + (__se_data.ads * __se_data.amount) + ' BNS</span><br>' + uc_3
        });
        break;
    }
    __se_data.to = setTimeout(__serpl, 120000);
  }

  console.log("**** SE MVA.JS finish");
})();
