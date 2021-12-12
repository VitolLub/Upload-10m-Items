if (chrome) {
    var browser = chrome;
}
var DEBUG = ('no' === 'yes');
var debug_info = {};

var retailer_id = 0;
var coupons = [];
var current_retailer;
var disabled_status = 0;
var promo = {};
var wishlist_url = "https://www.priceblink.com/webcpns/addwishlistitem.php";
var iframe_url = DEBUG ? "www.priceblink.com/iframe3/" : "www.priceblink.com/iframe3/";
// Permanently disabled
var is_hidden = false;
// Temporarily disabled for 1 hour
var is_minimized = false;
// Temporarily disabled for 24 hours and no price comp either
var is_minimized_24 = false;
var is_hide_iframe = false;
var products = [];
var NOT_DISABLED = 0;
var TEMP_DISABLED = 1;
var PERM_DISABLED = 2;
var TEMP_DISABLED_NO_PRICE_COMP = 3;
var disable_type = NOT_DISABLED;
var openPopup = true;

// For coupon overlays and sent as part of universal scrape
var coupon_overlay_xpath = "";
var coupon_code_count = 0;
// We don't want to expand coupons in these cases
var coupon_code_exception_rids = [];

var toolbarHeight = 36;

var scrape_interval;
var scrapeState;
var extension_id = browser.i18n.getMessage('@@extension_id');
var settings  = {currency:'$', coupon_text:'coupon'};
var domConfig = { 
                  ALLOW_UNKNOWN_PROTOCOLS: true,  
                  ADD_TAGS: ['iframe','link'],  
                  ADD_ATTR: ['enable-background','allow', 'allowfullscreen', 'frameborder', 'scrolling'], 
                  USE_PROFILES: {html: true,svg: true, svgFilters: true}, 
                  FORCE_BODY: true  
                };

function allStorageSet(items, callback) {
  var storage = (browser.storage || {}).local;
  var fn = (typeof callback === 'function') ? callback : (function () {});
  if (typeof items === 'object') {
    storage && storage.set(items, fn);
    var keys = Object.keys(items);
    keys.forEach(function (key) {
      localStorage.setItem(key, JSON.stringify(items[key]));
    });
  }
}

function allStorageGet(callback, key) {
  var storage = (browser.storage || {}).local;
  var fn = (typeof callback === 'function') ? callback : (function () {});

  function parseLocalStorage() {
    var merged = {};
    for (var i = 0; i < localStorage.length; i++) {
      try {
        merged[localStorage.key(i)] = JSON.parse(localStorage.getItem(localStorage.key(i)));
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
      fn(key ? local[key] : local);
    });
  } else {
    var merged = parseLocalStorage();
    fn(key ? merged[key] : merged);
  }
}

function getSiteSpecificClass() {
    return 'pb-retailer-' + window.location.hostname.replace('www.', '').replace(/\./g, '-');
}

var siteSpecificClass = getSiteSpecificClass();

// Kick off the process
init();

function init() {
    var url = document.location.href;
    if (document.location.protocol == "https:")
        iframe_url = "https://" + iframe_url;
    else
        iframe_url = "https://" + iframe_url;

    if (url.indexOf(".dell.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getCoupons',
            url: document.location.href,
            retailer_id: getDell()
        }, setCoupons);
    }else if (url.indexOf("secure-www.gap.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://www.gap.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("secure-oldnavy.gap.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://oldnavy.gap.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("secure-bananarepublic.gap.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://bananarepublic.gap.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("secure-athleta.gap.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://athleta.gap.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("secure-hillcity.gap.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://hillcity.gap.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf(".onepeloton.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://onepeloton.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf(".gator.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://hostgator.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("buy.norton.com/estore/checkOutV2/CartV3/true/Lifelock/true") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://lifelock.com',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("buy.norton.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://us.norton.com/',
            caller: 'main'
        }, setCoupons);
    }else if (url.indexOf("coreldraw.com") != -1) {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: 'https://corel.com/',
            caller: 'main'
        }, setCoupons);
    } else {
        browser.runtime.sendMessage({
            action: 'getRetailer',
            url: document.location.href,
            caller: 'main'
        }, setCoupons);
    }

    browser.runtime.sendMessage({
      action: 'getSettings',
      url: document.location.href
    }, setSettings);

    browser.runtime.sendMessage({
      action: 'getSuppressedRetailer',
      url: document.location.href
    }, checkSuppression);

    // Listen for the minimize event to temporarily disable toolbar
    var minimizeListener = function (evt) {
        var dt = new Date();

        // Minimize for 24 hours
        dt = new Date(dt.getTime() + (24 * 60 * 60 * 1000));
        browser.runtime.sendMessage({
            action: 'disableCoupons',
            url: document.location.href,
            retailer: {id: current_retailer.id, dt: dt.getTime()}});

        // Shift the page back to top
        eraseSpaceForToolbar();
    }
    document.addEventListener("pb1_Minimize_Event", minimizeListener, false, true);

    // Listen for retailer disable events to permanently disable toolbar
    var disableListener = function (evt) {
        eraseSpaceForToolbar();
        browser.runtime.sendMessage({
            action: 'disableCoupons',
            url: document.location.href,
            retailer: {id: current_retailer.id}
        });
    }
    window.addEventListener("pb1_Disable_Event", disableListener, false, true);

    // Listen for toolbar restore event after being temporarily disabled
    var restoreListener = function (evt) {
        browser.runtime.sendMessage({action: 'restoreCoupons', url: document.location.href, retailer_id: current_retailer.id});
    }
    window.addEventListener("pb1_Restore_Event", restoreListener, false, true);

    // Listen for toolbar highlighted retailer event
    var highlightListener = function (evt) {
        browser.runtime.sendMessage({action: 'highlightRetailer', url: document.location.href, coupons: coupons});
    }
    document.addEventListener("pb1_Highlight_Event", highlightListener, false, true);
    document.addEventListener("pb1_Open_Options_Event", function (evt) {
        browser.runtime.sendMessage({action: 'openOptionsPage', url: document.location.href});
    }, false, true);
    document.addEventListener("pb1_OpenUrl_Event", function (e) {
      const url = e.detail.replace('openUrl', '');
      browser.runtime.sendMessage({
        action: 'openUrl',
        url: url,
      });
    }, false, true);
}

function eraseSpaceForToolbar() {
    var htmlNode = document.body.parentNode;
    htmlNode.style.removeProperty("margin-top");
}

function injectSpaceForToolbar() {
    var htmlNode = document.body.parentNode;
    htmlNode.style.setProperty("margin-top", "36px", "important");
}

