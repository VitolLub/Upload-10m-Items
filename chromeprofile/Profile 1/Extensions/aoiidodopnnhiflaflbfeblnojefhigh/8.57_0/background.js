if (chrome) {
    var browser = chrome;
}

var retailers = [];
var universal_scrapes = [];
var current_retailer = {};
var coupons = {};
var ver = '8.57';
var uid;
var wishlist_url;
var suppressedMs = 30 * 60 * 1000;
var invalidTabId = -99999;
var suppressedTabId = invalidTabId;
var suppressedTabHost = [];
var suppressedTab_sup_url  = [];
var tabIdsExemptedFromSuppression = [];
var urlExemptedFromSuppression = 'priceblink.com';

var disabled_status;
var NOT_DISABLED = 0;
var TEMP_DISABLED = 1;
var PERM_DISABLED = 2;
// For our new split test where we pause for 24 hours and give no price comp or coupons
var TEMP_DISABLED_NO_PRICE_COMP = 3;

var suppress_toolbar = false;

// Some debug vars
var debugExtensionID = "";
var debug_params;
var debug_start;
var debug_g_search_url;
var debug_g_prices_url;

// This stores the ID of the retailer in the currently active tab
// This differs from current_retailer.id in cases where the user switches between tabs with supported retailers
var currently_active_tab_retailer_id;

var BASE_AMAZON_URL = "https://www.amazon.com/exec/obidos/ASIN/";

//For testing purposes, set this to 1 to get the push coupons popup displayed even if the call to the pushCoupons service fails.
var defaultHasPushCoupons = false;

var currentBrowserType = 'chrome';
var autoCouponsState      = {};

function getCodes(rid, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var codes = JSON.parse(xhr.response).filter(function(coupon) {
                return coupon.code;
            }).map(function(coupon) {
                return coupon.code;
            });
            callback(codes);
        }
    };
    xhr.open("GET", "https://tb.priceblink.com/coupons?rid=" + rid + "&uid="+uid+"&browser=" + currentBrowserType + "&code=1&partnerid=0");
    xhr.send();
}

function now() {
    return (new Date()).getTime();
}

// Keep only letters, numbers, and -.
// @todo Remove this.
function tempCleanIllegals(items) {
    if (!items) return items;
    var rm = function (s) {
        return typeof s === 'string' ? s.replace(/["\\]*/g, '') : s;
    };
    if (typeof items === 'object') {
        items.uid && (items.uid = rm(items.uid));
        items.country && (items.country = rm(items.country));
        items.expanded_at && (items.expanded_at = rm(items.expanded_at));
        return items;
    } else {
        return rm(items);
    }
}

function allStorageSet(items, callback) {
    var storage = (browser.storage || {}).sync;
    var fn = (typeof callback === 'function') ? callback : (function () {});
    items = tempCleanIllegals(items);
    if (typeof items === 'object') {
        storage && storage.set(items, fn);
        var keys = Object.keys(items);
        keys.forEach(function (key) {
            localStorage.setItem(key, typeof items[key] === 'object' ? JSON.stringify(items[key]) : items[key]);
        });
    }
}

function allStorageGet(callback, key) {
  var storage = (browser.storage || {}).sync;
  var fn = (typeof callback === 'function') ? callback : (function () {});

  // Test whether a string is enclosed by `{}`.
  function isObjectStr(str) {
    return /^{[\s\S]*}$/.test(str);
  }

  function parseLocalStorage() {
    var merged = {};
    for (var i = 0; i < localStorage.length; i++) {
      try {
        var value = localStorage.getItem(localStorage.key(i));
        merged[localStorage.key(i)] = isObjectStr(value) ? JSON.parse(value) : value;
      } catch (e) {}
    }
    return merged;
  }

  if (storage) {
    storage.get(function (local) {
      var merged = parseLocalStorage();
      var keys = Object.keys(local);
      keys.forEach(function (key) {
        local[key] && (merged[key] = local[key]);
      });
      merged = tempCleanIllegals(merged);
      fn(key ? merged[key] : merged);
    });
  } else {
    var merged = parseLocalStorage();
    merged = tempCleanIllegals(merged);
    fn(key ? merged[key] : merged);
  }
}

// For the local fields, if storage.local does not have value, while localStorage has values, copy over.
allStorageGet(function (oldLocal) {
    // @todo remove this temp cleaning later.
    var local = tempCleanIllegals(oldLocal);
    allStorageSet(local, function () {
        var newLocalData = {};
        ['disabled_retailers', 'suppressedRetailers'].forEach(function (field) {
            var value = local[field];
            if (!value && localStorage.getItem(field)) {
                try {
                    value = JSON.parse(localStorage.getItem(field));
                    if (value['retailers']) {
                        var arr = value['retailers'];
                        value = {};
                        arr.forEach(function (r) {
                            r.id && (value[r.id] = r);
                        });
                    }
                } catch (e) {
                }
            }
            value = value || {};
            newLocalData[field] = value;
        });

        // Pick the uid from FireFox if there is any.
        var storageFromFF = local.storage || {};
        uid = tempCleanIllegals(storageFromFF.uid) || tempCleanIllegals(local.uid) || tempCleanIllegals(localStorage.getItem('uid'));
        if (!uid) {
            uid = guid();
            // Let's go out and get the tax info
            try {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var doc = document.implementation.createHTMLDocument("");
                        doc.documentElement.innerHTML = DOMPurify.sanitize(xhr.responseText);
                        var tax_location = getXPathString(doc, "substring-after(//div[@class='sh-dr__restricts']//div[contains(., 'Your location')]/text()[normalize-space()], 'location: ')") || '';
                        tax_location = tax_location.split(",").reverse();

                        var tax_state = (tax_location[0] && tax_location[0].trim()) || 'unknown';
                        var tax_city = (tax_location[1] && tax_location[1].trim()) || 'unknown';
                        var xhr2 = new XMLHttpRequest();
                        xhr2.onreadystatechange = function () {
                          if (xhr2.readyState == 4) {
                            var doc2 = document.implementation.createHTMLDocument("");
                            doc2.documentElement.innerHTML = DOMPurify.sanitize(xhr2.responseText);
                            var total_amount = getXPathString(doc2, "//tr[@class='sh-osd__offer-row']//td[contains(text(),'Total price')]/following-sibling::*");
                            var tax_amount = getXPathString(doc2, "//tr[@class='sh-osd__offer-row']//td[contains(text(),'tax')]/following-sibling::*");

                            console.log(total_amount);
                            console.log(tax_amount);
                            console.log(tax_city);
                            console.log(tax_state);
                            browser.tabs.create({url: "https://www.priceblink.com/install?uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&total=" + total_amount + "&tax=" + tax_amount + "&city=" + tax_city + "&state=" + tax_state + "&partnerid=0"});
                          }
                     };
                    xhr2.open("GET", "https://www.google.com/shopping/product/11653372798373069192/offers?q=00885609016238&prds=cid:11653372798373069192,cond:1,fbog:1", true);
                    xhr2.send();
                  }
                };
                xhr.open("GET", "https://www.google.com/search?tbm=shop&tbs=vw:l,new:1&q=00885609016238", true);
                xhr.send();
            } catch (e) {
                console.error("Error during initialization.");
            }

        }

        if (!local.uid) {
            newLocalData.uid = uid;
        }
        allStorageSet(newLocalData, function () {
            getParser();
            getUniversalScrapes();
        });

        // Set the uninstall url here since it was previously null
        browser.runtime.setUninstallURL("https://www.priceblink.com/uninstall?browser=" + currentBrowserType + "&uid=" + uid + "&partnerid=0");
    });

});

