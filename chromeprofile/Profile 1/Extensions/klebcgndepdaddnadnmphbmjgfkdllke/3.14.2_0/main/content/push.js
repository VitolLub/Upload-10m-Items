(function (w, d, n) {

  if (typeof w[n] !== 'undefined') return;

  w[n] = {

    tpl: {
      "tag": "div", "class": "surfearner_notification noamin", "id": "se_ntf-${nid}", "data-top": "", "children": [
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

    // загрузаем список пушей, отображаем не закрытые
    init: function () {
      var list  = cm.get('push.visitedList'),
          nlist = {},
          cnt   = 0;

      if (!list)
        list = '{}';

      list = JSON.parse(list);
      for (var nid in list) {
        if (typeof nlist[nid] !== undefined && !cm.get('push.closed.' + nid) && cm.get('push.ttl.' + nid)) {
          o = list[nid];
          //if(o.tpl && o.tpl.class === 'surfearner_notification')
          //  o.tpl.class = 'surfearner_notification noamin'; // animation

          w[n].show(o);
          nlist[nid] = o;
          cnt++;
        }
      }

      if (cnt)
        cm.set('push.visitedList', JSON.stringify(nlist), 86400);
    },

    // проверяем какие пуши были закрыты в других вкладках
    focus: function () {
      $('.surfearner_notification').each(function () {
        var nid = $(this).find('._se-close_btn').attr('data-nid');
        if (cm.get('push.closed.' + nid))
          $(this).remove();
      });

      w[n].move();
    },

    // добавляем пуш в общий список
    add: function (o) {
      var list = cm.get('push.visitedList');
      if (!list)
        list = '{}';

      list = JSON.parse(list);
      list[o.nid] = o;

      cm.set('push.visitedList', JSON.stringify(list), 86400);
      cm.remove('push.closed.' + o.nid);
      cm.set('push.ttl.' + o.nid, 1, o.ttl ? o.ttl : 3600);

      o.tpl = w[n].tpl;
      o.tpl.class = 'surfearner_notification'; // animation
      w[n].show(o);
    },

    // show notification
    show:  function (o) {
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

      if (!div) {
        div = d.createElement('div');
        div.id = 'surfearner_ntf_wrap';
        d.body.insertBefore(div, d.body.firstChild);
      }

      var last_ntf = false,
          top      = 15 + offsetY,
          wrap     = d.createElement('div');
      console.log('pushShow():', top);
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

      $(wrap).json2html(o, w[n].tpl, {'output': 'jquery'});

      top = top + 'px';

      $(div).append($(wrap).children());

      var index = div.childNodes.length - 1;

      if (!!div.childNodes[index].attributes['data-top']) {
        if (div.childNodes[index].querySelector('._se-visit_go,._se-click_btn'))
          div.childNodes[index].querySelector('._se-visit_go,._se-click_btn').onclick = function (e) {
            var jqxhr = $.ajax({
              method:  "POST", url: 'https://surfearner.com/ext/click',
              data:    {nid: o.nid},
              success: function (resp) {
                console.log(resp);
              },
              error:   function (response) {
                console.log('===> Ошибка push.js click', o);
              }
            });
            w[n].close(e);
            chrome.runtime.sendMessage(o);
          };

        // close button
        var el = div.childNodes[index].querySelectorAll('._se-close_btn');
        for (var i in el) {
          el[i].onclick = function (e) {
            var jqxhr = $.ajax({
              method:  "POST", url: 'https://surfearner.com/ext/close',
              data:    {nid: o.nid},
              success: function (resp) {
                console.log(resp);
              },
              error:   function (response) {
                console.log('===> Ошибка push.js close', o);
              }
            });
            w[n].close(e);
          };
        }

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
      }
      if (o.ttl && o.ttl > 0) {
        // Закрываем через ttl
        setTimeout(function () {
          cm.set('push.closed.' + o.nid, 1, 86400);
          var el = d.querySelector('#se_ntf-' + o.nid);
          if (el) {
            el.remove();
          }
        }, o.ttl * 1000);
      }
    },
    close: function (e) {
      if (e.constructor === String) {
        cm.set('push.closed.' + e, 1, 86400);
        $('#se_ntf-' + e).remove();
        w[n].move();
      } else
        w[n].close(e.target.attributes['data-nid'].value);
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
    }
  };
})(window, document, 'sepush');
