(function() {
  try {
    urls = {};
    anchors = document.getElementsByTagName('a');
    for (i=0; i<anchors.length; i++) {
      a = anchors[i];
      
      if (!a.href || a.href == "" || a.href.substring(0, 10) == "javascript" || a.href == "#" || a.href.indexOf("/dp/") == -1)
        continue;
      
      title = a.title.trim();
      if (title == null || title == '') {
        title = a.textContent.trim();
      }
      
      if (title == null || title == "")
      {
        if (a.childNodes[0] && a.childNodes[0].alt)
          title = a.childNodes[0].alt.trim();
      }
      
      if (title == null || title == "")
        continue;
      
      // we'll take the longer title
      if (!urls[a.href] || urls[a.href].length < title.length) {
        urls[a.href] = title;
      }
    }   
    return {"urls": urls};
  } catch(e) {
    return {"error": e.message + "\n" + e.stack, "urls" : {}};
  }
})();