function getXPathContent(xpath) {
    if (xpath == undefined || xpath == "") return "";

    var xpath = "normalize-space(" + xpath + ")";
    var doc = document;
    var result = doc.evaluate(xpath, doc, null, XPathResult.ANY_TYPE, null);
    return clean(result.stringValue);
}

function setSettings(data){
  settings = data;
}

function setCoupons(obj) {
    if (!obj) return;
    coupons = obj.coupons;
    disabled_status = obj.disabled_status;
    current_retailer = obj.retailer;
    promo = obj.promo;
    coupon_overlay_xpath = obj.coupon_overlay_xpath;

    if(current_retailer && document.querySelector('#checkout_reduction_code, #checkout_discount_code') && document.querySelector('.payment-due__price')){
      current_retailer.coupon_input_selector = '#checkout_reduction_code, #checkout_discount_code';
      current_retailer.total_price_selector = '.payment-due__price';
      if(!current_retailer.ac_apply_function){
        current_retailer.ac_apply_function = 'apply_shopify';
      }       
    }

    if (obj.disabled_status == TEMP_DISABLED)
        is_minimized = true;
    else if (obj.disabled_status == PERM_DISABLED)
        is_hidden = true;
    else if (obj.disabled_status == TEMP_DISABLED_NO_PRICE_COMP)
        is_minimized_24 = true;

    coupon_code_xpath = obj.coupon_code_xpath;
    coupon_code_exception_rids = obj.coupon_code_exception_rids.rids;
    browser.runtime.sendMessage({ action: 'getAutoCouponsState', url: document.location.href }, function(state) {
        if (state && state.type =='P') {
            openPopup = false;
            postMessage({ action: 'applyCodes', retailer: current_retailer }, '*');
        }
        if (state && state.type =='N') {
            openPopup = false;
            postMessage({ action: 'autoApplyCodes', retailer: current_retailer }, '*');
        }
    })
    beginParse();

    // Added 10/11/12 for displaying coupons inline for G
    // Also fires price comparison when new search is issued under instant search
    if (document.location.href.indexOf("www.google.com") != -1) {

        var g_interval = null;
        var url = document.location.href;

        // This is for when the first search happens directly from a link or omnibox
        setTimeout(injectCoupons, 1000);

        g_interval = setInterval(function () {
            if (url != document.location.href) {
                // URL has changed so let's display our coupons,
                // but let's make sure they don't already exist
                // Set the url to new one
                url = document.location.href;

                // We introduce a delay in certain cases where instant results happen too fast
                setTimeout(beginInjection, 1000);
            } else {
                // URL hasn't changed
            }

        }, 500);
    }
}

function beginInjection() {
    // This means the iframe exists so we need to remove it
    if (document.getElementById("undefined")) {
        document.body.removeChild(document.getElementById("undefined"));
        var styles = document.getElementsByTagName('link');
        for (var i = 0; i < styles.length; i++) {
            if (styles[i].href.indexOf("iframe3/css/toolbar-injected.css") > -1) {
                styles[i].parentNode.removeChild(styles[i]);
                break;
            }
        }
    }

    injectCoupons();

    // Kick off the scrape
    beginParse();
}