function printStorage() {
    var storage = (browser.storage || {}).sync;
    storage && storage.get(function (local) {
        console.log(local);
    });
    console.log('local storage: ', localStorage);
}

function getParser(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            try {
                var resp = JSON.parse(xhr.responseText);
                retailers = resp;
            }
            catch (e) {
                //console.log("parsing retailers failed")
                if (!retailers) {
                    retailers = [];
                }

            }
            if (callback && (typeof callback) == "function") callback();
        }
    }

    xhr.open("GET", "https://tb.priceblink.com/retailers_0.4.js?uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&n=" + new Date().getMilliseconds() + "&partnerid=0", true);
    xhr.send();
}

// Let's grab the parser every 8 hours
browser.alarms.create('getParserAlarm', {
  periodInMinutes: 8 * 60,
});

browser.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'getParserAlarm') {
        getParser();
        getUniversalScrapes();
    }
});

// universal scrapes
function getUniversalScrapes(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            try {
                var resp = JSON.parse(xhr.responseText);
                universal_scrapes = resp;
                // Set the country pref
                allStorageSet({
                    country: resp[0].settings.country,
                });
            }
            catch (e) {
                //console.log("parsing universal scrapes failed")
                if (!universal_scrapes) {
                    universal_scrapes = [];
                }

            }
            if (callback && (typeof callback) == "function") callback();
        }
    }

    xhr.open("GET", "https://tb.priceblink.com/universal_scrapes.php?uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&n=" + new Date().getMilliseconds() + "&partnerid=0", true);
    xhr.send();
}

//This function acts as a proxy to ensure retailers and universal_scrapes are loaded properly before trying to process a request
function wrapRequest(request, sender, callback) {
    if (request.autocoupons) {
        if (request.openTabUrl) {
          chrome.tabs.create({ url: request.openTabUrl, active: false }, function(tab) {
            callback(tab.id);
          });
          return true;
        } else if (request.removeTabId) {
          chrome.tabs.remove(request.removeTabId);
        }
        return;
    }
    
    if (!retailers.length > 0) {
        getParser(function () {
            if (!universal_scrapes.length >= 0) {
                getUniversalScrapes(function () {
                    onRequest(request, sender, callback);
                })
            }
            else {
                onRequest(request, sender, callback);
            }
        });
    } else {
        onRequest(request, sender, callback);
    }
    // Very important: to allow callback after an async action, need to `return true` first.
    // It tells Chrome: `Please keep the channel alive, I will invoke the callback later`.
    // @see http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
    return true;
}

function isSuppressed(url, suppressedRetailers) {
    var retailer = getRetailer(url);
    // console.log('retailer', retailer);
    // console.log('suppressedRetailers', suppressedRetailers);
    if (retailer) {
        if (suppressedRetailers.hasOwnProperty(retailer.id)) {
            var record = suppressedRetailers[retailer.id];
            // Recover from suppression
            if (now() - record.time > suppressedMs) {
                delete suppressedRetailers[retailer.id];
                allStorageSet({
                    suppressedRetailers: suppressedRetailers,
                });
                return false;
            } else {
                //console.log('is suppressed')
                return true;
            }
        }
    }
    return false;
}

function isRetailerSuppressed(retailerId, callback) {
    allStorageGet(function (local) {
        callback(!!local.suppressedRetailers[retailerId]);
    });
}


