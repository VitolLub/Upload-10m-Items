function QueueEngine(domain, uid, key, ts, wait)
{
  // Assign initial properties.
  this._map = {};
  this._realplexor = null;
  this._needExecute = false;
  this._executeTimer = null;
  this.domain = domain;
  this.uid = uid;
  this.key = key;
  this.ts = ts;
  this.wait = wait || 120;

}

QueueEngine.prototype.subscribe = function (callback) {
  if (!this._map[this.uid])
    this._map[this.uid] = {cursor: null, callbacks: []};
  var chain = this._map[this.uid].callbacks;
  for (var i = 0; i < chain.length; i++) {
    if (chain[i] === callback)
      return this;
  }
  chain.push(callback);
  return this;
}

QueueEngine.prototype.unsubscribe = function(callback) {
    if (!this._map[this.uid]) return this;
    if (callback == null) {
        this._map[this.uid].callbacks = [];
        return this;
    }
    var chain = this._map[this.uid].callbacks;
    for (var i = 0; i < chain.length; i++) {
        if (chain[i] === callback) {
            chain.splice(i, 1);
            return this;
        }
    }
    return this;
}

QueueEngine.prototype.execute = function () {
  // Control IFRAME creation.
  if (!this._realplexor) {
    this._realplexor = QueueEngine_Loader;
  }

  // Check if the realplexor is ready (if not, schedule later execution).
  if (this._executeTimer) {
    clearTimeout(this._executeTimer);
    this._executeTimer = null;
  }

  // Realplexor loader is ready, run it.
  this._realplexor.execute(
          this.domain,
          this._map,
          this.uid,
          this.key,
          this.ts,
          this.wait
  );
}

QueueEngine.prototype.pause = function () {
  this._realplexor._pause = true;
  chrome.storage.local.set({"auth":this._realplexor.query});
//  console.log('set ts ',this._realplexor.query);
}

QueueEngine.prototype.resume = function () {

  this._realplexor._pause = false;
  this._realplexor.ch_loopFunc();
}