function injectCoupons() {
    if (coupon_overlay_xpath == "") return;

    var result = document.evaluate(coupon_overlay_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var urls = [];

    // No scrape results
    if (result.snapshotLength == 0) return;

    // Grab the links from the page
    for (var i = 0; i < result.snapshotLength; i++) {
        var node = result.snapshotItem(i);
        var url = node.getAttribute("href");

        // This is necessary because of encoded url redirects
        url = url.split("//");
        url = "http://" + url[url.length - 1];

        urls.push(url);
    }

    // Pass the urls to the background and find out what's supported
    browser.runtime.sendMessage({action: 'getCouponsForMultipleURLs', url: document.location.href, urls: urls}, function (obj) {
        var r = obj.coupons;
        var result = document.evaluate(coupon_overlay_xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        injectCSS("coupon_overlay.css");

        // Loop through the results again and find matches based on supported coupon retailers
        for (var i = 0; i < result.snapshotLength; i++) {
            var node = result.snapshotItem(i);
            var url = node.getAttribute("href");
            url = url.split("//");
            url = "http://" + url[url.length - 1];

            for (var j = 0; j < r.length; j++) {
                if (doUrlsMatch(url, r[j].domain)) {
                    var div = document.createElement("div");
                    var span = document.createElement("span");
                    span.innerHTML = DOMPurify.sanitize(r[j].short_label);
                    span.setAttribute("class", "pb-coupon-overlay");

                    // This is a relative url
                    if (node.getAttribute("href").indexOf("/") == 0)
                        div.setAttribute("onClick", "location.href='" + r[j].link_prefix + escape("http://" + document.URL.split("/")[2] + node.getAttribute("href")) + "'");
                    else
                        div.setAttribute("onClick", "location.href='" + r[j].link_prefix + escape(node.getAttribute("href")) + "'");

                    div.setAttribute("class", "pb-coupon-div");
                    div.setAttribute("title", r[j].label + "\n" + r[j].restrictions + "\n\nTo get this discount, click this button and then look for the coupon in the PriceBlink bar.");
                    div.appendChild(span);

                    // Put it right next to the hyperlink
                    node.parentNode.appendChild(div);
                }
            }
        }
    });
}

// Based on url let's see if the retailer exists in our parser
function doUrlsMatch(page_url, parser_url) {
    page_url = "/" + page_url.split("/")[2];

    var index = page_url.indexOf("/" + parser_url);

    if (index != -1) {
        return true;
    }

    index = page_url.indexOf("." + parser_url);

    if (index != -1) {
        return true;
    }

    return false;
}

function setProducts(obj) {
    if((obj.products[0].addtowishlist)){
        if(obj.retailer.observerFunction){
            scrapeState = true;
             //passing scrapeAgain function here, if product page not reloads
             new Function(obj.retailer.observerFunction)();             
            }       
    }
    // We made the call but we don't have any alternatives to offer. Need to make sure there are no coupons as well.
    if ((obj.products[0].retailers == undefined || obj.products[0].retailers.length == 0) && (coupons[0].coupons.length == 0 || is_hidden))
        return;
    products = obj.products;
    current_retailer = obj.retailer;

    debug_info = obj.debug;

    injectPopup(injectScript);
}

function beginParse() {
    var r = current_retailer;
    checkOrderConfirmation(current_retailer);
    // Params object
    var params = {};

    // Setup the scrape functions
    var title = new Function(r.title)();
    params.title = title;
    var s_title = title.replace(/_~_/g,'');
    // No title scrape so show coupons
    if (s_title == '' && !is_hidden && (coupons[0].coupons.length > 0 || (coupons[0].users_coupons != null && coupons[0].users_coupons.length > 0))) {
        injectPopup(injectScript);
        return;
    }
    scrapeFunction(r,params);

    var s_sku = params.sku.replace(/_~_/g,'');
    var s_mpn = params.mpn.replace(/_~_/g,'');
    var s_model = params.model.replace(/_~_/g,'');
    var s_upc = params.upc.replace(/_~_/g,'');
    var s_isbn = params.isbn.replace(/_~_/g,'');

    // We're doing the SE functionality for Amazon results in GS
    if ((document.URL.indexOf("www.google.com/shopping") > -1) || (document.URL.indexOf("www.google.co.uk/shopping") > -1)) {
        scrapeGS(params.upc, params.c3, params.c4, params.title, params.sku, params);
    }
    // Get the products from the catalog
    else if (s_title  != '' && (s_sku  != '' || s_mpn != '' || s_model != '' || s_upc != '' || s_isbn != '')) {
        //browser.runtime.sendMessage({action: 'getProducts', params: params}, setProducts);
        browser.runtime.sendMessage({action: 'step1', params: params,retailer:current_retailer, url: document.location.href}, setProducts);
        // Just in case we accidentally grab a title and slip through the logic above
    } else if (!is_hidden && (coupons[0].coupons.length > 0 || (coupons[0].users_coupons != null && coupons[0].users_coupons.length > 0))) {
        injectPopup(injectScript);
    }
}

function scrapeFunction(r,params){
    // Let's grab the asin for Amazon pages
    var asin = "";
    var sellerid = "";
    if (document.location.href.match(/https?:\/\/([a-z0-9]+[.])*amazon[.]com/g)) {

      asin = getXPathContent("//input[@id='ASIN' and @type='hidden']/@value");
      params.asin = asin;

      sellerid = getXPathContent("//input[@id='merchantID' and @type='hidden']/@value");
      params.sellerid = sellerid;

    }

    var price = "";
    if (r.price != undefined) {
        price = new Function(r.price)().replace('$', '').replace(',', '');
        params.price = price;
    } else {
        params.price = "";
    }

    var mpn = "";
    if (r.mpn != undefined) {
        mpn = new Function(r.mpn)();
        params.mpn = mpn;
    } else {
        params.mpn = "";
    }

    var model = "";
    if (r.model != undefined) {
        model = new Function(r.model)();
        params.model = model;
    } else {
        params.model = "";
    }

    var brand = "";
    if (r.brand != undefined) {
        brand = new Function(r.brand)();
        params.brand = brand;
    } else {
        params.brand = "";
    }

    var sku = "";
    if (r.sku != undefined) {
        sku = new Function(r.sku)();
        params.sku = sku;
    } else {
        params.sku = "";
    }

    var upc = "";
    if (r.upc != undefined) {
        upc = new Function(r.upc)();
        params.upc = upc;
    } else {
        params.upc = "";
    }

    var isbn = "";
    if (r.isbn != undefined) {
        isbn = new Function(r.isbn)();
        params.isbn = isbn;
    } else {
        params.isbn = "";
    }

    var ship = "";
    if (r.ship != undefined) {
        ship = new Function(r.ship)();
        params.ship = ship;
    } else {
        params.ship = "";
    }

    var rating = "";
    if (r.rating != undefined) {
        rating = new Function(r.rating)();
        params.rating = rating;
    } else {
        params.rating = "";
    }

    var in_stock = "";
    if (r.in_stock != undefined) {
        in_stock = new Function(r.in_stock)();
        params.in_stock = in_stock;
    } else {
        params.in_stock = "";
    }

    var c1 = "";
    if (r.c1 != undefined) {
        c1 = new Function(r.c1)();
        params.c1 = c1;
    } else {
        params.c1 = "";
    }

    var c2 = "";
    if (r.c2 != undefined) {
        c2 = new Function(r.c2)();
        params.c2 = c2;
    } else {
        params.c2 = "";
    }

    var c3 = "";
    if (r.c3 != undefined) {
        c3 = new Function(r.c3)();
        params.c3 = c3;
    } else {
        params.c3 = "";
    }

    var c4 = "";
    if (r.c4 != undefined) {
        c4 = new Function(r.c4)();
        params.c4 = c4;
    } else {
        params.c4 = "";
    }

    var c5 = "";
    if (r.c5 != undefined) {
        c5 = new Function(r.c5)();
        params.c5 = c5;
    } else {
        params.c5 = "";
    }

    return params;
}

var scrapeGS = function (upc, details_link, loc, title, sku, g_param) {
    var s_upc = upc.replace(/_~_/g,'');
    // UPC isn't here so let's grab details link
    if (s_upc  == "") {
        // Check for the details link and follow
        if (details_link != "") {
            var iframe = document.createElement("iframe");
            iframe.id = "gs-iframe";
            iframe.style.visibility = "hidden";
            iframe.style.display = "none";

            iframe.addEventListener("load", function (event) {
                var doc = iframe.contentDocument;
                var new_upc = current_retailer.upc.replace("return getXPathContent(\"", "").replace("\")", "");
                var result = doc.evaluate("normalize-space(" + new_upc + ")", doc, null, XPathResult.ANY_TYPE, null);
                var params = {
                    rid: current_retailer.id,
                    upc: result.stringValue,
                    c3: loc,
                    title: title,
                    price: "",
                    model: "",
                    mpn: g_param.mpn,
                    brand: g_param.brand,
                    sku: sku,
                    isbn: g_param.isbn,
                    ship: "",
                    rating: "",
                    in_stock: "",
                    c1: "",
                    c2: "",
                    c4: "",
                    c5: ""
                };
                browser.runtime.sendMessage({action: 'step1', params: params,retailer:current_retailer, url: document.location.href}, setProducts);
                document.body.removeChild(document.getElementById("gs-iframe"));
            });

            iframe.src = unescape(details_link);
            document.body.appendChild(iframe);
        }
        // Case where UPC is on main page
    } else {
        var params = {
            rid: current_retailer.id,
            upc: upc,
            c3: loc,
            title: title,
            price: "",
            model: "",
            mpn: g_param.mpn,
            brand: g_param.brand,
            sku: sku,
            isbn: g_param.isbn,
            ship: "",
            rating: "",
            in_stock: "",
            c1: "",
            c2: "",
            c4: "",
            c5: ""
        };
        browser.runtime.sendMessage({action: 'step1', params: params,retailer:current_retailer, url: document.location.href}, setProducts);
    }
}

var injectScript = function () {

    const pb_autocoupon = 'pb_autocoupon'+current_retailer.id;    
    if(localStorage.hasOwnProperty(pb_autocoupon)){
     try {
      const new_pb_autocoupon = JSON.parse(localStorage.getItem(pb_autocoupon));
      const affiliateTabId = new_pb_autocoupon.ih_affiliateTabId
      // closes new tab, opened after autocoupon process completed on page reload case.
      if(affiliateTabId){
        browser.runtime.sendMessage({ autocoupons: true, removeTabId: affiliateTabId });
        delete new_pb_autocoupon.ih_affiliateTabId;
        allStorageSet({[pb_autocoupon]: new_pb_autocoupon});   
      }
     } catch (e) { }          
    }

    // Test to see if we can auto-expand the coupons drop-down on a checkout page
    if (coupons && coupons[0].coupons.length > 0) {
        function checkSelector(selector) {
          try {
            return !!document.querySelector(selector);
          } catch (e) {
              try{
               if($(selector) && $(selector).length > 0){
                  return true;
                 }else{
                  return false;
                }
              }catch (e) {
                return false;
              }            
          }
        }

        function isCheckoutRegularPage() {
          return parseInt(getXPathContent(coupon_code_xpath)) > 0;
        }

        function isCheckoutAutoCouponPage(current_retailer) {
          var inputFound = checkSelector(current_retailer.coupon_input_selector);
          var submitFound = checkSelector(current_retailer.coupon_submit_selector);
          var cartPageElementFound = checkSelector(current_retailer.ac_cart_page_check_selector);
          var totalFound = checkSelector(current_retailer.total_price_selector);
          var cartStatus = true;
          if(current_retailer.ac_cartstatus){
            cartStatus = new Function(current_retailer.ac_cartstatus)();
          }else{
            cartStatus = true;
          }
          var result = (inputFound || submitFound || cartPageElementFound) && totalFound && cartStatus;
          
          if (result) {
            postMessage({ action: 'startAutocoupons', retailer: current_retailer }, '*');
          }
          return result;
        }

        function isAutoCouponPage(current_retailer) {
          return !!current_retailer.coupon_input_selector;
        }

        function isCheckoutPage(current_retailer) {
          return isAutoCouponPage(current_retailer) ?
            isCheckoutAutoCouponPage(current_retailer) :
            isCheckoutRegularPage();
        }

        var checkoutPage = isCheckoutPage(current_retailer);
        var ac_observer_target = document.body;
        if(current_retailer.ac_observer_target){
            var ac_observer_target = new Function(current_retailer.ac_observer_target)();
        }        
        if (!checkoutPage) {
          var continued = false;
          var observerCallback = function(mutationsList) {
            checkoutPage = isCheckoutPage(current_retailer);
            if (checkoutPage) {
              if (!continued) {
                continueProcess();
                observer.disconnect();
              }
              continued = true;
            }
          };
          var observer = new MutationObserver(observerCallback);
          observer.observe(ac_observer_target, { childList: true, subtree: true });
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
        };
        
        var h = 1;
        var t = document.documentElement;
          var ob = new MutationObserver(debounce(function() {
            var l = document.querySelector("#priceblink-container");
             if(t.childNodes[t.childNodes.length - 1] !== l && h > 0 ){
                h--;
                t.removeChild(l);
                t.appendChild(l);
             }
        }, 500));
          ob.observe(t, { attributes: !1, childList: !0, subtree: !1 });

        continueProcess();

        function continueProcess()  {
          // Don't auto-expand coupons on checkout page for this site
          for (var i = 0; i < coupon_code_exception_rids.length; i++) {
            if (current_retailer.id == coupon_code_exception_rids[i]) {
                checkoutPage = false;
                break;
            }
          }

          var localStorageKey;
          var offset;
          var codes; 
          if (checkoutPage) {
              if(coupons && coupons[0].coupons && coupons[0].coupons.length > 0) {
                coupons[0].maximized = 'true';
                codes = uniq(coupons[0].coupons.filter(function(coupon) {
                    return coupon.code;
                  }).map(function(coupon) {
                    return coupon.code;
                  }));
              }
              coupons[0].isAutoCoupons = isAutoCouponPage(current_retailer) && codes && codes.length > 0;
              localStorageKey = 'checkout_expanded_at' + current_retailer.id;
              if(isAutoCouponPage(current_retailer) && codes && codes.length > 0){
                offset = 3 * 60 * 1000; // 3 min
              }else{
                offset = 15 * 60 * 1000; // 15 min
              }

              if(localStorage.hasOwnProperty('pb_autocoupon'+current_retailer.id)){
               try {
               const local_pb_autocoupon = JSON.parse(localStorage.getItem('pb_autocoupon'+current_retailer.id));
               var nowtime = new Date().getTime();
               var savingpopup = local_pb_autocoupon.savingpopup;
               var showRatings = local_pb_autocoupon.showRatings;
               var savingpopup_time = local_pb_autocoupon.savingpopup_time;
               var savingpopupType = local_pb_autocoupon.savingpopupType;
               if(savingpopup == '1' && nowtime < savingpopup_time){
                openPopup = false;
                const bestCode = local_pb_autocoupon.mBestCode;
                const totalBefore = local_pb_autocoupon.ih_totalBefore;
                const totalAfter = local_pb_autocoupon.ih_totalAfter;
                if(savingpopupType == '1'){                    
                  injectAutoCouponsPopup('ac-savings', function() {
                      if(showRatings == '1'){
                        showRatingsMsg();
                      }
                      postMessage({
                        action: 'updateCode',
                        code: bestCode,
                      }, '*');

                      postMessage({
                        action: 'updateSavings',
                        savings: settings.currency + numberWithCommas((totalBefore - totalAfter).toFixed(2)),
                        without: settings.currency + numberWithCommas(Number.parseFloat(totalBefore).toFixed(2)),
                        with: settings.currency + numberWithCommas(Number.parseFloat(totalAfter).toFixed(2)),
                      }, '*');
                    });
                }else if(savingpopupType == '2'){
                   injectAutoCouponsPopup('ac-no-coupons');
                }else if(savingpopupType == '3'){
                   injectAutoCouponsPopup('ac-no-coupons', function() {
                     document.querySelector('#priceblink-ac-container #ac-title').innerHTML = DOMPurify.sanitize('Oops!!! Something went wrong, looks like we have increased your price in the cart. If so, please try entering your '+settings.coupon_text+' again.'); 
                    });
                }else{
                  injectAutoCouponsPopup('ac-no-coupons');
                }
               }
               } catch (e) { }
             }              
          }else {
            localStorageKey = 'checkout_expanded_at' + current_retailer.id;
            offset = 15 * 60 * 1000; // 60 min
          }

            allStorageGet(function (local) {
                var now = new Date().getTime();
                //for checkout autocoupon prompt
                if (!local[localStorageKey]) {
                    // Already expanded but let's check when                
                    coupons[0].show_coupon_apply = 'true';
                    if(checkoutPage && !coupons[0].isAutoCoupons){
                        coupons[0].auto_expand = 'true';           
                        allStorageSet({[localStorageKey]: now});
                    }
                } else {
                    var then = parseInt(local[localStorageKey]);                   
                    // Timer has expired so expand and reset
                    if (then + offset < now) {
                        coupons[0].show_coupon_apply = 'true';
                        if(checkoutPage && !coupons[0].isAutoCoupons){
                            coupons[0].auto_expand = 'true'; 
                            allStorageSet({[localStorageKey]: now});
                        }
                    }else{
                        coupons[0].show_coupon_apply = 'false';
                        coupons[0].auto_expand = 'false'; 
                    }
                }
            inject();
          });
         }
        } else {
          inject();
        }
        function inject() {
          // Escape single quotes and double escape double quotes
          if (coupons[0]) {
            coupons[0].disabled_status = disabled_status;
          }
          var cstr = JSON.stringify(coupons).replace(/'/g, "\\'").replace(/\"/g, "\\\"");
          var script = document.createElement("script");
          script.type = "text/javascript";

          if (coupons && openPopup && coupons[0].maximized === 'true' && coupons[0].show_coupon_apply === 'true' && coupons[0].isAutoCoupons) {           
            openPopup = false;
            browser.runtime.sendMessage({ action: 'statsAcPrompt', rid: current_retailer.id, url: document.location.href });
            var codes = uniq(coupons[0].coupons.filter(function(coupon) {
                    return coupon.code;
                  }).map(function(coupon) {
                    return coupon.code;
                  }));
            if (codes.length === 1) {
              var couponsText = jsUcfirst(settings.coupon_text+' found!');
              var couponsApplyText = jsUcfirst('Apply ' + settings.coupon_text);
            } else {
              var couponsText = jsUcfirst(settings.coupon_text+'s found!');
              var couponsApplyText = jsUcfirst('Apply ' + settings.coupon_text+'s');
            }
            document.querySelector("#priceblink-container #priceblink-auto-coupons #pb-coupon-count").innerHTML = codes.length;
            document.querySelector("#priceblink-container #priceblink-auto-coupons #pb-coupon-message").innerHTML = couponsText;
            document.querySelector("#priceblink-container #priceblink-auto-coupons .apply-button").innerHTML = couponsApplyText;
            window.document.querySelector("#priceblink-container #priceblink-auto-coupons .apply-button").addEventListener("click", applyCodes);
            window.document.querySelector("#priceblink-container #priceblink-auto-coupons .pb-close").addEventListener("click", hidePopup);
            selectPopup('priceblink-auto-coupons');
          }

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.text = "window.addEventListener('message', pb1_receiveMessage, false);function pb1_receiveMessage(e){var pb1_iframe=document.getElementById('pb1_iframe');var pb1_div=document.getElementById('pb1_div');if(e.data=='highlight'){var e = document.createEvent('Events');e.initEvent('pb1_Highlight_Event', true, false);document.dispatchEvent(e);} else if(e.data=='options'){var e = document.createEvent('Events');e.initEvent('pb1_Open_Options_Event', true, false);document.dispatchEvent(e);} else if(e.data=='maximize'){pb1_iframe.style.height=pb1_div.style.height='100%';}else if(e.data=='minimize'){pb1_iframe.style.height=pb1_div.style.height='36px';}else if(e.data=='close'){document.body.className=document.body.className.replace('priceblink-body " + siteSpecificClass + "', '');pb1_disable();var e = document.createEvent('Events');e.initEvent('pb1_Minimize_Event', true, false);document.dispatchEvent(e);}else if(e.data=='restore'){var e = document.createEvent('Events');e.initEvent('pb1_Restore_Event', true, false);document.dispatchEvent(e);document.location.reload(true);}else if(e.data=='hide'){document.body.className=document.body.className.replace('priceblink-body " + siteSpecificClass + "', '');pb1_div.style.display='none';var e = document.createEvent('Events');e.initEvent('pb1_Disable_Event', true, false);document.dispatchEvent(e);}else if(e.data && ('' + e.data).indexOf('openUrl') === 0) {var ev = new CustomEvent('pb1_OpenUrl_Event', {detail: e.data});document.dispatchEvent(ev);}}function pb1_disable(){pb1_iframe.src='" + iframe_url + "toolbar_minimized.html';document.getElementById('pb1_div').style.width='25px'}";
            document.getElementsByTagName("head").item(0).appendChild(script);
            
            if(!openPopup){
                if(document.querySelector('#pb1_div')){
                    document.querySelector('#pb1_div').remove();
                }
               var body = document.body;
               if(body.parentNode.style.getPropertyValue("margin-top") == '36px'){
                body.parentNode.style.setProperty("margin-top", "0px", "important");
               }            
            }else if (!is_minimized && !is_minimized_24) {
                injectSpaceForToolbar();
                injectCSS('toolbar-injected.css');
            }

            // Don't shift the page if the toolbar is minimized
            if (!is_minimized || (products.length > 0 && products[0].retailers != undefined)) {
                if (!is_minimized_24) { // For split test
                    // We may already have bumped with the early injection
                    if (document.body.className.indexOf("priceblink-body") == -1)
                        document.body.className += " priceblink-body " + siteSpecificClass;
                }
            }
            injectIframe();
        }    
}

// Append the stylesheet to the document
var injectCSS = function (stylesheet) {

    // First check to make sure the CSS doesn't already exist
    var css_exists = false;

    // Loop through CSS
    var styles = document.getElementsByTagName('link');
    for (var i = 0; i < styles.length; i++) {
        if (styles[i].href.indexOf("iframe/css/" + stylesheet) != -1) {
            css_exists = true;
            break;
        }
    }

    // CSS doesn't exist so create it
    if (!css_exists) {
        var css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.href = iframe_url + "css/" + stylesheet;
        document.getElementsByTagName("head").item(0).appendChild(css);
    }
}

var injectIframe = function () {
    if(document.querySelector('#pb1_div')){
        return;
    }
    if(!openPopup && products.length == 0) return;

    var iframe = document.createElement("iframe");
    var div = document.createElement("div");
    var isInIH = ('PriceBlink' === 'InvisibleHand');

    var htmlUrl = iframe_url;
    // In cases where the iframe is minimized but we're doing a products comparison we need to display the full toolbar
    if (is_minimized && products.length > 0 && products[0].retailers != undefined) {
        if(isInIH) {
            iframe.src = htmlUrl + "toolbar.html?tax=1&partnerid=0";
        } else {
            iframe.src = htmlUrl + "toolbar.html?tax=1";
        }
        iframe.width = "100%";
        iframe.style.left = 0;
        div.style.width = "100%";
        // Display minimized iframe
    } else if (is_minimized || is_minimized_24) {
        if(isInIH) {
            iframe.src = htmlUrl + "toolbar_minimized.html?tax=1&partnerid=0";
        } else {
            iframe.src = htmlUrl + "toolbar_minimized.html?tax=1";
        }
        iframe.width = "25px";
        div.style.width = "25px";
        eraseSpaceForToolbar();
        // Display full iframe
    } else {
        if(isInIH) {
            iframe.src = htmlUrl + "toolbar.html?tax=1&partnerid=0";
        } else {
            iframe.src = htmlUrl + "toolbar.html?tax=1";
        }
        iframe.width = "100%";
        iframe.style.left = 0;
        div.style.width = "100%";
    }

    div.id = "pb1_div";
    div.style.height = "36px";
    div.style.cssFloat = "right";
    div.style.position = "fixed";
    div.style.top = 0;
    div.style.right = 0;
    div.style.zIndex = "1000000";

    iframe.height = "36px";
    iframe.id = "pb1_iframe";
    iframe.border = "none";
    iframe.frameBorder = "0";
    iframe.scrolling = "no";
    iframe.style.display = "block";
    //iframe.style.position = "fixed";
    iframe.style.height = "36px";
    //iframe.style.top = 0;
    //iframe.style.right = 0;
    iframe.style.border = "none";
    //iframe.style.zIndex = "1000000";

    div.appendChild(iframe);
    document.querySelector('html').insertBefore(div, document.body);

    iframe.onload = function () {
        // If the toolbar is minimized and we're not on a products page don't do anything
        if (is_minimized && products.length == 0) return;
        inject();

        function inject() {
          // Escape single quotes and double escape double quotes
          if (coupons[0]) {
            coupons[0].disabled_status = disabled_status;
          }
          var cstr = JSON.stringify(coupons).replace(/'/g, "\\'").replace(/\"/g, "\\\"");
          var script = document.createElement("script");
          script.type = "text/javascript";

          // Display coupons only
          if (products.length == 0) {
            script.text = "var pb1_iframe=document.getElementById('pb1_iframe');pb1_iframe.contentWindow.postMessage('" + cstr + "', '*');";
          } else {
            // Display coupons and products
            var pstr = JSON.stringify(products).replace(/'/g, "\\'").replace(/\"/g, "\\\"");
            script.text = "var pb1_iframe=document.getElementById('pb1_iframe');pb1_iframe.contentWindow.postMessage('" + cstr + "|||" + pstr + "', '*');";
          }

          var head = document.getElementsByTagName("head").item(0);
          head.appendChild(script);
          head.removeChild(script);
        }

    }

    if (DEBUG) {
        return;
        var div = document.createElement("div");
        var str = "<strong>Time: " + debug_info.time + "ms</strong><br />";
        str += "<strong>Method: " + debug_info.method + "</strong>"
        str += "<br /><a href='" + debug_info.search_url + "' target='_blank'>" + debug_info.search_url + "</a>";
        str += "<br /><a href='" + debug_info.prices_url + "' target='_blank'>" + debug_info.prices_url + "</a>";
        str += "<br /><br />";

        var retailers = products[0].retailers;

        for (var i = 0; i < retailers.length; i++) {
            str += "<strong>" + retailers[i].retailer_name + " | " + retailers[i].price + "</strong> -- ";
            str += "<a href='" + retailers[i].url + "' target='_blank'>" + retailers[i].url + "</a>";
            str += "<hr />";
        }

        div.innerHTML = DOMPurify.sanitize(str);

        document.body.insertBefore(div, document.body.firstChild);
    }

}

function selectPopup(id) {
    isPopupMinimized = false;
    ['priceblink-auto-coupons'].forEach(function(item) {
      if (item === id) {
        updateDisplay(item, 'flex');
      } else {
        updateDisplay(item, 'none')
      }
    });
   var popup = document.getElementById('priceblink-container');
   popup.style.height = 'auto';
    popup.style.width  =  'auto';
     popup.style.opacity = 1;
    popup.style.visibility = 'visible';
    popup.style.zIndex = 2147483647;
}

function updateDisplay(id, displayValue) {
    var el = document.querySelector('#priceblink-container #' + id);
    el.style.display = displayValue;
}

function jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function applyCodes() {
    window.document.querySelector('#priceblink-container #priceblink-auto-coupons .apply-button').removeEventListener("click", applyCodes);   
    postMessage({ action: 'autoApplyCodes' }, '*');
}

function removePopup() {
    var popup = document.getElementById('priceblink-container');
    popup.style.opacity = 0;
    popup.style.visibility = 'hidden';
    popup.style.zIndex = -1;
}

// Trip spaces and remove html entities
function clean(str) {
    return str.replace(/&nbsp;/g, '').replace(/&amp;/g, '').replace(/[^\x00-\x7F]/g, "").replace(/^\s+|\s+$/g, "");
}

// Determine Home or SMB
function getDell() {
    var xpath = "//META[@name='SEGMENT']/@content";
    var result = getXPathContent(xpath);

    if (result == 'dhs' || result == 'gen') {
        return 8;
    } else if (result == 'bsd') {
        return 36;
    } else {
        return null;
    }
}

function calcChecksum(upc) {
    upc = upc.split('');
    var esum = Number(upc[1]) + Number(upc[3]) + Number(upc[5]) + Number(upc[7]) + Number(upc[9]);
    var osum = Number(upc[0]) + Number(upc[2]) + Number(upc[4]) + Number(upc[6]) + Number(upc[8]) + Number(upc[10]);
    var sum = esum + 3 * osum;

    sum = sum % 10;

    if (sum == 0)
        return 0;
    else
        return (10 - sum);
}

// Listen for messages from background
function onRequest(request, sender, callback) {
    // Sent from background page, but initiated from coupons_popup after coupons are turned back on
    if (request.action == "turnCouponsBackOn") {
        is_hidden = false;
        beginParse();
        // Sent from background, but initiated from coupons_popup to retrieve the "View All Coupons" link depending on selected tab
    } else if (request.action == "getViewAllCouponsLink") {
        var c = coupons[0].coupons;
        callback({url: c[c.length - 1].url});
        // Look for notifications right after we get coupons
    } else if (request.action == "universalScrape") {
        var count = getXPathContent(request.data[0].order_confirmation_xpath);
        if (count > 0) {
            callback(request);
        }
        // Need page URL for universal wishlist browser action
    } else if (request.action == "getPageURL") {
        var current_page_title = escape(getXPathContent("//title"));
        callback({
            url: wishlist_url + "?title=" + current_page_title + "&itemurl=" + escape(document.location.href),
            retailer: current_retailer
        });
    } else if (request.action == "getWishlistURL") {

        // Handle the case where there's not a scrape supported site
        if (products.length == 0)
            callback({url: null, retailer: current_retailer});
        else
            callback({
                url: products[0].addtowishlist + "&itemurl=" + escape(document.location.href),
                retailer: current_retailer
            });

    } else if (request.action == "getRetailer") {
        callback({retailer: current_retailer});
    } else if(request.action == 'urlUpdated'){
        rerunParse(current_retailer, request.url);
        setTimeout(function() {
         checkOrderConfirmation(current_retailer);
        }, 2000);
    }else if(request.action == 'getNavigationType'){
      callback({type: performance.navigation.type});
    }
}
browser.runtime.onMessage.addListener(onRequest);

// Vanilla implementation of Event Delegation
// http://bdadam.com/blog/plain-javascript-event-delegation.html
function eventOn(elSelector, eventName, selector, fn) {
    var element = document.querySelector(elSelector);

    element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;

        for (var i = 0, l = possibleTargets.length; i < l; i++) {
            var el = target;
            var p = possibleTargets[i];

            while(el && el !== element) {
                if (el === p) {
                    return fn.call(p, event);
                }

                el = el.parentNode;
            }
        }
    });
}