function onRequest(request, sender, callback) {   
    // Iterate through all tabs to identify the suppressed tab, even though it's in background
    // Note: `browser.tabs.query` is an async function, so if `suppressedTabId` is valid,
    // we need to test whether we should suppress the current tab, before going to process the request.
    // console.log('request', request);

    // A tab has incorrect information if its status is `loading`.
    // So we wait until the tab is `complete` before going to try the suppression.
    // @see https://app.asana.com/0/159920659659321/313589102923674

    if (request.action == 'openUrl') {
      browser.tabs.create({url: request.url, active: false});
      return;
    }

    if (request.action == 'getSettings') {            
        getSettings(callback);
        return;
    }

    if (request.action == 'getCouponCodes') {        
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var retailer= request.retailer;
            var tab = tabs[0];
            var url = new URL(tab.url);
            var el = url.hostname.split('.');
            var domain;
            if (el.length >= 3) {
                domain = el[1];
            } else if (el.length == 2) {
                domain = el[0];
            } else {
                callback([]);
                return;
            }
            if(retailer !== undefined){                     
                var rid = retailer.id;        
                if (((retailer.coupon_input_selector || retailer.coupon_submit_selector || retailer.ac_cart_page_check_selector) && retailer.total_price_selector)) {
                    getCodes(rid, function(codes) {
                       const unique_codes = codes.filter( onlyUnique );
                        callback(unique_codes);
                    });
                }
            }
        });
    }

    if (request.action == 'getSuppressedRetailer') {            
         allStorageGet(function (local) {
            var suppressedRetailers = local.suppressedRetailers;
            callback(suppressedRetailers);
        });
        return;
    }
    if (request.action == 'order_complete') {
        isRetailerSuppressed(request.rid, function(status){
            var t_status = 'on';
            var sup_domain = ''; var sup_url = ''; var sup_start_time = '';var sup_end_time = '';
            if(status == true){
                t_status = 'suppressed';
                var local = JSON.parse(localStorage.suppressedRetailers);
                var sup_retailer = local[request.rid];
                sup_domain = sup_retailer.sup_domain;
                sup_url = encodeURIComponent(sup_retailer.sup_url);
                var sup_time = sup_retailer.time;
                var sup_start_data = new Date(sup_time).toUTCString();
                sup_start_time = new Date(sup_start_data).getTime();
                var sup_end_data = new Date(sup_start_time + suppressedMs).toUTCString();
                sup_end_time = new Date(sup_end_data).getTime();
            }
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://tb.priceblink.com/et.php");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("event=order_complete&retailer_id=" + request.rid + "&uid=" + uid + '&toolbar=0&t_status='+t_status+'&sup_domain='+sup_domain+ "&ver=" + ver+ "&sup_start=" + sup_start_time+ "&sup_end=" + sup_end_time+ "&sup_url=" + sup_url);
        });
        return;        
    }

    var isRecentlySuppressed = false;
    function tryToSuppressTab(tab) {
        function afterComplete(completedTab) {
            // console.log('you are suppressed', completedTab);
            // console.log('you are suppressed', request);
          browser.tabs.sendMessage(tab.id, {action: "getNavigationType"}, function (response) {
           if(response.type != '2' && response.type != '1'){

            if (now() - (15 * 1000) < suppressedTabTimeStamp) {
                isRecentlySuppressed = true;
            }
            allStorageGet(function (local) {
                var suppressedRetailers = local.suppressedRetailers;
                var retailer = getRetailer(completedTab.url);
                // console.log('you are suppressed', retailer);
                if (retailer) {
                    var suppressingUrl = new URL(suppressedTabHost[0]);
                    suppressedRetailers[retailer.id] = {
                        id: retailer.id,
                        name: retailer.name,
                        url: retailer.url,
                        sup_domain: suppressingUrl.hostname,
                        sup_url: suppressedTab_sup_url[0],
                        time: now()
                    };
                    allStorageSet({
                        suppressedRetailers: suppressedRetailers
                    });
                    suppressedTabId = invalidTabId;
                    suppressedTabHost = [];
                    suppressedTab_sup_url = [];
                }
                gateway();
              });
             }else{
                suppressedTabId = invalidTabId;
                suppressedTabHost = [];
                suppressedTab_sup_url = [];
                gateway();
             }
          });            
        }

        if (tab.status === 'complete') {
            afterComplete(tab);
        } else {
            var i = 1;
            pingTab();
            function pingTab() {
                tab && tab.id >= 0 && browser.tabs.get(tab.id, function (updatedTab) {
                    // console.log('retrying to suppress tab', updatedTab);
                    // If the tab is closed, `updatedTab` will be `null`. So stop it.
                    if (updatedTab && updatedTab.status === 'complete') {
                        afterComplete(updatedTab);
                    } else {
                        if (i++ < 50) {
                            // console.log('next round i' + i);
                            setTimeout(pingTab, 200);
                        }else{
                            suppressedTabHost = [];
                            suppressedTab_sup_url = [];
                        }
                    }
                });
            }
        }
    }

    if (suppressedTabId && suppressedTabId != invalidTabId) {
        browser.tabs.query({}, function(tabs) {
            // console.log('tabs', tabs);
            var noTabToSuppress = true;
            if (tabs && tabs.length > 0) {
                for (var i = 0; i < tabs.length; i++) {
                    var tab = tabs[i];
                    // console.log('onRequest tab', tab);
                    // If the retailer is suppressed
                    if (tab.url && tab.id === suppressedTabId) {
                        noTabToSuppress = false;
                        tryToSuppressTab(tab);
                    }
                }
            }
            // If there is some tab to suppress, we process the request in `tryToSuppressTab`.
            if (noTabToSuppress) {
                gateway();
            }
        });
    } else {
        gateway();
    }

    function gateway() {
        // Make sure the requests always pass in the current page url
        allStorageGet(function (local) {
            if (request.url && !isSuppressed(request.url, local.suppressedRetailers) && !isRecentlySuppressed) {
                // console.log('Is not suppressed', request.url);
                action();
            }else if(request.url && isSuppressed(request.url, local.suppressedRetailers)){
                getSupRetailer();
            }
        });
    }

    function getSupRetailer(){
        if (request.action == 'getSupRetailer') {
           var retailer = getRetailer(request.url);
            if (retailer != null) {
                callback(retailer);
                return true;
            }
        }
    }

    function action() {
        // Is it a supported URL? Get retailer
        if (request.action == 'getRetailer') {
            // This will begin the coupons process
            getRetailerByUrl(request.url, function(retailer) {
              if (retailer != null) {
                  // Now get the coupons
                  getCoupons(retailer, callback);
                  return true;
              }
            });
            // Get coupons
        } else if (request.action == 'getPushCoupons') {
            // Check the server to see if there's coupons to push
            getPushCoupons(request.url, callback);
            // Get coupons
        } else if (request.action == 'getCoupons') {
            var callGetCoupons = function(retailer) {
                if (retailer != null) {
                  // Now get the coupons
                  getCoupons(retailer, callback);
                }
            }
            // If there's an id passed let's set the current retailer (Dell case)
            if (request.retailer_id != null) {
                getRetailerSID(request.retailer_id, callGetCoupons);
            } else {
                getRetailerByUrl(request.url, callGetCoupons);
            }
            // Get the data we need to crawl
        } else if (request.action == 'step1') {
            var retailer = request.retailer;
            getProductsData(retailer,request.params,request.url,callback);
            //callback
        } else if (request.action == 'scrapeAgain') {
            var retailer = request.retailer;
            getProductsData(retailer,request.params,request.url,callback);
        } else if (request.action == 'newTab') {
            browser.tabs.create({url: request.url});
            // For dev purposes
        } else if (request.action == 'openOptionsPage') {
            browser.tabs.create({url: '/options.html'});
            // For dev purposes
        } else if (request.action == 'setUid') {
            setUid(request.query);
            // For when the popup browser action is triggered. Need to retrieve the proper "view all coupons" url in cases where multiple tabs are loaded
        } else if (request.action == 'getCouponsForSelected') {
            browser.tabs.query({active: true}, function (tabs) {
                var tab = tabs && tabs[0];
                if (!tab) {
                    console.error('Cannot get current tab: ', tabs);
                    return;
                }
                browser.tabs.sendMessage(tab.id, {action: "getViewAllCouponsLink"}, function (response) {
                    callback({url: response.url});
                });
            });
            // For add to wish list popup
        } else if (request.action == 'getWishListURL') {
            // Return the server-provided wishlist url
            var retailer = getRetailerByID(request.rid);
            if (wishlist_url != null && retailer) {
                callback({url: wishlist_url});
                // Build the wishlist url
            } else {
                browser.tabs.query({active: true}, function (tabs) {
                    var tab = tabs && tabs[0];
                    if (!tab) {
                        console.error('Cannot get current tab: ', tabs);
                        return;
                    }
                    // If it's a chrome:// url then return that so we can disable menu
                    if (tab.url.indexOf("chrome://") == 0) {
                        // Do nothing yet
                        //callback{url: tab.url};
                        // Build the wishlist url from current page
                    } else {
                        browser.tabs.sendMessage(tab.id, {action: "getPageURL"}, function (response) {
                            response && callback({url: response.url});
                        });
                    }
                });
            }
            // Minimize and disable coupons
        } else if (request.action == 'disableCoupons') {
            disableRetailer(request.retailer);
        } else if (request.action == 'restoreCoupons') {
            restoreRetailer(request.retailer_id);
        } else if (request.action == 'getCouponsForMultipleURLs') {
            var retailer = getRetailer(request.url);
            var retailer_ids = getRetailerIdsForMultipleURLs(request.urls).toString();

            // There are no supported retailers so don't make the request
            if (retailer_ids.length == 0) return;

            var url = "https://tb.priceblink.com/coupons_response_array.php?uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&rid=" + retailer.id + "&rids=" + retailer_ids + "&partnerid=0";

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var coupons = JSON.parse(xhr.responseText);
                    callback({coupons: coupons[0].coupons});
                }
            }
            xhr.open("GET", url);
            xhr.send();
        } else if (request.action == 'highlightRetailer') {
            var highlight_url = request.coupons[0].coupons[0].url;

            if (highlight_url.indexOf("rdr.php?d=4") > -1) {
                var url = highlight_url.split("rdr.php?d=4");
                highlight_url = url[0] + "rdr.php?d=24" + url[1];
            } else if (highlight_url.indexOf("rdr.php?d=11") > -1) {
                var url = highlight_url.split("rdr.php?d=11");
                highlight_url = url[0] + "rdr.php?d=26" + url[1];
            }

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.responseText.indexOf("goskim()") != -1) {
                        var iframe = xhr.responseText.split("iframe")[1];
                        var src = iframe.split("src=\"")[1].split("\"></iframe>")[0];
                        var xhr2 = new XMLHttpRequest();
                        xhr2.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                // Do nothing
                            }
                        }
                        xhr2.open("GET", src);
                        xhr2.send();
                    }
                }
            }
            xhr.open("GET", highlight_url);
            xhr.send();
            // Send from options page when country is changed. We need to reload parser then.
        } else if (request.action == 'reloadParser') {
            getParser();
        } else if (request.action == 'statsAcPrompt') {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "https://tb.priceblink.com/stats.php?event=ac_prompt&partnerid=0&retailer=" + request.rid + "&uid=" + uid);
          xhr.send();
        } else if (request.action == 'statsAcComplete') {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", "https://tb.priceblink.com/stats.php?event=ac_complete&partnerid=0&retailer=" + request.rid + "&uid=" + uid + "&ac_savings=" + request.savings + "&ac_coupon_id=" + request.couponId + "&ac_clk_code=" + request.clkCode + "&ac_count=" + request.count + "&ac_time=" + request.time);
          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
             if (xhr.responseText != '') {
                var ac_complete_resp = JSON.parse(xhr.responseText);
                callback(ac_complete_resp);
             }else{
                callback();
             }
            }
          }
          xhr.send();
        } else if (request.action == 'setReviewStatus') {
          callUpdateReviewStatus(1);
        } else if (request.action == 'initAutoCoupons') {
          autoCouponsState[sender.tab.id] = {
            affiliateTabId: request.affiliateTabId,
            bestCoupon: -1,
            coupons: request.coupons,
            lastCoupon: -1,
            lastStage: 'total',
            startTime: request.startTime,
            totalBefore: request.total,
            total: request.total,
            prevCode: request.prevCode,
            type: request.type,
            totalIncreased: false,
          }
        } else if (request.action == 'applyNextCode') {
          if (autoCouponsState[sender.tab.id].lastStage !== 'interrupt') {
            autoCouponsState[sender.tab.id].lastCoupon += 1;
            autoCouponsState[sender.tab.id].lastStage = 'code';
          }
          try {
            callback();
          } catch (e) {
            if (e.message !== 'Attempting to use a disconnected port object') {
              throw e;
            }
          }
        } else if (request.action == 'evaluateCode') {
          if (autoCouponsState[sender.tab.id].lastStage !== 'interrupt') {
            if (request.total < autoCouponsState[sender.tab.id].total) {
              autoCouponsState[sender.tab.id].total = request.total;
              autoCouponsState[sender.tab.id].bestCoupon = autoCouponsState[sender.tab.id].lastCoupon;
            }else if((request.total == autoCouponsState[sender.tab.id].total)) {
              if(isPositiveInteger(autoCouponsState[sender.tab.id].bestCoupon)){
                autoCouponsState[sender.tab.id].total = request.total;
                autoCouponsState[sender.tab.id].bestCoupon = autoCouponsState[sender.tab.id].bestCoupon;
              }else{
                autoCouponsState[sender.tab.id].total = request.total;
                autoCouponsState[sender.tab.id].bestCoupon = autoCouponsState[sender.tab.id].lastCoupon;
              }              
            }
            if (request.total > autoCouponsState[sender.tab.id].totalBefore) {
              autoCouponsState[sender.tab.id].totalIncreased = true;
            }
            autoCouponsState[sender.tab.id].lastStage = 'total';
          }
          try {
            callback(autoCouponsState[sender.tab.id]);
          } catch (e) {
            if (e.message !== 'Attempting to use a disconnected port object') {
              throw e;
            }
          }
        } else if (request.action == 'endAutoCoupons') {
          autoCouponsState[sender.tab.id] = undefined;
        } else if (request.action == 'getAutoCouponsState') {
          callback(autoCouponsState[sender.tab.id]);
        } else if (request.action == 'interruptAutoCoupons') {
          if (autoCouponsState[sender.tab.id]) {
            autoCouponsState[sender.tab.id].lastStage = 'interrupt';
          }
        } else if (request.action == 'reviewClicked') {
            callUpdateReviewStatus(2);
        }
    }

}

