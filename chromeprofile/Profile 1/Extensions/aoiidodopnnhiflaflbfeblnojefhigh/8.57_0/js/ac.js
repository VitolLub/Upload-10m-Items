window.addEventListener('message', function(e) {
  if (e.data.action === 'updateCode') {
    document.querySelector('#priceblink-ac-container #ac-code').innerHTML = decodeEntities(e.data.code);
  } else if (e.data.action === 'updateProgress') {
    var progress = document.querySelector('#priceblink-ac-container #ac-progress');
    progress.style.width = e.data.percentage;
    //progress.innerHTML = decodeEntities(e.data.percentage);
  } else if (e.data.action === 'updateSavings') {
    document.querySelector('#priceblink-ac-container .green-text').innerHTML = decodeEntities(e.data.savings);
    document.querySelector('#priceblink-ac-container table .black-btn').innerHTML = decodeEntities(e.data.without);
    document.querySelector('#priceblink-ac-container table .green-btn').innerHTML = decodeEntities(e.data.with);
  } else if (e.data.action === 'updateMessage') {
    document.querySelector('#priceblink-ac-container #ac-title').innerHTML = decodeEntities(e.data.message);
  }
});

var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();