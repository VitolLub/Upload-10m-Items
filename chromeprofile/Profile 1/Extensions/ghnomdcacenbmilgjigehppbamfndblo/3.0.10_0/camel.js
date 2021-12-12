browser.tabs.query({active: true, currentWindow: true}).then(function(tab) {
  tab = tab[0];
  var url = tab.url;
  var camel_url = "https://";
  camel_url += CAMELIZER.config("camel_domain");
  camel_url += "/go/to?src=camelizer&url=";
  camel_url += escape(url); // escape?
  var tab = null;
  var args = {
    url: camel_url,
    active: true,
  };
  
  browser.tabs.create(args).then(function(tab) {
    tab = tab;
    tab.url = args.url;
  }, function(e) {
    dmsg(e);
  });
});