// Saves retailer in localStorage as string
// Stored in the format of {"retailers":[{'id':1, 'dt':12345},{'id':2}]}
// A dt means temp disable while no dt means permanent disable
function disableRetailer(retailer) {
    allStorageGet(function (local) {
        var disabled_retailers = local.disabled_retailers;
        disabled_retailers[retailer.id] = retailer;
        allStorageSet({
            disabled_retailers: disabled_retailers
        });
        disabled_status = checkIfRetailerIsDisabled(retailer.id, disabled_retailers);
    });
}

// Restore coupons after a retailer has been disabled temporarily
var restoreRetailer = function (id) {
    allStorageGet(function (local) {
        var disabled_retailers = local.disabled_retailers;
        delete disabled_retailers[id];
        allStorageSet({
            disabled_retailers: disabled_retailers
        });
    });
}

function getCoupons(retailer, callback) {
    var interval = 1000 * 3;
    var usePreviousResults = false;
    function uniq(array) {
      return array.reduce(function(result, currentElement) {
        var found = result.find(function(el) {
          return el.code === currentElement.code;
        });

        return !found ? result.concat([currentElement]) : result;
      }, []);
    }

    function prepareRetailer(retailer, coupons) {
      retailer.codes = uniq(coupons.filter(function(coupon) {
        return coupon.code;
      })).map(function(coupon) {
        var urlParams = new URLSearchParams(coupon.url.match(/(\?.*)/)[1]);
        return {
          code: coupon.code,
          id: urlParams.get('c'),
          clkCode: urlParams.get('d')
        };
      });

      retailer.affiliateLink = coupons[0] ? coupons[0].url + "&type=ac" : undefined;
    }

    function prepareCallbackParams(coupons, disabled_retailers) {
        disabled_status = checkIfRetailerIsDisabled(retailer.id, disabled_retailers);
        prepareRetailer(retailer, coupons[0].coupons);
        return {
            coupons: coupons,
            retailer: retailer,
            promo: coupons.promo || {},
            disabled_status: disabled_status,
            coupon_code_xpath: universal_scrapes[0].coupon_code_xpath,
            coupon_code_exception_rids: universal_scrapes[0].coupon_code_exception_rids,
            coupon_overlay_xpath: universal_scrapes[0].coupon_overlay_xpath
        };
    }

    if (coupons[retailer.id] && coupons[retailer.id].dt && now() - coupons[retailer.id].dt < interval && coupons[retailer.id].coupons && coupons[retailer.id].coupons.length > 0) {
        console.warn('Get coupons call too frequent. Cancelled');
        usePreviousResults = true;
    }

    if (coupons[retailer.id]) {
      coupons[retailer.id].dt = now();
    } else {
      coupons[retailer.id] = {
        dt: now(),
      };
    }

    setTimeout(function () {
      coupons[retailer.id].dt = 0;
    }, interval);

    if (usePreviousResults) {
      allStorageGet(function (local) {
        callback(prepareCallbackParams(coupons[retailer.id].coupons, local.disabled_retailers));
      });
      return;
    }

    // Reset wishlist URL in case wishlist page action has been displayed on a product page. We don't want to cache
    // and have it display on a coupons page
    wishlist_url = null;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var resp = JSON.parse(xhr.responseText);
            coupons[retailer.id].coupons = resp;

            // This sets the global status
            allStorageGet(function (local) {
                // Split test 2, 3, and 4 cells let's stop processing - this doesn't work because for cell 2
                // we need to display the minimized toolbarrn;

                // For suggest a coupon link
                currently_active_tab_retailer_id = retailer.id;

                // Pass coupons and coupon overlay xpath to the content script
                callback(prepareCallbackParams(coupons[retailer.id].coupons, local.disabled_retailers));

                // Let's trigger the universal scrape after we get coupons
                browser.tabs.query({active: true}, function (tabs) {
                    var tab = tabs && tabs[0];
                    if (!tab) {
                        console.error('Cannot get current tab: ', tabs);
                        return;
                    }
                    browser.tabs.sendMessage(tab.id, {
                        action: "universalScrape",
                        data: universal_scrapes
                    }, function (response) {
                        if (response == undefined) return;
                        var url = "https://tb.priceblink.com/universal_scrapes.php?uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&rid=" + retailer.id + "&partnerid=0";
                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                // Do nothing here. We just need to make the request and the proper cookie will either get set or not.
                            }
                        }
                        xhr.open("GET", url, true);
                        xhr.send();
                    });
                });
            });
        }
    }

    xhr.open("GET", "https://tb.priceblink.com/coupons?rid=" + retailer.id + "&uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&partnerid=0&code=1", true);
    xhr.send();
}