// https://www.adorama.com/l/Lenses/Canon~DSLR-Cinema-Lenses
// Make sure that clicking `ADD TO CART` will make the popup window at the correct position.
eventOn('html', 'click', 'body.pb-retailer-adorama-com .button.add-to-cart', function() {
    console.log('clicked');
    var i = 0;
    var body = document.body;
    var timer = setInterval(function() {
        var $popup = document.querySelector(
            'body.priceblink-body.pb-retailer-adorama-com .popup800 .popupBorder'
        );
        if ($popup) {
            $popup.setAttribute('style', 'top: ' + (50 + body.scrollTop) + 'px');
            clearInterval(timer);
        }
        if (i++ > 50) {
            clearInterval(timer);
        }
    }, 100);
});

function scrapeAgain(){
  var r = current_retailer;
  var params = {};
  var title = new Function(r.title)();
  params.title = title;
  var s_title = title.replace(/_~_/g,'');
  params.rid = r.id;
  if (s_title == '' && !is_hidden && (coupons[0].coupons.length > 0 || (coupons[0].users_coupons != null && coupons[0].users_coupons.length > 0))) {
    products = [];
    if(document.querySelector('#pb1_div')){
        document.querySelector('#pb1_div').remove();
    }
    injectPopup(injectScript);
    return;
  }
  scrapeFunction(r,params);
    var s_sku = params.sku.replace(/_~_/g,'');
    var s_mpn = params.mpn.replace(/_~_/g,'');
    var s_model = params.model.replace(/_~_/g,'');
    var s_upc = params.upc.replace(/_~_/g,'');
    var s_isbn = params.isbn.replace(/_~_/g,'');
    if (s_title != '' && (s_sku != '' || s_mpn != '' || s_model != '' || s_upc != '' || s_isbn != '')) {
       browser.runtime.sendMessage({action: 'scrapeAgain', params: params,retailer:current_retailer, url: document.location.href}, setScrapeAgain);
        // Just in case we accidentally grab a title and slip through the logic above
    } else if (!is_hidden && (coupons[0].coupons.length > 0 || (coupons[0].users_coupons != null && coupons[0].users_coupons.length > 0))) {
        products = [];
        if(document.querySelector('#pb1_div')){
            document.querySelector('#pb1_div').remove();
        }
        injectPopup(injectScript);
    }else{
        if(document.querySelector('#pb1_div')){
            document.querySelector('#pb1_div').remove();
        }
    }
}

