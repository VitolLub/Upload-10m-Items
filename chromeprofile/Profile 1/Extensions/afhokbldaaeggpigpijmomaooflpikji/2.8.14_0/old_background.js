chrome.runtime.setUninstallURL('https://maketime.online/api/uninstall');

chrome.browserAction.onClicked.addListener(function(activeTab)
{
    var newURL = "chrome-extension://afhokbldaaeggpigpijmomaooflpikji/index.html";
    chrome.tabs.create({ url: newURL });
});