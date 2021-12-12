if (chrome) {
  var browser = chrome;
}
var iframe_url = "www.priceblink.com/iframe3/";

if(document.location.protocol == "https:")
  iframe_url = "https://" + iframe_url;
else
  iframe_url = "https://" + iframe_url;

var interval = setInterval(function() {
  if(document.body != null) {
    browser.runtime.sendMessage({action: 'getRetailer', url: document.location.href, caller: 'early'}, injectBlankSpace);
    // Entry point for push notifications
    //chrome.extension.sendRequest({action: 'getPushCoupons', url: document.location.href}, injectPushCoupons);
    clearInterval(interval);
  }
}, 10);

function getSiteSpecificClass() {
  return 'pb-retailer-' + window.location.hostname.replace('www.', '').replace(/\./g, '-');
}

function injectBlankSpace(response) {
  if(response && response.coupons && response.coupons[0] &&
      response.coupons[0].coupons && response.coupons[0].coupons.length > 0 &&
      response.disabled_status == 0) {
      
    var css = document.createElement("link");
    var body = document.body;
    var originalStyles = body.getAttribute('style') || 'NULL';
    css.type = "text/css";
    css.rel = "stylesheet";
    css.href = iframe_url + "css/toolbar-injected-early.css";
    document.getElementsByTagName("head").item(0).appendChild(css);
    body.className += " priceblink-body " + getSiteSpecificClass();
    body.parentNode.style.setProperty("margin-top", "36px", "important");
  }
}