function setScrapeAgain(obj){
    if(scrapeState != true){
        return;
    }
   if ((obj.products[0].retailers == undefined || obj.products[0].retailers.length == 0) && (coupons[0].coupons.length == 0 || is_hidden)){
      if(document.querySelector('#pb1_div')){
        document.querySelector('#pb1_div').remove();
      } 
      return;
   }else{
    products = obj.products;
    current_retailer = obj.retailer;
    debug_info = obj.debug;
    if(document.querySelector('#pb1_div')){
        document.querySelector('#pb1_div').remove();
    }
    injectPopup(injectScript);
   }
}

// looking for url change in certain websites and rerun scrappe
function rerunParse(current_retailer, updated_url){
  if(current_retailer && current_retailer.metadata ){
    const metadata = JSON.parse(current_retailer.metadata);
    const rerun_parse_observer = metadata.rerun_parse_observer;
    const nonValidURL_regex = metadata.nonValidurl_regex;
    if(nonValidURL_regex && nonValidURL_regex!= ''){
        var regex = new RegExp(nonValidURL_regex,"g");
        if (updated_url.match(regex)) { 
            return;
        }
    }
    if(rerun_parse_observer && rerun_parse_observer!= ''){
        var o_title = '';
        var scrapeCounter = 0;
        scrapeState = false;
        if(document.querySelector('#pb1_div')){
            document.querySelector('#pb1_div').remove();
        }        
        function checkAndScrape(){
            scrapeCounter++;
            o_title = new Function(current_retailer.title)();            
            if(scrapeCounter == '1' && o_title ==''){
                scrapeAgain();
            }else if(o_title != ''){
                clearInterval(scrape_interval);
                scrapeAgain();
                scrapeState = true;
            }else if(scrapeCounter > 10){
                clearInterval(scrape_interval);
            }                   
        }

        var observer = new MutationObserver(function(mutations) {            
            if (current_retailer.title != undefined) {
                window.clearInterval(scrape_interval);
                scrape_interval = window.setInterval(checkAndScrape, 1000);
            }
            observer.disconnect();     
        });

        var config = { childList: true };
        if(current_retailer.id == '10'){
            config = { attributes :true, subtree: true, childList: true };
        }
        observer.observe(document.body, config);        
    }    
  }
}

