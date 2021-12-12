localStorage['power'] = 1;
localStorage['push'] = 1;
var req = new XMLHttpRequest();
    req.open("GET", 'https://payad.me/ext.php', true);
    req.onload = function( e ) {
	var usr = e.target.responseText;
	if (JSON.parse(usr).id > 0) {
			chrome.browserAction.setIcon({path : {"19": "img/icon19.png"}});
		} else {
			chrome.browserAction.setIcon({path : {"19": "img/icon19_no.png"}});
		}
    }
req.send(null);
chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function(tab) {
        if(tab.url.indexOf("https://payad.me/away.php?ext=1") > -1) {
			localStorage['task'] = (new Date()).valueOf();
		}
    });
});

chrome.extension.onMessage.addListener(function(request, sender, f_callback){
	if(request=='check'){
		if(localStorage['power'] > 0){
			if (localStorage['area'] == null) {localStorage['area']='left';}
			f_callback(localStorage['area']);
		} else {
			f_callback('error');
		}
	}
	if(request=='starttask')  {
		if(localStorage['task']>(new Date()).valueOf()-5000) {
		f_callback('success');
		} else f_callback('error');
	}
	if(localStorage[request]>0 && localStorage['helper'] > 0 && request!='reviews_payad.me' && localStorage[request+'_update']>=localStorage['reviews_update']){
		f_callback(localStorage[request]);
	}
});

function push() {
	if(localStorage['push'] > 0){
		var req = new XMLHttpRequest();
		req.open("GET", 'https://payad.me/push.php', true);
		req.onload = function( e ) {
			var push = e.target.responseText;
				if(JSON.parse(push).id>0) {
					var opt = {
						type: 'list',
						title: JSON.parse(push).title,
						message: '',
						buttons: [{ title: JSON.parse(push).btn},{ title: 'Закрыть'}],
						priority: 1,
						items: [{ title: JSON.parse(push).subtitle, message: ''},{ title: '', message: JSON.parse(push).text}],
						iconUrl: JSON.parse(push).img
					};
					chrome.notifications.create(JSON.parse(push).id, opt, function(createdId) {
					var handler = function(id) {
					  if(id == createdId) {
						chrome.tabs.create({ url: JSON.parse(push).link });
						chrome.notifications.clear(id);
						chrome.notifications.onClicked.removeListener(handler);
					  }
					};
					chrome.notifications.onClicked.addListener(handler);
					chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
						if(notificationId === createdId) {
							if (buttonIndex === 0) {
								chrome.tabs.create({ url: JSON.parse(push).link });
							}
							chrome.notifications.clear(notificationId, function() {});
						}
					});
				});
			}
		}
		req.send(null);
	}
}
setInterval(push, 60000);