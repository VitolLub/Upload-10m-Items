console.log('Hendlers: Start');
function Handlers() {
 var _t = this;

 this.ikey = '__se_handlers_i_';
 this.items = {};

 this.loaded = false;

 this.handlers = {
  surfVideo: function( data ){
   // Показывает рекламный видеоролик
    console.log('Handlers.surfVideo');
    var dv = document.createElement("div");
    dv.id = "__se_mva_data";
    dv.setAttribute("data-sess", data.session);
    dv.setAttribute("data-uuid", data.uid);
    dv.setAttribute("data-host", data.host);
    dv.setAttribute("data-partner", data.key);
    dv.setAttribute("data-amount", data.amount);
    document.body.appendChild(dv);
    insertLocalScript("/main/content/json2html.js","body");
    insertLocalScript("/main/content/surf.js","body");
    insertLocalScript("/main/content/handlers/mva.js","body");
    return true;
  },
 }

 chrome.storage.local.get(null, function (items) {
  var keys = Object.keys(items);
  var tm = ((new Date()).valueOf()/1000)^0;
  var rm = [];
  for( var i in keys ){
   if( new RegExp(_t.ikey).test(keys[i]) && items[keys[i]] !== null ){
    if( ! items[keys[i]].tm || tm > items[keys[i]].tm + items[keys[i]].ttl ){
     rm.push( keys[i] );
     continue;
    }
    _t.items[ items [keys [i]].id ] = items[keys[i]];
   }
  }
  if( rm.length > 0 ){
   chrome.storage.local.remove( rm );
  }
  _t.loaded = true;
 });
 chrome.storage.onChanged.addListener(function (changes) {
  var keys = Object.keys(changes);
  for( var i in keys ){
   if( new RegExp(_t.ikey).test(keys[i])){
    if( changes[keys[i]].newValue )
     _t.items[ changes[ keys [i]].newValue.id ] = changes[keys[i]].newValue;
   }
  }
 });

 return this;
}

Handlers.prototype.addItem = function( item ){
 item.tm = ((new Date()).valueOf()/1000)^0;
 this.items[item.id] = item;
 var set = {};
 set[this.ikey+item.id] = item;
 chrome.storage.local.set(set);
 return true;
};

Handlers.prototype.apply = function(){
 var tm = ((new Date()).valueOf()/1000)^0,rm = [],result = false;
 for( var i in this.items ){
  var item = this.items [i];
  if( tm > item.tm + item.ttl ){
   rm.push( this.ikey + i );
   continue;
  }
  if( item.hosts !== "*" && item.hosts.indexOf( location.host ) < 0 ) continue;
  if( this.handlers [item.handler] ){
   if( item.oneTime ){
    var irm = [];
    irm.push( this.ikey + i );
    chrome.storage.local.remove( irm );
    delete this.items [i];
   }
   this.handlers [item.handler]( item.data );
   result = true;
   break;
  }
 }
 if( rm.length > 0 ){
  chrome.storage.local.remove( rm );
 }
 return result;
};