QueueEngine_Loader = {
  // Maximum bounce count.
  JS_MAX_BOUNCES: 2,
  // Reconnect delay.
  JS_WAIT_RECONNECT_DELAY: 15000,
  // Realplexor WAIT url parts.
  JS_WAIT_URI: '',
  // Realplexor normal WAIT timeout (seconds).
  JS_WAIT_TIMEOUT: 120,
  fullUrl: '',
  query: null,
  // Count of sequential bounces.
  _bounceCount: 0,
  // Previous request time.
  _prevReqTime: null,
  // Previously used xmlhttp.
  _lastXmlhttp: null,
  _pause: false,
  // Pairs of [cursor, [ callback1, callback2, ... ]] for each ID.
  // Callbacks will be called on data ready.
  _ids: {},
  // Create a new XMLHttpRequest object.
  _getXmlHttp: function () {
    var xmlhttp;
    if (typeof XMLHttpRequest != 'undefined') {
      xmlhttp = new XMLHttpRequest();
    }
    if (!xmlhttp)
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
      }
    if (!xmlhttp)
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
      }
    return xmlhttp;
  },
  // Log a debug message.
  _log: function (msg, func) {
    if (!this.JS_DEBUG)
      return;
    if (window.console) {
      if (!func)
        func = "log";
      var multiline = false;
//      if (("" + msg).match(/^([^\r\n]+)\r?\n([\s\S]*)$/)) {
//        var first = RegExp.$1, second = RegExp.$2;
//        if (console.groupCollapsed) {
//          console.groupCollapsed(first);
//          console[func](second + "\n");
//          console.groupEnd();
//        } else {
//          console.stats(first);
//          console[func](second + "\n");
//        }
//      } else {
//        console[func](msg);
//      }
    }
  },
  // Log an error message.
  _error: function (prefix, msg) {
    this._log(prefix, "error");
    this._log(msg);
  },
  // Process the response data.
  _processResponseText: function (text) {
    // Safary bug: responseText sometimes contain headers+body, not only body!
    // So cat before the first "[".
    var d = JSON.parse(text);
    
    var item = this._ids[this.query.id];
    
    if(d.ts)
    {
      this.query.ts = d.ts;
      chrome.storage.local.set({"auth":this.query});
//      console.log('set ts ',this.query);
    }
          
    for (var j = 0; j < item.callbacks.length; j++) {
      if(d.ts)
      {
        for (var i = 0; i < d.events.length; i++) {
          item.callbacks[j](JSON.parse(d.events[i]));
        }
      }
      else
        item.callbacks[j](d);
    }
    
    
  },
  // Called on response arrival.
  _onresponse: function (text) {
    var nextQueryDelay = this.JS_WAIT_RECONNECT_DELAY;

    // Run the query.
    try {
      if (text.match(/^\s*$/)) {
        text = "";
        throw "Empty response";
      }
      this._processResponseText(text);
      this._bounceCount = 0;
    } catch (e) {
      var t = new Date().getTime();
      if (t - this._prevReqTime < this.JS_WAIT_TIMEOUT / 2 * 1000) {
        // This is an unexpected disconnect (bounce).
        this._bounceCount++;
        this._log("Bounce detected (bounceCount = " + this._bounceCount + ")");
      } else {
        this._log("Disconnect detected");
      }
      if (text != "") {
        this._error(e.message ? e.message : e, "Response:\n" + text);
      }
      this._prevReqTime = t;
    }
    
    if(text !== '')
    {
      try{
        var data = JSON.parse(text);
      }catch(e){return;}
      
      if(data.failed) return;
    }
    
    // Calculate next query delay.
    if (this._bounceCount > this.JS_MAX_BOUNCES) {
      // Progressive delay.
      var progressive = this._bounceCount - this.JS_MAX_BOUNCES + 2;
      nextQueryDelay = 1000 + 500 * progressive * progressive;
      if (nextQueryDelay > 60000)
        nextQueryDelay = 60000;
    }

    if (!this._lastXmlhttp && !this._pause) {
      this._log("Next query in " + nextQueryDelay + " ms");
      var th = this;
      setTimeout(function () {
        th._loopFunc();
      }, nextQueryDelay);
    }
  },
  ch_loopFunc: function () {
    var th = this;
    chrome.storage.local.get("auth",function(d){
//      console.log('get ts ',d.auth);
      if(d.auth && Object.keys(d.auth).length && th.query.ts < d.auth.ts)
        th.query = d.auth;
      
      if(!th._lastXmlhttp)
        th._loopFunc();
    });
  },
  // Loop function.
  _loopFunc: function () {
    if(cm.get('queue.timeout')) return;
    var url = this.fullUrl, query = this.query, postData = null;
    
    
    var xmlhttp = this._getXmlHttp();
    if (!xmlhttp) {
      this._error("No XMLHttpRequest found!");
      return;
    }
    
    
		var ts = new Date().getTime(), postData = 'rand='+ts;
		for(var i in query) postData += '&'+i+'='+encodeURIComponent(query[i]);

    var th = this;
    xmlhttp.open('POST', url, true);
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState != 4)
        return;
      if (!th._lastXmlhttp)
        return; // abort() called
      th._lastXmlhttp = null;
      th._onresponse("" + xmlhttp.responseText);
      th = null;
    }
    this._lastXmlhttp = xmlhttp;
    
    cm.set('queue.timeout',true,surfearner.settings.timeout.queue);
    xmlhttp.send(postData);
    this._prevReqTime = new Date().getTime();
  },
  // Run the polling process.
  execute: function (domain, callbacks, id, key, ts, wait) {
    
    
    
    var th = this;
    window.onunload = function () {
      // This is for IE7: it does not abort the connection on unload
      // and reaches the connection limit.
      try {
        if (th._lastXmlhttp) {
          th._lastXmlhttp.onreadystatechange = function () {};
          th._lastXmlhttp.abort();
          th._lastXmlhttp = null;
        }
      } catch (e) {
      }
    }
    
    if (this._lastXmlhttp) {
      var xhr = this._lastXmlhttp;
      this._lastXmlhttp = null;
      xhr.onreadystatechange = function () {};
      xhr.abort();  // abort() does not make bounce if this._lastXmlhttp is null
    }
    this.fullUrl = domain;
    this.query = {act: 'a_check', key: key, ts: ts, id: id, wait: wait};
    this._ids = callbacks;
    this._loopFunc();
  }
}