function getPushCoupons(url, callback) {
    var r = getRetailer(url);
    if (r != null) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (resp != null) {
                    var resp = JSON.parse(xhr.responseText);
                    // Pass push coupons and user id to caller (typically early.js)
                    callback({hasPushCoupons: resp.hasPushCoupons, uid: uid});
                }
                else {
                    //This is for testing purposes only.
                    callback({hasPushCoupons: defaultHasPushCoupons, uid: '79252cdd-6c84-c686-8107-0c01f75bf9d3'});
                }
            }
        }
        xhr.open("GET", "https://tb.priceblink.com/pushCoupons?uid=" + uid + "&ver=" + ver, true);
        xhr.send();
    }
    else {
        //console.log("Not a PB enabled site");
        callback({hasPushCoupons: false, uid: uid});
    }
}

/*
 Let's get the lowest price as well as the current seller price
 */
function getAmazonSellerInfo(retailer, params, scraped_retailers_arr, callback, method) {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {

        if (xhr.readyState == 4) {

            var doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = DOMPurify.sanitize(xhr.responseText);

            // Build the offers array
            var offers = {};
            var rows = getXPathArray(doc, "//div[@id='olpOfferList']//div[contains(@class,'olpOffer')]");
            var row = rows.iterateNext();
            var rowObjects = [];

            // Append to the offers array
            while (row) {
                rowObjects.push(row);
                row = rows.iterateNext();
            }

            var price_xpath = "//span[contains(@class,'olpOfferPrice')]";
            var ship_xpath = "//p[contains(@class,'olpShippingInfo')]//b|//p[contains(@class,'olpShippingInfo')]//span[@class='olpShippingPrice']";
            var tax_xpath = "//p[contains(@class,'olpShippingInfo')]//span[@class='olpEstimatedTaxText']";
            var delivery_xpath = "//div[@id='promiseBullets']//li/span/text()[1]|//ul[contains(@class,'olpFastTrack')]/li[1]/span[not(contains(./a,'Shipping rates'))]";
            var rating_xpath = "//p[@class='a-spacing-small']/i/span/text()";
            var seller_xpath = "//h3//a";
            // This is for the Amazon seller logo
            seller_xpath += "|//h3/img/@alt"

            // This will match the current seller row
            var seller_url_xpath = "//h3//a[contains(@href,'" + params.sellerid + "')]/@href";

            var keep_processing = true;

            for (var i = 0; i < rowObjects.length; i++) {

                if (!keep_processing) break;

                var doc = document.implementation.createHTMLDocument();
                doc.body.appendChild(rowObjects[i]);

                var seller = getXPathString(doc, seller_xpath);
                var seller_url = getXPathString(doc, seller_url_xpath);
                var price = getXPathString(doc, price_xpath);
                var ship = getXPathString(doc, ship_xpath);
                var tax = getXPathString(doc, tax_xpath);
                var delivery = getXPathString(doc, delivery_xpath);
                var rating = getXPathString(doc, rating_xpath);

                // Lowest price seller
                if (i == 0) {

                    /*console.log("-- Lowest Seller --")
                     console.log("[PB] seller is: " + seller);
                     console.log("[PB] price is: " + price);
                     console.log("[PB] shipping is: " + ship);
                     console.log("[PB] tax is: " + tax);
                     console.log("[PB] delivery is: " + delivery);
                     console.log("[PB] rating is: " + rating);*/

                    scraped_retailers_arr.push({
                        name: "xx_" + seller,
                        url: "https://www.amazon.com",
                        price: price,
                        ship: ship,
                        title: "no title",
                        tax: tax,
                        delivery: delivery,
                        rating: rating
                    });

                  // Current price seller or Amazon is the current seller
                  // params.seller_id can be null from main page which would lead to a match so let's make sure we filter out that case
                  } else if ((params.sellerid != '' && seller_url != '') || (seller == 'Amazon.com' && params.sellerid == "ATVPDKIKX0DER")) {

                    /*console.log("-- Current Seller --")
                     console.log("[PB] seller is: " + seller);
                     console.log("[PB] price is: " + price);
                     console.log("[PB] shipping is: " + ship);
                     console.log("[PB] tax is: " + tax);
                     console.log("[PB] delivery is: " + delivery);
                     console.log("[PB] rating is: " + rating);*/

                    scraped_retailers_arr.push({
                        name: "xx_" + seller,
                        url: "https://www.amazon.com",
                        price: price,
                        ship: ship,
                        title: "no title",
                        tax: tax,
                        delivery: delivery,
                        rating: rating
                    });

                    keep_processing = false;

                }

            }

            postScrapedData(retailer, params, scraped_retailers_arr, callback, method);

        }

    }

    xhr.open("GET", unescape(params.seller_url), true);
    xhr.send();

}


function getAmazon(retailer, params, scraped_retailers_arr, callback, method) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = DOMPurify.sanitize(xhr.responseText);

            var href = BASE_AMAZON_URL + getXPathString(doc, universal_scrapes[0].a_asin_xpath);
            var price = getXPathString(doc, universal_scrapes[0].a_price_xpath);
            var title = getXPathString(doc, universal_scrapes[0].a_title_xpath);
            var name = "Amazon.com";

            // Don't set the URL unless a valid one exists
            if (href.length > BASE_AMAZON_URL.length)
                scraped_retailers_arr.push({name: name, url: href, price: price, title: title});

            postScrapedData(retailer, params, scraped_retailers_arr, callback, method);

        }
    }
    xhr.open("GET", unescape(params.am_url), true);
    xhr.send();
}

