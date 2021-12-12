var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(b) {
  var p = 0;
  return function() {
    return p < b.length ? {done:!1, value:b[p++]} : {done:!0};
  };
};
$jscomp.arrayIterator = function(b) {
  return {next:$jscomp.arrayIteratorImpl(b)};
};
$jscomp.makeIterator = function(b) {
  var p = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
  return p ? p.call(b) : $jscomp.arrayIterator(b);
};
$jscomp.arrayFromIterator = function(b) {
  for (var p, g = []; !(p = b.next()).done;) {
    g.push(p.value);
  }
  return g;
};
$jscomp.arrayFromIterable = function(b) {
  return b instanceof Array ? b : $jscomp.arrayFromIterator($jscomp.makeIterator(b));
};
$jscomp.checkStringArgs = function(b, p, g) {
  if (null == b) {
    throw new TypeError("The 'this' value for String.prototype." + g + " must not be null or undefined");
  }
  if (p instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + g + " must not be a regular expression");
  }
  return b + "";
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, p, g) {
  b != Array.prototype && b != Object.prototype && (b[p] = g.value);
};
$jscomp.getGlobal = function(b) {
  return "undefined" != typeof window && window === b ? b : "undefined" != typeof global && null != global ? global : b;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(b, p, g, l) {
  if (p) {
    g = $jscomp.global;
    b = b.split(".");
    for (l = 0; l < b.length - 1; l++) {
      var t = b[l];
      t in g || (g[t] = {});
      g = g[t];
    }
    b = b[b.length - 1];
    l = g[b];
    p = p(l);
    p != l && null != p && $jscomp.defineProperty(g, b, {configurable:!0, writable:!0, value:p});
  }
};
$jscomp.polyfill("String.prototype.startsWith", function(b) {
  return b ? b : function(b, g) {
    var l = $jscomp.checkStringArgs(this, b, "startsWith");
    b += "";
    var p = l.length, q = b.length;
    g = Math.max(0, Math.min(g | 0, l.length));
    for (var G = 0; G < q && g < p;) {
      if (l[g++] != b[G++]) {
        return !1;
      }
    }
    return G >= q;
  };
}, "es6", "es3");
$jscomp.owns = function(b, p) {
  return Object.prototype.hasOwnProperty.call(b, p);
};
$jscomp.assign = "function" == typeof Object.assign ? Object.assign : function(b, p) {
  for (var g = 1; g < arguments.length; g++) {
    var l = arguments[g];
    if (l) {
      for (var t in l) {
        $jscomp.owns(l, t) && (b[t] = l[t]);
      }
    }
  }
  return b;
};
$jscomp.polyfill("Object.assign", function(b) {
  return b || $jscomp.assign;
}, "es6", "es3");
$jscomp.polyfill("Object.is", function(b) {
  return b ? b : function(b, g) {
    return b === g ? 0 !== b || 1 / b === 1 / g : b !== b && g !== g;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function(b) {
  return b ? b : function(b, g) {
    var l = this;
    l instanceof String && (l = String(l));
    var p = l.length;
    g = g || 0;
    for (0 > g && (g = Math.max(g + p, 0)); g < p; g++) {
      var q = l[g];
      if (q === b || Object.is(q, b)) {
        return !0;
      }
    }
    return !1;
  };
}, "es7", "es3");
$jscomp.polyfill("String.prototype.includes", function(b) {
  return b ? b : function(b, g) {
    return -1 !== $jscomp.checkStringArgs(this, b, "includes").indexOf(b, g || 0);
  };
}, "es6", "es3");
var onlyStock = !1, isDiscuss = (document.location + "").startsWith("https://discuss.keepa.com"), scanner = function() {
  function b(b, g, q, p, H, B) {
    var l = new XMLHttpRequest, t = !1, e = setTimeout(function() {
      t = !0;
      B();
    }, p || 4000);
    l.onreadystatechange = function() {
      t || (clearTimeout(e), H(l));
    };
    l.onerror = B;
    l.open(g, b, !0);
    null == q ? l.send() : l.send(q);
  }
  function p(l, g) {
    var q = {};
    if (null == document.body) {
      q.status = 599, g(q);
    } else {
      if (document.body.textContent.match("you're not a robot")) {
        q.status = 403, g(q);
      } else {
        for (var p = document.evaluate("//comment()", document, null, XPathResult.ANY_TYPE, null), t = p.iterateNext(), B = ""; t;) {
          B += t, t = p.iterateNext();
        }
        if (B.match(/automated access/)) {
          q.status = 403, g(q);
        } else {
          if (B.match(/ref=cs_503_link/)) {
            q.status = 503, g(q);
          } else {
            var C = 0;
            if (l.scrapeFilters && 0 < l.scrapeFilters.length) {
              p = {};
              t = null;
              var w = "", e = null, z = {}, y = {}, I = !1, v = function(a, c, f) {
                var h = [];
                if (!a.selector) {
                  if (!a.regExp) {
                    return w = "invalid selector, sel/regexp", !1;
                  }
                  var d = document.getElementsByTagName("html")[0].innerHTML.match(new RegExp(a.regExp, "i"));
                  if (!d || d.length < a.reGroup) {
                    d = "regexp fail: html - " + a.name + f;
                    if (!1 === a.optional) {
                      return w = d, !1;
                    }
                    e += " // " + d;
                    return !0;
                  }
                  return d[a.reGroup];
                }
                d = c.querySelectorAll(a.selector);
                0 == d.length && (d = c.querySelectorAll(a.altSelector));
                if (0 == d.length) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  w = "selector no match: " + a.name + f;
                  return !1;
                }
                if (a.parentSelector && (d = [d[0].parentNode.querySelector(a.parentSelector)], null == d[0])) {
                  if (!0 === a.optional) {
                    return !0;
                  }
                  w = "parent selector no match: " + a.name + f;
                  return !1;
                }
                if ("undefined" != typeof a.multiple && null != a.multiple && (!0 === a.multiple && 1 > d.length || !1 === a.multiple && 1 < d.length)) {
                  if (!I) {
                    return I = !0, v(a, c, f);
                  }
                  f = "selector multiple mismatch: " + a.name + f + " found: " + d.length;
                  if (!1 === a.optional) {
                    a = "";
                    for (var k in d) {
                      !d.hasOwnProperty(k) || 1000 < a.length || (a += " - " + k + ": " + d[k].outerHTML + " " + d[k].getAttribute("class") + " " + d[k].getAttribute("id"));
                    }
                    w = f + a + " el: " + c.getAttribute("class") + " " + c.getAttribute("id");
                    return !1;
                  }
                  e += " // " + f;
                  return !0;
                }
                if (a.isListSelector) {
                  return z[a.name] = d, !0;
                }
                if (!a.attribute) {
                  return w = "selector attribute undefined?: " + a.name + f, !1;
                }
                for (var n in d) {
                  if (d.hasOwnProperty(n)) {
                    c = d[n];
                    if (!c) {
                      break;
                    }
                    if (a.childNode) {
                      a.childNode = Number(a.childNode);
                      c = c.childNodes;
                      if (c.length < a.childNode) {
                        d = "childNodes fail: " + c.length + " - " + a.name + f;
                        if (!1 === a.optional) {
                          return w = d, !1;
                        }
                        e += " // " + d;
                        return !0;
                      }
                      c = c[a.childNode];
                    }
                    c = "text" == a.attribute ? c.textContent : "html" == a.attribute ? c.innerHTML : c.getAttribute(a.attribute);
                    if (!c || 0 == c.length || 0 == c.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "").length) {
                      d = "selector attribute null: " + a.name + f;
                      if (!1 === a.optional) {
                        return w = d, !1;
                      }
                      e += " // " + d;
                      return !0;
                    }
                    if (a.regExp) {
                      k = c.match(new RegExp(a.regExp, "i"));
                      if (!k || k.length < a.reGroup) {
                        d = "regexp fail: " + c + " - " + a.name + f;
                        if (!1 === a.optional) {
                          return w = d, !1;
                        }
                        e += " // " + d;
                        return !0;
                      }
                      h.push(k[a.reGroup]);
                    } else {
                      h.push(c);
                    }
                    if (!a.multiple) {
                      break;
                    }
                  }
                }
                d = h;
                a.multiple || (d = h[0]);
                return d;
              };
              B = document;
              var a = !1, c = {}, k;
              for (k in l.scrapeFilters) {
                c.$jscomp$loop$prop$pageType$86 = k;
                a: {
                  if (a) {
                    break;
                  }
                  c.$jscomp$loop$prop$pageFilter$83 = l.scrapeFilters[c.$jscomp$loop$prop$pageType$86];
                  var n = c.$jscomp$loop$prop$pageFilter$83.pageVersionTest, d = document.querySelectorAll(n.selector);
                  0 == d.length && (d = document.querySelectorAll(n.altSelector));
                  if (0 != d.length) {
                    if ("undefined" != typeof n.multiple && null != n.multiple) {
                      if (!0 === n.multiple && 2 > d.length) {
                        break a;
                      }
                      if (!1 === n.multiple && 1 < d.length) {
                        break a;
                      }
                    }
                    if (n.attribute) {
                      var f = null;
                      f = "text" == n.attribute ? "" : d[0].getAttribute(n.attribute);
                      if (null == f) {
                        break a;
                      }
                    }
                    t = c.$jscomp$loop$prop$pageType$86;
                    d = {};
                    for (var h in c.$jscomp$loop$prop$pageFilter$83) {
                      if (a) {
                        break;
                      }
                      d.$jscomp$loop$prop$sel$79 = c.$jscomp$loop$prop$pageFilter$83[h];
                      if (d.$jscomp$loop$prop$sel$79.name != n.name) {
                        if (d.$jscomp$loop$prop$sel$79.parentList) {
                          f = [];
                          if ("undefined" != typeof z[d.$jscomp$loop$prop$sel$79.parentList]) {
                            f = z[d.$jscomp$loop$prop$sel$79.parentList];
                          } else {
                            if (!0 === v(c.$jscomp$loop$prop$pageFilter$83[d.$jscomp$loop$prop$sel$79.parentList], B, c.$jscomp$loop$prop$pageType$86)) {
                              f = z[d.$jscomp$loop$prop$sel$79.parentList];
                            } else {
                              break;
                            }
                          }
                          y[d.$jscomp$loop$prop$sel$79.parentList] || (y[d.$jscomp$loop$prop$sel$79.parentList] = []);
                          var D = 0, u = {}, A;
                          for (A in f) {
                            if (a) {
                              break;
                            }
                            if (f.hasOwnProperty(A)) {
                              if ("lager" == d.$jscomp$loop$prop$sel$79.name) {
                                D++;
                                try {
                                  var m = void 0, r = void 0;
                                  d.$jscomp$loop$prop$sel$79.selector && (m = f[A].querySelector(d.$jscomp$loop$prop$sel$79.selector));
                                  d.$jscomp$loop$prop$sel$79.altSelector && (r = f[A].querySelector(d.$jscomp$loop$prop$sel$79.altSelector));
                                  r && (r = r.getAttribute(d.$jscomp$loop$prop$sel$79.attribute));
                                  var F = 999, O = !1;
                                  try {
                                    O = -1 != f[A].textContent.toLowerCase().indexOf("add to cart to see product details.");
                                  } catch (E) {
                                  }
                                  if (!r) {
                                    try {
                                      var x = JSON.parse(d.$jscomp$loop$prop$sel$79.regExp);
                                      if (x.sel1) {
                                        try {
                                          var S = JSON.parse(f[A].querySelectorAll(x.sel1)[0].dataset[x.dataSet1]);
                                          r = S[x.val1];
                                          F = S.maxQty;
                                        } catch (E) {
                                        }
                                      }
                                      if (!r && x.sel2) {
                                        try {
                                          var T = JSON.parse(f[A].querySelectorAll(x.sel2)[0].dataset[x.dataSet2]);
                                          r = T[x.val2];
                                          F = T.maxQty;
                                        } catch (E) {
                                        }
                                      }
                                    } catch (E) {
                                    }
                                  }
                                  if (m) {
                                    C++;
                                    u.$jscomp$loop$prop$mapIndex$80 = A + "";
                                    u.$jscomp$loop$prop$busy$81 = !0;
                                    var K = document.location.href.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/)[1];
                                    K = K[1];
                                    null == K || 9 > K.length || (chrome.runtime.sendMessage({type:"getStock", asin:K, oid:r, maxQty:F, isMAP:O, host:document.location.hostname, referer:document.location + "", domainId:l.domainId, force:!0, session:"unknown"}, function(a, c) {
                                      return function(d) {
                                        a.$jscomp$loop$prop$busy$81 && (a.$jscomp$loop$prop$busy$81 = !1, "undefined" != typeof d && (d.error ? console.log(d.error) : (console.log("got stock: ", d), y[c.$jscomp$loop$prop$sel$79.parentList][a.$jscomp$loop$prop$mapIndex$80][c.$jscomp$loop$prop$sel$79.name] = d, 0 == --C && g(q))));
                                      };
                                    }(u, d)), setTimeout(function(a) {
                                      return function() {
                                        a.$jscomp$loop$prop$busy$81 && 0 == --C && (a.$jscomp$loop$prop$busy$81 = !1, g(q));
                                      };
                                    }(u), 2000));
                                  }
                                } catch (E) {
                                }
                              } else {
                                if ("revealMAP" == d.$jscomp$loop$prop$sel$79.name) {
                                  u.$jscomp$loop$prop$revealMAP$84 = d.$jscomp$loop$prop$sel$79, m = void 0, m = u.$jscomp$loop$prop$revealMAP$84.selector ? f[A].querySelector(u.$jscomp$loop$prop$revealMAP$84.selector) : f[A], null != m && m.textContent.match(new RegExp(u.$jscomp$loop$prop$revealMAP$84.regExp, "i")) && (m = document.location.href.match(/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/), m = m[1], r = c.$jscomp$loop$prop$pageFilter$83.sellerId, "undefined" == typeof r || null == r || null == m || 
                                  2 > m.length || (r = f[A].querySelector('input[name="oid"]').value, null == r || 20 > r + 0 || (m = u.$jscomp$loop$prop$revealMAP$84.altSelector.replace("OFFERID", r).replace("ASINID", m), C++, u.$jscomp$loop$prop$mapIndex$14$85 = A + "", b(m, "GET", null, 3000, function(a, c) {
                                    return function(d) {
                                      if (4 == d.readyState) {
                                        C--;
                                        if (200 == d.status) {
                                          try {
                                            var f = d.responseText, h = a.$jscomp$loop$prop$pageFilter$83.price;
                                            if (h && h.regExp) {
                                              if (f.match(/no valid offer--/)) {
                                                y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85] || (y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85] = {}), y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85][c.$jscomp$loop$prop$revealMAP$84.name] = -1;
                                              } else {
                                                var k = f.match(new RegExp("price info--\x3e(?:.|\\n)*?" + h.regExp + "(?:.|\\n)*?\x3c!--")), n = f.match(/price info--\x3e(?:.|\n)*?(?:<span.*?size-small.*?">)([^]*?<\/span)(?:.|\n)*?\x3c!--/);
                                                if (!k || k.length < h.reGroup) {
                                                  e += " //  priceMAP regexp fail: " + (f + " - " + h.name + a.$jscomp$loop$prop$pageType$86);
                                                } else {
                                                  var b = k[h.reGroup];
                                                  y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85] || (y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85] = {});
                                                  y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85][c.$jscomp$loop$prop$revealMAP$84.name] = b;
                                                  null != n && 2 == n.length && (y[c.$jscomp$loop$prop$revealMAP$84.parentList][c.$jscomp$loop$prop$mapIndex$14$85][c.$jscomp$loop$prop$revealMAP$84.name + "Shipping"] = n[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                                }
                                              }
                                            }
                                          } catch (J) {
                                          }
                                        }
                                        0 == C && g(q);
                                      }
                                    };
                                  }(c, u), function() {
                                    0 == --C && g(q);
                                  }))));
                                } else {
                                  m = v(d.$jscomp$loop$prop$sel$79, f[A], c.$jscomp$loop$prop$pageType$86);
                                  if (!1 === m) {
                                    a = !0;
                                    break;
                                  }
                                  if (!0 !== m) {
                                    if (y[d.$jscomp$loop$prop$sel$79.parentList][A] || (y[d.$jscomp$loop$prop$sel$79.parentList][A] = {}), d.$jscomp$loop$prop$sel$79.multiple) {
                                      for (var N in m) {
                                        m.hasOwnProperty(N) && !d.$jscomp$loop$prop$sel$79.keepBR && (m[N] = m[N].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                                      }
                                      m = m.join("\u271c\u271c");
                                      y[d.$jscomp$loop$prop$sel$79.parentList][A][d.$jscomp$loop$prop$sel$79.name] = m;
                                    } else {
                                      y[d.$jscomp$loop$prop$sel$79.parentList][A][d.$jscomp$loop$prop$sel$79.name] = d.$jscomp$loop$prop$sel$79.keepBR ? m : m.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ");
                                    }
                                  }
                                }
                              }
                            }
                            u = {$jscomp$loop$prop$busy$81:u.$jscomp$loop$prop$busy$81, $jscomp$loop$prop$mapIndex$80:u.$jscomp$loop$prop$mapIndex$80, $jscomp$loop$prop$revealMAP$84:u.$jscomp$loop$prop$revealMAP$84, $jscomp$loop$prop$mapIndex$14$85:u.$jscomp$loop$prop$mapIndex$14$85};
                          }
                        } else {
                          f = v(d.$jscomp$loop$prop$sel$79, B, c.$jscomp$loop$prop$pageType$86);
                          if (!1 === f) {
                            a = !0;
                            break;
                          }
                          if (!0 !== f) {
                            if (d.$jscomp$loop$prop$sel$79.multiple) {
                              for (var P in f) {
                                f.hasOwnProperty(P) && !d.$jscomp$loop$prop$sel$79.keepBR && (f[P] = f[P].replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                              }
                              f = f.join();
                            } else {
                              d.$jscomp$loop$prop$sel$79.keepBR || (f = f.replace(/(\r\n|\n|\r)/gm, " ").replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " "));
                            }
                            p[d.$jscomp$loop$prop$sel$79.name] = f;
                          }
                        }
                      }
                      d = {$jscomp$loop$prop$sel$79:d.$jscomp$loop$prop$sel$79};
                    }
                    a = !0;
                  }
                }
                c = {$jscomp$loop$prop$pageFilter$83:c.$jscomp$loop$prop$pageFilter$83, $jscomp$loop$prop$pageType$86:c.$jscomp$loop$prop$pageType$86};
              }
              if (null == t) {
                w += " // no pageVersion matched", q.status = 308, q.payload = [e, w, l.dbg1 ? document.getElementsByTagName("html")[0].innerHTML : ""];
              } else {
                if ("" === w) {
                  q.payload = [e];
                  q.scrapedData = p;
                  for (var V in y) {
                    q[V] = y[V];
                  }
                } else {
                  q.status = 305, q.payload = [e, w, l.dbg2 ? document.getElementsByTagName("html")[0].innerHTML : ""];
                }
              }
            } else {
              q.status = 306;
            }
            0 == C && g(q);
          }
        }
      }
    }
  }
  if (!isDiscuss) {
    var g = !0;
    window.self === window.top && (g = !1);
    window.sandboxHasRun && (g = !1);
    g && (window.sandboxHasRun = !0, window.addEventListener("message", function(b) {
      if (b.source == window.parent && b.data && (b.origin == "chrome-extension://" + chrome.runtime.id || b.origin.startsWith("moz-extension://") || b.origin.startsWith("safari-extension://"))) {
        var g = b.data.value;
        "data" == b.data.key && g.url && g.url == document.location && setTimeout(function() {
          null == document.body ? setTimeout(function() {
            p(g, function(b) {
              window.parent.postMessage({sandbox:b}, "*");
            });
          }, 1500) : p(g, function(b) {
            window.parent.postMessage({sandbox:b}, "*");
          });
        }, 800);
      }
    }, !1), window.parent.postMessage({sandbox:document.location + "", isUrlMsg:!0}, "*"));
    window.addEventListener("error", function(b, g, p, G, H) {
      "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(H);
      return !1;
    });
    return {scan:p};
  }
}();
(function() {
  if (!isDiscuss) {
    var b = !1, p = !1, g = window.opera || -1 < navigator.userAgent.indexOf(" OPR/"), l = -1 < navigator.userAgent.toLowerCase().indexOf("firefox"), t = -1 < navigator.userAgent.toLowerCase().indexOf("edge/"), q = /Apple Computer/.test(navigator.vendor) && /Safari/.test(navigator.userAgent), G = !g && !l && !t & !q, H = l ? "Firefox" : q ? "Safari" : G ? "Chrome" : g ? "Opera" : t ? "Edge" : "Unknown", B = chrome.runtime.getManifest().version, C = !1;
    try {
      C = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    } catch (a) {
    }
    if (!window.keepaHasRun) {
      window.keepaHasRun = !0;
      var w = 0;
      window.addEventListener("message", function(a) {
        if ("undefined" == typeof a.data.sandbox) {
          if ("https://keepa.com" == a.origin || "https://test.keepa.com" == a.origin) {
            if (a.data.hasOwnProperty("origin") && "keepaIframe" == a.data.origin) {
              e.handleIFrameMessage(a.data.key, a.data.value, function(c) {
                try {
                  a.source.postMessage({origin:"keepaContentScript", key:a.data.key, value:c, id:a.data.id}, a.origin);
                } catch (h) {
                }
              });
            } else {
              if ("string" === typeof a.data) {
                var c = a.data.split(",");
                if (2 > c.length) {
                  return;
                }
                if (2 < c.length) {
                  for (var k = 2, n = c.length; k < n; k++) {
                    c[1] += "," + c[k];
                  }
                }
                e.handleIFrameMessage(c[0], c[1], function(c) {
                  a.source.postMessage({origin:"keepaContentScript", value:c}, a.origin);
                });
              }
            }
          }
          if (a.origin.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|jp|ca|fr|es|it|in|com\.mx)/)) {
            try {
              var d = JSON.parse(a.data);
            } catch (f) {
              return;
            }
            (d = d.asin) && "null" != d && /([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(d) && (d != e.ASIN ? (e.ASIN = d, e.swapIFrame()) : 0 != w ? (window.clearTimeout(w), w = 1) : w = window.setTimeout(function() {
              e.swapIFrame();
            }, 1000));
          }
        }
      });
      var e = {domain:0, iframeStorage:null, ASIN:null, tld:"", placeholder:"", cssFlex:function() {
        var a = "flex", c = ["flex", "-webkit-flex", "-moz-box", "-webkit-box", "-ms-flexbox"], e = document.createElement("flexelement"), n;
        for (n in c) {
          try {
            if ("undefined" != e.style[c[n]]) {
              a = c[n];
              break;
            }
          } catch (d) {
          }
        }
        return a;
      }(), getDomain:function(a) {
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
          case "jp":
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
            return -1;
        }
      }, revealWorking:!1, juvecOnlyOnce:!1, revealMapOnlyOnce:!1, revealCache:{}, revealMAP:function() {
        e.revealMapOnlyOnce || (e.revealMapOnlyOnce = !0, chrome.runtime.sendMessage({type:"isPro"}, function(a) {
          var c = !0 === a.value;
          chrome.storage.local.get("revealStock", function(a) {
            "undefined" == typeof a && (a = {});
            var k = !0;
            try {
              k = "0" != a.revealStock;
            } catch (L) {
            }
            console.log("keepa stock active: " + c + " " + k);
            try {
              if ((k || "com" == e.tld) && !e.revealWorking) {
                if (e.revealWorking = !0, document.getElementById("keepaMAP")) {
                  e.revealWorking = !1;
                } else {
                  var d = function() {
                    var a = new MutationObserver(function(c) {
                      setTimeout(function() {
                        e.revealMAP();
                      }, 100);
                      try {
                        a.disconnect();
                      } catch (aa) {
                      }
                    });
                    a.observe(document.getElementById("keepaMAP").parentNode.parentNode.parentNode, {childList:!0, subtree:!0});
                  }, f = function(a, d, f, k, n, b, m) {
                    if ("undefined" == typeof e.revealCache[k]) {
                      e.revealCache[k] = -1;
                      var g = "" == a.id && "aod-pinned-offer" == a.parentNode.id;
                      b = b || g;
                      try {
                        f = f || -1 != a.textContent.toLowerCase().indexOf("add to cart to see product details.") || !b && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(document.getElementById("price").textContent);
                      } catch (ca) {
                      }
                      if (f || c) {
                        h(a, d, f, k, b);
                        var u = function(a) {
                          var d = document.getElementById("keepaStock" + k);
                          if (null != d) {
                            d.innerHTML = "";
                            if (null != a && null != a.price && f) {
                              var h = document.createElement("div");
                              a = 5 == e.domain ? a.price : (Number(a.price) / 100).toFixed(2);
                              var n = new Intl.NumberFormat(" en-US en-GB de-DE fr-FR ja-JP en-CA zh-CN it-IT es-ES hi-IN es-MX pt-BR en-AU nl-NL tr-TR".split(" ")[e.domain], {style:"currency", currency:" USD GBP EUR EUR JPY CAD CNY EUR EUR INR MXN BRL AUD EUR TRY".split(" ")[e.domain]});
                              h.innerHTML = 'Price&emsp;&ensp;<span style="font-weight: bold;">' + n.format(a) + "</span>";
                              d.parentNode.parentNode.parentNode.prepend(h);
                            }
                            c && (a = e.revealCache[k].stock, 999 == a ? a = "999+" : 1000 == a && (a = "1000+"), h = document.createElement("span"), h.style = "font-weight: bold;", h.innerText = a + " ", a = document.createElement("span"), a.style = "color: #dedede;", a.innerText = " (revealed by \u271c Keepa)", n = document.createElement("span"), n.style = "color:#da4c33;", n.innerText = " max order limit ", d.appendChild(h), e.revealCache[k].limit && d.appendChild(n), b && d.appendChild(a));
                          }
                        };
                        "undefined" != typeof e.revealCache[k] && -1 != e.revealCache[k] ? u(e.revealCache[k]) : chrome.runtime.sendMessage({type:"getStock", asin:d, oid:k, maxQty:m, isMAP:f, host:document.location.hostname, force:f, referer:document.location + "", domainId:e.domain, session:n}, function(a) {
                          if ("undefined" != typeof a && null != a) {
                            if (a.error) {
                              var c = document.getElementById("keepaStock" + k);
                              c.innerHTML = "";
                              var d = document.createElement("span");
                              d.style = "color:#e8c7c1;";
                              d.innerText = "error(" + a.errorCode + ")";
                              d.title = a.error + ". Contact info@keepa.com with a screenshot for assistance.";
                              c.appendChild(d);
                              console.log(a.error);
                            } else {
                              e.revealCache[k] = a, u(a);
                            }
                          }
                        });
                      }
                    }
                  }, h = function(a, f, k, h, n) {
                    f = "" == a.id && "aod-pinned-offer" == a.parentNode.id;
                    var b = (n ? a.parentElement : a).querySelector(".keepaMAP");
                    if (null == (n ? a.parentElement : a).querySelector(".keepaStock")) {
                      null != b && null != b.parentElement && b.parentElement.remove();
                      var m = n ? "165px" : "55px;height:20px;";
                      b = document.createElement("div");
                      b.id = "keepaMAP" + (n ? k + h : "");
                      b.className = "a-section a-spacing-none a-spacing-top-micro aod-clear-float keepaStock";
                      k = document.createElement("div");
                      k.className = "a-fixed-left-grid";
                      var g = document.createElement("div");
                      g.style = "padding-left:" + m;
                      n && (g.className = "a-fixed-left-grid-inner");
                      var u = document.createElement("div");
                      u.style = "width:" + m + ";margin-left:-" + m + ";float:left;";
                      u.className = "a-fixed-left-grid-col aod-padding-right-10 a-col-left";
                      m = document.createElement("div");
                      m.style = "padding-left:0%;float:left;";
                      m.className = "a-fixed-left-grid-col a-col-right";
                      var l = document.createElement("span");
                      l.className = "a-size-small a-color-tertiary";
                      var D = document.createElement("span");
                      D.style = "color: #dedede;";
                      D.innerText = "loading\u2026";
                      var r = document.createElement("span");
                      r.className = "a-size-small a-color-base";
                      r.id = "keepaStock" + h;
                      r.appendChild(D);
                      m.appendChild(r);
                      u.appendChild(l);
                      g.appendChild(u);
                      g.appendChild(m);
                      k.appendChild(g);
                      b.appendChild(k);
                      l.className = "a-size-small a-color-tertiary";
                      e.revealWorking = !1;
                      c && (l.innerText = "Stock");
                      n ? f ? (a = document.querySelector("#aod-pinned-offer-show-more-link"), 0 == a.length && document.querySelector("#aod-pinned-offer-main-content-show-more"), a.prepend(b)) : a.parentNode.insertBefore(b, a.parentNode.children[a.parentNode.children.length - 1]) : a.appendChild(b);
                      n || d();
                    }
                  }, b = "1 ATVPDKIKX0DER A3P5ROKL5A1OLE A3JWKAKR8XB7XF A1X6FK5RDHNB96 AN1VRQENFRJN5 A3DWYIK6Y9EEQB A1AJ19PSB66TGU A11IL2PNWYJU7H A1AT7YVPFBWXBL A3P5ROKL5A1OLE AVDBXBAVVSXLQ A1ZZFT5FULY4LN ANEGB3WVEVKZB A17D2BRD4YMT0X".split(" "), g = document.location.href, l = /&seller=([A-Z0-9]{9,21})($|&)/;
                  if (0 < g.indexOf("/offer-listing/")) {
                    try {
                      var m = document.getElementById("olpTabContent");
                      if (null == m && (m = document.getElementById("olpOfferList"), null == m)) {
                        return;
                      }
                      var r = m.querySelector('[role="grid"]');
                      if (null != r) {
                        var p = r.childNodes, q;
                        for (q in p) {
                          if (p.hasOwnProperty(q)) {
                            var x = p[q];
                            if (null != x && "DIV" == x.nodeName) {
                              try {
                                var t = x.querySelector('input[name="offeringID.1"]');
                                if (t) {
                                  var v = x.children[0], y = t.getAttribute("value"), w = x.querySelector('input[name="session-id"]');
                                  if (w) {
                                    var z = w.getAttribute("value"), C = x.querySelector('input[name="merchantID"]'), E = null;
                                    null != C && (E = C.getAttribute("value"));
                                    null == E && (E = null != x.querySelector('.olpSellerName img[alt="Amazon.' + e.tld + '"]') ? b[e.domain] : null);
                                    if (null == E) {
                                      var B = x.querySelector(".olpSellerName a");
                                      null != B && (B = B.getAttribute("href"));
                                      if (null != B) {
                                        var G = B.match(l);
                                        null != G && 1 < G.length && (E = G[1]);
                                      }
                                    }
                                    var H = -1 != x.textContent.toLowerCase().indexOf("add to cart to see product details.");
                                    (k || H) && f(v, e.ASIN, H, y, z, !1);
                                  }
                                }
                              } catch (L) {
                                console.log(L);
                              }
                            }
                          }
                        }
                      }
                    } catch (L) {
                      console.log(L), e.reportBug(L, "MAP error: " + g);
                    }
                  } else {
                    var I = new MutationObserver(function(a) {
                      try {
                        var c = document.querySelectorAll("#aod-offer,#aod-pinned-offer");
                        if (null != c && 0 != c.length) {
                          a = null;
                          var d = c[0].querySelector('input[name="session-id"]');
                          if (d) {
                            a = d.getAttribute("value");
                          } else {
                            if (d = document.querySelector("#session-id")) {
                              a = document.querySelector("#session-id").value;
                            }
                          }
                          if (!a) {
                            for (var k = document.querySelectorAll("script"), h = $jscomp.makeIterator(k), n = h.next(); !n.done; n = h.next()) {
                              var m = n.value.text.match("ue_sid.?=.?'([0-9-]{19})'");
                              m && (a = m[1]);
                            }
                          }
                          if (a) {
                            for (var u in c) {
                              if (c.hasOwnProperty(u)) {
                                var D = c[u];
                                if (null != D && "DIV" == D.nodeName) {
                                  d = void 0;
                                  k = 999;
                                  var r = D.querySelector('input[name="offeringID.1"]');
                                  if (r) {
                                    d = r.getAttribute("value");
                                  } else {
                                    try {
                                      var p = JSON.parse(D.querySelectorAll("[data-aod-atc-action]")[0].dataset.aodAtcAction);
                                      d = p.oid;
                                      k = p.maxQty;
                                    } catch (Q) {
                                      try {
                                        var A = JSON.parse(D.querySelectorAll("[data-aw-aod-cart-api]")[0].dataset.awAodCartApi);
                                        d = A.oid;
                                        k = A.maxQty;
                                      } catch (da) {
                                      }
                                    }
                                  }
                                  if (d) {
                                    var q = D.children[0], x = D.querySelector('input[name="merchantID"]');
                                    h = null;
                                    null != x && (h = x.getAttribute("value"));
                                    null == h && (h = null != D.querySelector('.olpSellerName img[alt="Amazon.' + e.tld + '"]') ? b[e.domain] : null);
                                    if (null == h) {
                                      var F = D.querySelector(".olpSellerName a, #aod-offer-soldBy a");
                                      null != F && (F = F.getAttribute("href"));
                                      null != F && F.match(l);
                                    }
                                    var t = -1 != D.textContent.toLowerCase().indexOf("add to cart to see product details.");
                                    "undefined" === typeof e.revealCache[d] && f(q, e.ASIN, t, d, a, !0, k);
                                  }
                                }
                              }
                            }
                          } else {
                            console.error("missing sessionId");
                          }
                        }
                      } catch (Q) {
                        console.log(Q), e.reportBug(Q, "MAP error: " + g);
                      }
                    });
                    I.observe(document.querySelector("body"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                    window.onunload = function Z() {
                      try {
                        window.detachEvent("onunload", Z), I.disconnect();
                      } catch (aa) {
                      }
                    };
                    var M = document.querySelector("#newAccordionRow #offerListingID, #qualifiedBuybox #offerListingID, #exportsBuybox #offerListingID");
                    if (null != M && null != M.value) {
                      var R = M.parentElement.querySelector("#session-id"), U = M.parentElement.querySelector("#ASIN");
                      if (null != R && null != U) {
                        var J = document.querySelector("#availability");
                        null == J && (J = document.querySelector("#availabilityInsideBuyBox_feature_div"));
                        null == J && (J = document.querySelector("#shippingMessageInsideBuyBox_feature_div"));
                        null == J && (J = document.querySelector("#buyNew_cbb"));
                        null != J && f(J, U.value, !1, M.value, R.value, !1);
                      }
                    }
                    E = document.getElementById("price");
                    if (null != E && /(our price|always remove it|add this item to your cart|see product details in cart|see price in cart)/i.test(E.textContent)) {
                      var W = document.getElementById("merchant-info");
                      k = "";
                      if (W) {
                        if (-1 == W.textContent.toLowerCase().indexOf("amazon.c")) {
                          var X = E.querySelector('span[data-action="a-modal"]');
                          if (X) {
                            var Y = X.getAttribute("data-a-modal");
                            Y.match(/offeringID\.1=(.*?)&amp/) && (k = RegExp.$1);
                          }
                          if (0 == k.length && !Y.match('map_help_pop_(.*?)"')) {
                            e.revealWorking = !1;
                            return;
                          }
                        }
                        if (null != k && 10 < k.length) {
                          var ba = document.querySelector("#session-id");
                          f(E, e.ASIN, !1, k, ba.value, !1);
                        }
                      } else {
                        e.revealWorking = !1;
                      }
                    } else {
                      e.revealWorking = !1;
                    }
                  }
                }
              }
            } catch (L) {
              e.revealWorking = !1, console.log(L);
            }
          });
        }));
      }, onPageLoad:function() {
        e.tld = RegExp.$2;
        var a = RegExp.$4;
        e.ASIN || (e.ASIN = a);
        e.domain = e.getDomain(e.tld);
        chrome.storage.local.get(["s_boxType", "s_boxOfferListing"], function(a) {
          "undefined" == typeof a && (a = {});
          var c = 0 < document.location.href.indexOf("/offer-listing/");
          c && "0" === a.s_boxOfferListing && (onlyStock = !0);
          document.addEventListener("DOMContentLoaded", function(k) {
            k = document.getElementsByTagName("head")[0];
            var d = document.createElement("script");
            d.type = "text/javascript";
            d.src = chrome.runtime.getURL("chrome/content/selectionHook.js");
            k.appendChild(d);
            "0" == a.s_boxType ? e.swapIFrame() : e.getPlaceholderAndInsertIFrame(function(a, d) {
              if (void 0 !== a) {
                d = document.createElement("div");
                d.setAttribute("id", "keepaButton");
                d.setAttribute("style", "    background-color: #444;\n    border: 0 solid #ccc;\n    border-radius: 6px 6px 6px 6px;\n    color: #fff;\n    cursor: pointer;\n    font-size: 12px;\n    margin: 15px;\n    padding: 6px;\n    text-decoration: none;\n    text-shadow: none;\n    box-shadow: 0px 0px 7px 0px #888;\n    width: 100px;\n    background-repeat: no-repeat;\n    height: 32px;\n    background-position-x: 7px;\n    background-position-y: 7px;\n    text-align: center;\n    background-image: url(https://cdn.keepa.com/img/logo_circled_w.svg);\n    background-size: 80px;");
                var f = document.createElement("style");
                f.appendChild(document.createTextNode("#keepaButton:hover{background-color:#666 !important}"));
                document.head.appendChild(f);
                d.addEventListener("click", function() {
                  var a = document.getElementById("keepaButton");
                  a.parentNode.removeChild(a);
                  e.swapIFrame();
                }, !1);
                c && (a = document.getElementById("olpTabContent"), a || (a = document.getElementById("olpProduct"), a = a.nextSibling));
                a.parentNode.insertBefore(d, a);
              }
            });
          }, !1);
        });
      }, swapIFrame:function() {
        if (onlyStock || "com.au" == e.tld || "nl" == e.tld) {
          try {
            e.revealMAP(document, e.ASIN, e.tld), e.revealMapOnlyOnce = !1;
          } catch (c) {
          }
        } else {
          if (!document.getElementById("keepaButton")) {
            e.swapIFrame.swapTimer && clearTimeout(e.swapIFrame.swapTimer);
            e.swapIFrame.swapTimer = setTimeout(function() {
              if (!C) {
                document.getElementById("keepaContainer") || e.getPlaceholderAndInsertIFrame(e.insertIFrame);
                try {
                  e.revealMAP(document, e.ASIN, e.tld), e.revealMapOnlyOnce = !1;
                } catch (c) {
                }
                e.swapIFrame.swapTimer = setTimeout(function() {
                  document.getElementById("keepaContainer") || e.getPlaceholderAndInsertIFrame(e.insertIFrame);
                }, 2000);
              }
            }, 2000);
            var a = document.getElementById("keepaContainer");
            if (null != e.iframeStorage && a) {
              try {
                e.iframeStorage.contentWindow.postMessage({origin:"keepaContentScript", key:"updateASIN", value:e.domain + "-0-" + e.ASIN}, e.iframeStorage.src);
              } catch (c) {
                console.error(c);
              }
            } else {
              e.getPlaceholderAndInsertIFrame(e.insertIFrame);
              try {
                e.revealMAP(document, e.ASIN, e.tld), e.revealMapOnlyOnce = !1;
              } catch (c) {
              }
            }
          }
        }
      }, getDevicePixelRatio:function() {
        var a = 1;
        void 0 !== window.screen.systemXDPI && void 0 !== window.screen.logicalXDPI && window.screen.systemXDPI > window.screen.logicalXDPI ? a = window.screen.systemXDPI / window.screen.logicalXDPI : void 0 !== window.devicePixelRatio && (a = window.devicePixelRatio);
        return a;
      }, getPlaceholderAndInsertIFrame:function(a) {
        chrome.storage.local.get("keepaBoxPlaceholder keepaBoxPlaceholderBackup keepaBoxPlaceholderBackupClass keepaBoxPlaceholderAppend keepaBoxPlaceholderBackupAppend webGraphType webGraphRange".split(" "), function(c) {
          "undefined" == typeof c && (c = {});
          var k = 0, n = function() {
            if (!document.getElementById("keepaButton") && !document.getElementById("amazonlive-homepage-widget")) {
              if (C) {
                var d = document.querySelector("#olpLinkWidget_feature_div,#tellAFriendBox_feature_div");
                try {
                  document.querySelector("#keepaMobileContainer")[0].remove();
                } catch (r) {
                }
                if (d && d.previousSibling) {
                  try {
                    var f = c.webGraphType;
                    try {
                      f = JSON.parse(f);
                    } catch (r) {
                    }
                    var h = c.webGraphRange;
                    try {
                      h = Number(h);
                    } catch (r) {
                    }
                    var b = Math.min(1800, 1.6 * window.innerWidth).toFixed(0), g = "https://graph.keepa.com/pricehistory.png?type=2&asin=" + e.ASIN + "&domain=" + e.domain + "&width=" + b + "&height=450";
                    g = "undefined" == typeof f ? g + "&amazon=1&new=1&used=1&salesrank=1&range=365" : g + ("&amazon=" + f[0] + "&new=" + f[1] + "&used=" + f[2] + "&salesrank=" + f[3] + "&range=" + h + "&fba=" + f[10] + "&fbm=" + f[7] + "&bb=" + f[18] + "&ld=" + f[8] + "&wd=" + f[9]);
                    var l = document.createElement("div");
                    l.setAttribute("id", "keepaMobileContainer");
                    l.setAttribute("style", "margin-bottom: 20px;");
                    var m = document.createElement("img");
                    m.setAttribute("style", "margin: 5px 0; width: " + Math.min(1800, window.innerWidth) + "px;");
                    m.setAttribute("id", "keepaImageContainer" + e.ASIN);
                    m.setAttribute("src", g);
                    document.createElement("div").setAttribute("style", "margin: 20px; display: flex;justify-content: space-evenly;");
                    l.appendChild(m);
                    d.after(l);
                    m.addEventListener("click", function() {
                      m.remove();
                      e.insertIFrame(d.previousSibling, !1, !0);
                    }, !1);
                  } catch (r) {
                    console.error(r);
                  }
                  return;
                }
              }
              if ((f = document.getElementById("gpdp-btf-container")) && f.previousElementSibling) {
                e.insertIFrame(f.previousElementSibling, !1, !0);
              } else {
                if ((f = document.getElementsByClassName("mocaGlamorContainer")[0]) || (f = document.getElementById("dv-sims")), f || (f = document.getElementById("mas-terms-of-use")), f && f.nextSibling) {
                  e.insertIFrame(f.nextSibling, !1, !0);
                } else {
                  if (h = c.keepaBoxPlaceholder || "#bottomRow", f = !1, h = document.querySelector(h)) {
                    "sims_fbt" == h.previousElementSibling.id && (h = h.previousElementSibling, "bucketDivider" == h.previousElementSibling.className && (h = h.previousElementSibling), f = !0), 1 == c.keepaBoxPlaceholderAppend && (h = h.nextSibling), a(h, f);
                  } else {
                    if (h = c.keepaBoxPlaceholderBackup || "#elevatorBottom", "ATFCriticalFeaturesDataContainer" == h && (h = "#ATFCriticalFeaturesDataContainer"), h = document.querySelector(h)) {
                      1 == c.keepaBoxPlaceholderBackupAppend && (h = h.nextSibling), a(h, !0);
                    } else {
                      if (h = document.getElementById("hover-zoom-end")) {
                        a(h, !0);
                      } else {
                        if (h = c.keepaBoxPlaceholderBackupClass || ".a-fixed-left-grid", (h = document.querySelector(h)) && h.nextSibling) {
                          a(h.nextSibling, !0);
                        } else {
                          f = 0;
                          h = document.getElementsByClassName("twisterMediaMatrix");
                          b = !!document.getElementById("dm_mp3Player");
                          if ((h = 0 == h.length ? document.getElementById("handleBuy") : h[0]) && 0 == f && !b && null != h.nextElementSibling) {
                            g = !1;
                            for (b = h; b;) {
                              if (b = b.parentNode, "table" === b.tagName.toLowerCase()) {
                                if ("buyboxrentTable" === b.className || /buyBox/.test(b.className) || "buyingDetailsGrid" === b.className) {
                                  g = !0;
                                }
                                break;
                              } else {
                                if ("html" === b.tagName.toLowerCase()) {
                                  break;
                                }
                              }
                            }
                            if (!g) {
                              h = h.nextElementSibling;
                              a(h, !1);
                              return;
                            }
                          }
                          h = document.getElementsByClassName("bucketDivider");
                          0 == h.length && (h = document.getElementsByClassName("a-divider-normal"));
                          if (!h[f]) {
                            if (!h[0]) {
                              40 > k++ && window.setTimeout(function() {
                                n();
                              }, 100);
                              return;
                            }
                            f = 0;
                          }
                          for (b = h[f]; b && h[f];) {
                            if (b = b.parentNode, "table" === b.tagName.toLowerCase()) {
                              if ("buyboxrentTable" === b.className || /buyBox/.test(b.className) || "buyingDetailsGrid" === b.className) {
                                b = h[++f];
                              } else {
                                break;
                              }
                            } else {
                              if ("html" === b.tagName.toLowerCase()) {
                                break;
                              }
                            }
                          }
                          e.placeholder = h[f];
                          h[f] && h[f].parentNode && (f = document.getElementsByClassName("lpo")[0] && h[1] && 0 == f ? h[1] : h[f], a(f, !1));
                        }
                      }
                    }
                  }
                }
              }
            }
          };
          n();
        });
      }, getAFComment:function(a) {
        for (a = [a]; 0 < a.length;) {
          for (var c = a.pop(), k = 0; k < c.childNodes.length; k++) {
            var b = c.childNodes[k];
            if (8 === b.nodeType && -1 < b.textContent.indexOf("MarkAF")) {
              return b;
            }
            a.push(b);
          }
        }
        return null;
      }, getIframeUrl:function(a, c) {
        return "https://keepa.com/iframe_addon.html#" + a + "-0-" + c;
      }, insertIFrame:function(a, c) {
        if (null != e.iframeStorage && document.getElementById("keepaContainer")) {
          e.swapIFrame();
        } else {
          var k = document.getElementById("hover-zoom-end"), b = function(a) {
            for (var c = document.getElementById(a), d = []; c;) {
              d.push(c), c.id = "a-different-id", c = document.getElementById(a);
            }
            for (c = 0; c < d.length; ++c) {
              d[c].id = a;
            }
            return d;
          }("hover-zoom-end");
          chrome.storage.local.get("s_boxHorizontal", function(d) {
            "undefined" == typeof d && (d = {});
            if (null == a) {
              setTimeout(function() {
                e.getPlaceholderAndInsertIFrame(e.insertIFrame);
              }, 2000);
            } else {
              var f = d.s_boxHorizontal, h = window.innerWidth - 50;
              if (!document.getElementById("keepaContainer")) {
                d = 0 < document.location.href.indexOf("/offer-listing/");
                var n = e.getIframeUrl(e.domain, e.ASIN), g = document.createElement("div");
                "0" != f || d ? g.setAttribute("style", "min-width: 935px; width: calc(100% - 30px); height: 500px; display: flex; border:0 none; margin: 10px 0 0;") : (h -= 550, 960 > h && (h = 960), g.setAttribute("style", "min-width: 935px; max-width:" + h + "px;display: flex;  height: 500px; border:0 none; margin: 10px 0 0;"));
                g.setAttribute("id", "keepaContainer");
                var l = document.createElement("iframe");
                f = document.createElement("div");
                f.setAttribute("id", "keepaClear");
                l.setAttribute("style", "width: 100%; height: 100%; border:0 none;overflow: hidden;");
                l.setAttribute("src", n);
                l.setAttribute("scrolling", "no");
                l.setAttribute("id", "keepa");
                p || (p = !0);
                g.appendChild(l);
                h = !1;
                if (!c) {
                  null == a.parentNode || "promotions_feature_div" !== a.parentNode.id && "dp-out-of-stock-top_feature_div" !== a.parentNode.id || (a = a.parentNode);
                  try {
                    var m = a.previousSibling.previousSibling;
                    null != m && "technicalSpecifications_feature_div" == m.id && (a = m);
                  } catch (K) {
                  }
                  0 < b.length && (k = b[b.length - 1]) && "centerCol" != k.parentElement.id && ((m = e.getFirstInDOM([a, k], document.body)) && 600 < m.parentElement.offsetWidth && (a = m), a === k && (h = !0));
                  (m = document.getElementById("title") || document.getElementById("title_row")) && e.getFirstInDOM([a, m], document.body) !== m && (a = m);
                }
                m = document.getElementById("vellumMsg");
                null != m && (a = m);
                m = document.body;
                var r = document.documentElement;
                r = Math.max(m.scrollHeight, m.offsetHeight, r.clientHeight, r.scrollHeight, r.offsetHeight);
                var q = a.offsetTop / r;
                if (0.5 < q || 0 > q) {
                  m = e.getAFComment(m), null != m && (q = a.offsetTop / r, 0.5 > q && (a = m));
                }
                if (a.parentNode) {
                  m = document.querySelector(".container_vertical_middle");
                  d ? (a = document.getElementById("olpTabContent"), a || (a = document.getElementById("olpProduct"), a = a.nextSibling), a.parentNode.insertBefore(g, a)) : "burjPageDivider" == a.id ? (a.parentNode.insertBefore(g, a), c || a.parentNode.insertBefore(f, g.nextSibling)) : "bottomRow" == a.id ? (a.parentNode.insertBefore(g, a), c || a.parentNode.insertBefore(f, g.nextSibling)) : h ? (a.parentNode.insertBefore(g, a.nextSibling), c || a.parentNode.insertBefore(f, g.nextSibling)) : null != 
                  m ? (a = m, a.parentNode.insertBefore(g, a.nextSibling), c || a.parentNode.insertBefore(f, g.nextSibling)) : (a.parentNode.insertBefore(g, a), c || a.parentNode.insertBefore(f, g));
                  e.iframeStorage = l;
                  g.style.display = e.cssFlex;
                  var t = !1, x = 5;
                  if (!C) {
                    var v = setInterval(function() {
                      if (0 >= x--) {
                        clearInterval(v);
                      } else {
                        var a = null != document.getElementById("keepa" + e.ASIN);
                        try {
                          if (!a) {
                            throw e.getPlaceholderAndInsertIFrame(e.insertIFrame), 1;
                          }
                          if (t) {
                            throw 1;
                          }
                          document.getElementById("keepa" + e.ASIN).contentDocument.location = n;
                        } catch (N) {
                          clearInterval(v);
                        }
                      }
                    }, 4000), w = function() {
                      t = !0;
                      l.removeEventListener("load", w, !1);
                      e.synchronizeIFrame();
                    };
                    l.addEventListener("load", w, !1);
                  }
                } else {
                  e.swapIFrame();
                }
              }
            }
          });
        }
      }, handleIFrameMessage:function(a, c, k) {
        switch(a) {
          case "resize":
            b || (b = !0);
            c = "" + c;
            -1 == c.indexOf("px") && (c += "px");
            if (a = document.getElementById("keepaContainer")) {
              a.style.height = c;
            }
            break;
          case "ping":
            k({location:chrome.runtime.id + " " + document.location});
            break;
          case "openPage":
            chrome.runtime.sendMessage({type:"openPage", url:c});
            break;
          case "getToken":
            chrome.runtime.sendMessage({type:"getCookie", key:"token"}, function(a) {
              k({token:a.value});
            });
            break;
          case "setCookie":
            chrome.runtime.sendMessage({type:"setCookie", key:c.key, val:c.val});
        }
      }, synchronizeIFrame:function() {
        var a = 0;
        chrome.storage.local.get("s_boxHorizontal", function(c) {
          "undefined" != typeof c && "undefined" != typeof c.s_boxHorizontal && (a = c.s_boxHorizontal);
        });
        var c = window.innerWidth, k = !1;
        C || window.addEventListener("resize", function() {
          k || (k = !0, window.setTimeout(function() {
            if (c != window.innerWidth && "0" == a) {
              c = window.innerWidth;
              var b = window.innerWidth - 50;
              b -= 550;
              935 > b && (b = 935);
              document.getElementById("keepaContainer").style.width = b;
            }
            k = !1;
          }, 100));
        }, !1);
      }, getFirstInDOM:function(a, c) {
        var k;
        for (c = c.firstChild; c; c = c.nextSibling) {
          if ("IFRAME" !== c.nodeName && 1 === c.nodeType) {
            if (-1 !== a.indexOf(c)) {
              return c;
            }
            if (k = e.getFirstInDOM(a, c)) {
              return k;
            }
          }
        }
        return null;
      }, getClipRect:function(a) {
        "string" === typeof a && (a = document.querySelector(a));
        var c = 0, k = 0, b = function(a) {
          c += a.offsetLeft;
          k += a.offsetTop;
          a.offsetParent && b(a.offsetParent);
        };
        b(a);
        return 0 == k && 0 == c ? e.getClipRect(a.parentNode) : {top:k, left:c, width:a.offsetWidth, height:a.offsetHeight};
      }, findPlaceholderBelowImages:function(a) {
        var c = a, b, g = 100;
        do {
          for (g--, b = null; !b;) {
            b = a.nextElementSibling, b || (b = a.parentNode.nextElementSibling), a = b ? b : a.parentNode.parentNode, !b || "IFRAME" !== b.nodeName && "SCRIPT" !== b.nodeName && 1 === b.nodeType || (b = null);
          }
        } while (0 < g && 100 < e.getClipRect(b).left);
        return b ? b : c;
      }, httpGet:function(a, c) {
        var b = new XMLHttpRequest;
        c && (b.onreadystatechange = function() {
          4 == b.readyState && c.call(this, b.responseText);
        });
        b.open("GET", a, !0);
        b.send();
      }, httpPost2:function(a, c, b, e, d) {
        var f = new XMLHttpRequest;
        e && (f.onreadystatechange = function() {
          4 == f.readyState && e.call(this, f.responseText);
        });
        f.withCredentials = d;
        f.open("POST", a, !0);
        f.setRequestHeader("Content-Type", b);
        f.send(c);
      }, httpPost:function(a, c, b, g) {
        e.httpPost2(a, c, "text/plain;charset=UTF-8", b, g);
      }, lastBugReport:0, reportBug:function(a, c, b) {
        var k = Date.now();
        if (!(6E5 > k - e.lastBugReport || /(dead object)|(Script error)|(\.location is null)/i.test(a))) {
          e.lastBugReport = k;
          k = "";
          try {
            k = Error().stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
            if (!/(keepa|content)\.js/.test(k)) {
              return;
            }
            k = k.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
          } catch (d) {
          }
          if ("object" == typeof a) {
            try {
              a = a instanceof Error ? a.toString() : JSON.stringify(a);
            } catch (d) {
            }
          }
          null == b && (b = {exception:a, additional:c, url:document.location.host, stack:k});
          null != b.url && b.url.startsWith("blob:") || (b.keepaType = G ? "keepaChrome" : g ? "keepaOpera" : q ? "keepaSafari" : t ? "keepaEdge" : "keepaFirefox", b.version = B, chrome.storage.local.get("token", function(a) {
            "undefined" == typeof a && (a = {token:"undefined"});
            e.httpPost("https://dyn.keepa.com/service/bugreport/?user=" + a.token + "&type=" + H, JSON.stringify(b));
          }));
        }
      }};
      window.onerror = function(a, c, b, g, d) {
        if ("string" !== typeof a) {
          d = a.error;
          var f = a.filename || a.fileName;
          b = a.lineno || a.lineNumber;
          g = a.colno || a.columnNumber;
          a = a.message || a.name || d.message || d.name;
        }
        a = a.toString();
        var h = "";
        g = g || 0;
        if (d && d.stack) {
          h = d.stack;
          try {
            h = d.stack.split("\n").splice(1).splice(1).join("&ensp;&lArr;&ensp;");
            if (!/(keepa|content)\.js/.test(h)) {
              return;
            }
            h = h.replace(/chrome-extension:\/\/.*?\/content\//g, "").replace(/:[0-9]*?\)/g, ")").replace(/[ ]{2,}/g, "");
          } catch (D) {
          }
        }
        "undefined" === typeof b && (b = 0);
        "undefined" === typeof g && (g = 0);
        a = {msg:a, url:(c || f || document.location.toString()) + ":" + b + ":" + g, stack:h};
        "ipbakfmnjdenbmoenhicfmoojdojjjem" != chrome.runtime.id && "blfpbjkajgamcehdbehfdioapoiibdmc" != chrome.runtime.id || console.log(a);
        e.reportBug(null, null, a);
        return !1;
      };
      if (window.self == window.top && (document.addEventListener("DOMContentLoaded", function(a) {
        chrome.runtime.sendMessage({type:"optionalPermissionsRequired"}, function(a) {
          if (!0 === a.value) {
            var c = 0;
            console.log("opr: ", a.value);
            var b = function() {
              10 < c++ && document.body.removeEventListener("click", b);
              chrome.runtime.sendMessage({type:"optionalPermissions"}, function(a) {
                document.body.removeEventListener("click", b);
              });
            };
            document.body.addEventListener("click", b);
          }
        });
      }), !(/.*music\.amazon\..*/.test(document.location.href) || /.*primenow\.amazon\..*/.test(document.location.href) || /.*amazonlive-portal\.amazon\..*/.test(document.location.href) || /.*amazon\.com\/restaurants.*/.test(document.location.href)))) {
        l = function(a) {
          chrome.runtime.sendMessage({type:"sendData", val:{key:"m1", payload:[a]}}, function() {
          });
        };
        var z = document.location.href, y = !1;
        document.addEventListener("DOMContentLoaded", function(a) {
          if (!y) {
            try {
              if (z.startsWith("https://test.keepa.com") || z.startsWith("https://keepa.com")) {
                var c = document.createElement("div");
                c.id = "extension";
                c.setAttribute("type", H);
                c.setAttribute("version", B);
                document.body.appendChild(c);
                y = !0;
              }
            } catch (k) {
            }
          }
        });
        var I = !1;
        z.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/s\?/) ? (onlyStock = !0, e.onPageLoad()) : /((\/images)|(\/review)|(\/customer-reviews)|(ask\/questions)|(\/product-reviews))/.test(z) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(z) || !z.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|nl|in|com\.mx|com\.br|com\.au)\/[^.]*?(\/|[?&]ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !z.match(/^htt(p|ps):\/\/.*?\.amzn\.(com).*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) ? 
        z.match(/^htt(p|ps):\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/[^.]*?\/(wishlist|registry)/) || z.match(/^htt(p|ps):\/\/w*?\.amzn\.(com)[^.]*?\/(wishlist|registry)/) || (z.match("^https?://.*?(?:seller).*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|nl|es|in|com.mx|com.br|com.au)/") ? l("s" + e.getDomain(RegExp.$1)) : z.match(/^https?:\/\/.*?(?:af.?ilia|part|assoc).*?\.amazon\.(de|com|co\.uk|co\.jp|nl|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/home/) && l("a" + 
        e.getDomain(RegExp.$1))) : (e.onPageLoad(!1), I = !0);
        if (!C) {
          l = /^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/(s([\/?])|gp\/bestsellers\/|gp\/search\/|.*?\/b\/)/;
          (I || z.match(l)) && document.addEventListener("DOMContentLoaded", function(a) {
            var c = null;
            chrome.runtime.sendMessage({type:"getFilters"}, function(a) {
              c = a;
              if (null != c && null != c.value) {
                var b = function() {
                  var c = z.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|com.mx)/");
                  if (I || c) {
                    var b = e.getDomain(RegExp.$1);
                    scanner.scan(a.value, function(a) {
                      a.key = "f1";
                      a.domainId = b;
                      chrome.runtime.sendMessage({type:"sendData", val:a}, function(a) {
                      });
                    });
                  }
                };
                b();
                var d = document.location.href, f = -1, h = -1, k = -1;
                h = setInterval(function() {
                  d != document.location.href && (d = document.location.href, clearTimeout(k), k = setTimeout(function() {
                    b();
                  }, 2000), clearTimeout(f), f = setTimeout(function() {
                    clearInterval(h);
                  }, 180000));
                }, 2000);
                f = setTimeout(function() {
                  clearInterval(h);
                }, 180000);
              }
            });
          });
          l = document.location.href;
          l.match("^https?://.*?.amazon.(de|com|co.uk|co.jp|ca|fr|it|es|in|com.mx|com.br|com.au)/") && -1 == l.indexOf("aws.amazon.") && -1 == l.indexOf("music.amazon.") && -1 == l.indexOf("services.amazon.") && -1 == l.indexOf("primenow.amazon.") && -1 == l.indexOf("kindle.amazon.") && -1 == l.indexOf("watch.amazon.") && -1 == l.indexOf("developer.amazon.") && -1 == l.indexOf("skills-store.amazon.") && -1 == l.indexOf("pay.amazon.") && document.addEventListener("DOMContentLoaded", function(a) {
            setTimeout(function() {
              chrome.runtime.onMessage.addListener(function(a, b, g) {
                switch(a.key) {
                  case "collectASINs":
                    a = {};
                    var c = !1;
                    b = (document.querySelector("#main") || document.querySelector("#zg") || document.querySelector("#pageContent") || document.querySelector("#wishlist-page") || document.querySelector("#merchandised-content") || document.querySelector("[id^='contentGrid']") || document.querySelector("#container") || document.querySelector(".a-container") || document).getElementsByTagName("a");
                    if (void 0 != b && null != b) {
                      for (var f = 0; f < b.length; f++) {
                        var h = b[f].href;
                        /\/images/.test(h) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(h) || !h.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx|com\.br|com\.au)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !h.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (c = RegExp.$2, h = e.getDomain(RegExp.$1), "undefined" === typeof a[h] && (a[h] = []), a[h].includes(c) || a[h].push(c), c = !0);
                      }
                    }
                    if (c) {
                      g(a);
                    } else {
                      return alert("Keepa: No product ASINs found on this page."), !1;
                    }
                    break;
                  default:
                    g({});
                }
              });
              chrome.storage.local.get(["overlayPriceGraph", "webGraphType", "webGraphRange"], function(a) {
                "undefined" == typeof a && (a = {});
                try {
                  var b = a.overlayPriceGraph, c = a.webGraphType;
                  try {
                    c = JSON.parse(c);
                  } catch (r) {
                  }
                  var d = a.webGraphRange;
                  try {
                    d = Number(d);
                  } catch (r) {
                  }
                  var f;
                  if (1 == b) {
                    var h = document.getElementsByTagName("a"), e = 0 < document.location.href.indexOf("/offer-listing/");
                    if (void 0 != h && null != h) {
                      for (f = 0; f < h.length; f++) {
                        var g = h[f].href;
                        /\/images/.test(g) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(g) || !g.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !g.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (e || -1 == g.indexOf("offer-listing")) && v.add_events(c, d, h[f], g, RegExp.$1, RegExp.$2);
                      }
                    }
                    var l = function(a) {
                      if ("A" == a.nodeName) {
                        var b = a.href;
                        /\/images/.test(b) || /\/e\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/.test(b) || !b.match(/^https?:\/\/.*?\.amazon\.(de|com|co\.uk|co\.jp|ca|fr|it|es|in|com\.mx)\/[^.]*?(?:\/|\?ASIN=)([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) && !b.match(/^https?:\/\/.*?\.amzn\.(com)[^.]*?\/([BC][A-Z0-9]{9}|\d{9}(!?X|\d))/) || (e || -1 == b.indexOf("offer-listing")) && v.add_events(c, d, a, b, RegExp.$1, RegExp.$2);
                      }
                    }, m = new MutationObserver(function(a) {
                      a.forEach(function(a) {
                        try {
                          if ("childList" === a.type) {
                            for (f = 0; f < a.addedNodes.length; f++) {
                              l(a.addedNodes[f]);
                              for (var b = a.addedNodes[f].children; null != b && "undefined" != b && 0 < b.length;) {
                                for (var c = [], d = 0; d < b.length; d++) {
                                  l(b[d]);
                                  try {
                                    if (b[d].children && 0 < b[d].children.length) {
                                      for (var h = 0; h < b[d].children.length && 30 > h; h++) {
                                        c.push(b[d].children[h]);
                                      }
                                    }
                                  } catch (K) {
                                  }
                                }
                                b = c;
                              }
                            }
                          } else {
                            if (c = a.target.getElementsByTagName("a"), "undefined" != c && null != c) {
                              for (b = 0; b < c.length; b++) {
                                l(c[b]);
                              }
                            }
                          }
                          l(a.target);
                        } catch (K) {
                        }
                      });
                    });
                    m.observe(document.querySelector("html"), {childList:!0, attributes:!1, characterData:!1, subtree:!0, attributeOldValue:!1, characterDataOldValue:!1});
                    window.onunload = function F() {
                      try {
                        window.detachEvent("onunload", F), m.disconnect();
                      } catch (O) {
                      }
                    };
                  }
                } catch (r) {
                }
              });
            }, 100);
          });
          var v = {image_urls_main:[], pf_preview_current:"", preview_images:[], tld:"", img_string:'<img style="border: 1px solid #ff9f29;  -moz-border-radius: 0px;  margin: -3px;   display:block;   position: relative;   top: -3px;   left: -3px;" src=\'', createNewImageElement:function(a) {
            a = a.createElement("img");
            a.style.borderTop = "2px solid #ff9f29";
            a.style.borderBottom = "3px solid grey";
            a.style.display = "block";
            a.style.position = "relative";
            a.style.padding = "5px";
            return a;
          }, preview_image:function(a, b, e, g, d, f) {
            try {
              var c = e.originalTarget.ownerDocument;
            } catch (r) {
              c = document;
            }
            if (!c.getElementById("pf_preview")) {
              var k = c.createElement("div");
              k.id = "pf_preview";
              k.addEventListener("mouseout", function(a) {
                v.clear_image(a);
              }, !1);
              k.style.boxShadow = "rgb(68, 68, 68) 0px 1px 7px -2px";
              k.style.position = "fixed";
              k.style.zIndex = "10000000";
              k.style.bottom = "0px";
              k.style.right = "0px";
              k.style.margin = "12px 12px";
              k.style.backgroundColor = "#fff";
              c.body.appendChild(k);
            }
            v.pf_preview_current = c.getElementById("pf_preview");
            if (!v.pf_preview_current.firstChild) {
              k = Math.max(Math.floor(0.3 * c.defaultView.innerHeight), 128);
              var l = Math.max(Math.floor(0.3 * c.defaultView.innerWidth), 128), n = 2;
              if (300 > l || 150 > k) {
                n = 1;
              }
              1000 < l && (l = 1000);
              1000 < k && (k = 1000);
              v.pf_preview_current.current = -1;
              v.pf_preview_current.a = d;
              v.pf_preview_current.href = g;
              v.pf_preview_current.size = Math.floor(1.1 * Math.min(l, k));
              c.defaultView.innerWidth - e.clientX < 1.05 * l && c.defaultView.innerHeight - e.clientY < 1.05 * k && (e = c.getElementById("pf_preview"), e.style.right = "", e.style.left = "6px");
              d = "https://graph.keepa.com/pricehistory.png?type=" + n + "&asin=" + d + "&domain=" + f + "&width=" + l + "&height=" + k;
              d = "undefined" == typeof a ? d + "&amazon=1&new=1&used=1&salesrank=1&range=365" : d + ("&amazon=" + a[0] + "&new=" + a[1] + "&used=" + a[2] + "&salesrank=" + a[3] + "&range=" + b + "&fba=" + a[10] + "&fbm=" + a[7] + "&bb=" + a[18] + "&ld=" + a[8] + "&wd=" + a[9]);
              c.getElementById("pf_preview").style.display = "block";
              var m = v.createNewImageElement(c);
              v.pf_preview_current.appendChild(m);
              fetch(d).then(function(a) {
                try {
                  if ("FAIL" === a.headers.get("screenshot-status")) {
                    return null;
                  }
                } catch (F) {
                }
                return a.blob();
              }).then(function(a) {
                null != a && m.setAttribute("src", URL.createObjectURL(a));
              });
            }
          }, clear_image:function(a) {
            try {
              try {
                var b = a.originalTarget.ownerDocument;
              } catch (n) {
                b = document;
              }
              var e = b.getElementById("pf_preview");
              e.style.display = "none";
              e.style.right = "2px";
              e.style.left = "";
              v.pf_preview_current.innerHTML = "";
            } catch (n) {
            }
          }, add_events:function(a, b, e, g, d, f) {
            0 <= g.indexOf("#") || (v.tld = d, "pf_prevImg" != e.getAttribute("keepaPreview") && (e.addEventListener("mouseover", function(c) {
              v.preview_image(a, b, c, g, f, d);
              return !0;
            }, !0), e.addEventListener("mouseout", function(a) {
              v.clear_image(a);
            }, !1), e.setAttribute("keepaPreview", "pf_prevImg")));
          }};
        }
      }
    }
  }
})();

