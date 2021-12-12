// CommonMemory - something like Memcache for Chrome extension
// Provide crosstab data with expiration and immediately answer
// author: Dave Modis dumbashable@gmail.com
// special for SurfEarner extension

function CommonMemory()
{

  this.data = {};// key - value data
  this.exp = {};// key expired values
  this.prefix = '_cm_';
  this.prefix_exp = '_cmexp_';
  this.loaded = false;

  var _t = this;
  // load existed data from localStorage
  chrome.storage.local.get(null, function(items) {
    var keys = Object.keys(items);
    for(var i in keys)
    {
      if(new RegExp(_t.prefix).test(keys[i]) && items[keys[i]] !== null)
        _t.data[keys[i]] = items[keys[i]];

      if(new RegExp(_t.prefix_exp).test(keys[i]) && items[keys[i]] !== null)
        _t.exp[keys[i]] = items[keys[i]];
    }
    _t.loaded = true;
  });

  // listen for changes in other tabs
  chrome.storage.onChanged.addListener(function(changes) {
    var keys = Object.keys(changes);

    for(var i in keys)
    {
      if(new RegExp(_t.prefix).test(keys[i]))
        _t.data[keys[i]] = changes[keys[i]].newValue;

      if(new RegExp(_t.prefix_exp).test(keys[i]))
        _t.exp[keys[i]] = changes[keys[i]].newValue;
    }
  });
}

CommonMemory.prototype.get = function(key)
{
  var res = [];

  if(key.constructor !== Array)
    key = [String(key)];

  for(var i in key)
  {
    var k = this.prefix+key[i],
    ke = this.prefix_exp+key[i];
    // check if exist and not expired
    if(
      this.data[k] !== undefined
      && this.exp[ke] > 0
      && this.exp[ke] > (new Date()).valueOf()
    )
      res.push(this.data[k]);
    else
      res.push(null);
  }

  if(!res.length)
    return null;

  if(res.length === 1)
    return res[0];
  else
    return res;
};

CommonMemory.prototype.set = function(key, value, exp)
{
  var set = {},
  time = (new Date()).valueOf();
  set[this.prefix+key] = value;
  set[this.prefix_exp+key] = exp ? time+exp*1000 : time+1800000;

  this.data[this.prefix+key] = value;
  this.exp[this.prefix_exp+key] = set[this.prefix_exp+key];

  chrome.storage.local.set(set);
};

CommonMemory.prototype.remove = function(key)
{
  if(key.constructor !== Array)
    key = [String(key)];

  var keys = [];
  var set = {};
  for(var i in key)
  {
    var d = this.prefix+key[i], e = this.prefix_exp+key[i];
    set[d] = null;
    set[e] = null;
    keys.push(d);
    keys.push(e);
    delete this.data[d];
    delete this.exp[e];
  }

  chrome.storage.local.set(set); // delete data in other tabs
  chrome.storage.local.remove(key);
};

CommonMemory.prototype.clear = function()
{
  var _t = this;
  chrome.storage.local.get(null, function(items) {
      var keys = Object.keys(items);

      for(var i in keys)
      {
        var key = keys[i];
        if(new RegExp(_t.prefix).test(key) || new RegExp(_t.prefix_exp).test(key))
          chrome.storage.local.remove(key);
      }

  });
};