// 1 step scrape
function getGTIN(retailer, params, callback) {
    allStorageGet(function (local) {
        var url = (local.country === 'uk') ?
            "https://www.google.com/" : "https://www.google.com/";

        url += "search?tbm=shop&tbs=vw:l,new:1&q=" + params.search;
        debug_g_search_url = url;
        if(params.search == ''){ 
          // Do the 3rd party seller scrape else we do the normal scrape
          if (params.asin != undefined && params.asin != "") {
            getAmazonSellerInfo(retailer, params, [], callback, "No Scraped Data");
          } else {
            params.am_url ? getAmazon(retailer, params, [], callback, "No Scraped Data") : basicScrape(retailer, params, callback, "No Scraped Data");
          }
          return;
        }else{
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var doc = document.implementation.createHTMLDocument("");
                doc.documentElement.innerHTML = DOMPurify.sanitize(xhr.responseText);

                // This handles the case where there are no matching results
                // We don't want to proceed with any scrapes
                var no_results = getXPathString(doc, universal_scrapes[0].g_step1_no_results_xpath);
                if (parseInt(no_results)) {

                  // Do the 3rd party seller scrape else we do the normal scrape
                  if (params.asin != undefined && params.asin != "") {

                    getAmazonSellerInfo(retailer, params, [], callback, "Google 1 Step Scrape");

                  } else {

                    params.am_url ? getAmazon(retailer, params, [], callback, "Google 1 Step Scrape") : basicScrape(retailer, params, callback, "Google 1 Step Scrape");

                  }

                  return;

                }

                var href = getXPathString(doc, universal_scrapes[0].g_step1_href_xpath);
                var user_location = getXPathString(doc, "substring-after(//div[@class='sh-dr__restricts']//div[contains(., 'Your location')]/text()[normalize-space()], 'location: ')") || '';
                // There's no catalog link from above so let's grab from the search page
                if (href.length == 0) {
                    var urls = getXPathArray(doc, universal_scrapes[0].g_step1_url_xpath);
                    var node = urls.iterateNext();

                    // If there are no urls in the results then let's do a basic scrape
                    if (node == null) {

                      // Do the 3rd party seller scrape else we do the normal scrape
                      if (params.asin != undefined && params.asin != "") {

                        getAmazonSellerInfo(retailer, params, [], callback, "Google 1 Step Scrape");

                      } else {

                        params.am_url ? getAmazon(retailer, params, [], callback, "Google 1 Step Scrape") : basicScrape(retailer, params, callback,"Google 1 Step Scrape");

                      }

                      return;
                    }

                    var urls_arr = [];
                    while (node) {
                        var url = extractGURL(node.getAttribute("href"));
                        urls_arr.push(url);
                        node = urls.iterateNext();
                    }

                    var prices = getXPathArray(doc, universal_scrapes[0].g_step1_price_xpath);
                    var prices_arr = [];

                    var node = prices.iterateNext();
                    while (node) {
                        prices_arr.push(node.textContent);
                        node = prices.iterateNext();
                    }

                    // Getting cite node without hyperlink, which would be the reviews
                    var retailers = getXPathArray(doc, universal_scrapes[0].g_step1_retailer_xpath);
                    var retailers_arr = [];

                    var node = retailers.iterateNext();
                    while (node) {
                        retailers_arr.push(node.textContent);
                        node = retailers.iterateNext();
                    }

                    var titles = getXPathArray(doc, universal_scrapes[0].g_step1_title_xpath);
                    var titles_arr = [];

                    var node = titles.iterateNext();

                    while (node) {
                        titles_arr.push(node.textContent);
                        node = titles.iterateNext();
                    }

                    var ships = getXPathArray(doc, universal_scrapes[0].g_step1_ship_xpath);
                    var ships_arr = [];

                    var node = ships.iterateNext();
                    while (node) {
                        var ship = node.textContent;
                        ships_arr.push(ship);
                        node = ships.iterateNext();
                    }

                    var scraped_retailers_arr = [];
                    for (var i = 0; i < retailers_arr.length; i++) {
                        var obj = {
                            name: clean(retailers_arr[i]),
                            url: urls_arr[i],
                            price: clean(prices_arr[i]),
                            ship: clean(ships_arr[i]),
                            title: titles_arr[i]
                        };
                        scraped_retailers_arr.push(obj);
                    }


                    // Amazon 3rd party seller
                    if (params.asin != undefined && params.asin != "") {

                        getAmazonSellerInfo(retailer, params, scraped_retailers_arr, callback, "Google 1 Step Scrape");

                    } else if (params.am_url != "") {

                        getAmazon(retailer, params, scraped_retailers_arr, callback, "Google 1 Step Scrape");

                    } else {

                        postScrapedData(retailer, params, scraped_retailers_arr, callback, "Google 1 Step Scrape");

                    }

                } else {
                    // Let's go to the catalog page and get the retailers there
                    var id = href.split("product/")[1].split("?")[0];
                    getPrices(retailer, params, id,user_location, callback);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
      }
    });


}

// 2 step scrape
function getPrices(retailer, params, id,user_location, callback) {
    allStorageGet(function (local) {
         var url = universal_scrapes[0].g_prod_url;
         url = url.replace(/xxxxx/g,id);
         url = url.replace(/qqqqq/g,params.search);
         debug_g_prices_url = url;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var doc = document.implementation.createHTMLDocument("");
                doc.documentElement.innerHTML = DOMPurify.sanitize(xhr.responseText);

                var retailers_arr = [];
                var urls_arr = [];
                var prices_arr = [];
                var ships_arr = [];
                var taxes_arr = [];
                var totals_arr = [];

                var links = getXPathArray(doc, universal_scrapes[0].g_step2_href_xpath);
                var node = links.iterateNext();
                while (node) {
                    var href = node.getAttribute("href");
                    var retailer_name = node.textContent;
                    retailers_arr.push(retailer_name);
                    urls_arr.push(href);
                    node = links.iterateNext();
                }

                var prices = getXPathArray(doc, universal_scrapes[0].g_step2_price_xpath);
                var node = prices.iterateNext();
                while (node) {
                    var price = node.textContent;
                    prices_arr.push(price);
                    node = prices.iterateNext();
                }

                var totals = getXPathArray(doc, universal_scrapes[0].g_step2_total_price_xpath);
                var node = totals.iterateNext();
                while (node) {
                    var total = node.textContent;
                    totals_arr.push(total);
                    node = totals.iterateNext();
                }

                var i = 0;
                var ships = getXPathArray(doc, universal_scrapes[0].g_step2_ship_xpath);
                var node = ships.iterateNext();
                while (node) {
                    var ship = node.textContent;
                    var total = totals_arr[i];
                    i = i + 1;

                    if (clean(total).length == 0 && clean(ship).length == 0) {
                        ship = "plus shipping";
                    }

                    ships_arr.push(ship);
                    node = ships.iterateNext();
                }

                var taxes = getXPathArray(doc, universal_scrapes[0].g_step2_tax_xpath);
                var node = taxes.iterateNext();
                while (node) {
                    var tax = node.textContent;
                    taxes_arr.push(tax);
                    node = taxes.iterateNext();
                }

                // Get the main title listing
                var title = getXPathString(doc, universal_scrapes[0].g_step2_title_xpath);

                // Get the city/state for tax purposes
                var tax_location = user_location;
                tax_location = tax_location.split(",").reverse();
                var tax_state = (tax_location[0] && tax_location[0].trim()) || 'unknown';
                var tax_city = (tax_location[1] && tax_location[1].trim()) || 'unknown';

                // Now ship to server
                var scraped_retailers_arr = [];
                for (var i = 0; i < retailers_arr.length; i++) {
                    var obj = {
                        name: clean(retailers_arr[i]),
                        url: extractGURL(urls_arr[i]),
                        price: clean(prices_arr[i]),
                        ship: clean(ships_arr[i]),
                        tax: clean(taxes_arr[i]),
                        title: title,
                        city: tax_city,
                        state: tax_state
                    };
                    scraped_retailers_arr.push(obj);
                }

                // Amazon 3rd party seller
                if (params.asin != undefined && params.asin != "") {

                    getAmazonSellerInfo(retailer, params, scraped_retailers_arr, callback, "Google 2 Step Scrape");

                } else if (params.am_url != "") {

                    getAmazon(retailer, params, scraped_retailers_arr, callback, "Google 2 Step Scrape");

                } else {

                    postScrapedData(retailer, params, scraped_retailers_arr, callback, "Google 2 Step Scrape");

                }

            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    });
}

function basicScrape(retailer, params, callback, method) {
    postScrapedData(retailer, params, "", callback, method);
}

function postScrapedData(retailer, params, data, callback, method) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var results = JSON.parse(xhr.responseText);
            var end = new Date().getTime() - debug_start.getTime();
            callback({
                retailer: retailer,
                products: results,
                debug: {
                    "method": method,
                    "search_url": debug_g_search_url,
                    "prices_url": debug_g_prices_url,
                    "time": end
                }
            });
        }
    }

    var cur_url = "https://tb.priceblink.com/get_prices.php?n=" + new Date().getMilliseconds() + "&browser=" + currentBrowserType + "&partnerid=0";

    if (debugExtensionID != "") {
        browser.runtime.sendMessage(debugExtensionID, {
            extension: 'PriceBlink',
            get_prices: cur_url,
            data: data,
            token: params.token,
            params: debug_params,
            retailer: retailer
        })
    }
    var bg_source = method.replace(/[^0-9]/g,'');
    xhr.open("POST", cur_url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("retailers=" + encodeURIComponent(JSON.stringify(data)).replace(/'/g, "%27").replace(/"/g, "%22") + "&token=" + params.token + "&bg_source=" + bg_source + "&tax=1");
}

function extractGURL(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });

    // adurl exists
    if (!(undefined == vars["adurl"])) {
        // adurl is empty
        if(vars["adurl"] == "") {
            return url;
        // adurl exists so let's return it
        } else {
            return vars["adurl"];
        }
    }

    return url;
}

