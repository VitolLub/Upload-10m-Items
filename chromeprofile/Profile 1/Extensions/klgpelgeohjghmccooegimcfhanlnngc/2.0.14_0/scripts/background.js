var _AnalyticsCode = 'UA-63431315-1';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
//_gaq.push(['_trackPageview']);

/*(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
  })();*/

var App = (function (my) {

        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);

  var enabled = false;

  my.init = function() {
    //console.log('background init');

    enabled = localStorage.enabled === undefined ? true : localStorage.enabled === 'true';
    my.setIcon(enabled);
    chrome.browserAction.onClicked.addListener(function(tab) {
      my.toggleState(enabled);
    });
    my.initMessaging();
  };

  my.toggleState = function() {
    enabled = !enabled;
    localStorage.enabled = enabled;
    my.setIcon(enabled);
    my.updateCScriptState();
  };

  my.setIcon = function(on) {
    var icon = 'images/Add_product_arrow-off.png';
    if (on) icon = 'images/Add_product_arrow-on.png';
    chrome.browserAction.setIcon({path: icon});
  };

  my.initMessaging = function() {

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
       
        if (request.type === 'getState') {
          _gaq.push(['_trackPageview']);
          sendResponse(enabled);
        }

        if (request.type === 'toggleState') {
          //_gaq.push(['_trackPageview']);
          my.toggleState();
          sendResponse(enabled);
        }

        if (request.type === 'eventWithLabel') {

          _gaq.push(['_trackEvent', request.category , request.action, request.label]);

          sendResponse({status : "OK"});
        }

        if (request.type === 'eventWithLabelAndValue') {

          _gaq.push(['_trackEvent', request.category , request.action, request.label,request.value]);

          sendResponse({status : "OK"});
        }

       if (request.type === 'getProductsData') {
          
           sendResponse({status : "test"});

        }

        if (request.type === 'getProductData') {

          var xhttp = new XMLHttpRequest();
          var method = 'GET';

          xhttp.onload = function() {
                sendResponse({status : "OK",url : request.url,data : xhttp.responseText});

          };

          xhttp.onerror = function() {
              // Do whatever you want on error. Don't forget to invoke the
              // callback to clean up the communication port.
              sendResponse({status : "Error"});
          };

          xhttp.open(method, request.url, true);

          if (method == 'POST') {
              xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          }

          xhttp.send();

          return true; 


        }

        if (request.type === 'getProductsData') {
          
           sendResponse({status : "test"});

        }

        if (request.type === 'getSellersData') {
          var xhttp = new XMLHttpRequest();
          var method = 'GET';
          xhttp.onload = function() {
                sendResponse({status : "OK",url : request.url,data : xhttp.responseText});
          };
          xhttp.onerror = function() {
              // Do whatever you want on error. Don't forget to invoke the
              // callback to clean up the communication port.
              sendResponse({status : "Error"});
          };
          xhttp.open(method, request.url, true);          
          xhttp.send();
          return true; 
        }
  
       /* if (request.type === 'test') {

          $.get('http://keywordtool.io').done( function(data){

          		sendResponse({status : "OK"});

          }).fail(function() {
    			sendResponse({status : "Error"});
  		  });

  		  //sendResponse({status : "OK"});

          
        } */


      });
  };

  my.updateCScriptState = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "updateState", data: enabled}, function(response) {});
    });
  };

  return my;

})(App || {});


App.init();
