(function() {
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !! window.chrome.runtime);
  var mBestCode = null;
  var mBestRetailer = null;
  var browser = chrome;
  var settings  = {currency:'$', coupon_text:'coupon'};
  var domConfig = { 
                    ALLOW_UNKNOWN_PROTOCOLS: true,  
                    ADD_TAGS: ['iframe','link'],  
                    ADD_ATTR: ['enable-background','allow', 'allowfullscreen', 'frameborder', 'scrolling'], 
                    USE_PROFILES: {html: true,svg: true, svgFilters: true}, 
                    FORCE_BODY: true  
                  };

  browser.runtime.sendMessage({ action: 'getSettings', url: document.location.href }, function(data) {
    settings = data;
  });

  function getTotal(ret) {
    var total;
    if (ret.total_price_selector) {
      try {
        total = document.querySelector(ret.total_price_selector).innerText;
      } catch (e) {
        const elTotal = $(ret.total_price_selector);
        total = elTotal.first().text();
      }     
    } else {
      total = ret.total();
    }
    var regexComma = new RegExp(/[,]\d{2}$/g,"i");
    var regexDecimal = new RegExp(/[.]\d{3}$/g,"i");
    if (total.replace(/[^0-9.,]/g, '').trim().match(regexComma)) {
      ret.ac_price_divisor = 100;
      total = total.replace(/[^0-9]/g, '').trim();
    }else if(total.replace(/[^0-9.,]/g, '').trim().match(regexDecimal)){
      total = total.replace(/[^0-9]/g, '').trim();
    }else{
      total = total.replace(/[^0-9.]/g, '').trim();
    }   

    if (ret.ac_price_divisor) {
      total = total / ret.ac_price_divisor;
    }
    return parseFloat(total);
  }


  function fillAndSubmitCode(ret, code) {
    if (ret.ac_pre_input) {
      runEval(ret.ac_pre_input);
    }

    $(ret.coupon_input_selector)[0] && $(ret.coupon_input_selector).val(code);

    if (ret.ac_pre_submit) {
      runEval(ret.ac_pre_submit);
    }

    try {
      $(ret.coupon_submit_selector)[0] && $(ret.coupon_submit_selector)[0].click();
    } catch (e) {
      runEval(ret.coupon_submit_selector);
    }

    if (ret.ac_post_submit) {
      runEval(ret.ac_post_submit);
    }
  }

  function applyCodes(ret) {
    browser.runtime.sendMessage({ action: 'getAutoCouponsState', url: document.location.href }, function(state) {
      if (!state) {
        browser.runtime.sendMessage({ autocoupons: true, openTabUrl: ret.affiliateLink }, function(affiliateTabId) {
          browser.runtime.sendMessage({
            action: 'initAutoCoupons',
            affiliateTabId: affiliateTabId,
            coupons: ret.codes,
            startTime: (new Date()).getTime(),
            total: getTotal(ret),
            type: 'P',
            prevCode: 'prevCode',
            url: document.location.href,
          });
          if (ret.ac_remove_promo_code) {
            runEval(ret.ac_remove_promo_code);
          }
          applyCodes(ret);
        });
     }else if (state.type == 'P' && ret.id == '1845' && window.location.href.indexOf("carnext") > -1 && state.total < state.totalBefore) {
        var index = state.lastCoupon;
        var coupons = state.coupons;
        endCodeTesting(ret, state.affiliateTabId, coupons[state.bestCoupon], state.totalBefore, state.totalIncreased, state.startTime);
     }else if (state.type == 'P' && state.lastStage === 'total') {
        var index = state.lastCoupon + 1;
        var coupons = state.coupons;
        if (index < coupons.length) {
          applyCode(ret, coupons[index].code, index, coupons.length);
        } else {
          applyCode(ret, coupons[state.bestCoupon] ? coupons[state.bestCoupon].code : '', coupons.length, coupons.length);
        }
      } else if (state.type == 'P' && state.lastStage === 'code') {
        var index = state.lastCoupon;
        var coupons = state.coupons;
        if (index < coupons.length) {
          evaluateCode(ret, index === coupons.length - 1);
        } else {
          endCodeTesting(ret, state.affiliateTabId, coupons[state.bestCoupon], state.totalBefore, state.totalIncreased, state.startTime);
        }
      } else if (state.type == 'P' && state.lastStage === 'interrupt') {
        browser.runtime.sendMessage({ autocoupons: true, removeTabId: state.affiliateTabId });
        browser.runtime.sendMessage({
          action: 'endAutoCoupons',
          url: document.location.href,
        });
      }
    });
  }

  function updateStatus(code, index, couponsAmount) {
    postMessage({
      action: 'updateCode',
      code: code,
    }, '*');

    postMessage({
      action: 'updateProgress',
      percentage: (((index + 1) / (couponsAmount + 1)) * 100).toFixed(0) + '%',
    }, '*');
  }

  function autoApplyCoupons(codes) {
    console.log('codes----------', codes);
    var results = {};
    var url = new URL(location.origin);
    var splitted = url.hostname.split('.');
    if(splitted.length > 3 && splitted.indexOf('com') === -1  ){
      var retailer = auto_coupon_retailers[splitted[splitted.length - 3]];
    }else if(splitted.length > 3 && splitted.indexOf('com') > -1  ){
      var retailer = auto_coupon_retailers[splitted[splitted.length - 2]];
    }else if(splitted.length == 3 && splitted.indexOf('www') === -1 && splitted.indexOf('com') === -1){
      var retailer = auto_coupon_retailers[splitted[splitted.length - 3]];
    }else{
      var retailer = auto_coupon_retailers[splitted[splitted.length - 2]];
    }
    var start_time = (new Date()).getTime();
      if(current_retailer.ac_apply_function && !retailer){
        retailer = auto_coupon_retailers[current_retailer.ac_apply_function];
      }
    if(retailer){
      browser.runtime.sendMessage({ action: 'getAutoCouponsState', url: document.location.href }, function(state) {
       if (!state) {
        browser.runtime.sendMessage({ autocoupons: true, openTabUrl: current_retailer.affiliateLink }, function(affiliateTabId) {
          retailer.preApplyCodes(function(totalBefore,prevCode) {
            totalBefore = convertNumbers(totalBefore);
            browser.runtime.sendMessage({
              action: 'initAutoCoupons',
              affiliateTabId: affiliateTabId,
              coupons: current_retailer.codes,
              startTime: (new Date()).getTime(),
              total: totalBefore,
              prevCode: prevCode,
              type:'N',
              url: document.location.href,
            });
            var codes = current_retailer.codes;
            acApplyCodes(retailer, codes, 0,results, totalBefore, totalBefore, prevCode, start_time,affiliateTabId);
          });
        });
       }else if(state.type == 'N' && (state.lastStage === 'total' || state.lastStage === 'code')){
        var index = state.lastCoupon + 1;
        var codes = state.coupons;
        results.bestIndex = state.bestCoupon;
        results.bestCode = codes[state.bestCoupon] ? codes[state.bestCoupon].code : '';
        results[results.bestCode] = state.total;
        acApplyCodes(retailer, codes, index,results, state.total, state.totalBefore, state.prevCode, state.startTime, state.affiliateTabId);
       }else if (state.type == 'N' && state.lastStage === 'interrupt') {
        browser.runtime.sendMessage({ autocoupons: true, removeTabId: state.affiliateTabId });
        browser.runtime.sendMessage({
          action: 'endAutoCoupons',
          url: document.location.href,
        });
      }
      });
    }else{
      applyCodes(current_retailer);
    }
  }

  function acApplyCodes (retailer, codes, index,results, total, totalBefore, prevCode, start_time, affiliateTabId) {  
    browser.runtime.sendMessage({ action: 'getAutoCouponsState', url: document.location.href }, function(state) {
     if (state && state.type == 'N' && state.lastStage === 'interrupt') {
      browser.runtime.sendMessage({ autocoupons: true, removeTabId: state.affiliateTabId });
      browser.runtime.sendMessage({
        action: 'endAutoCoupons',
        url: document.location.href,
      });
      if(total > totalBefore){
        location.reload();
      }
      return false;
     }
    if (index < codes.length) {           
        var code = codes[index].code;
        var acContainer = document.getElementById('priceblink-ac-container');
        if (!acContainer) {
            injectAutoCouponsPopup('ac-apply-coupons', function() {
              updateStatus(code, index-1, codes.length-1);
            });
        } else {
          updateStatus(code, index-1, codes.length-1);
        }
        
        retailer.applyCode(code, function(value) {
            results[code] = convertNumbers(value);
            console.log(code, value);
            if (results.bestCode) {
                if (results[code] < results[results.bestCode]) {
                    results.bestCode = code;
                    results.bestIndex = index;
                }
            } else {
                results.bestCode = code;
                results.bestIndex = index;
            }
            browser.runtime.sendMessage({
              action: 'applyNextCode',
              url: document.location.href,
            });
            browser.runtime.sendMessage({
              action: 'evaluateCode',
              total: convertNumbers(value)==Number.POSITIVE_INFINITY?totalBefore:convertNumbers(value),
              url: document.location.href,
            });
            acApplyCodes(retailer, codes, index+1,results, convertNumbers(value), totalBefore,prevCode,start_time,affiliateTabId);
        });
        return;
    }
    var totalAfter = results[results.bestCode];
    console.log('totalBefore-----', totalBefore);
    console.log('totalAfter-----', totalAfter); 
    ih_key = 'pb_autocoupon' + current_retailer.id;
    //resetting local ih_key by removing it
    localStorage.removeItem(ih_key);
    setTimeout(function() {
      browser.runtime.sendMessage({ autocoupons: true, removeTabId: affiliateTabId }); 
      try {
        var new_ih_key = JSON.parse(localStorage.getItem(ih_key))  || {};
        delete new_ih_key.ih_affiliateTabId;
        allStorageSet({[ih_key]: new_ih_key});
      } catch (e) { }
    }, 5000);

    var checkout_expanded_at = 'checkout_expanded_at' + current_retailer.id;
    var now = new Date().getTime();
    allStorageSet({[checkout_expanded_at]: now});
    var offset = 3 * 60 * 1000;    
    var setSavings,savingPopupName,savingpopupType;
    if (totalAfter < totalBefore) {
      mBestCode = results.bestCode;
      mBestRetailer = retailer;
      savingPopupName = 'ac-savings';
      savingpopupType = '1';
      setSavings = function(){
        postMessage({
          action: 'updateCode',
          code: results.bestCode,
        }, '*');

        postMessage({
          action: 'updateSavings',
          savings: settings.currency + numberWithCommas((totalBefore - totalAfter).toFixed(2)),
          without: settings.currency + numberWithCommas(Number.parseFloat(totalBefore).toFixed(2)),
          with: settings.currency + numberWithCommas(Number.parseFloat(totalAfter).toFixed(2)),
        }, '*');
      }    
    }else if(prevCode){
      mBestCode = null;
      mBestRetailer = null;
      savingPopupName = 'ac-no-coupons';
      savingpopupType = '2';
      setSavings = function(){ retailer.applyBestCode(prevCode); }
    }else if(totalAfter == totalBefore){
      mBestCode = null;
      mBestRetailer = null;
      savingPopupName = 'ac-no-coupons'; 
      savingpopupType = '2';
      setSavings = function(){ retailer.applyBestCode(results.bestCode); }
    }else if((totalAfter > totalBefore) && (totalAfter != Number.POSITIVE_INFINITY) && retailer.removePrevCode){
      mBestCode = null;
      mBestRetailer = null;      
      savingPopupName = 'ac-no-coupons';
      savingpopupType = '2';    
      setSavings = function(){ }
    }else if((totalAfter > totalBefore) && (totalAfter != Number.POSITIVE_INFINITY)){
      mBestCode = null;
      mBestRetailer = null;      
      savingPopupName = 'ac-no-coupons';
      savingpopupType = '3';
      setSavings = function(){
        location.reload();
        document.querySelector('#priceblink-ac-container #ac-title').innerHTML = DOMPurify.sanitize('Oops!!! Something went wrong, looks like we have increased your price in the cart. If so, please try entering your '+settings.coupon_text+' again.'); 
      }
    }else {
      mBestCode = null;
      mBestRetailer = null;      
      savingPopupName = 'ac-no-coupons';
      savingpopupType = '2';
      setSavings = function(){ }
    }
    if(totalAfter == Number.POSITIVE_INFINITY){
      totalAfter = totalBefore;
    }
    var bestIndex = results.bestIndex;
    var couponId = codes[bestIndex].id;
    var clkCode = codes[bestIndex].clkCode;
        browser.runtime.sendMessage({
          action: 'statsAcComplete',
          clkCode: mBestCode ? clkCode : null,
          count: codes.length,
          couponId: mBestCode ? couponId : null,
          savings: (totalBefore - totalAfter).toFixed(2),
          rid: current_retailer.id,
          time: (new Date()).getTime() - start_time,
          url: document.location.href,
        }, setSavingPopup);

        function setSavingPopup(data){
           injectAutoCouponsPopup(savingPopupName, function() {            
            allStorageSet({[ih_key]: {
              ih_totalBefore: Number.parseFloat(totalBefore).toFixed(2),
              ih_totalAfter: Number.parseFloat(totalAfter).toFixed(2),
              ih_affiliateTabId: affiliateTabId,
              savingpopup : 1,
              savingpopupType : savingpopupType,
              savingpopup_time : now+offset,
              mBestCode : mBestCode
            }});
            browser.runtime.sendMessage({
              action: 'endAutoCoupons',
              url: document.location.href,
            });
            setRatings(data);
            setSavings();
          });
        }
    }); 
  }


  function convertNumbers(total){
    //we are doing it in autoapply but to make sure we didn't miss any.
    var regexComma = new RegExp(/[,]\d{2}$/g,"i");
    var regexDecimal = new RegExp(/[.]\d{3}$/g,"i");
    if(total == Number.POSITIVE_INFINITY){
      total = Number.POSITIVE_INFINITY;
    }else if (String(total).match(regexComma)) {
      total = Number.parseFloat(String(total).replace(/[^0-9]/g, '').trim()/100);
    }else if(String(total).match(regexDecimal)){
      total = Number.parseFloat(String(total).replace(/[^0-9]/g, '').trim());
    }else{
      total = Number.parseFloat(String(total).replace(/[^0-9.]/g, '').trim());
    }
    return total;
  }

  function setRatings(data){
   if(data && data[0].showRating == 'ON'){
    try {
      var new_ih_key = JSON.parse(localStorage.getItem('pb_autocoupon'+current_retailer.id)) || {};
      new_ih_key.showRatings = 1;
      allStorageSet({['pb_autocoupon'+current_retailer.id]: new_ih_key });
    } catch (e) { }
      browser.runtime.sendMessage({
        action: 'setReviewStatus',
        url: document.location.href,
      });
      postMessage({
        action: 'showRatings'
      }, '*');
   }else{
    try {
      var new_ih_key = JSON.parse(localStorage.getItem('pb_autocoupon'+current_retailer.id)) || {};
      new_ih_key.showRatings = 0;
      allStorageSet({['pb_autocoupon'+current_retailer.id]: new_ih_key });
    } catch (e) { }
   }
  }

  function applyCode(ret, code, index, couponsAmount) {
    var acContainer = document.getElementById('priceblink-ac-container');
    if (!acContainer) {
      injectAutoCouponsPopup('ac-apply-coupons', function() {
        updateStatus(code, index, couponsAmount);
        applyCode(ret, code, index, couponsAmount);
      });
      return;
    }

    if (ret.ac_pre_apply_codes) {
      runEval(ret.ac_pre_apply_codes);
    }

    setTimeout(function() {
      updateStatus(code, index, couponsAmount);

      fillAndSubmitCode(ret, code);

      browser.runtime.sendMessage({
        action: 'applyNextCode',
        url: document.location.href,
      });

      applyCodes(ret);
    }, ret.ac_submit_delay * 1000);
  }

  function evaluateCode(ret, last) {
    setTimeout(function() {
      browser.runtime.sendMessage({
        action: 'evaluateCode',
        total: getTotal(ret),
        url: document.location.href,
      }, function(state) {
        if (last && state.bestCoupon === state.lastCoupon) {
          browser.runtime.sendMessage({
            action: 'applyNextCode',
            url: document.location.href,
          }, applyCodes.bind(null, ret));
        } else {
          if (ret.ac_remove_promo_code) {
            runEval(ret.ac_remove_promo_code);
          }
          applyCodes(ret);
        }
      });
    }, (ret.ac_submit_delay * 1000) - 250);
  }

  function endCodeTesting(ret, affiliateTabId, bestCode, totalBefore, totalIncreased, startTime) {
    setTimeout(function() {
      if (ret.ac_post_apply_codes) {
        runEval(ret.ac_post_apply_codes);
      }

      browser.runtime.sendMessage({ autocoupons: true, removeTabId: affiliateTabId });
      browser.runtime.sendMessage({
        action: 'endAutoCoupons',
        url: document.location.href,
      });

      var totalAfter = getTotal(ret);
      var setSavings,savingPopupName;
      if (totalAfter < totalBefore) {
         savingPopupName = 'ac-savings';
         setSavings = function(){
          postMessage({
            action: 'updateCode',
            code: bestCode ? bestCode.code : null,
          }, '*');

          postMessage({
            action: 'updateSavings',
            savings: settings.currency + numberWithCommas((totalBefore - totalAfter).toFixed(2)),
            without: settings.currency + numberWithCommas(totalBefore.toFixed(2)),
            with: settings.currency + numberWithCommas(totalAfter.toFixed(2)),
          }, '*');
        }
      } else {
        if (bestCode && totalIncreased) {
         savingPopupName = 'ac-no-coupons';
         setSavings = function(){
            postMessage({
              action: 'updateMessage',
              message: 'Congratulations! We\'ve applied the best '+settings.coupon_text+' for you.',
            }, '*');
         }
        } else {
          savingPopupName = 'ac-no-coupons';
          setSavings = function(){}
        }
      }

      browser.runtime.sendMessage({
        action: 'statsAcComplete',
        clkCode: bestCode ? bestCode.clkCode : null,
        count: ret.codes.length,
        couponId: bestCode ? bestCode.id : null,
        savings: (totalBefore - totalAfter).toFixed(2),
        rid: ret.id,
        time: (new Date()).getTime() - startTime,
        url: document.location.href,
       }, setSavingPopup);

       function setSavingPopup(data){
           injectAutoCouponsPopup(savingPopupName, function() {
            setRatings(data);
            setSavings();
          });
        }  

    var checkout_expanded_at = 'checkout_expanded_at' + current_retailer.id;
    var now = new Date().getTime();
    allStorageSet({[checkout_expanded_at]: now});
    
    }, (ret.ac_submit_delay * 1000) - 250);
  }

  function runEval(code) {
    var result = document.createElement('div');
    result.id = 'pb-autocoupons-eval-result';
    document.body.appendChild(result);

    var callback = function(mutationsList) {
      for(var mutation of mutationsList) {
        if (mutation.attributeName === 'result') {
          observer.disconnect();
          result.remove();
          script.remove();
          break;
        }
      }
    };

    var observer = new MutationObserver(callback);
    observer.observe(result, { attributes: true });

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = "(function () {\n    var result = null;\n    try {\n      result = JSON.stringify(function(){" + code + "}());\n    } catch(e) {\n      e.error = true;\n      result = JSON.stringify(e, ['message', 'name', 'error']);\n    }\n    document.getElementById('" + result.id + "').setAttribute('result', result);\n  }())";
    document.getElementsByTagName('head').item(0).appendChild(script);
  }

  function numberWithCommas(x) {
    var parts = x.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  var currentURL = window.location.href;
  var isCartPage = false;

  function injectAutoCouponsPopup(popupName, onload) {
    var acContainer = document.getElementById('priceblink-ac-container');
    if (acContainer) {
      acContainer.remove();
    }

    injectPopupScripts();

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

      addListeners(acContainer, popupName);
      var doc1 = document.documentElement || document.body;
      doc1.appendChild(acContainer);
      onload && onload();
    });
  }

  function closePopup() {
    openPopup = true;  
    postMessage({
      action: 'closeAutocouponsPopup',
      url: document.location.href
    }, '*');

    browser.runtime.sendMessage({
      action: 'interruptAutoCoupons',
      url: document.location.href,
    });
    var now = new Date().getTime();
    try {
      var new_ih_key = JSON.parse(localStorage.getItem('pb_autocoupon'+current_retailer.id))  || {};
      new_ih_key.savingpopup = 0;
      new_ih_key.savingpopup_time = now;
      allStorageSet({['pb_autocoupon'+current_retailer.id]: new_ih_key });
    } catch (e) { }
  }

  function closeAndApplyBestCode() {
    closePopup();
    mBestRetailer && mBestCode && 
      mBestRetailer.applyBestCode(mBestCode);
   
  }

   function applyBestCode_v1() {
    var now = new Date().getTime();
    mBestRetailer && mBestCode && 
        mBestRetailer.applyBestCode(mBestCode);   
    setTimeout(function(){ 
     try {
      var new_ih_key = JSON.parse(localStorage.getItem('pb_autocoupon'+current_retailer.id))  || {};
      new_ih_key.savingpopup = 0;
      new_ih_key.savingpopup_time = now;
      allStorageSet({['pb_autocoupon'+current_retailer.id]: new_ih_key });
     } catch (e) { }
    }, 15000);
  }

  function addListeners(node, popupName) {
    node.querySelector('#ac-close-icon') &&
      node.querySelector('#ac-close-icon').addEventListener('click', closePopup);
    if (popupName === 'ac-savings') {
      applyBestCode_v1();
      node.querySelector('#ac-button') &&
        node.querySelector('#ac-button').addEventListener('click', closePopup);
      node.querySelector('#rating_msg_checkout') &&
        node.querySelector("#rating_msg_checkout").addEventListener("click", closePopup);
    } else {
      node.querySelector('#ac-button') &&
        node.querySelector('#ac-button').addEventListener('click', closePopup);
    }    
  }

  var popupScriptsInjected = false;

  function injectPopupScripts() {
    if (!popupScriptsInjected) {
      var scripts = ['js/ac.js'];
      scripts.forEach(injectScript);
      popupScriptsInjected = true;
    }
  }

  function injectScript(path) {
    getFileContent(path, function(responseText) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.text = responseText;

      document.getElementsByTagName("head").item(0).appendChild(script);
    });
  }

  function getFileContent(path, callback) {
    var url = browser.runtime.getURL(path);
    var xhr = new XMLHttpRequest();

    xhr.addEventListener("load", function() {
      localizeHtmlPage(this.responseText,callback);  
      //callback(this.responseText.replace(/\{\{ extension_id \}\}/g, extension_id));
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

  var acSelectors = [
    'coupon_input_selector',
    'coupon_submit_selector',
    'total_price_selector',
    'ac_pre_apply_codes',
    'ac_remove_promo_code',
  ]
  var currentRetailer;

  function handlePopupMessage(e) {
     if(!e.data) return;
    if (e.data.action == 'applyCodes') {
      if (e.data.retailer) {
        currentRetailer = e.data.retailer;
      }
      applyCodes(currentRetailer);
    } else if (e.data.action == 'autoApplyCodes') {
      autoApplyCoupons(current_retailer.codes);
      postMessage({ action: 'closePopup' }, '*');
    } else if (e.data.action == 'closeAutocouponsPopup') {
      if(document.getElementById('priceblink-ac-container')){
        document.getElementById('priceblink-ac-container').remove();
      }      
    } else if (e.data.action == 'openDebugDialog' && currentRetailer) {
      var results = {};
      acSelectors.forEach(function(selector) {
        if (currentRetailer[selector]) {
          var currentSelector = currentRetailer[selector];
          try {
            var element = document.querySelector(currentRetailer[selector]);
          } catch (e) {
            // does nothing
          }

          results[selector] = {};
          results[selector].found = !!element;
          results[selector].selector = currentSelector;
        }
      });

      injectAutoCouponsPopup('debug', function() {
        acSelectors.forEach(function(sel) {
          if (results[sel]) {
            var group = document.createElement('div');
            group.classList.add('group');

            var result = document.createElement('div');
            result.classList.add('result');
            result.innerHTML = DOMPurify.sanitize((!results[sel].found ? 'NOT ' : '') + 'FOUND: ' + sel);

            var selector = document.createElement('div');
            selector.classList.add('selector');
            selector.innerHTML = DOMPurify.sanitize(results[sel].selector);

            group.appendChild(result);
            group.appendChild(selector);

            var acDebugContent = document.querySelector('#ac-debug #ac-content');
            acDebugContent.appendChild(group);
          }
        });
        var link = document.createElement('a');
        link.href = 'https://tb.priceblink.com/webcpns/45ejiwe12323sdkj/compareAutoCouponData.php?id=' + currentRetailer.id;
        link.innerHTML = DOMPurify.sanitize('Compare selectors');

        var acDebugContent = document.querySelector('#ac-debug #ac-content');
        acDebugContent.appendChild(link);
      });
    } else if (e.data.action === 'startAutocoupons') {
      currentRetailer = e.data.retailer;
      if (current_retailer.codes !== undefined && current_retailer.codes.length > 0) {
        var intervalId = setInterval(function() {
          var popup = document.getElementById('priceblink-container');
          if (popup) {
            clearInterval(intervalId);
            postMessage({ action: 'isCheckoutPage', content: { isCheckoutPage: true } }, '*');
          }
        }, 1000);
      }
    }
  }

  window.addEventListener("message", handlePopupMessage);
})();