function checkSuppression(data){
  if(data){
    for (var key in data) {
      var suppressedUrl = data[key].url;
          if(window.location.href.indexOf(suppressedUrl) != -1){
            browser.runtime.sendMessage({
              action: 'getSupRetailer',
              url: document.location.href,
              caller: 'main'
        }, checkOrderConfirmation);
      }
    }
  }
}

function checkOrderConfirmation(current_retailer){
  if(current_retailer && current_retailer.order_complete){
    var expression = current_retailer.order_complete;
    var regex = new RegExp(expression,"i");
    var t = window.location.href;
    if (t.match(regex)) {
     browser.runtime.sendMessage({action: 'order_complete',rid:current_retailer.id, url: document.location.href});
    }
  }  
}

function injectAutoCouponsPopup(popupName, onload) {
  var acContainer = document.getElementById('priceblink-ac-container');
  if (acContainer) {
    acContainer.remove();
  }
  injectPopupScripts();
  injectPopupStyles();

  getFileContent('html/' + popupName + '.html', function(responseText) {
    acContainer = document.createElement('div');
    acContainer.id = 'priceblink-ac-container';
    acContainer.innerHTML = DOMPurify.sanitize(responseText, domConfig);

    acContainer.style = `
      background-color: rgba(0, 0, 0, 0.2) !important;
      height: 100% !important;
      left: 0 !important;
      opacity: 1 !important;
      position: fixed !important;
      top: 0 !important;
      width: 100% !important;
      z-index: 2147483647 !important;
    `

    addListenerscoupons(acContainer, popupName);

    var doc2 = document.documentElement || document.body;
    doc2.appendChild(acContainer);
    onload && onload();

    var now = new Date().getTime();
    if(localStorage.hasOwnProperty('pb_autocoupon'+current_retailer.id)){   
      try {   
        const new_ih_ac_key = JSON.parse(localStorage.getItem('pb_autocoupon'+current_retailer.id));
        new_ih_ac_key.savingpopup = 0;
        new_ih_ac_key.savingpopup_time = now;
        allStorageSet({['pb_autocoupon'+current_retailer.id]: new_ih_ac_key });
      } catch (e) { }
    }
  });
}

