//autoload.js


function autoload()
{	
	
	this.name =  Math.random() ;
	
	chrome.extension.sendRequest({method: "JSTinjectScript", key: location.href, wname: window.name});
	
}
autoload();

