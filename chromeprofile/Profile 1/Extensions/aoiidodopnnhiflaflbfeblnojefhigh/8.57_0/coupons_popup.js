if (chrome) {
  var browser = chrome;
}
var NOT_DISABLED = 0;
var PERM_DISABLED = 2;
var currently_active_tab_retailer_id;
var bg;

var isInIH = ('PriceBlink' === 'InvisibleHand');

function allStorageGet(callback, key) {
  var storage = (browser.storage || {}).sync;
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

function init() {
  allStorageGet(function (local) {
    var country = local.country;
    bg = browser.extension.getBackgroundPage();
    currently_active_tab_retailer_id = bg.currently_active_tab_retailer_id;

    // UK users don't get the wishlist just yet
    if(country == "uk") {
      document.getElementById("add-to-wishlist").className = "hide";
      document.getElementById("go-to-wishlist").className = "hide";
      // Show add/go to wishlist
    } else {
      document.getElementById("add-to-wishlist").style.className = "show";
      document.getElementById("go-to-wishlist").style.className = "show";
      document.getElementById("go-to-wishlist").addEventListener('click', function() {
        browser.tabs.create({url: "http://www.priceblink.com/webcpns/wishlist.php"});
      });
      browser.runtime.sendMessage({action: 'getWishListURL', url: 'coupons_popup.html', rid: currently_active_tab_retailer_id}, setWishListLink);
    }

    // Setup suggest a coupon link
    var suggest_link = null;

    if(currently_active_tab_retailer_id != null)
      suggest_link = "http://www.priceblink.com/coupons-codes/suggest/" + currently_active_tab_retailer_id + "?utm_source=icon&submit_coupon=true&uid=" + bg.uid;

    document.getElementById("suggest-a-coupon").addEventListener('click', function() {
      // Existing merchant
      if(suggest_link != null) {
        browser.tabs.create({url: suggest_link});
      }
    });

    // If eBay let's remove the link
    var eBayIDs = [730, 4368, 7783, 20877, 32257];
    if (currently_active_tab_retailer_id == null || eBayIDs.includes(currently_active_tab_retailer_id)) {
      document.getElementById("suggest-a-coupon").style.display = "none";
    }

    // Coupons toggling - only do on merchants where we have coupons
    var toggle_coupons = document.querySelector("#toggle-coupons");
    if(currently_active_tab_retailer_id != null) {
      toggle_coupons.className = "show";
      if(bg.disabled_status == PERM_DISABLED) {
        document.querySelector("#toggle-coupons-text").innerHTML = "on";
        toggle_coupons.addEventListener('click', enableCoupons);
      } else {
        document.querySelector("#toggle-coupons-text").innerHTML = "off";
        toggle_coupons.addEventListener('click', disableCoupons);
      }
    } else {
      toggle_coupons.className = "hide";
    }

    document.getElementById("need-help").addEventListener('click', function() {
      browser.tabs.create({url: "https://www.priceblink.com/webcpns/page.php?sp_id=4"});
    });

    /*document.getElementById("submit-product-search").addEventListener('click', function() {
      var q = document.getElementById("product-search").value;
      browser.tabs.create({url: "https://www.priceblink.com/webcpns/search_products.php?q="+q+"&uid="+bg.uid});
    });*/

    // Maybe use in the future
    //chrome.extension.sendRequest({action: 'getCouponsForSelected'}, setViewAllLink);
  });
}

function setViewAllLink(obj) {
  var url1 = '<a href="' + obj.url + '" target="_blank">' + str1 + '</a>';
  document.getElementById("priceblink-popup-view").innerHTML = url1;
}

function setWishListLink(obj) {
  // No wishlist URL is available
  if(!obj || !obj.url) {
    document.getElementById("add-to-wishlist").style.display = "none";
  } else {
    document.getElementById("add-to-wishlist").style.display = "block";
    var wishlist = document.querySelector("#add-to-wishlist");
    wishlist.addEventListener('click', function() {
      browser.tabs.create({url: obj.url});
    });
  }
}

// If coupons are enabled for a merchant let's turn them off
function disableCoupons() {
  var current_retailer = bg.getRetailerByID(currently_active_tab_retailer_id);
  browser.runtime.sendMessage({action: "disableCoupons", retailer: current_retailer, url: 'coupons_popup.html'});
  browser.tabs.reload();
  // Not sure why, but need to add setTimeout for FireFox.
  setTimeout(function () {
    window.close();
  });
}

// If coupons are disabled for a merchant let's turn them on
function enableCoupons() {
  var current_retailer = bg.getRetailerByID(currently_active_tab_retailer_id);
  bg.enableCouponsForRetailer(current_retailer);
  window.close();
  browser.tabs.reload();
}

function customizeMenus() {
  if (isInIH) {
    document.getElementById("add-to-wishlist").className = "hide";
    document.getElementById('go-to-wishlist').className = "hide";
    document.getElementById('suggest-a-coupon').className = "hide";

  }
}

window.onload = function() {
  init();
  customizeMenus();
}
