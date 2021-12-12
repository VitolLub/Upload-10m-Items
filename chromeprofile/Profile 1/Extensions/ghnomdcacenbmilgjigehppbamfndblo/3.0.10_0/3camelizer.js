// http://www.webtoolkit.info/javascript-sha1.html

function sha1(msg)
{
  if (msg == "")
    return("");
  
  if (msg == null)
    return(null);
  
  function rotate_left(n, s)
  {
    var t4 = (n << s) | (n >>> (32 - s));
    return t4;
  };

  function lsb_hex(val)
  {
    var str = "";
    var i;
    var vh;
    var vl;
    for (i = 0; i <= 6; i += 2)
    {
      vh = (val >>> (i * 4 + 4)) & 0x0f;
      vl = (val >>> (i * 4)) & 0x0f;
      str += vh.toString(16) + vl.toString(16);
    }
    return str;
  };

  function cvt_hex(val)
  {
    var str = "";
    var i;
    var v;
    for (i = 7; i >= 0; i--)
    {
      v = (val >>> (i * 4)) & 0x0f;
      str += v.toString(16);
    }
    return str;
  };

  function Utf8Encode(string)
  {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++)
    {
      var c = string.charCodeAt(n);
      if (c < 128)
      {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048))
      {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else
      {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var temp;
  msg = Utf8Encode(msg || "");
  var msg_len = msg.length;
  var word_array = new Array();
  for (i = 0; i < msg_len - 3; i += 4)
  {
    j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
    word_array.push(j);
  }
  switch (msg_len % 4)
  {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
      break;
    case 3:
      i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
      break;
  }
  word_array.push(i);
  while ((word_array.length % 16) != 14) word_array.push(0);
  word_array.push(msg_len >>> 29);
  word_array.push((msg_len << 3) & 0x0ffffffff);
  for (blockstart = 0; blockstart < word_array.length; blockstart += 16)
  {
    for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
    for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for (i = 0; i <= 19; i++)
    {
      temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 20; i <= 39; i++)
    {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 40; i <= 59; i++)
    {
      temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    for (i = 60; i <= 79; i++)
    {
      temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotate_left(B, 30);
      B = A;
      A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  return temp.toLowerCase();
}
function dmsg(msg)
{
  
}
// init global state object with null values
var CAMELIZER = new Object({
  // consty globals
  configs: new Object({
    all_price_types: new Array("amazon", "new", "used"),
    default_chart_dims: new Object({height: 400, width: 100}),
    expanded_chart_dims: new Object({height: 535, width: 100}),
    expanded_h_classes: new Array("", ""), // CUT
    unexpanded_h_classes: new Array("", ""), // CUT
    build_info: "2021-03-08 @ 13:13:17",
    camel_domain: "camelcamelcamel.com",
    api_endpoint: "izer.camelcamelcamel.com",
    charts_domain: "charts.camelcamelcamel.com",
    analytics_endpoint: "hello.camelcamelcamel.com/camelizer",
  }),
  
  
  // params: key
  // one param: getter
  // configs cannot be written
  config: function() {
    this.validate_args(arguments);
    var key = arguments[0];
    this.validate_key(key, this.configs);
    
    if (arguments.length == 2)
      throw "You cannot set config vars";
    
    return(this.configs[key]);
  },
  
  // addon state that resets between activations
  ephemerals: new Object({
    browser: "chrome",
    current_tab_url: null,
    asin: null,
    locale: "US",
    product_created_at: null,
    chart_dims: new Object({"width": -1, "height": 365}),
    selected_tab: "pricehistory",
    currency_symbol: "$",
    logged_in: false,
    user: null,
    camels: {},
    highest_prices: null,
    lowest_prices: null,
    current_prices: null,
    last_prices: null,
    page_products: null,
    chart_expanded_v: false,
    secret_keys: {}, // saved to local storage for each asin, in case user isn't logged in
    intro: null, // intro.js
  }),
  
  // params: key, [value]
  // one param: getter
  // two params: setter
  ephemeral: function() {
    this.validate_args(arguments);
    var key = arguments[0];
    this.validate_key(key, this.ephemerals);
    
    if (arguments.length == 2)
    {
      var newval = arguments[1];
      this.ephemerals[key] = newval;
      dmsg("Writing ephemeral: " + key);
      dmsg(newval);
      
      return(newval);
    }
    
    return(this.ephemerals[key]);
  },
  
  // addon state that is user configurable and saved between activations
  settings: new Object({
    period: "all",
    close_up: true,
    filter_outliers: false,
    chart_expanded_h: false,
    price_types: new Array("amazon", "new", "used"),
    email: null,
    allow_analytics: true,
    install: null,
    tour_shown: false,
    browser_zoom: "1.0",
  }),
  
  settings_keys: function() {
    return(Object.keys(this.settings));
  },
  
  // params: key, [value]
  // one param: getter
  // two params: setter
  setting: function() {
    this.validate_args(arguments);
    var key = arguments[0];
    this.validate_key(key, this.settings);
    
    if (arguments.length == 2)
    {
      var newval = arguments[1];
      this.settings[key] = newval;
      
      dmsg("Writing setting: " + key + " = " + newval);
      
      return(newval);
    }
    
    if (key == "install")
      return(this.hashit(this.settings[key]));
    
    return(this.settings[key]);
  },
  
  validate_args: function(args) {
    if (args.length == 0 || args.length > 2)
      throw "Too many args";
  },
  
  validate_key: function(key, list) {
    if (Object.keys(list).indexOf(key) == -1)
      throw "Invalid key";
  },
  
  enable_price_type: function(price_type) {
    dmsg("Enabling price type: " + price_type);
    
    if (this.settings.price_types.indexOf(price_type) == -1)
      this.settings.price_types.push(price_type);
  },
  
  disable_price_type: function(price_type) {
    dmsg("Disabling price type: " + price_type);
    
    var i = this.settings.price_types.indexOf(price_type);
          
    if (i >= 0)
      this.settings.price_types.splice(i, 1);
  },
  
  amazon_domain: function() {
    var locale = CAMELIZER.ephemeral("locale") || "US";
    
    switch (locale)
    {
    case "US":
      return("amazon.com");
    case "CA":
      return("amazon.ca");
    case "AU":
      return("amazon.com.au");
    case "DE":
      return("amazon.de");
    case "UK":
      return("amazon.co.uk");
    case "FR":
      return("amazon.fr");
    case "IT":
      return("amazon.it");
    case "ES":
      return("amazon.es");
    }
    
    throw ("Unhandled locale: " + locale);
  },
  
  locale_domain: function() {
    var locale = arguments[0] || CAMELIZER.ephemeral("locale") || "US";
    
    if (locale == "US")
      return CAMELIZER.config("camel_domain");
    else
      return locale.toLowerCase() + "." + CAMELIZER.config("camel_domain");
  },
  
  browser_is_chromal: function() {
    return(true);
  },
  
  version: function() {
    return(String(browser.runtime.getManifest().version));
  },
  
  is_camelizer_three_oh_oh: function() {
    return(false);
  },
  
  hashit: function(str) {
    return String(sha1(str));
  },
});
// load user's saved settings here
function load_settings(callback)
{
  var keys = CAMELIZER.settings_keys();
  
  DataStore.get(keys).then(function(data) {
    $.each(data, function(k, v) {
      //dmsg(k + " <- " + v);
      CAMELIZER.setting(k, v);
    });
    
    callback();
  }, function(err) {
    dmsg("Error loading user settings");
    dmsg(err);
  });
}

function save_settings()
{
  var keys = CAMELIZER.settings_keys();
  
  $.each(keys, function(i, key) {
    val = CAMELIZER.setting(key);
    //dmsg(key + " -> " + val);
    DataStore.set(key, val);
  });
}

function secret_keys_store_id()
{
  return(CAMELIZER.ephemeral("asin") + ":" + CAMELIZER.ephemeral("locale").toLowerCase());
}

function load_secret_keys()
{
  //dmsg("LOAD KEYS: " + secret_keys_store_id());
  return(DataStore.get(secret_keys_store_id()));
}

function save_secret_keys()
{
  var keys = CAMELIZER.ephemeral("secret_keys");
  
  //dmsg("WRITE KEYS: " + secret_keys_store_id());
  //dmsg(keys);
  DataStore.set(secret_keys_store_id(), keys);
}
function joinA(array, glue) {
  var str;
  str = "";
  var max = array.length;
  
  $.each(array, function(i, elm) {
    str += String(elm);
    
    if (i < max - 1)
      str += glue;
  });
  
  return(str);
}

function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax= arr.indexOf(what)) !== -1) {
          arr.splice(ax, 1);
      }
  }
  return arr;
}
// read from sync first, if available
// if that fails, read from local
// write to both sync and local, always

var DataStore = new Object({
  get: function(keys) {
    
    try {
      var getting = browser.storage.sync.get(keys);
      return(getting);
    } catch (e) {
      dmsg("DataStore::get sync error, trying local");
      dmsg(e);
    }
    
      
    return(browser.storage.local.get(keys));
  },
  
  set: function(key, val) {
    obj = {};
    obj[key] = val;
    browser.storage.local.set(obj);
    
    try {
      browser.storage.sync.set(obj);
    } catch (e) { dmsg(e); }
  },
  
  remove: function(keys) {
    browser.storage.local.remove(keys);
    
    try {
      browser.storage.sync.remove(keys);
    } catch (e) { dmsg(e); }
  },
});
// all analytics requests flow through this function.
// if a user disables anonymous usage statistics in the first_run window,
// this function returns immediately.
function camelizer_metric(data)
{
  if (!CAMELIZER.setting("allow_analytics"))
  {
    dmsg("Analytics not allowed.");
    return;
  }
  
  var default_params = new Object({
    url: escape(CAMELIZER.ephemeral("current_tab_url")),
    geo: CAMELIZER.ephemeral("locale"),
    install: CAMELIZER.setting("install"),
    browser: CAMELIZER.ephemeral("browser"),
    screen: String(screen.width) + "x" + String(screen.height),
    view: String(window.innerWidth) + "x" + String(window.innerHeight),
    version: String(CAMELIZER.version()),
    build: String(CAMELIZER.config("build_info")),
    zzzzzz: Math.random(),
  });
  
  var qstr = $.param(data) + "&" + $.param(default_params);
  var url = "https://";
  var domain = CAMELIZER.config("analytics_endpoint");
  
  if (!domain)
    return;
  
  url += domain;
  
  $.post(url, qstr, function(data, status, xhr) {
  }, "html");
}

function camelizer_pageview(path)
{
  var params = new Object({
    hit: "pageview",
    page: path || selected_tab_path(),
  });
  
  camelizer_metric(params);
}

function camelizer_event(action, label, value)
{
  var params = new Object({
    hit: "event",
    cat: CAMELIZER.ephemeral("browser"),
    act: action,
    lab: label,
    val: value || 0,
    page: selected_tab_path(),
  });
  
  camelizer_metric(params);
}

function selected_tab_path()
{
  var path = "/unknown";
  
  switch (CAMELIZER.ephemeral("selected_tab"))
  {
  case "pricehistory":
    path = "/chart";
    break;
  case "help":
    path = "/about";
    break;
  case "pageproducts":
    path = "/products_on_page";
    break;
  case "user":
    path = "/account";
    break;
  }
  
  return(path);
}

function campaign_params()
{
  var q = "utm_campaign=camelizer&utm_medium=extension&utm_source=";
  q += CAMELIZER.ephemeral("browser");
  
  if (arguments.length > 0)
    q += "&utm_content=" + arguments[0];
  
  var asin = CAMELIZER.ephemeral("asin");
  var locale = CAMELIZER.ephemeral("locale");
  
  if (asin && locale)
    q += "&utm_term=" + locale + "-" + asin;
  
  return(q);
}

var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
function uuidv4()
{
  var d0 = Math.random()*0xffffffff|0;
  var d1 = Math.random()*0xffffffff|0;
  var d2 = Math.random()*0xffffffff|0;
  var d3 = Math.random()*0xffffffff|0;
  return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
  lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
  lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
  lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
}
function announce(callback)
{
  var querying = browser.tabs.query({active: true, currentWindow: true});
  var params = {"file": "announce.js", "runAt": "document_idle", "allFrames": false,};
  
  querying.then(function(tab) {
    tab = tab[0];
    
    var executing = browser.tabs.executeScript(tab.id, params);
    
    executing.then(function(response) {
      callback(response);
    }, function(response) {
      dmsg("ERROR GETTING ASINS");
      dmsg(response);
    });
  }, function(response) {
    dmsg("ERROR GETTING ASINS");
      dmsg(response);
  });
}

function get_asins(callback)
{
  var querying = browser.tabs.query({active: true, currentWindow: true});
  var params = {"file": "get_all_anchors.js", "runAt": "document_end"};
  
  querying.then(function(tab) {
    tab = tab[0];
    
    var executing = browser.tabs.executeScript(tab.id, params);
    
    executing.then(function(response) {
      response = response[0];
      
      if (typeof response["error"] != "undefined")
      {
        dmsg("ERROR GETTING ASINS");
        dmsg(response["error"]);
      }
      
      callback(response);
    }, function(response) {
      dmsg("ERROR GETTING ASINS");
      dmsg(response);
    });
  }, function(response) {
    dmsg("ERROR GETTING ASINS");
      dmsg(response);
  });
}

function get_asin(callback)
{
  var querying = browser.tabs.query({active: true, currentWindow: true});
  var params = {"file": "get_asin.js", "runAt": "document_end"};
  
  querying.then(function(tab) {
    tab = tab[0];
    
    var executing = browser.tabs.executeScript(tab.id, params);
    
    executing.then(function(response) {
      response = response[0];
      
      if (typeof response["error"] != "undefined")
      {
        dmsg("ERROR GETTING ASIN");
        dmsg(response["error"]);
      }
      
      callback(response);
    }, function(response) {
      dmsg("ERROR GETTING ASIN");
      dmsg(response);
    }, function(response) {
      dmsg("ERROR GETTING ASIN");
      dmsg(response);
    });
  });
}

function set_firstrun_options(callback)
{
  var querying = browser.tabs.query({active: true, currentWindow: true});
  var params = {"file": "set_firstrun_options.js", "runAt": "document_end"};
  
  querying.then(function(tab) {
    tab = tab[0];
    
    var code = "var c3_version = \"" + CAMELIZER.version() + "\"; ";
    code += "var c3_allow = " + (CAMELIZER.setting("allow_analytics") ? "true" : "false") + "; ";
    
    var exec = browser.tabs.executeScript(tab.id, {
      "code": code,
    }).then(function(resp) {
      var executing = browser.tabs.executeScript(tab.id, params);
      dmsg(resp);
      
      executing.then(function(response) {
        dmsg(response);
        response = response[0];
        
        if (response["error"])
        {
          dmsg("ERROR SETTING OPTIONS 1");
          dmsg(response["error"]);
        }
        
        callback(response);
      }, function(response) {
        dmsg("ERROR SETTING OPTIONS 2");
        dmsg(response);
      });
    }, function(response) {
      dmsg("ERROR SETTING OPTIONS 3");
      dmsg(response);
    })
  }, function(response) {
    dmsg("ERROR SETTING OPTIONS 4");
      dmsg(response);
  });
}
function set_chart_height(h)
{
  var chart = $("#chart");
  var width = Math.floor(chart.width());
  var height = h || CAMELIZER.config("default_chart_dims").height; //$("#image_section > div").height();
  var table_height = $("#subchartarea").height();
  //var footer_height = $("#footer").height();
  var parent_height = 580 - 10;
  height = parent_height - table_height;
  chart.height(height);
  var dims = CAMELIZER.ephemeral("chart_dims");
  dims.height = height;
  dims.width = width;
  CAMELIZER.ephemeral("chart_dims", dims);
}

function load_chart()
{
  // needs: asin, locale, [price types], [width, height], time period, filter outliers
  var dims = CAMELIZER.ephemeral("chart_dims");
  var width = dims.width;
  var height = dims.height;
  var parms = {
    force: 1,
    zero: CAMELIZER.setting("close_up") ? "0" : "1",
    w: String(width),
    h: String(height),
    desired: false,
    legend: 0,
    ilt: 1,
    tp: CAMELIZER.setting("period"),
    fo: CAMELIZER.setting("filter_outliers") ? "1" : "0",
    lang: "en",
  };
  var chart_url = "https://" + CAMELIZER.config("charts_domain") + "/";
  chart_url += CAMELIZER.ephemeral("locale").toLowerCase() + "/";
  chart_url += CAMELIZER.ephemeral("asin") + "/";
  chart_url += joinA(CAMELIZER.setting("price_types"), "-") + ".png?";
  chart_url += $.param(parms);
  dmsg(chart_url);
  
  update_product_links();
  
  $("#chart").attr("src", chart_url);
}
function show_loading_overlay()
{
  if (arguments.length > 0)
    set_loading_overlay_text(arguments[0]);
  
  $("#loaderlay").show();
}

function hide_loading_overlay()
{
  //window.setTimeout(function() {
    $("#loaderlay").hide();
  //}, 500);
  set_loading_overlay_text(browser.i18n.getMessage("loading_overlay_msg")); // always reset
}

function set_loading_overlay_text(text)
{
  $("#loaderlay div.msg").html(text);
}
function show_error_overlay()
{
  if (arguments.length > 1)
    set_error_overlay_text(arguments[0], arguments[1]);
  
  $("#error_overlay").show();
}

function hide_error_overlay()
{
  $("#error_overlay").hide();
  set_error_overlay_text(browser.i18n.getMessage("error_overlay_title"), browser.i18n.getMessage("error_overlay_body")); // always reset
}

function set_error_overlay_text(title, body)
{
  $("#eo_title").html(title);
  $("#eo_body").html(body);
}
// slides down a panel from the top of the window and displays an image
// optional 'autoclose' argument: # of seconds to wait before closing the panel (default: 0, aka 'off')
function show_top_msg(title, msg, type/*, autoclose = 0*/)
{
  var autoclose = 0;
  
  if (arguments.length >= 4)
    autoclose = arguments[3];
  
  var elm = $("#top_msg_panel");
  elm.removeClass("notice error success");
  elm.addClass(type);
  $("#top_msg_title").html(title);
  $("#top_msg_body").html(msg);
  
  elm.foundation("open");
  
  if (autoclose > 0)
    window.setTimeout(function() {
      close_top_msg();
    }, autoclose * 1000);
}

function close_top_msg()
{
  $("#top_msg_panel").foundation("close");
}

function show_top_error(title, msg/*, autoclose = 0*/)
{
  show_top_msg(title, msg, "error", arguments[2] || 0);
}

function show_top_notice(title, msg/*, autoclose = 0*/)
{
  show_top_msg(title, msg, "notice", arguments[2] || 0);
}

function show_top_success(title, msg/*, autoclose = 0*/)
{
  show_top_msg(title, msg, "success", arguments[2] || 0);
}
function getMatches(str, regex)
{
  var out = null;
  if (regex.test(str))
    out = regex.exec(str);
  
  return(out);
}

function is_amazon(url)
{
  var domains = [
    /https?:\/\/(?:.*\.)?amazon\.com/i,
    /https?:\/\/(?:.*\.)?amazon\.co\.uk/i,
    /https?:\/\/(?:.*\.)?amazon\.fr/i,
    /https?:\/\/(?:.*\.)?amazon\.de/i,
    /https?:\/\/(?:.*\.)?amazon\.ca/i,
    /https?:\/\/(?:.*\.)?amazon\.es/i,
    /https?:\/\/(?:.*\.)?amazon\.it/i,
    /https?:\/\/(?:.*\.)?amazon\.com\.au/i
  ];

  for (var i=0; i<domains.length; i++) {
    regex = domains[i];
    if (url.match(regex)) {
      return true;
    }
  }
  return false;
}

function extract_asin(url)
{
  regexs = new Array(
    /ASIN\.1=([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /ASIN=([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /dp\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /dp\/product\-description\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /product\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /.*?offer\-listing\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /product\-reviews\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /dp\/premier\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i,
    /d\/.*?\/.*?\/([A-Z0-9]{10,13})(\/|$|\?|\%|\ )?/i
   );

  if (url.match(/\/gp\/slredirect\/redirect\.html/)) {
    // this is an ad on an amazon page.
    return false;
  }
  for (i=0; i<regexs.length; i++) {
    regex = regexs[i];
    var asin = getMatches(url, regex);
    if (asin) {
      return(asin[1]);
    }
  }
  return null;
}

function extract_amazon_locale(url)
{
  var tld = url.substring(0, url.indexOf("/", 8));
  var locale = false;
    
  if (!tld)
    return(locale);
  
  tld = (m = tld.match(new RegExp("\.([a-z,A-Z]{2,6})$") )) ? m[1] : false;
  
  if (!tld)
    return(locale);
  
  if (tld == "com")
    locale = "US";
  else
  {
    locale = tld.split(".");
    locale = locale[locale.length - 1].toUpperCase();
  }
  
  return(locale);
}

function is_camel(url)
{
  return(url.indexOf(CAMELIZER.config("camel_domain")) != -1 || url.indexOf(CAMELIZER.config("api_endpoint")) != -1);
}

function extract_camel_locale(url)
{
  
}

function camel_request_url()
{
  var url = "https://";
  url += CAMELIZER.config("api_endpoint");
  url += "/chromelizer/";
  url += CAMELIZER.ephemeral("asin");
  url += "?";
  var parms = new Object({
    locale: CAMELIZER.ephemeral("locale"),
    ver: 5,
    url: CAMELIZER.ephemeral("current_tab_url"),
  });
  url += $.param(parms);
  
  return(url);
}

function convert_from_currency_base(n)
{
  locale = CAMELIZER.ephemeral("locale").toLowerCase();
  
  if (locale == "jp") {
    n = (n*100).toFixed();
  }
  else
    n = n / 100.0;
  
  if (locale == "es" || locale == "de" || locale == "fr" || locale == "it")   {
    decimal_sep = ",";
    thousands_sep = ".";
  } else if (locale == "fr") {
    decimal_sep = ",";
    thousands_sep = " ";
  } else {
    decimal_sep = ".";
    thousands_sep = ",";
  }
  c = 2
  d = decimal_sep;
  t = thousands_sep;
  sign = (n < 0) ? '-' : '',

  //extracting the absolute value of the integer part of the number and converting to string
  i = parseInt(n = Math.abs(n).toFixed(c)) + '', 

  j = ((j = i.length) > 3) ? j % 3 : 0; 
  str = sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ''); 
  len = str.length;
  //str = str.substring(len-3, len) == ".00" ? str.substring(0, len-3) : str;
  if (locale == "jp") {
    return str.replace(/(.*)\..*/, "$1");
  }
  return str;
}

function first_run_url()
{
  return("https://camelcamelcamel.com/camelizer/first_run?browser=chrome&version=3.0.10&utm_campaign=camelizer&utm_medium=extension&utm_source=chrome&utm_content=first_run");
}

function last_run_url()
{
  return("https://camelcamelcamel.com/camelizer/last_run?browser=chrome&version=3.0.10&utm_campaign=camelizer&utm_medium=extension&utm_source=chrome&utm_content=last_run");
}
function perform_vertical_expansion()
{
  var watchfrm = $("#watchfrm");
  
  if (CAMELIZER.ephemeral("chart_expanded_v"))
  {
    watchfrm.hide();
    set_chart_height(CAMELIZER.config("expanded_chart_dims").height);
  }
  else
  {
    watchfrm.show();
    set_chart_height(CAMELIZER.config("default_chart_dims").height);
  }
}

function perform_horizontal_expansion()
{
  $("#date_list button").each(function(i, btn) {
    btn = $(btn);
    btn.html(btn.attr(!CAMELIZER.setting("chart_expanded_h") ? "x-camel-long" : "x-camel-short"));
  });
  
  var exp_classes = CAMELIZER.config("expanded_h_classes");
  var unexp_classes = CAMELIZER.config("unexpanded_h_classes");
  
  if (!CAMELIZER.setting("chart_expanded_h"))
  {
    $("#chartcol").removeClass(exp_classes[0]);
    $("#menucol").removeClass(exp_classes[1]);
    $("#chartcol").addClass(unexp_classes[0]);
    $("#menucol").addClass(unexp_classes[1]);
  }
  else
  {
    $("#chartcol").removeClass(unexp_classes[0]);
    $("#menucol").removeClass(unexp_classes[1]);
    $("#chartcol").addClass(exp_classes[0]);
    $("#menucol").addClass(exp_classes[0]);
  }
}

function select_correct_period()
{
  dmsg("CORRECT PERIOD");
  $("#date_list .button").removeClass("active");
  var period = CAMELIZER.setting("period") || "all";
  var btn = $("#date_" + period);
  
  if (!btn.length)
    btn = $("#date_all");
  
  var arrow = $("#date_list_arrow");
  btn.addClass("active");
  var x = btn.offset().left + (btn.width() / 2.0);
  x += 5;
  dmsg(btn.offset());
  dmsg(arrow.width());
  arrow.offset({left: x});
}

function activate_appropriate_tab()
{
  var selected_tab = CAMELIZER.ephemeral("selected_tab");
  
  // hide all tabs, show selected tab
  $(".tab_content").hide();
  $("#" + selected_tab + "_tab").show();
  
  // deactivate all buttons, activate selected button
  $("#sidebar .tab").removeClass("active");
  $("#" + selected_tab + "_tab_btn").addClass("active");
}

function parse_amazon_url_and_update_ui()
{
  get_asin(function(response) {
    var url = CAMELIZER.ephemeral("current_tab_url");
    dmsg(url);
    var asin = extract_asin(url);
    var page_asin = response["asin"];
    
    if (page_asin != null && page_asin != asin)
      asin = page_asin;
    
    var locale = extract_amazon_locale(url);
    CAMELIZER.ephemeral("asin", asin);
    CAMELIZER.ephemeral("locale", locale);
    
    if (!asin || !locale)
    {
      CAMELIZER.ephemeral("selected_tab", "pageproducts");
      activate_appropriate_tab();
      
      //mode
      $("#pricehistory_tab_btn").addClass("disabled");
      $("#chartmenu").addClass("disabled");
      
      get_asins(function(resp) {
        process_asins_for_pageproducts(resp);
        hide_loading_overlay();
        check_tour_necessity();
      });
      
      return;
    }
    
    load_secret_keys().then(function(data) {
      dmsg("KEYS LOADED");
      dmsg(data);
      CAMELIZER.ephemeral("secret_keys", {});
      var store_id = secret_keys_store_id();
      
      if (Object.keys(data).length > 0 && data[store_id])
        CAMELIZER.ephemeral("secret_keys", data[store_id]);
      
      finish_parse_amazon_url_and_update_ui();
    }, function(err) { dmsg(err); });
  });
}

function finish_parse_amazon_url_and_update_ui()
{
  CAMELIZER.ephemeral("selected_tab", "pricehistory");
  $("#pricehistory_tab_btn").removeClass("disabled");
  $("#chartmenu").removeClass("disabled");
  
  var domain = CAMELIZER.config("api_endpoint");
  var locale = CAMELIZER.ephemeral("locale");
  var asin = CAMELIZER.ephemeral("asin");
  var api_url = camel_request_url();
  var secret_keys = {"secret_keys": CAMELIZER.ephemeral("secret_keys")};
  
  $.get(api_url, secret_keys, function(){}).always(function(data, status, xhr) {
    if (status == "error")
      status = data.status;
    else
      status = xhr.status;
    
    if (status != 200)
    {
      // move this to its own function
      var errmsg = null;
      
      switch (status)
      {
      case 0:
        errmsg = browser.i18n.getMessage("http_0");
      break;
      case 403:
        errmsg = browser.i18n.getMessage("http_403");
      break;
      case 404:
        errmsg = browser.i18n.getMessage("http_404");
      break;
      case 429:
        errmsg = browser.i18n.getMessage("http_429");
      break;
      case 500:
        errmsg = browser.i18n.getMessage("http_500");
      break;
      case 502:
      case 503:
      case 504:
        errmsg = browser.i18n.getMessage("http_5xx");
      break;
      default:
        errmsg = browser.i18n.getMessage("http_unknown", [String(status)]);
      }
      
      set_error_overlay_text(browser.i18n.getMessage("http_error_title", [String(status)]), errmsg);
      
      CAMELIZER.ephemeral("logged_in", false);
      CAMELIZER.ephemeral("user", null);
      //CAMELIZER.setting("email", null);
      update_user_info();
      
      $("#pricehistory_tab_btn").addClass("disabled");
      $("#chartmenu").addClass("disabled");
      
      hide_loading_overlay();
      show_error_overlay();
      
      return;
    }
    
    if (data.p)
    {
      set_error_overlay_text(browser.i18n.getMessage("parent_error_title"), browser.i18n.getMessage("parent_error_msg"));
      $("#pricehistory_tab_btn").addClass("disabled");
      $("#chartmenu").addClass("disabled");
      
      hide_loading_overlay();
      show_error_overlay();
      
      return;
    }
    
    dmsg("Success!");
    dmsg(data);
    
    if (data.a)
    {
      CAMELIZER.ephemeral("logged_in", true);
      CAMELIZER.ephemeral("user", data.login);
      CAMELIZER.setting("email", data.login);
    }
    else
    {
      CAMELIZER.ephemeral("logged_in", false);
      CAMELIZER.ephemeral("user", null);
    }
    
    update_user_info();
    
    CAMELIZER.ephemeral("asin", data.asin);
    CAMELIZER.ephemeral("currency_symbol", data.currency_symbol);
    update_currency_symbol();
    
    CAMELIZER.ephemeral("camels", data.camels);
    CAMELIZER.ephemeral("highest_prices", data.highest_pricing);
    CAMELIZER.ephemeral("lowest_prices", data.lowest_pricing);
    CAMELIZER.ephemeral("current_prices", data.prices);
    CAMELIZER.ephemeral("last_prices", data.last_price);
    update_prices_and_camels();
    
    CAMELIZER.ephemeral("product_created_at", data.created_at);
    
    var secret_keys = {};
    
    if (!data.a) // logged in
    {
      $.each(CAMELIZER.ephemeral("camels"), function(price_type, camel) {
        if (camel.secret_key)
          secret_keys[price_type] = camel.secret_key;
      });
      
      CAMELIZER.ephemeral("secret_keys", secret_keys);
    }
    
    save_secret_keys();
    save_settings();
    
    update_product_links();
    activate_appropriate_tab();
    perform_vertical_expansion();
    update_period_options();
    camelizer_pageview(null);
    
    // load the chart
    load_chart();
  });
}

function process_asins_for_pageproducts(resp)
{
  dmsg("process_asins_for_pageproducts:");
  dmsg(resp);
  
  if (resp.error)
  {
    // show error msg;
    return;
  }
  
  var asins = Array();
  
  $.each(resp.urls, function(url, title) {
    var asin = extract_asin(url);
    
    if (asin)
      asins.push(asin);
  });
  
  var data = new Object({
    locale: CAMELIZER.ephemeral("locale"),
    asins: asins,
    page_asin: CAMELIZER.ephemeral("asin"),
    json: true,
    asins_scrape_error: null,
  });
  
  var url = "https://" + CAMELIZER.config("api_endpoint") + "/camelizer/list";
  CAMELIZER.ephemeral("page_products", null);
  
  $.get(url, data, function(){}, "json").always(function(data, status, xhr) {
    dmsg(url);
    dmsg(data);
    dmsg(status);
    dmsg(xhr);
    
    switch (xhr.status)
    {
    case 200:
      dmsg("OK");
      CAMELIZER.ephemeral("page_products", data);
      render_pageproducts();
      camelizer_pageview(null);
      break;
    default:
      dmsg("Error");
      activate_appropriate_tab();
      hide_loading_overlay();
      show_error_overlay(browser.i18n.getMessage("http_error_title", [String(xhr.status)]), browser.i18n.getMessage("msg_product_list_error"));
      return;
    }
  });
}

function render_pageproducts()
{
  var data = CAMELIZER.ephemeral("page_products");
  var locale = CAMELIZER.ephemeral("locale");
  
  $("#productlinks li").remove();
  
  // construct this list in a way that doesn't set innerHTML using server-sourced data.
  // element.text(remote_data) should be safe though?!
  $.each(data["products"], function(category, products) {
    var cat_li = $("<li></li>");
    var cat_strong = $("<strong></strong>");
    
    cat_strong.text(category || "Uncategorized");
    
    cat_li.append(cat_strong);
    $("#productlinks").append(cat_li);
    
    $.each(products, function(i, product) {
      var p_li = $("<li></li>");
      var p_a = $("<a></a>");
      var url = "https://" + CAMELIZER.amazon_domain() + "/product/" + product.asin;
      
      p_a.text(product.full_title);
      p_a.attr("href", "#");
      p_a.attr("x-camel-asin", product.asin);
      p_a.attr("x-camel-locale", locale);
      p_a.attr("x-camel-url", url);
      
      p_li.append(p_a);
      $("#productlinks").append(p_li);
    });
  });
  
  $("#productlinks a").click(function(e) {
    var elm = $(e.currentTarget);
    var asin = elm.attr("x-camel-asin");
    var locale = elm.attr("x-camel-locale");
    var url = elm.attr("x-camel-url");
    CAMELIZER.ephemeral("current_tab_url", url);
    //camelizer_event("Products on Page", locale + " - " + asin, null);
    show_loading_overlay();
    parse_amazon_url_and_update_ui();
    dmsg(asin);
    dmsg(locale);
  });
}

function update_currency_symbol()
{
  $(".currency_symbol").text(CAMELIZER.ephemeral("currency_symbol"));
}

function update_prices_and_camels()
{
  var watchform_cols = new Array("highest", "lowest", "current");
  var camels = CAMELIZER.ephemeral("camels");
  var last_prices = CAMELIZER.ephemeral("last_prices");
  var first_last_price = null; // first existing "last price" value
  var discounts = new Array(1, 0.95, 0.9, 0.85, 0.8, 0.75);
  
  $.each(CAMELIZER.config("all_price_types"), function(i, type) {
    if (first_last_price)
      return;
    
    var price_type = "price_" + type;
    first_last_price = last_prices[price_type];
  });
  
  $.each(CAMELIZER.config("all_price_types"), function(i, type) {
    var price_type = "price_" + type;
    var pt_type = "pt_" + type;
    var pt_type_id = "#" + pt_type;
    var desired_price = null;
    var last_price = last_prices[price_type] || first_last_price;
    
    // tooltippos
    var suggested_list = $("#watch_suggestions_" + type + " ul");
    suggested_list.html("");
    
    if (last_price)
    {
      suggested_list.append("<li class=\"menu-text\">Save at least:</li>");
      
      $.each(discounts, function(j, discount) {
        var discount_str = "";
        var discount_val = "";
        
        if (discount == 1)
        {
          discount_val = last_price - discount;
          discount_str = CAMELIZER.ephemeral("currency_symbol");
          discount_str += convert_from_currency_base(1);
        }
        else
        {
          discount_val = last_price * discount;
          discount_str = String(((1 - discount) * 100).toFixed(0));
          discount_str += "%";
        }
        
        discount_val = convert_from_currency_base(discount_val);
        var dsc_li = $("<li></li>");
        var dsc_a = $("<a></a>");
        var dsc_small = $("<small></small>");
        
        dsc_a.attr("href", "#");
        dsc_a.attr("x-camel-discount", discount_val);
        dsc_a.attr("x-camel-pt", type);
        dsc_a.attr("x-camel-dsc", discount_str);
        dsc_a.text(discount_str);
        dsc_a.addClass("discount_link");
        
        dsc_small.text("(" + CAMELIZER.ephemeral("currency_symbol") +  + discount_val + ")");
        
        dsc_a.append("<br />");
        dsc_a.append(dsc_small);
        dsc_li.append(dsc_a);
        suggested_list.append(dsc_li);
      });
      
      suggested_list.find("a.discount_link").click(function(e) {
        e.preventDefault();
        var elm = $(e.delegateTarget);
        var discount = elm.attr("x-camel-discount");
        
        if (!discount)
          return;
        
        var dp_field = $("input[name='" + price_type + "']");
        
        dp_field.val(discount);
        dp_field.tooltipster("close");
        dp_field.focus();
        
        //var label = elm.attr("x-camel-pt") || "Unknown";
        //label += " - ";
        //label += elm.attr("x-camel-dsc") || "Unknown";
        //camelizer_event("Suggested Discount", label, null);
        
      });
    }
    else
      suggested_list.html("<li class=\"menu-text\">We do not have enough data to offer price suggestions here.</li>");
    
    try
    {
      desired_price = camels[price_type].price;
      dmsg(desired_price);
      desired_price = convert_from_currency_base(desired_price);
      dmsg(desired_price);
    } catch (e) { desired_price = ""; }
    
    $("tr." + price_type + " .desired input").not(".error").val(desired_price);
    
    if (!desired_price || desired_price == "")
      $("tr." + price_type + " .desired .delete_camel").hide();
    else
      $("tr." + price_type + " .desired .delete_camel").show();
    
    $.each(watchform_cols, function(j, col) {
      var obj = null;
      
      try
      {
        var prices = CAMELIZER.ephemeral(col + "_prices");
        obj = prices[price_type];
      } catch (e) { obj = null; }
      
      var selector = "tr." + price_type + " ." + col + " label";
      
      dmsg(obj);
      
      if (!obj)
      {
        dmsg("No " + col);
        $(selector).text(col == "current" ? "Not in Stock" : "-");
      }
      else
      {
        dmsg(col);
        var text = "";
        var price = obj;
        
        if (col != "current")
          price = obj.price;
        
        if (price)
        {
          text = CAMELIZER.ephemeral("currency_symbol");
          text += convert_from_currency_base(price);
        }
        else
        {
          text = "Not in Stock";
        }
        
        if (obj.created_at)
        {
          text += " (";
          text += obj.created_at;
          text += ")";
        }
        
        $(selector).text(text);
      }
    });
  });
}

function update_user_info()
{
  var email = CAMELIZER.setting("email");
  
  if (CAMELIZER.ephemeral("logged_in"))
  {
    $("#wishlistbtn").show();
    $("#signupbtn").hide();
    $("#signinbtn").hide();
    $(".signed_out").hide();
    $(".signed_in").show();
    $("#youraccountbtn").show();
    $("#signedinas").show();
    
    var user = CAMELIZER.ephemeral("user");
    
    $("#youraccountbtn").text(user);
    $(".c3_username").html(user);
  }
  else
  {
    $("#wishlistbtn").hide();
    $("#signupbtn").show();
    $("#signinbtn").show();
    $(".signed_in").hide();
    $(".signed_out").show();
    $("#youraccountbtn").hide();
    $("#signedinas").hide();
  }
  
  $("#email").val(email);
  $(".c3_email").html(email);
}

function update_period_options()
{
  $("#date_list button").removeClass("disabled");
  var created_at = new Date().getTime() / 1000;
  var product_created_at = CAMELIZER.ephemeral("product_created_at");
  
  if (product_created_at)
    created_at = Date.parse(product_created_at) / 1000;
  
  now = new Date().getTime() / 1000;
  days_ids = {"30":"1m", "91":"3m", "182":"6m", "365":"1y"};
  var period = CAMELIZER.setting("period");
  
  $.each(days_ids, function(days, id) {
    if ((now - (days * 86400)) < created_at)
    {
      $("#date_" + id).addClass("disabled");
      
      // user had previously selected a now-unavailable option
      if (period == id)
        CAMELIZER.setting("period", "all");
    }
  });
  
  select_correct_period();
}

function update_product_links()
{
  var asin = CAMELIZER.ephemeral("asin");
  
  var chart_link_url = "https://";
  chart_link_url += CAMELIZER.locale_domain();
  
  if (asin)
  {
    chart_link_url += "/product/";
    chart_link_url += asin;
  }
  
  chart_link_url += "?";
  
  $("#chartlink").attr("href", chart_link_url + campaign_params("chart"));
  $("#gotoc3").attr("href", chart_link_url + campaign_params("view-product-button"));
  
  update_static_links();
}

function update_static_links()
{
  var prefix = "https://";
  prefix += CAMELIZER.locale_domain();
  
  $("#signupbtn").attr("href", prefix + "/signup?" + campaign_params("signup-link"));
  $("#signinbtn").attr("href", prefix + "/login?" + campaign_params("signin-link"));
  $("#youraccountbtn").attr("href", prefix + "/account?" + campaign_params("account-link"));
  $("#wishlistbtn").attr("href", prefix + "/wishlists?" + campaign_params("wishlists-button"));
  $("#c3logo").attr("href", prefix + "/?" + campaign_params("camel-logo"));
  $("#about_link").attr("href", prefix + "/?" + campaign_params("about-link"));
}

function clear_input_errors()
{
  $("input[type='text'].error").removeClass("error");
}

function set_input_errors(fields)
{
  // if email is found, return true
  var ret = false;
  
  $.each(fields, function(i, field) {
    dmsg("ERRORING " + field);
    $("input[name='" + field + "']").addClass("error");
    
    if (field == "email")
      ret = true;
  });
  
  return(ret);
}

function init_intro()
{
  var intro = introJs();
  
  intro.setOptions({
    disableInteraction: true,
    showStepNumbers: false,
    showBullets: false,
    skipLabel: "Exit",
    steps: [
      {
        intro: "<strong>" + browser.i18n.getMessage("intro_welcome_0")  + "</strong><br />" + browser.i18n.getMessage("intro_welcome_1"),
      },
      {
        element: document.querySelector("#sidebar"),
        intro: browser.i18n.getMessage("intro_sidebar"),
        disableInteraction: true,
      },
      {
        element: document.querySelector("#chart_area"),
        intro: browser.i18n.getMessage("intro_chart_area"),
        disableInteraction: true,
      },
      {
        element: document.querySelector("#chart_period_opts"),
        intro: browser.i18n.getMessage("intro_chart_period_opts"),
        disableInteraction: true,
      },
      {
        element: document.querySelector("#watchfrm"),
        intro: browser.i18n.getMessage("intro_watchfrm"),
        disableInteraction: true,
      },
      {
        intro: browser.i18n.getMessage("intro_thanks"),
      },
    ],
  });
  
  CAMELIZER.ephemeral("intro", intro);
}

function check_tour_necessity()
{
  // if we have never asked them before
  if (CAMELIZER.setting("tour_shown"))
    return;
  
  CAMELIZER.setting("tour_shown", true);
  save_settings();
  CAMELIZER.ephemeral("intro").start();
}
function translate_all_elms()
{
  dmsg("*********************************************");
  dmsg("TRANSLATIONS!");
  dmsg("*********************************************");
  
  $("[x-i18n]").each(function(i, elm) {
    elm = $(elm);
    var msg_key = elm.attr("x-i18n");
    var msg_dest = elm.attr("x-i18n-dst") || "html";
    var placeholders = [];
    var attr = null;
    var i = 0;
    
    while (attr = elm.attr("x-i18n-ph-" + String(i)))
    {
      placeholders.push(attr);
      i++;
    }
    
    var str = browser.i18n.getMessage(msg_key, placeholders);
    
    switch (msg_dest)
    {
    case "html":
      elm.html(str);
      break;
    case "title":
      elm.attr("title", str);
      break;
    case "alt":
      elm.attr("alt", str);
      break;
    case "placeholder":
      elm.attr("placeholder", str);
      break;
    case "value":
      elm.val(str);
      break;
    default:
      throw "i18n: Unsupported destination";
    }
  });
}
function set_zoom()
{
  
  
  var ozoom = parseFloat(CAMELIZER.setting("browser_zoom")) || 1.0;
  var zoom = 1.0;
  
  zoom = (1.0 / ozoom);
  zoom *= 100.0;
  //zoom -= 0.5;
  zoom = Math.floor(zoom);
  $("html").css("zoom", String(zoom - 2) + "%");
  $("html").focus();
  
  return(true);
}