function addListenerscoupons(node, popupName) {
  node.querySelector('#ac-close-icon') &&
    node.querySelector('#ac-close-icon').addEventListener('click', closePopup);
   node.querySelector('#ac-button') &&
      node.querySelector('#ac-button').addEventListener('click', closePopup);
}

function injectPopup(onload) {
          injectPopupScripts();
          injectPopupStyles();

          getFileContent('html/popup.html', function(responseText) {
            var popupContainer = document.getElementById('priceblink-container');
            if(!popupContainer){            
              var popupContainer = document.createElement('div');
              popupContainer.id = 'priceblink-container';
              popupContainer.innerHTML = DOMPurify.sanitize(responseText, domConfig);

              // we may need a full list of css default values
              popupContainer.style = `
                border-radius: 10px !important;
                box-shadow: 1px 1px 5px #aaaaaa !important;
                display: block !important;
                overflow: hidden !important;
                position: fixed !important;
                right: 20px !important;
                top: 20px !important;
                visibility: hidden !important;
                z-index: -1 !important;
                border: none !important;
                opacity: 0 !important;
                bottom: auto !important;
              `
            }
            popupContainer.addEventListener('click', function(e) {
              e.stopPropagation();
            });

            function isAutoCoupons() {
              var el = document.getElementById('priceblink-auto-coupons');
              var style = getComputedStyle(el);
              return style.display !== 'none';
            }

            window.addEventListener('click', function(e) {
              if (e.isTrusted && !isAutoCoupons()) {
                popupContainer.style.opacity = 0;
                popupContainer.style.visibility = 'hidden';
                popupContainer.style.zIndex = -1;
              }
            });
            var docu = document.documentElement || document.body;
            docu.appendChild(popupContainer);
            setTimeout(function() {
              onload && onload();
            }, 125);
          });

}

