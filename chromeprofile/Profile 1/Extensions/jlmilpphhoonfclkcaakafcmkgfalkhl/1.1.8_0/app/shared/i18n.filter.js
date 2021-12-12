App.filter('i18n', function() {
  return function(str) {
    let translatedStr = chrome.i18n.getMessage(str);
    return translatedStr
  };
});