// Matches retailer based on URL
function getRetailer(url) {
    url = "/" + url.split("/")[2];

    for (var i = 0; i < retailers.length; i++) {
        var index = url.indexOf("/" + retailers[i].url);
        if (index != -1) {
            return retailers[i];
        }
        index = url.indexOf("." + retailers[i].url);
        if (index != -1) {
            return retailers[i];
        }
    }
    return null;
}

// For coupon injection functionality
// return an array of supported retailers
var getRetailerIdsForMultipleURLs = function (urls) {
    var arr = [];
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        var r = checkRetailerExistsInParser(url);
        if (r != null) {
            // If retailer already exists in array then don't add it
            var exists = false;
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].name == r.name) {
                    exists = true;
                    break;
                }
            }

            if (!exists)
                arr.push(r.id);
        }
    }
    return arr;
}

// Based on url let's see if the retailer exists in our parser
function checkRetailerExistsInParser(url) {
    url = "/" + url.split("/")[2];
    for (var i = 0; i < retailers.length; i++) {
        var index = url.indexOf("/" + retailers[i].url);
        if (index != -1) {
            return retailers[i];
        }
        index = url.indexOf("." + retailers[i].url);
        if (index != -1) {
            return retailers[i];
        }
    }
    return null;
}

var checkIfRetailerIsDisabled = function (id, disabled_retailers) {
    var retailer = disabled_retailers[id];
    if (retailer) {
        if (!retailer.dt) {
            return PERM_DISABLED;
        }
        var offset = 1 * 60 * 60 * 1000; // 1 hour
        var nowDT = new Date().getTime();
        var disabledDT = parseInt(retailer.dt);

        if (disabledDT + offset < nowDT) {
            restoreRetailer(id);
            return NOT_DISABLED;
        } else {
            return TEMP_DISABLED_NO_PRICE_COMP;
        }
    } else {
        return NOT_DISABLED;
    }
}

function getRetailerByUrl(url, callback) {
  var retailer = getRetailer(url);
  if(!retailer){
    callback(null);
    return;
  }
  getRetailerByUrl_step2(retailer.id, callback);
}

function getRetailerByUrl_step2(rid, callback){
   if (!rid) {
    callback(null);
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      try {
        var retailer = JSON.parse(xhr.responseText)[0];
        callback(retailer);
      }
      catch (e) {
        callback(null);
      }
    }
  }
  xhr.open("GET", "https://tb.priceblink.com/retailer.php?uid=" + uid + "&browser=" + currentBrowserType + "&ver=" + ver + "&partnerid=0&rid=" + rid + "&auto_coupon_support=1", true);
  xhr.send();
}

function getRetailerSID(id , callback) {
    getRetailerByUrl_step2(id, callback);
}

