var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.checkStringArgs = function(b, t, l) {
  if (null == b) {
    throw new TypeError("The 'this' value for String.prototype." + l + " must not be null or undefined");
  }
  if (t instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + l + " must not be a regular expression");
  }
  return b + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, t, l) {
  b != Array.prototype && b != Object.prototype && (b[t] = l.value);
};
$jscomp.getGlobal = function(b) {
  return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(b, t, l, r) {
  if (t) {
    l = $jscomp.global;
    b = b.split(".");
    for (r = 0; r < b.length - 1; r++) {
      var E = b[r];
      E in l || (l[E] = {});
      l = l[E];
    }
    b = b[b.length - 1];
    r = l[b];
    t = t(r);
    t != r && null != t && $jscomp.defineProperty(l, b, {configurable:!0, writable:!0, value:t});
  }
};
$jscomp.polyfill("String.prototype.startsWith", function(b) {
  return b ? b : function(b, l) {
    var r = $jscomp.checkStringArgs(this, b, "startsWith");
    b += "";
    var t = r.length, I = b.length;
    l = Math.max(0, Math.min(l | 0, r.length));
    for (var F = 0; F < I && l < t;) {
      if (r[l++] != b[F++]) {
        return !1;
      }
    }
    return F >= I;
  };
}, "es6", "es3");
$jscomp.polyfill("String.prototype.endsWith", function(b) {
  return b ? b : function(b, l) {
    var r = $jscomp.checkStringArgs(this, b, "endsWith");
    b += "";
    void 0 === l && (l = r.length);
    l = Math.max(0, Math.min(l | 0, r.length));
    for (var t = b.length; 0 < t && 0 < l;) {
      if (r[--l] != b[--t]) {
        return !1;
      }
    }
    return 0 >= t;
  };
}, "es6", "es3");
(function() {
  var b = window, t = !1;
  String.prototype.hashCode = function() {
    var a = 0, c;
    if (0 === this.length) {
      return a;
    }
    var d = 0;
    for (c = this.length; d < c; d++) {
      var h = this.charCodeAt(d);
      a = (a << 5) - a + h;
      a |= 0;
    }
    return a;
  };
  var l = "optOut_crawl revealStock s_boxOfferListing s_boxType s_boxHorizontal webGraphType webGraphRange overlayPriceGraph".split(" "), r = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), E = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), I = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), F = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), G = !r && !E && !I && !F, P = G ? "keepaChrome" : r ? "keepaOpera" : F ? "keepaSafari" : I ? 
  "keepaEdge" : "keepaFirefox", ba = E ? "Firefox" : F ? "Safari" : G ? "Chrome" : r ? "Opera" : I ? "Edge" : "Unknown", B = null, K = !1;
  try {
    K = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  } catch (a) {
  }
  if (G) {
    try {
      chrome.runtime.sendMessage("hnkcfpcejkafcihlgbojoidoihckciin", {type:"isActive"}, null, function(a) {
        chrome.runtime.lastError || a && a.isActive && (t = !0);
      });
    } catch (a) {
    }
  }
  try {
    chrome.runtime.onUpdateAvailable.addListener(function(a) {
      chrome.runtime.reload();
    });
  } catch (a) {
  }
  var Y = {}, Z = 0;
  chrome.runtime.onMessage.addListener(function(a, f, d) {
    if (f.tab && f.tab.url || f.url) {
      switch(a.type) {
        case "restart":
          document.location.reload(!1);
          break;
        case "setCookie":
          chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:a.key, value:a.val, secure:!0, expirationDate:(Date.now() / 1000 | 0) + 31536E3});
          "token" == a.key ? B != a.val && 64 == a.val.length && (B = a.val, c.set("token", B), setTimeout(function() {
            document.location.reload(!1);
          }, 300)) : c.set(a.key, a.val);
          break;
        case "getCookie":
          return chrome.cookies.get({url:"https://keepa.com/extension", name:a.key}, function(a) {
            null == a ? d({value:null}) : d({value:a.value});
          }), !0;
        case "openPage":
          chrome.windows.create({url:a.url, incognito:!0});
          break;
        case "isPro":
          d({value:c.stockServer.pro});
          break;
        case "getStock":
          return c.addStockJob(a, d), !0;
        case "getFilters":
          d({value:v.getFilters()});
          break;
        case "sendData":
          a = a.val;
          if (null != a.ratings) {
            if (f = a.ratings, 1000 > Z) {
              if ("f1" == a.key) {
                if (f) {
                  for (var h = f.length; h--;) {
                    var Q = f[h];
                    null == Q || null == Q.asin ? f.splice(h, 1) : (Q = a.domainId + Q.asin, Y[Q] ? f.splice(h, 1) : (Y[Q] = 1, Z++));
                  }
                  0 < f.length && k.sendPlainMessage(a);
                }
              } else {
                k.sendPlainMessage(a);
              }
            } else {
              Y = null;
            }
          } else {
            k.sendPlainMessage(a);
          }
          d({});
          break;
        case "optionalPermissionsRequired":
          d({value:(G || E || r) && "undefined" === typeof chrome.webRequest});
          break;
        case "optionalPermissionsDenied":
          c.set("optOut_crawl", "1");
          console.log("optionalPermissionsDenied");
          d({value:!0});
          break;
        case "optionalPermissionsInContent":
          a = a.val;
          "undefined" != typeof a && (a ? (c.set("optOut_crawl", "0"), console.log("granted"), chrome.runtime.reload()) : (c.set("optOut_crawl", "1"), n.reportBug("permission denied"), console.log("denied")));
          d({value:!0});
          break;
        case "optionalPermissions":
          return "undefined" === typeof chrome.webRequest && chrome.permissions.request({permissions:["webRequest", "webRequestBlocking"]}, function(a) {
            chrome.runtime.lastError || (d({value:a}), "undefined" != typeof a && (a ? (c.set("optOut_crawl", "0"), console.log("granted"), chrome.runtime.reload()) : (c.set("optOut_crawl", "1"), n.reportBug("permission denied"), console.log("denied"))));
          }), !0;
        default:
          d({});
      }
    }
  });
  window.onload = function() {
    E ? chrome.storage.local.get(["install", "optOutCookies"], function(a) {
      a.optOutCookies && 3456E5 > Date.now() - a.optOutCookies || (a.install ? n.register() : chrome.tabs.create({url:chrome.runtime.getURL("chrome/content/onboard.html")}));
    }) : n.register();
  };
  try {
    chrome.browserAction.onClicked.addListener(function(a) {
      chrome.tabs.create({url:"https://keepa.com/#!manage"});
    });
  } catch (a) {
    console.log(a);
  }
  var c = {storage:chrome.storage.local, contextMenu:function() {
    try {
      chrome.contextMenus.removeAll(), chrome.contextMenus.create({title:"View products on Keepa", contexts:["page"], documentUrlPatterns:"*://*.amazon.com/* *://*.amzn.com/* *://*.amazon.co.uk/* *://*.amazon.de/* *://*.amazon.fr/* *://*.amazon.it/* *://*.amazon.ca/* *://*.amazon.com.mx/* *://*.amazon.es/* *://*.amazon.co.jp/* *://*.amazon.in/*".split(" ")}), chrome.contextMenus.onClicked.addListener(function(a, c) {
        chrome.tabs.sendMessage(c.id, {key:"collectASINs"}, {}, function(a) {
          "undefined" != typeof a && chrome.tabs.create({url:"https://keepa.com/#!viewer/" + encodeURIComponent(JSON.stringify(a))});
        });
      });
    } catch (a) {
      console.log(a);
    }
  }, parseCookieHeader:function(a, c) {
    if (0 < c.indexOf("\n")) {
      c = c.split("\n");
      for (var d = 0; d < c.length; ++d) {
        var h = c[d].substring(0, c[d].indexOf(";")), f = h.indexOf("=");
        h = [h.substring(0, f), h.substring(f + 1)];
        2 == h.length && "-" != h[1] && a.push(h);
      }
    } else {
      c = c.substring(0, c.indexOf(";")), d = c.indexOf("="), c = [c.substring(0, d), c.substring(d + 1)], 2 == c.length && "-" != c[1] && a.push(c);
    }
  }, log:function(a) {
    n.quiet || console.log(a);
  }, iframeWin:null, operationComplete:!1, counter:0, stockInit:!1, stockReferer:[], stockSessions:[], stockCallbacks:[], stockOrigin:[], initStock:function() {
    if (!c.stockInit && "undefined" != typeof chrome.webRequest) {
      var a = "*://www.amazon.com/*?*kidkid* *://www.amazon.co.uk/*?*kidkid* *://www.amazon.es/*?*kidkid* *://www.amazon.nl/*?*kidkid* *://www.amazon.com.mx/*?*kidkid* *://www.amazon.it/*?*kidkid* *://www.amazon.in/*?*kidkid* *://www.amazon.de/*?*kidkid* *://www.amazon.fr/*?*kidkid* *://www.amazon.co.jp/*?*kidkid* *://www.amazon.ca/*?*kidkid* *://www.amazon.com.br/*?*kidkid* *://www.amazon.com.au/*?*kidkid* *://www.amazon.com.mx/*?*kidkid* *://smile.amazon.com/*?*kidkid* *://smile.amazon.co.uk/*?*kidkid* *://smile.amazon.es/*?*kidkid* *://smile.amazon.nl/*?*kidkid* *://smile.amazon.com.mx/*?*kidkid* *://smile.amazon.it/*?*kidkid* *://smile.amazon.in/*?*kidkid* *://smile.amazon.de/*?*kidkid* *://smile.amazon.fr/*?*kidkid* *://smile.amazon.co.jp/*?*kidkid* *://smile.amazon.ca/*?*kidkid* *://smile.amazon.com.br/*?*kidkid* *://smile.amazon.com.au/*?*kidkid* *://smile.amazon.com.mx/*?*kidkid*".split(" ");
      try {
        chrome.webRequest.onBeforeSendHeaders.addListener(function(a) {
          var d = a.requestHeaders, h = {};
          try {
            var f = a.url.indexOf("kidkid");
            if (0 < f) {
              var x = a.url.substr(f + 7);
              if (0 < a.url.indexOf("cart/add.html") || 0 < a.url.indexOf("add-to-cart") || 0 < a.url.indexOf("item-dispatch")) {
                for (var w = 0; w < d.length; ++w) {
                  var b = d[w].name.toLowerCase();
                  (c.stockServer.addCartHeaders[b] || c.stockServer.addCartHeaders[d[w].name] || "cookie" == b || "content-type" == b || "sec-fetch-dest" == b || "sec-fetch-mode" == b || "sec-fetch-user" == b || "accept" == b || "referer" == b) && d.splice(w--, 1);
                }
                if (19 > c.stockSessions[x].length) {
                  return h.cancel = !0, h;
                }
                for (var n in c.stockServer.addCartHeaders) {
                  var l = c.stockServer.addCartHeaders[n];
                  0 != l.length && (l = l.replace("{COOKIE}", c.stockSessions[x]).replace("{REFERER}", c.stockReferer[x]).replace("{ORIGIN}", c.stockOrigin[x]), d.push({name:n, value:l}));
                }
              } else {
                for (b = 0; b < d.length; ++b) {
                  w = d[b].name.toLowerCase(), (c.stockServer.addressChangeHeaders[w] || c.stockServer.addressChangeHeaders[d[b].name] || "cookie" == w) && d.splice(b--, 1);
                }
                for (var k in c.stockServer.addressChangeHeaders) {
                  var e = c.stockServer.addressChangeHeaders[k];
                  0 != e.length && (e = e.replace("{COOKIE}", c.stockSessions[x]).replace("{REFERER}", c.stockReferer[x]).replace("{ORIGIN}", c.stockOrigin[x]), d.push({name:k, value:e}));
                }
              }
              for (b = 0; b < d.length; ++b) {
                var r = d[b].name.toLowerCase();
                (c.stockServer.stockHeaders[r] || c.stockServer.stockHeaders[d[b].name] || "origin" == r || "pragma" == r || "cache-control" == r || "upgrade-insecure-requests" == r) && d.splice(b--, 1);
              }
              for (var v in c.stockServer.stockHeaders) {
                var t = c.stockServer.stockHeaders[v];
                0 != t.length && (t = t.replace("{COOKIE}", c.stockSessions[x]).replace("{REFERER}", c.stockReferer[x]).replace("{ORIGIN}", c.stockOrigin[x]), d.push({name:v, value:t}));
              }
              h.requestHeaders = d;
              a.requestHeaders = d;
            } else {
              return h.cancel = !0, h;
            }
          } catch (R) {
            h.cancel = !0;
          }
          return h;
        }, {urls:a}, G ? ["blocking", "requestHeaders", "extraHeaders"] : ["blocking", "requestHeaders"]), chrome.webRequest.onHeadersReceived.addListener(function(a) {
          var d = a.responseHeaders, h = {};
          try {
            var f = a.url.indexOf("kidkid"), x = [];
            if (0 < f) {
              var w = a.url.substr(f + 7);
              if (0 < a.url.indexOf("cart/add.html") || 0 < a.url.indexOf("add-to-cart") || 0 < a.url.indexOf("item-dispatch")) {
                for (var b = 0; b < d.length; ++b) {
                  "set-cookie" == d[b].name.toLowerCase() && (d.splice(b, 1), b--);
                }
                h.responseHeaders = d;
              } else {
                for (a = 0; a < d.length; ++a) {
                  b = d[a], "set-cookie" == b.name.toLowerCase() && c.parseCookieHeader(x, b.value);
                }
                h.cancel = !0;
                setTimeout(function() {
                  c.stockCallbacks[w](x);
                }, 10);
              }
            } else {
              return h.cancel = !0, h;
            }
          } catch (da) {
            h.cancel = !0;
          }
          return h;
        }, {urls:a}, G ? ["blocking", "responseHeaders", "extraHeaders"] : ["blocking", "responseHeaders"]), c.stockInit = !0;
      } catch (f) {
        n.reportBug(f, f.message + " stock exception: " + typeof chrome.webRequest + " " + ("undefined" != typeof chrome.webRequest ? typeof chrome.webRequest.onBeforeSendHeaders : "~") + " " + ("undefined" != typeof chrome.webRequest ? typeof chrome.webRequest.onHeadersReceived : "#"));
      }
    }
  }, stockServer:{stock:null, post:null, price:null, stockAdd:null, stockQty:null, stockMaxQty:null, limit:null, zipCodes:null, stockEnabled:null}, stockJobQueue:[], addStockJob:function(a, f) {
    var d = function(a) {
      c.stockJobQueue.shift();
      f(a);
      0 < c.stockJobQueue.length && c.processStockJob(c.stockJobQueue[0][0], c.stockJobQueue[0][1]);
    };
    c.stockJobQueue.push([a, d]);
    1 == c.stockJobQueue.length && c.processStockJob(a, d);
  }, processStockJob:function(a, f) {
    if (null == c.stockServer.stock) {
      console.log("stock retrieval not initialized"), f({error:"stock retrieval not initialized", errorCode:0});
    } else {
      if (0 == c.stockServer.stockEnabled[a.domainId]) {
        console.log("stock retrieval not supported for domain"), f({error:"stock retrieval not supported for domain", errorCode:1});
      } else {
        if (!0 === c.stockServer.pro || a.force) {
          if (!a.isMAP && a.maxQty && c.stockServer.stockMaxQty && a.maxQty < c.stockServer.stockMaxQty) {
            f({stock:a.maxQty, limit:!1});
          } else {
            if (null == a.oid) {
              console.log("missing oid", a), f({error:"stock retrieval failed for offer: " + a.asin + " id: " + a.id2 + " missing oid.", errorCode:9});
            } else {
              if (a.onlyMaxQty) {
                f();
              } else {
                if (c.initStock(), c.stockInit) {
                  a.id = c.counter++;
                  a.id2 = c.counter++;
                  c.stockOrigin[a.id2] = a.host;
                  c.stockOrigin[a.id] = a.host;
                  setTimeout(function() {
                    delete c.stockSessions[a.id2];
                    delete c.stockCallbacks[a.id];
                    delete c.stockReferer[a.id2];
                    delete c.stockOrigin[a.id2];
                    delete c.stockOrigin[a.id];
                  }, 120000);
                  var d = c.stockServer.zipCodes[a.domainId];
                  c.stockCallbacks[a.id] = function(d) {
                    for (var h = "", b = !1, w = !1, l = 0, r = 0; r < d.length; ++r) {
                      var k = d[r];
                      h += k[0] + "=" + k[1] + "; ";
                      "session-id" == k[0] && 16 < k[1].length && 65 > k[1].length && (b = !0, k[1] != a.session && (w = !0, l = k[1]));
                    }
                    a.cookie = h;
                    b && w ? (c.stockSessions[a.id2] = h, c.stockReferer[a.id2] = a.referer, n.httpPost("https://" + a.host + c.stockServer.addCartUrl + "?kidkid=" + a.id2, c.stockServer.addCartPOST.replace("{SESSION_ID}", l).replace("{OFFER_ID}", a.oid).replace("{ADDCART}", c.stockServer.stockAdd[a.domainId]).replaceAll("{ASIN}", a.asin), function(d) {
                      var h = d.match(new RegExp(c.stockServer.stock)), b = d.match(new RegExp(c.stockServer.stockAlt)), w = d.match(new RegExp(c.stockServer.price)), x = (new RegExp(c.stockServer.limit)).test(d);
                      h ? (d = parseInt(h[1]), h = -1, b && (h = parseInt(b[1])), f({stock:Math.max(d, h), limit:x, price:w ? parseInt(w[1].replace(/[\D]/g, "")) / d : -1})) : d.match(/automated access/) ? (f({error:"Amazon stock retrieval rate limited (bot detection) of offer: " + a.asin + " id: " + a.id2 + " offer: " + a.oid, errorCode:5}), console.log("stock retrieval rate limited for offer: ", a.asin + " " + a.oid + " id: " + a.id2, d.length)) : f({error:"stock retrieval failed for offer: " + 
                      a.asin + " id: " + a.id2 + " offer: " + a.oid, errorCode:6});
                    }, !1)) : (n.reportBug(null, "stock session issue: " + b + " " + w + " counter: " + c.counter + " c: " + JSON.stringify(d) + " " + JSON.stringify(a)), f({error:"stock session issue: " + b + " " + w, errorCode:4}));
                  };
                  1 == c.stockServer.post ? n.httpPost("https://" + a.host + c.stockServer.addressChangeUrl + "?kidkid=" + a.id, c.stockServer.addressChangePOST.replace("{ZIPCODE}", d), null, !1) : -1 < a.host.indexOf("smile") ? n.httpGet("https://" + a.host + "/gp/chpf/homepage?kidkid=" + a.id, null, !1) : n.httpGet("https://" + a.host + "/?kidkid=" + a.id, null, !1);
                } else {
                  console.log("could not init stock retrieval", c.stockInit, typeof chrome.webRequest), f({error:"could not init stock retrieval", errorCode:"undefined" != typeof chrome.webRequest ? 3 : 33});
                }
              }
            }
          }
        } else {
          console.log("stock retrieval not pro"), f({error:"stock retrieval failed, not subscribed", errorCode:2});
        }
      }
    }
  }, set:function(a, b, d) {
    var h = {};
    h[a] = b;
    c.storage.set(h, d);
  }, remove:function(a, b) {
    c.storage.remove(a, b);
  }, get:function(a, b) {
    "function" != typeof b && (b = function() {
    });
    c.storage.get(a, function(a) {
      b(a);
    });
  }};
  c.contextMenu();
  var n = {quiet:!0, version:chrome.runtime.getManifest().version, browser:1, url:"https://keepa.com", testUrl:"https://test.keepa.com", getDomain:function(a) {
    switch(a) {
      case "com":
        return 1;
      case "co.uk":
        return 2;
      case "de":
        return 3;
      case "fr":
        return 4;
      case "co.jp":
        return 5;
      case "ca":
        return 6;
      case "it":
        return 8;
      case "es":
        return 9;
      case "in":
        return 10;
      case "com.mx":
        return 11;
      case "com.br":
        return 12;
      case "com.au":
        return 13;
      case "nl":
        return 14;
      default:
        return 1;
    }
  }, objectStorage:[], Guid:function() {
    var a = function(c, h, b) {
      return c.length >= h ? c : a(b + c, h, b || " ");
    }, c = function() {
      var a = (new Date).getTime();
      return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/x/g, function(c) {
        var d = (a + 16 * Math.random()) % 16 | 0;
        a = Math.floor(a / 16);
        return ("x" === c ? d : d & 7 | 8).toString(16);
      });
    };
    return {newGuid:function() {
      var d = "undefined" != typeof window.crypto.getRandomValues;
      if ("undefined" != typeof window.crypto && d) {
        d = new window.Uint16Array(16);
        window.crypto.getRandomValues(d);
        var h = "";
        for (x in d) {
          var b = d[x].toString(16);
          b = a(b, 4, "0");
          h += b;
        }
        var x = h;
      } else {
        x = c();
      }
      return x;
    }};
  }(), register:function() {
    chrome.cookies.onChanged.addListener(function(a) {
      a.removed || null == a.cookie || "keepa.com" != a.cookie.domain || "/extension" != a.cookie.path || ("token" == a.cookie.name ? B != a.cookie.value && 64 == a.cookie.value.length && (B = a.cookie.value, c.set("token", B), setTimeout(function() {
        document.location.reload(!1);
      }, 300)) : c.set(a.cookie.name, a.cookie.value));
    });
    var a = !1, b = function(d) {
      for (var b = {}, f = 0; f < d.length; b = {$jscomp$loop$prop$name$76:b.$jscomp$loop$prop$name$76}, f++) {
        b.$jscomp$loop$prop$name$76 = d[f];
        try {
          chrome.cookies.get({url:"https://keepa.com/extension", name:b.$jscomp$loop$prop$name$76}, function(d) {
            return function(b) {
              chrome.runtime.lastError && -1 < chrome.runtime.lastError.message.indexOf("No host permission") ? a || (a = !0, n.reportBug("extensionPermission restricted ### " + chrome.runtime.lastError.message)) : null != b && null != b.value && 0 < b.value.length && c.set(d.$jscomp$loop$prop$name$76, b.value);
            };
          }(b));
        } catch (x) {
          console.log(x);
        }
      }
    };
    b(l);
    chrome.cookies.get({url:"https://keepa.com/extension", name:"token"}, function(a) {
      if (null != a && 64 == a.value.length) {
        B = a.value, c.set("token", B);
      } else {
        var d = (Date.now() / 1000 | 0) + 31536E3;
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"optOut_crawl", value:"0", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"revealStock", value:"1", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxType", value:"0", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxOfferListing", value:"1", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"s_boxHorizontal", value:"0", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphType", value:"[1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"webGraphRange", value:"180", secure:!0, expirationDate:d});
        chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"overlayPriceGraph", value:"0", secure:!0, expirationDate:d});
        b(l);
        c.get("token", function(a) {
          B = (a = a.token) && 64 == a.length ? a : n.Guid.newGuid();
          chrome.cookies.set({url:"https://keepa.com", path:"/extension", name:"token", value:B, secure:!0, expirationDate:d});
        });
      }
    });
    try {
      "undefined" != typeof chrome.storage.sync && chrome.storage.sync.clear();
    } catch (d) {
    }
    window.addEventListener("message", function(a) {
      var c = a.data;
      if (c) {
        if ("string" === typeof c) {
          try {
            c = JSON.parse(c);
          } catch (w) {
            return;
          }
        }
        if (c.log) {
          console.log(c.log);
        } else {
          var d = function() {
          };
          if (a.origin != n.url && a.origin != n.testUrl) {
            var b = v.getMessage();
            if (null != b && ("function" == typeof b.onDoneC && (d = b.onDoneC, delete b.onDoneC), "undefined" == typeof b.sent && c.sandbox && a.source == document.getElementById("keepa_data").contentWindow)) {
              if (c.sandbox == b.url) {
                v.setStatTime(40);
                try {
                  a.source.postMessage({key:"data", value:b}, "*");
                } catch (w) {
                  v.abortJob(407), d();
                }
              } else {
                c.isUrlMsg ? (b.wasUrl = c.sandbox, v.abortJob(405)) : (a = v.getOutgoingMessage(b, c.sandbox), k.sendMessage(a)), d();
              }
            }
          }
        }
      }
    });
    E ? c.set("addonVersionFirefox", n.version) : c.set("addonVersionChrome", n.version);
    try {
      chrome.runtime.setUninstallURL("https://dyn.keepa.com/app/stats/?type=uninstall&version=" + P + "." + n.version);
    } catch (d) {
    }
    window.setTimeout(function() {
      k.initWebSocket();
    }, 2000);
  }, log:function(a) {
    c.log(a);
  }, lastBugReport:0, reportBug:function(a, b, d) {
    var h = Error();
    c.get(["token"], function(c) {
      var f = Date.now();
      if (!(12E5 > f - n.lastBugReport || /(dead object)|(Script error)|(setUninstallURL)|(File error: Corrupted)|(operation is insecure)|(\.location is null)/i.test(a))) {
        n.lastBugReport = f;
        f = "";
        var w = n.version;
        b = b || "";
        try {
          if (f = h.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;"), !/(keepa|content)\.js/.test(f) || f.startsWith("https://www.amazon") || f.startsWith("https://smile.amazon") || f.startsWith("https://sellercentral")) {
            return;
          }
        } catch (W) {
        }
        try {
          f = f.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
        } catch (W) {
        }
        if ("object" == typeof a) {
          try {
            a = a instanceof Error ? a.toString() : JSON.stringify(a);
          } catch (W) {
          }
        }
        null == d && (d = {exception:a, additional:b, url:document.location.host, stack:f});
        d.keepaType = P;
        d.version = w;
        setTimeout(function() {
          n.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + c.token + "&type=" + ba + "&version=" + w, JSON.stringify(d), null, !1);
        }, 50);
      }
    });
  }, httpGet:function(a, c, b) {
    var d = new XMLHttpRequest;
    c && (d.onreadystatechange = function() {
      4 == d.readyState && c.call(this, d.responseText);
    });
    d.withCredentials = b;
    d.open("GET", a, !0);
    d.send();
  }, httpPost:function(a, c, d, b) {
    var f = new XMLHttpRequest;
    d && (f.onreadystatechange = function() {
      4 == f.readyState && d.call(this, f.responseText);
    });
    f.withCredentials = b;
    f.open("POST", a, !0);
    f.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    f.send(c);
  }};
  window.addEventListener("error", function(a, c, b, h, l) {
    a = "object" === typeof a && a.srcElement && a.target ? "[object HTMLScriptElement]" == a.srcElement && "[object HTMLScriptElement]" == a.target ? "Error loading script " + JSON.stringify(a) : JSON.stringify(a) : a.toString();
    var d = "";
    h = h || 0;
    if (l && l.stack) {
      d = l.stack;
      try {
        d = l.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
        if (!/(keepa|content)\.js/.test(d)) {
          return;
        }
        d = d.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
      } catch (w) {
      }
    }
    a = {msg:a, url:(c || document.location.toString()) + ":" + parseInt(b || 0) + ":" + parseInt(h || 0), stack:d};
    "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(a);
    n.reportBug(null, null, a);
    return !1;
  });
  var aa = 0;
  var k = {server:["wss://dyn.keepa.com", "wss://dyn-2.keepa.com"], serverIndex:0, clearTimeout:0, webSocket:null, sendPlainMessage:function(a) {
    K || (a = JSON.stringify(a), k.webSocket.send(pako.deflate(a)));
  }, sendMessage:function(a) {
    if (!K) {
      v.clearIframe();
      var c = pako.deflate(JSON.stringify(a));
      v.clearMessage();
      1 == k.webSocket.readyState && k.webSocket.send(c);
      403 == a.status && v.endSession(aa);
      b.console.clear();
    }
  }, initWebSocket:function() {
    K || c.get(["token", "optOut_crawl"], function(a) {
      var b = a.token, d = a.optOut_crawl;
      if (b && 64 == b.length) {
        var h = function() {
          if (null == k.webSocket || 1 != k.webSocket.readyState) {
            k.serverIndex %= k.server.length;
            if ("undefined" == typeof d || "undefined" == d || null == d || "null" == d) {
              d = "0";
            }
            t && (d = "1");
            "undefined" === typeof chrome.webRequest && (d = "1");
            var a = new WebSocket(k.server[k.serverIndex] + "/apps/cloud/?user=" + b + "&app=" + P + "&version=" + n.version + "&wr=" + typeof chrome.webRequest + "&optOut=" + d);
            a.binaryType = "arraybuffer";
            a.onmessage = function(a) {
              a = a.data;
              var b = null;
              a instanceof ArrayBuffer && (a = pako.inflate(a, {to:"string"}));
              try {
                b = JSON.parse(a);
              } catch (W) {
                n.reportBug(W, a);
                return;
              }
              108 != b.status && (108108 == b.timeout ? (b.stock && (c.stockServer.stock = b.stock, c.stockServer.stockAlt = b.stockAlt, c.stockServer.stockAdd = b.stockAdd, c.stockServer.stockQty = b.stockQty, c.stockServer.stockMaxQty = b.stockMaxQty, c.stockServer.addCartHeaders = b.addCartHeaders, c.stockServer.addressChangePOST = b.addressChangePOST, c.stockServer.addressChangeUrl = b.addressChangeUrl, c.stockServer.addCartUrl = b.addCartUrl, c.stockServer.addCartPOST = b.addCartPOST, c.stockServer.stockHeaders = 
              b.stockHeaders, c.stockServer.addressChangeHeaders = b.addressChangeHeaders, c.stockServer.post = b.post, c.stockServer.price = b.price, c.stockServer.limit = b.stockLimit, c.stockServer.zipCodes = b.zipCodes, c.stockServer.stockEnabled = b.stockEnabled, c.stockServer.pro = b.pro, console.log("stock reveal ready")), "undefined" != typeof b.keepaBoxPlaceholder && c.set("keepaBoxPlaceholder", b.keepaBoxPlaceholder), "undefined" != typeof b.keepaBoxPlaceholderBackup && c.set("keepaBoxPlaceholderBackup", 
              b.keepaBoxPlaceholderBackup), "undefined" != typeof b.keepaBoxPlaceholderBackupClass && c.set("keepaBoxPlaceholderBackupClass", b.keepaBoxPlaceholderBackupClass), "undefined" != typeof b.keepaBoxPlaceholderAppend && c.set("keepaBoxPlaceholderAppend", b.keepaBoxPlaceholderAppend), "undefined" != typeof b.keepaBoxPlaceholderBackupAppend && c.set("keepaBoxPlaceholderBackupAppend", b.keepaBoxPlaceholderBackupAppend)) : (b.domainId && (aa = b.domainId), v.clearIframe(), v.onMessage(b)));
            };
            a.onclose = function(a) {
              setTimeout(function() {
                h();
              }, 18E4 * Math.random());
            };
            a.onerror = function(b) {
              k.serverIndex++;
              a.close();
            };
            a.onopen = function() {
              v.abortJob(414);
            };
            k.webSocket = a;
          }
        };
        h();
      }
    });
  }};
  var v = function() {
    function a(a) {
      try {
        e.stats.times.push(a), e.stats.times.push(Date.now() - e.stats.start);
      } catch (p) {
      }
    }
    function f(b, c) {
      b.sent = !0;
      a(25);
      var d = b.key, m = b.messageId;
      b = b.stats;
      try {
        var p = A[C]["session-id"];
      } catch (g) {
        p = "";
      }
      d = {key:d, messageId:m, stats:b, sessionId:p, payload:[], status:200};
      for (var q in c) {
        d[q] = c[q];
      }
      return d;
    }
    function d(b) {
      C = e.domainId;
      T = t(A);
      "object" != typeof A[C] && (A[C] = {});
      "undefined" == typeof e.headers.Accept && (e.headers.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8");
      l(b, !b.isAjax, function(c) {
        a(0);
        var d = {payload:[]};
        if (c.match(G)) {
          d.status = 403;
        } else {
          if (b.contentFilters && 0 < b.contentFilters.length) {
            for (var m in b.contentFilters) {
              var p = c.match(new RegExp(b.contentFilters[m]));
              if (p) {
                d.payload[m] = p[1].replace(/\n/g, "");
              } else {
                d.status = 305;
                d.payload[m] = c;
                break;
              }
            }
          } else {
            d.payload = [c];
          }
        }
        try {
          b.stats.times.push(3), b.stats.times.push(n.lastBugReport);
        } catch (q) {
        }
        "undefined" == typeof b.sent && (d = f(b, d), k.sendMessage(d));
      });
    }
    function h(b) {
      C = e.domainId;
      T = t(A);
      "object" != typeof A[C] && (A[C] = {});
      "undefined" == typeof e.headers.Accept && (e.headers.Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*!/!*;q=0.8");
      a(4);
      var d = new URL(b.url), m = null;
      try {
        null != b.scrapeFilters && 0 < b.scrapeFilters.length && b.scrapeFilters[0].lager && chrome.cookies.get({url:d.origin, name:"session-id"}, function(a) {
          null == a ? m = "guest" : null != a.value && 5 < a.value.length && (m = a.value);
        });
      } catch (L) {
      }
      l(b, !b.isAjax, function(p, h) {
        a(6);
        if ("undefined" == typeof b.sent) {
          var q = {};
          try {
            for (var g = p.evaluate("//comment()", p, null, XPathResult.ANY_TYPE, null), e = g.iterateNext(), l = ""; e;) {
              l += e.textContent, e = g.iterateNext();
            }
            if (p.querySelector("body").textContent.match(G) || l.match(G)) {
              q.status = 403;
              if ("undefined" != typeof b.sent) {
                return;
              }
              q = f(b, q);
              k.sendMessage(q);
              return;
            }
          } catch (H) {
          }
          a(7);
          if (b.scrapeFilters && 0 < b.scrapeFilters.length) {
            var L = {}, D = {}, r = {}, z = "", t = null, v = function() {
              if ("" === z) {
                q.payload = [t];
                q.scrapedData = r;
                for (var a in D) {
                  q[a] = D[a];
                }
              } else {
                q.status = 305, q.payload = [t, z, ""];
              }
              try {
                b.stats.times.push(99), b.stats.times.push(n.lastBugReport);
              } catch (fa) {
              }
              "undefined" == typeof b.sent && (q = f(b, q), k.sendMessage(q));
            }, x = function(a, b, c) {
              var d = [];
              if (!a.selector) {
                if (!a.regExp) {
                  return z = "invalid selector, sel/regexp", !1;
                }
                d = p.querySelector("html").innerHTML.match(new RegExp(a.regExp));
                if (!d || d.length < a.reGroup) {
                  c = "regexp fail: html - " + a.name + c;
                  if (!1 === a.optional) {
                    return z = c, !1;
                  }
                  t += " // " + c;
                  return !0;
                }
                return d[a.reGroup];
              }
              var m = b.querySelectorAll(a.selector);
              0 == m.length && (m = b.querySelectorAll(a.altSelector));
              if (0 == m.length) {
                if (!0 === a.optional) {
                  return !0;
                }
                z = "selector no match: " + a.name + c;
                return !1;
              }
              if (a.parentSelector && (m = [m[0].parentNode.querySelector(a.parentSelector)], null == m[0])) {
                if (!0 === a.optional) {
                  return !0;
                }
                z = "parent selector no match: " + a.name + c;
                return !1;
              }
              if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > m.length || !1 === a.multiple && 1 < m.length)) {
                c = "selector multiple mismatch: " + a.name + c + " found: " + m.length;
                if (!1 === a.optional) {
                  return z = c, !1;
                }
                t += " // " + c;
                return !0;
              }
              if (a.isListSelector) {
                return L[a.name] = m, !0;
              }
              if (!a.attribute) {
                return z = "selector attribute undefined?: " + a.name + c, !1;
              }
              for (var g in m) {
                if (m.hasOwnProperty(g)) {
                  b = m[g];
                  if (!b) {
                    break;
                  }
                  if (a.childNode) {
                    a.childNode = Number(a.childNode);
                    b = b.childNodes;
                    if (b.length < a.childNode) {
                      c = "childNodes fail: " + b.length + " - " + a.name + c;
                      if (!1 === a.optional) {
                        return z = c, !1;
                      }
                      t += " // " + c;
                      return !0;
                    }
                    b = b[a.childNode];
                  }
                  b = "text" == a.attribute ? b.textContent : "html" == a.attribute ? b.innerHTML : b.getAttribute(a.attribute);
                  if (!b || 0 == b.length || 0 == b.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                    c = "selector attribute null: " + a.name + c;
                    if (!1 === a.optional) {
                      return z = c, !1;
                    }
                    t += " // " + c;
                    return !0;
                  }
                  if (a.regExp) {
                    var q = b.match(new RegExp(a.regExp));
                    if (!q || q.length < a.reGroup) {
                      c = "regexp fail: " + b + " - " + a.name + c;
                      if (!1 === a.optional) {
                        return z = c, !1;
                      }
                      t += " // " + c;
                      return !0;
                    }
                    d.push("undefined" == typeof q[a.reGroup] ? q[0] : q[a.reGroup]);
                  } else {
                    d.push(b);
                  }
                  if (!a.multiple) {
                    break;
                  }
                }
              }
              return a.multiple ? d : d[0];
            };
            e = !1;
            g = {};
            for (var A in b.scrapeFilters) {
              g.$jscomp$loop$prop$pageType$81 = A;
              a: {
                if (e) {
                  break;
                }
                g.$jscomp$loop$prop$pageFilter$78 = b.scrapeFilters[g.$jscomp$loop$prop$pageType$81];
                g.$jscomp$loop$prop$pageVersionTest$79 = g.$jscomp$loop$prop$pageFilter$78.pageVersionTest;
                l = p.querySelectorAll(g.$jscomp$loop$prop$pageVersionTest$79.selector);
                0 == l.length && (l = p.querySelectorAll(g.$jscomp$loop$prop$pageVersionTest$79.altSelector));
                if (0 != l.length) {
                  if ("undefined" != typeof g.$jscomp$loop$prop$pageVersionTest$79.multiple && null != g.$jscomp$loop$prop$pageVersionTest$79.multiple) {
                    if (!0 === g.$jscomp$loop$prop$pageVersionTest$79.multiple && 2 > l.length) {
                      break a;
                    }
                    if (!1 === g.$jscomp$loop$prop$pageVersionTest$79.multiple && 1 < l.length) {
                      break a;
                    }
                  }
                  if (g.$jscomp$loop$prop$pageVersionTest$79.attribute) {
                    var B = null;
                    B = "text" == g.$jscomp$loop$prop$pageVersionTest$79.attribute ? "" : l[0].getAttribute(g.$jscomp$loop$prop$pageVersionTest$79.attribute);
                    if (null == B) {
                      break a;
                    }
                  }
                  var C = g.$jscomp$loop$prop$pageType$81;
                  g.$jscomp$loop$prop$revealMAP$98 = g.$jscomp$loop$prop$pageFilter$78.revealMAP;
                  g.$jscomp$loop$prop$revealed$100 = !1;
                  g.$jscomp$loop$prop$afterAjaxFinished$101 = function(g) {
                    return function() {
                      var f = 0, h = [];
                      a(26);
                      var e = {}, l;
                      for (l in g.$jscomp$loop$prop$pageFilter$78) {
                        e.$jscomp$loop$prop$sel$87 = g.$jscomp$loop$prop$pageFilter$78[l];
                        if (!(e.$jscomp$loop$prop$sel$87.name == g.$jscomp$loop$prop$pageVersionTest$79.name || g.$jscomp$loop$prop$revealed$100 && "revealMAP" == e.$jscomp$loop$prop$sel$87.name)) {
                          var z = p;
                          if (e.$jscomp$loop$prop$sel$87.parentList) {
                            var k = [];
                            if ("undefined" != typeof L[e.$jscomp$loop$prop$sel$87.parentList]) {
                              k = L[e.$jscomp$loop$prop$sel$87.parentList];
                            } else {
                              if (!0 === x(g.$jscomp$loop$prop$pageFilter$78[e.$jscomp$loop$prop$sel$87.parentList], z, g.$jscomp$loop$prop$pageType$81)) {
                                k = L[e.$jscomp$loop$prop$sel$87.parentList];
                              } else {
                                break;
                              }
                            }
                            D[e.$jscomp$loop$prop$sel$87.parentList] || (D[e.$jscomp$loop$prop$sel$87.parentList] = []);
                            z = 0;
                            var u = {}, n;
                            for (n in k) {
                              if (k.hasOwnProperty(n)) {
                                if ("lager" == e.$jscomp$loop$prop$sel$87.name) {
                                  z++;
                                  try {
                                    var y = void 0;
                                    u.$jscomp$loop$prop$offerId$84 = void 0;
                                    e.$jscomp$loop$prop$sel$87.selector && (y = k[n].querySelector(e.$jscomp$loop$prop$sel$87.selector));
                                    e.$jscomp$loop$prop$sel$87.altSelector && (u.$jscomp$loop$prop$offerId$84 = k[n].querySelector(e.$jscomp$loop$prop$sel$87.altSelector));
                                    u.$jscomp$loop$prop$offerId$84 && (u.$jscomp$loop$prop$offerId$84 = u.$jscomp$loop$prop$offerId$84.getAttribute(e.$jscomp$loop$prop$sel$87.attribute));
                                    u.$jscomp$loop$prop$maxQty$85 = 999;
                                    if (!u.$jscomp$loop$prop$offerId$84) {
                                      try {
                                        var H = JSON.parse(e.$jscomp$loop$prop$sel$87.regExp);
                                        if (H.sel1) {
                                          try {
                                            var A = JSON.parse(k[n].querySelectorAll(H.sel1)[0].dataset[H.dataSet1]);
                                            u.$jscomp$loop$prop$offerId$84 = A[H.val1];
                                            u.$jscomp$loop$prop$maxQty$85 = A.maxQty;
                                          } catch (U) {
                                          }
                                        }
                                        if (!u.$jscomp$loop$prop$offerId$84 && H.sel2) {
                                          try {
                                            var B = JSON.parse(k[n].querySelectorAll(H.sel2)[0].dataset[H.dataSet2]);
                                            u.$jscomp$loop$prop$offerId$84 = B[H.val2];
                                            u.$jscomp$loop$prop$maxQty$85 = B.maxQty;
                                          } catch (U) {
                                          }
                                        }
                                      } catch (U) {
                                      }
                                    }
                                    if (y && u.$jscomp$loop$prop$offerId$84 && null != m) {
                                      f++;
                                      u.$jscomp$loop$prop$mapIndex$90 = n + "";
                                      u.$jscomp$loop$prop$isMAP$88 = !1;
                                      try {
                                        u.$jscomp$loop$prop$isMAP$88 = D[e.$jscomp$loop$prop$sel$87.parentList][u.$jscomp$loop$prop$mapIndex$90].isMAP || -1 != k[n].textContent.toLowerCase().indexOf("add to cart to see product details.");
                                      } catch (U) {
                                      }
                                      u.$jscomp$loop$prop$busy$89 = !0;
                                      u.$jscomp$loop$prop$currentASIN$83 = b.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                                      null == u.$jscomp$loop$prop$currentASIN$83 || 9 > u.$jscomp$loop$prop$currentASIN$83.length || setTimeout(function(a, e) {
                                        return function() {
                                          c.addStockJob({type:"getStock", asin:a.$jscomp$loop$prop$currentASIN$83, oid:a.$jscomp$loop$prop$offerId$84, host:d.host, maxQty:a.$jscomp$loop$prop$maxQty$85, onlyMaxQty:9 == e.$jscomp$loop$prop$sel$87.reGroup, isMAP:a.$jscomp$loop$prop$isMAP$88, referer:d.host + "/dp/" + a.$jscomp$loop$prop$currentASIN$83, domainId:b.domainId, force:!0, session:m}, function(b) {
                                            a.$jscomp$loop$prop$busy$89 && (a.$jscomp$loop$prop$busy$89 = !1, "undefined" != typeof b && (D[e.$jscomp$loop$prop$sel$87.parentList][a.$jscomp$loop$prop$mapIndex$90][e.$jscomp$loop$prop$sel$87.name] = b), 0 == --f && v(q));
                                          });
                                          setTimeout(function() {
                                            a.$jscomp$loop$prop$busy$89 && 0 == --f && (a.$jscomp$loop$prop$busy$89 = !1, console.log("timeout " + a.$jscomp$loop$prop$offerId$84), v(q));
                                          }, 2000 + 1000 * f);
                                        };
                                      }(u, e), 1);
                                    }
                                  } catch (U) {
                                  }
                                } else {
                                  if ("revealMAP" == e.$jscomp$loop$prop$sel$87.name) {
                                    if (u.$jscomp$loop$prop$revealMAP$48$91 = e.$jscomp$loop$prop$sel$87, y = void 0, y = u.$jscomp$loop$prop$revealMAP$48$91.selector ? k[n].querySelector(u.$jscomp$loop$prop$revealMAP$48$91.selector) : k[n], null != y && y.textContent.match(new RegExp(u.$jscomp$loop$prop$revealMAP$48$91.regExp))) {
                                      y = b.url.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                                      var J = g.$jscomp$loop$prop$pageFilter$78.sellerId;
                                      "undefined" == typeof J || null == J || null == y || 2 > y.length || (J = k[n].querySelector(e.$jscomp$loop$prop$sel$87.childNode).value, null == J || 20 > J + 0 || (y = u.$jscomp$loop$prop$revealMAP$48$91.altSelector.replace("OFFERID", J).replace("ASINID", y), f++, u.$jscomp$loop$prop$mapIndex$51$92 = n + "", w(y, "GET", null, 3000, function(a) {
                                        return function(b) {
                                          try {
                                            var c = g.$jscomp$loop$prop$pageFilter$78.price;
                                            if (c && c.regExp) {
                                              if (b.match(/no valid offer--/)) {
                                                D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92] || (D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92] = {}), D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92][a.$jscomp$loop$prop$revealMAP$48$91.name] = -1;
                                              } else {
                                                var d = b.match(new RegExp("price info--\x3e(?:.|\\n)*?" + c.regExp + "(?:.|\\n)*?\x3c!--")), e = b.match(/price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?<\/span)(?:.|\n)*?\x3c!--/);
                                                if (!d || d.length < c.reGroup) {
                                                  t += " //  priceMAP regexp fail: " + (b + " - " + c.name + g.$jscomp$loop$prop$pageType$81);
                                                } else {
                                                  var p = d[c.reGroup];
                                                  D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92] || (D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92] = {});
                                                  D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92][a.$jscomp$loop$prop$revealMAP$48$91.name] = p;
                                                  null != e && 2 == e.length && (D[a.$jscomp$loop$prop$revealMAP$48$91.parentList][a.$jscomp$loop$prop$mapIndex$51$92][a.$jscomp$loop$prop$revealMAP$48$91.name + "Shipping"] = e[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                                }
                                              }
                                            }
                                          } catch (ha) {
                                          }
                                          0 == --f && 0 == h.length && v();
                                        };
                                      }(u), function() {
                                        0 == --f && 0 == h.length && v();
                                      })));
                                    }
                                  } else {
                                    y = x(e.$jscomp$loop$prop$sel$87, k[n], g.$jscomp$loop$prop$pageType$81);
                                    if (!1 === y) {
                                      break;
                                    }
                                    if (!0 !== y) {
                                      if (D[e.$jscomp$loop$prop$sel$87.parentList][n] || (D[e.$jscomp$loop$prop$sel$87.parentList][n] = {}), e.$jscomp$loop$prop$sel$87.multiple) {
                                        for (var C in y) {
                                          y.hasOwnProperty(C) && !e.$jscomp$loop$prop$sel$87.keepBR && (y[C] = y[C].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                        }
                                        y = y.join("\u271c\u271c");
                                        D[e.$jscomp$loop$prop$sel$87.parentList][n][e.$jscomp$loop$prop$sel$87.name] = y;
                                      } else {
                                        D[e.$jscomp$loop$prop$sel$87.parentList][n][e.$jscomp$loop$prop$sel$87.name] = e.$jscomp$loop$prop$sel$87.keepBR ? y : y.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                      }
                                    }
                                  }
                                }
                              }
                              u = {$jscomp$loop$prop$currentASIN$83:u.$jscomp$loop$prop$currentASIN$83, $jscomp$loop$prop$offerId$84:u.$jscomp$loop$prop$offerId$84, $jscomp$loop$prop$maxQty$85:u.$jscomp$loop$prop$maxQty$85, $jscomp$loop$prop$isMAP$88:u.$jscomp$loop$prop$isMAP$88, $jscomp$loop$prop$busy$89:u.$jscomp$loop$prop$busy$89, $jscomp$loop$prop$mapIndex$90:u.$jscomp$loop$prop$mapIndex$90, $jscomp$loop$prop$revealMAP$48$91:u.$jscomp$loop$prop$revealMAP$48$91, $jscomp$loop$prop$mapIndex$51$92:u.$jscomp$loop$prop$mapIndex$51$92};
                            }
                          } else {
                            k = x(e.$jscomp$loop$prop$sel$87, z, g.$jscomp$loop$prop$pageType$81);
                            if (!1 === k) {
                              break;
                            }
                            if (!0 !== k) {
                              if (e.$jscomp$loop$prop$sel$87.multiple) {
                                for (var E in k) {
                                  k.hasOwnProperty(E) && !e.$jscomp$loop$prop$sel$87.keepBR && (k[E] = k[E].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                }
                                k = k.join();
                              } else {
                                e.$jscomp$loop$prop$sel$87.keepBR || (k = k.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              r[e.$jscomp$loop$prop$sel$87.name] = k;
                            }
                          }
                        }
                        e = {$jscomp$loop$prop$sel$87:e.$jscomp$loop$prop$sel$87};
                      }
                      try {
                        if (1 == h.length || "500".endsWith("8") && 0 < h.length) {
                          h.shift()();
                        } else {
                          for (e = 0; e < h.length; e++) {
                            setTimeout(function() {
                              0 < h.length && h.shift()();
                            }, 500 * e);
                          }
                        }
                      } catch (U) {
                      }
                      0 == f && 0 == h.length && v();
                    };
                  }(g);
                  if (g.$jscomp$loop$prop$revealMAP$98) {
                    if (e = p.querySelector(g.$jscomp$loop$prop$revealMAP$98.selector), null != e) {
                      g.$jscomp$loop$prop$url$99 = e.getAttribute(g.$jscomp$loop$prop$revealMAP$98.attribute);
                      if (null == g.$jscomp$loop$prop$url$99 || 0 == g.$jscomp$loop$prop$url$99.length) {
                        g.$jscomp$loop$prop$afterAjaxFinished$101();
                        break;
                      }
                      0 != g.$jscomp$loop$prop$url$99.indexOf("http") && (e = document.createElement("a"), e.href = b.url, g.$jscomp$loop$prop$url$99 = e.origin + g.$jscomp$loop$prop$url$99);
                      r[g.$jscomp$loop$prop$revealMAP$98.name] = "1";
                      g.$jscomp$loop$prop$url$99 = g.$jscomp$loop$prop$url$99.replace(/(mapPopover.*?)(false)/, "$1true");
                      g.$jscomp$loop$prop$xhr$96 = new XMLHttpRequest;
                      g.$jscomp$loop$prop$hasTimeout$95 = !1;
                      g.$jscomp$loop$prop$ti$97 = setTimeout(function(a) {
                        return function() {
                          a.$jscomp$loop$prop$hasTimeout$95 = !0;
                          a.$jscomp$loop$prop$afterAjaxFinished$101();
                        };
                      }(g), 4000);
                      g.$jscomp$loop$prop$xhr$96.onreadystatechange = function(a) {
                        return function() {
                          if (!a.$jscomp$loop$prop$hasTimeout$95 && 4 == a.$jscomp$loop$prop$xhr$96.readyState) {
                            clearTimeout(a.$jscomp$loop$prop$ti$97);
                            if (200 == a.$jscomp$loop$prop$xhr$96.status) {
                              var b = a.$jscomp$loop$prop$xhr$96.responseText;
                              if (a.$jscomp$loop$prop$revealMAP$98.regExp) {
                                var c = b.match(new RegExp(a.$jscomp$loop$prop$revealMAP$98.regExp));
                                if (!c || c.length < a.$jscomp$loop$prop$revealMAP$98.reGroup) {
                                  if (c = p.querySelector(a.$jscomp$loop$prop$revealMAP$98.selector)) {
                                    var d = c.cloneNode(!1);
                                    d.innerHTML = b;
                                    c.parentNode.replaceChild(d, c);
                                  }
                                } else {
                                  r[a.$jscomp$loop$prop$revealMAP$98.name] = c[a.$jscomp$loop$prop$revealMAP$98.reGroup], r[a.$jscomp$loop$prop$revealMAP$98.name + "url"] = a.$jscomp$loop$prop$url$99;
                                }
                              }
                            }
                            a.$jscomp$loop$prop$revealed$100 = !0;
                            a.$jscomp$loop$prop$afterAjaxFinished$101();
                          }
                        };
                      }(g);
                      g.$jscomp$loop$prop$xhr$96.onerror = g.$jscomp$loop$prop$afterAjaxFinished$101;
                      g.$jscomp$loop$prop$xhr$96.open("GET", g.$jscomp$loop$prop$url$99, !0);
                      g.$jscomp$loop$prop$xhr$96.send();
                    } else {
                      g.$jscomp$loop$prop$afterAjaxFinished$101();
                    }
                  } else {
                    g.$jscomp$loop$prop$afterAjaxFinished$101();
                  }
                  e = !0;
                }
              }
              g = {$jscomp$loop$prop$pageFilter$78:g.$jscomp$loop$prop$pageFilter$78, $jscomp$loop$prop$pageVersionTest$79:g.$jscomp$loop$prop$pageVersionTest$79, $jscomp$loop$prop$revealed$100:g.$jscomp$loop$prop$revealed$100, $jscomp$loop$prop$pageType$81:g.$jscomp$loop$prop$pageType$81, $jscomp$loop$prop$hasTimeout$95:g.$jscomp$loop$prop$hasTimeout$95, $jscomp$loop$prop$afterAjaxFinished$101:g.$jscomp$loop$prop$afterAjaxFinished$101, $jscomp$loop$prop$xhr$96:g.$jscomp$loop$prop$xhr$96, $jscomp$loop$prop$ti$97:g.$jscomp$loop$prop$ti$97, 
              $jscomp$loop$prop$revealMAP$98:g.$jscomp$loop$prop$revealMAP$98, $jscomp$loop$prop$url$99:g.$jscomp$loop$prop$url$99};
            }
            a(8);
            if (null == C) {
              z += " // no pageVersion matched";
              q.payload = [t, z, b.dbg1 ? h : ""];
              q.status = 308;
              a(10);
              try {
                b.stats.times.push(99), b.stats.times.push(n.lastBugReport);
              } catch (H) {
              }
              "undefined" == typeof b.sent && (q = f(b, q), k.sendMessage(q));
            }
          } else {
            a(9), q.status = 306, "undefined" == typeof b.sent && (q = f(b, q), k.sendMessage(q));
          }
        }
      });
    }
    function l(c, d, f) {
      if (null != M && !R) {
        R = !0;
        for (var p = 1; p < M.length; p++) {
          var m = M[p];
          try {
            for (var q = window, g = 0; g < m.path.length - 1; g++) {
              q = q[m.path[g]];
            }
            if (m.b) {
              q[m.path[g]](S[m.index], m.a, m.b);
            } else {
              q[m.path[g]](S[m.index], m.a);
            }
          } catch (J) {
          }
        }
        b.console.clear();
      }
      N = c;
      var h = c.messageId;
      setTimeout(function() {
        null != N && N.messageId == h && (N = N = null);
      }, c.timeout);
      c.onDoneC = function() {
        N = null;
      };
      if (d) {
        a(11), d = document.getElementById("keepa_data"), d.removeAttribute("srcdoc"), d.src = c.url;
      } else {
        if (1 == c.httpMethod && (c.scrapeFilters && 0 < c.scrapeFilters.length && (I = c), !K && (K = !0, c.l && 0 < c.l.length))) {
          M = c.l;
          R = !0;
          for (d = 0; d < c.l.length; d++) {
            p = c.l[d];
            try {
              m = window;
              for (q = 0; q < p.path.length - 1; q++) {
                m = m[p.path[q]];
              }
              if (p.b) {
                m[p.path[q]](S[p.index], p.a, p.b);
              } else {
                m[p.path[q]](S[p.index], p.a);
              }
            } catch (J) {
            }
          }
          b.console.clear();
        }
        w(c.url, P[c.httpMethod], c.postData, c.timeout, function(d) {
          a(12);
          if ("o0" == c.key) {
            f(d);
          } else {
            var p = document.getElementById("keepa_data_2");
            p.src = "";
            d = d.replace(/src=".*?"/g, 'src=""');
            if (null != e) {
              e.block && (d = d.replace(new RegExp(e.block, "g"), ""));
              a(13);
              var m = !1;
              p.srcdoc = d;
              a(18);
              p.onload = function() {
                a(19);
                m || (p.onload = void 0, m = !0, a(20), setTimeout(function() {
                  a(21);
                  var b = document.getElementById("keepa_data_2").contentWindow;
                  try {
                    f(b.document, d);
                  } catch (ca) {
                    n.reportBug(ca), F(410);
                  }
                }, 80));
              };
            }
            b.console.clear();
          }
        });
      }
    }
    function r() {
      try {
        var a = document.getElementById("keepa_data");
        a.src = "";
        a.removeAttribute("srcdoc");
      } catch (z) {
      }
      try {
        var b = document.getElementById("keepa_data_2");
        b.src = "";
        b.removeAttribute("srcdoc");
      } catch (z) {
      }
      N = null;
    }
    function w(b, c, d, e, f) {
      var p = new XMLHttpRequest;
      if (f) {
        var m = !1, h = setTimeout(function() {
          m = !0;
          v.abortJob(413);
        }, e || 15000);
        p.onreadystatechange = function() {
          m || (2 == p.readyState && a(27), 4 == p.readyState && (clearTimeout(h), a(29), 503 != p.status && (0 == p.status || 399 < p.status) ? v.abortJob(415, [p.status]) : 0 == p.responseText.length && c == P[0] ? v.abortJob(416) : f.call(this, p.responseText)));
        };
        p.onerror = function() {
          v.abortJob(408);
        };
      }
      p.open(c, b, !0);
      null == d ? p.send() : p.send(d);
    }
    function t(a) {
      var b = "", c = "", d;
      for (d in a[C]) {
        var e = a[C][d];
        "-" != e && (b += c + d + "=" + e + ";", c = " ");
      }
      return b;
    }
    function B(a) {
      delete A["" + a];
      localStorage.cache = pako.deflate(JSON.stringify(A), {to:"string"});
    }
    function F(a, c) {
      if (null != e) {
        try {
          if ("undefined" != typeof e.sent) {
            return;
          }
          var d = f(e, {});
          c && (d.payload = c);
          d.status = a;
          k.sendMessage(d);
          r();
        } catch (L) {
          n.reportBug(L, "abort");
        }
      }
      b.console.clear();
    }
    var I = null, e = null, G = /automated access/, S = [function(a) {
    }, function(a) {
      if (null != e) {
        var b = !0;
        if (e.url == a.url) {
          O = a.frameId, V = a.tabId, X = a.parentFrameId, b = !1;
        } else {
          if (O == a.parentFrameId || X == a.parentFrameId || O == a.frameId) {
            b = !1;
          }
        }
        if (-2 != O && V == a.tabId && !(0 < a.url.indexOf("kidkid"))) {
          a = a.requestHeaders;
          var c = {};
          "" === e.headers.Cookie && (b = !0);
          (e.timeout + "").endsWith("108") || (e.headers.Cookie = b ? "" : T);
          for (var d in e.headers) {
            b = !1;
            for (var f = 0; f < a.length; ++f) {
              if (a[f].name.toLowerCase() == d.toLowerCase()) {
                "" == e.headers[d] ? a.splice(f, 1) : a[f].value = e.headers[d];
                b = !0;
                break;
              }
            }
            b || "" == e.headers[d] || a.push({name:E ? d.toLowerCase() : d, value:e.headers[d]});
          }
          c.requestHeaders = a;
          return c;
        }
      }
    }, function(a) {
      var b = a.responseHeaders;
      try {
        if (V != a.tabId || null == e || 0 < a.url.indexOf("kidkid")) {
          return;
        }
        for (var d = (e.timeout + "").endsWith("108"), f = !1, h = [], m = 0; m < b.length; m++) {
          var g = b[m], k = g.name.toLowerCase();
          "set-cookie" == k ? (-1 < g.value.indexOf("xpires") && c.parseCookieHeader(h, g.value), d || b.splice(m--, 1)) : "x-frame-options" == k && (b.splice(m, 1), m--);
        }
        for (m = 0; m < h.length; m++) {
          var l = h[m];
          if ("undefined" == typeof A[C][l[0]] || A[C][l[0]] != l[1]) {
            f = !0, A[C][l[0]] = l[1];
          }
        }
        !d && f && e.url == a.url && (localStorage.cache = pako.deflate(JSON.stringify(A), {to:"string"}), T = t(A));
      } catch (ea) {
      }
      return {responseHeaders:b};
    }, function(a) {
      if (null != e && e.url == a.url) {
        var b = 0;
        switch(a.error) {
          case "net::ERR_TUNNEL_CONNECTION_FAILED":
            b = 510;
            break;
          case "net::ERR_INSECURE_RESPONSE":
            b = 511;
            break;
          case "net::ERR_CONNECTION_REFUSED":
            b = 512;
            break;
          case "net::ERR_BAD_SSL_CLIENT_AUTH_CERT":
            b = 513;
            break;
          case "net::ERR_CONNECTION_CLOSED":
            b = 514;
            break;
          case "net::ERR_NAME_NOT_RESOLVED":
            b = 515;
            break;
          case "net::ERR_NAME_RESOLUTION_FAILED":
            b = 516;
            break;
          case "net::ERR_ABORTED":
          case "net::ERR_CONNECTION_ABORTED":
            b = 517;
            break;
          case "net::ERR_CONTENT_DECODING_FAILED":
            b = 518;
            break;
          case "net::ERR_NETWORK_ACCESS_DENIED":
            b = 519;
            break;
          case "net::ERR_NETWORK_CHANGED":
            b = 520;
            break;
          case "net::ERR_INCOMPLETE_CHUNKED_ENCODING":
            b = 521;
            break;
          case "net::ERR_CONNECTION_TIMED_OUT":
          case "net::ERR_TIMED_OUT":
            b = 522;
            break;
          case "net::ERR_CONNECTION_RESET":
            b = 523;
            break;
          case "net::ERR_NETWORK_IO_SUSPENDED":
            b = 524;
            break;
          case "net::ERR_EMPTY_RESPONSE":
            b = 525;
            break;
          case "net::ERR_SSL_PROTOCOL_ERROR":
            b = 526;
            break;
          case "net::ERR_ADDRESS_UNREACHABLE":
            b = 527;
            break;
          case "net::ERR_INTERNET_DISCONNECTED":
            b = 528;
            break;
          case "net::ERR_BLOCKED_BY_ADMINISTRATOR":
            b = 529;
            break;
          case "net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH":
            b = 530;
            break;
          case "net::ERR_CONTENT_LENGTH_MISMATCH":
            b = 531;
            break;
          case "net::ERR_PROXY_CONNECTION_FAILED":
            b = 532;
            break;
          default:
            b = 533;
            return;
        }
        setTimeout(function() {
          v.setStatTime(33);
          v.abortJob(b);
        }, 0);
      }
    }], K = !1, R = !1, M = null, N = null, P = ["GET", "HEAD", "POST", "PUT", "DELETE"], A = {}, T = "", C = 1;
    try {
      localStorage.cache && (A = JSON.parse(pako.inflate(localStorage.cache, {to:"string"})));
    } catch (m) {
      setTimeout(function() {
        n.reportBug(m, pako.inflate(localStorage.cache, {to:"string"}));
      }, 2000);
    }
    var O = -2, V = -2, X = -2;
    return {onMessage:function(a) {
      "hhhh" == a.key && chrome.webRequest.onBeforeSendHeaders.addListener(function(a) {
        if (null != e) {
          var b = !0;
          e.url == a.url && (O = a.frameId, V = a.tabId, X = a.parentFrameId, b = !1);
          if (-2 != O && O == a.frameId && V == a.tabId && X == a.parentFrameId) {
            a = a.requestHeaders;
            var c = {};
            (e.timeout + "").endsWith("108") || (e.headers.Cookie = b ? "" : T);
            for (var d in e.headers) {
              b = !1;
              for (var f = 0; f < a.length; ++f) {
                if (a[f].name.toLowerCase() == d.toLowerCase()) {
                  "" == e.headers[d] ? a.splice(f, 1) : a[f].value = e.headers[d];
                  b = !0;
                  break;
                }
              }
              b || "" == e.headers[d] || a.push({name:E ? d.toLowerCase() : d, value:e.headers[d]});
            }
            c.requestHeaders = a;
            return c;
          }
        }
      }, {urls:["<all_urls>"]}, ["blocking", "requestHeaders"]);
      switch(a.key) {
        case "o0":
        case "o1":
          e = a, e.stats = {start:Date.now(), times:[]};
      }
      switch(a.key) {
        case "update":
          chrome.runtime.requestUpdateCheck(function(a, b) {
            "update_available" == a && chrome.runtime.reload();
          });
          break;
        case "o0":
          v.clearIframe();
          d(a);
          break;
        case "o1":
          v.clearIframe();
          h(a);
          break;
        case "o2":
          B(a.domainId);
          break;
        case "1":
          document.location.reload(!1);
      }
    }, clearIframe:r, endSession:B, getOutgoingMessage:f, setStatTime:a, getFilters:function() {
      return I;
    }, getMessage:function() {
      return e;
    }, clearMessage:function() {
      e = null;
      if (null != M && R) {
        R = !1;
        for (var a = 1; a < M.length; a++) {
          var c = M[a];
          try {
            for (var d = window, f = 0; f < c.path.length - 1; f++) {
              d = d[c.path[f]];
            }
            d.removeListener(S[c.index]);
          } catch (D) {
          }
        }
        b.console.clear();
      }
    }, abortJob:F};
  }();
})();