var scriptsInjected = false;

function injectPopupScripts() {
  if (!scriptsInjected) {
    var scripts = ['js/ac.js'];
    scripts.forEach(injectpopScript);
    scriptsInjected = true;
  }
}

function injectpopScript(path) {
  getFileContent(path, function(responseText) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.text = responseText;
    document.getElementsByTagName("head").item(0).appendChild(script);
  });
}

var stylesInjected = false;

function injectPopupStyles() {
  if (!stylesInjected) {
    var styles = [
      'css/ac-popup.css',
      'fonts/bootstrap-icons.css'
    ];
    styles.forEach(injectStyle);
    stylesInjected = true;
  }
}

function injectStyle(path) {
  getFileContent(path, function(responseText) {
    var style = document.createElement("style");
    style.innerHTML = responseText;
    document.getElementsByTagName("head").item(0).appendChild(style);
  });
}

function getFileContent(path, callback) {
  var url = browser.runtime.getURL(path);
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("load", function() {
    localizeHtmlPage(this.responseText,callback);    
  });
  xhr.open("GET", url);
  xhr.send();
}

function localizeHtmlPage(text,callback){
  var valNewH = text.replace(/\{\{ extension_id \}\}/g, extension_id);
  Object.keys(settings).forEach(function(key) {
     valNewH = valNewH.replace(/__MSG_(\w+)__/g, function(match, key)
      {
          return settings[key];
      });
  });
  callback(valNewH);
}

function numberWithCommas(x) {
  var parts = x.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function uniq(array) {
  return array.reduce(function(result, currentElement) {
    if (result.indexOf(currentElement) < 0) {
      return result.concat([currentElement]);
    }
    return result;
  }, []);
}

function showRatingsMsg(){
    return;
  var elements = window.document.querySelectorAll('#priceblink-ac-container #ac-savings');
    if (elements.length > 0) {
        var rating_msg = window.document.querySelector("#priceblink-ac-container #ac-savings #rating_msg");
        rating_msg.parentElement.style.removeProperty("display");
        rating_msg.innerHTML = DOMPurify.sanitize('Mind writing a quick review? It helps keep PriceBlink free.');
                var rating_msg_checkout =window.document.querySelector("#priceblink-ac-container #ac-savings #rating_msg_checkout");
        rating_msg_checkout.style.removeProperty("display");
        rating_msg_checkout.innerHTML = DOMPurify.sanitize('Review PriceBlink');
        window.document.querySelector("#priceblink-ac-container #ac-savings #ac-button").addEventListener("click", closePopup);
        window.document.querySelector("#priceblink-ac-container #ac-savings #rating_msg_checkout").addEventListener("click", function(){
         window.open('https://chrome.google.com/webstore/detail/priceblink-coupons-and-pr/aoiidodopnnhiflaflbfeblnojefhigh/reviews', '_blank');
         closePopup();
         browser.runtime.sendMessage({ action: 'reviewClicked', url: document.location.href });
        });
    }
}

function hidePopup(){
    var popup = document.getElementById('priceblink-container');
    popup.style.opacity = 0;
    popup.style.visibility = 'hidden';
    popup.style.zIndex = -1;
    openPopup = true;
}

function closePopup() {
  document.getElementById('priceblink-ac-container').remove();
}

function handlePopupMessage(e) {
   if(!e.data) return;
  var popup = document.getElementById('priceblink-container');
  if (e.data.action == 'closePopup') {
    popup.style.opacity = 0;
    popup.style.visibility = 'hidden';
    popup.style.zIndex = -1;
  } else if (e.data.action == 'showRatings') {
    showRatingsMsg();
  }  
}

window.addEventListener("message", handlePopupMessage);