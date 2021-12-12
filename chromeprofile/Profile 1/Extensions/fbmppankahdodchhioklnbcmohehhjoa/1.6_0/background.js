chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(tab.id, {file: "flipit.js"})
});


/*
*	Right-click context menu
*/
function genericOnClick(info, tab) {
	if (info && info.linkUrl)
	{
		saveUrl = info.linkUrl;
	}
	if (info && info.mediaType && (info.mediaType == 'image') )
	{
		saveUrl = info.srcUrl
	}
	newtab = chrome.tabs.create({url:saveUrl, active:false}, function (tab) {
		chrome.tabs.executeScript(tab.id, {file: "flipit.js"}, function () {
		    chrome.tabs.remove(tab.id);
		})
	});
}

var contexts = ["link", "image"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Flip " + context + " to magazine";
  var id = chrome.contextMenus.create({
  	"title": title, "contexts":[context],
  	"onclick": genericOnClick
  });
}