function getRetailerByID(id) {
    for (var i = 0; i < retailers.length; i++) {
        if (retailers[i].id == id) {
            return retailers[i];
        }
    }
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function setUid(query) {
    alert(query);
    alert(localStorage.uid);
}

// Called from coupons popup and passed to content script
function enableCouponsForRetailer(retailer) {
    browser.tabs.query({active: true}, function (tabs) {
        var tab = tabs && tabs[0];
        if (!tab) {
            console.error('Cannot get current tab: ', tabs);
            return;
        }
        restoreRetailer(retailer.id);
        browser.tabs.sendMessage(tab.id, {action: "turnCouponsBackOn"}, null);
        disabled_status = NOT_DISABLED;
    });
}

function getXPathString(doc, xpath) {
    if (xpath == undefined || xpath == "") return "";
    var xpath = "normalize-space(" + xpath + ")";
    var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
    return clean(result.stringValue);
}

function getXPathArray(doc, xpath) {
    if (xpath == undefined || xpath == "") return "";
    var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
    return result;
}
// Trip spaces and remove html entities
function clean(str) {
    return str ? str.replace(/&nbsp;/g, '').replace(/&amp;/g, '').replace(/^\s+|\s+$/g, "") : '';
}

function callUpdateReviewStatus(status) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://tb.priceblink.com/surveys/updateReviewStatus.php?partnerid=0&datauid=" + uid + "&dataval=" + status, true);
  xhr.send();
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function getSettings(callback) {
    var country               = localStorage.getItem('country').replace(/[^a-zA-Z ]/g, "");
    var currency              = (country =='uk') ? "&pound;" : "$";
    var coupon_text           = (country =='uk') ? "voucher" : "coupon";
    var settings              = {currency:currency, coupon_text:coupon_text};
    callback(settings);
}

// Listen for any messages
browser.runtime.onMessage.addListener(wrapRequest);

// Tab change event to set wishlist_url
browser.tabs.onActivated.addListener(function (tab) {

    // Don't do anything for Chrome URLs and reset globals for toolbar button
    browser.tabs.get(tab.tabId, function (tab) {
        if (tab.url.indexOf("chrome://") == 0) {
            currently_active_tab_retailer_id = null;
            wishlist_url = null;
            return;
        }

        // Get wishlist URL
        browser.tabs.sendMessage(tab.id, {action: "getWishlistURL"}, function (response) {
            if (response == undefined) return;

            // We have a server-provided wishlist url
            if (response.url != null) {
                wishlist_url = response.url;
                // No server-provided wishlist url so let's build one from the page url
            } else {
                browser.tabs.sendMessage(tab.id, {action: "getPageURL"}, function (response) {
                    wishlist_url = response.url;

                });
            }

            // Handle the suggest a coupon global retailer id
            if (response.retailer != null)
                currently_active_tab_retailer_id = response.retailer.id;
            else
                currently_active_tab_retailer_id = null;
        });
    });
});

// Look for afsrc on all link clicks so we can suppress our toolbar
browser.webRequest.onBeforeRequest.addListener(function (details) {
    if (details.frameId === 0) {
        // Let's only proceed when resource type is main frame
        if (details.type == "main_frame") {
            var suppressTabUrl = details.initiator?details.initiator:details.url;
            /**
             * If the current tab url is from priceblink.com, do not suppress it. We add the tab id to a special array
             */
            if (details.url.indexOf(urlExemptedFromSuppression) >= 0) {
                tabIdsExemptedFromSuppression.push(details.tabId);
            } else {
                var exempted = tabIdsExemptedFromSuppression.find(function (tabId) {
                    return tabId === details.tabId;
                });
                if (!exempted) {
                    // console.log('this is to suppress tab: ', details);
                    suppressedTabId = details.tabId;
                    suppressedTabHost.push(suppressTabUrl);
                    suppressedTab_sup_url.push(details.url);
                    suppressedTabTimeStamp = now();
                }
            }
        }
    }
}, {urls: ["*://*/*afsrc=1*", "*://www.jdoqocy.com/*", "*://www.kqzyfj.com/*", "*://www.tkqlhce.com/*", "*://www.anrdoezrs.net/*", "*://www.dpbolvw.net/*", "*://www.apmebf.com/*", "*://www.commission-junction.com/*", "*://www.qksrv.net/*", "*://www.qksz.net/*", "*://www.afcyhf.com/*", "*://www.awltovhc.com/*", "*://www.ftjcfx.com/*", "*://www.lduhtrp.net/*", "*://www.tqlkg.com/*", "*://www.awxibrm.com/*", "*://www.cualbr.com/*", "*://www.rnsfpw.net/*", "*://www.vofzpwh.com/*", "*://www.yceml.net/*", "*://www.emjcd.com/*", "*://www.cj.com/*", "*://affiliate.rakuten.com/*", "*://*.linksynergy.com/*"]});

/**
 * After a tab is `complete` loading, remove this tab id from `tabIdsExemptedFromSuppression`.
 * So that if the user goes to some other retailer that should be suppressed, we do not exempt it.
 */
browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo && changeInfo.status === 'complete') {
        browser.tabs.get(tabId, function (tab) {
            if (tab && tab.url &&tab.url.indexOf(urlExemptedFromSuppression) < 0
                && tab.url.indexOf('about:blank') < 0) {
                var tabIndex = tabIdsExemptedFromSuppression.findIndex(function (id) {
                    return id === tabId;
                });
                if (tabIndex >= 0) {
                    tabIdsExemptedFromSuppression.splice(tabIndex, 1);
                }
            }
        });
    }if(changeInfo.url) {
        browser.tabs.sendMessage(tabId, { action: 'urlUpdated', url:changeInfo.url });
    }
});


function getProductsData(retailer,params,page_url,callback){
    // Reset the debug vars
    debug_g_search_url = "";
    debug_g_prices_url = "";
    debug_start = new Date();
    debug_params = params;
    var url = "https://tb.priceblink.com/products?";
    url += "rid=" + retailer.id;
    url += "&title=" + escape(params.title);
    url += "&price=" + escape(params.price);
    url += "&model=" + escape(params.model);
    url += "&mpn=" + escape(params.mpn); // Need to address from asana task
    url += "&brand=" + escape(params.brand);
    url += "&upc=" + escape(params.upc);
    url += "&sku=" + escape(params.sku);
    url += "&isbn=" + escape(params.isbn);
    url += "&ship=" + escape(params.ship);
    url += "&rating=" + escape(params.rating);
    url += "&in_stock=" + escape(params.in_stock);
    url += "&c1=" + escape(params.c1);
    url += "&c2=" + escape(params.c2);
    url += "&c3=" + escape(params.c3);
    url += "&c4=" + escape(params.c4);
    url += "&c5=" + escape(params.c5);
    url += "&uid=" + uid;
    url += "&ver=" + ver;
    url += "&page_url=" + escape(page_url);
    url += "&browser=" + currentBrowserType + "&step=1&tax=1&partnerid=0";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {

            var results = JSON.parse(xhr.responseText);

            // This means there's an immediate data response with no scrape info
            if (results.token == undefined) {

                callback({
                    retailer: retailer,
                    products: results,
                    debug: {
                        "method": "Instant Response",
                        "search_url": "",
                        "prices_url": "",
                        "time": new Date().getTime() - debug_start.getTime()
                    }
                });

            } else {

                // Amazon 3rd party seller logic
                if (params.asin != undefined && params.asin != "") {

                    //console.log("---------------------------------------------------------------------------------");

                    //console.log("[PB] ASIN is: " + params.asin)
                    //console.log("[PB] Seller is: " + params.sellerid)

                    var seller_url = "https://www.amazon.com/gp/offer-listing/" + params.asin + "/ref=olp_sort_tax?ie=UTF8&f_new=true&sort=taxsip";
                    //console.log("[PB] URL template is: " + seller_url);

                    getGTIN(retailer, {
                        "search": results.search,
                        "token": results.token,
                        "am_url": results.search1,
                        "asin": params.asin,
                        "sellerid": params.sellerid,
                        "seller_url": seller_url
                    }, callback);

                    // Standard path
                } else {

                    getGTIN(retailer, {
                        "search": results.search,
                        "token": results.token,
                        "am_url": results.search1
                    }, callback);

                }

            }
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

function isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
}
