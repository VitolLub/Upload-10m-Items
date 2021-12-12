var storeData = {}, //contains storeData, chosen storeId, and chosen tag
    domainData={},
    loggedIn = 'unknown',
    sessionKey = undefined,
    username = '',
    isEnabled = true, // Keep the enabled/disabled state of extension
    graphDataMap = {}, // Keeps earnings graph data in store ==> graphData and earningRequestDay
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var earningFeedUrlPattern ='https://' + '__SERVICE__HOST__' + '/services/json/stores/__STORE_ID__/getEarnings?reqId=__REQUEST__ID__&startDate=__START_DATE__&endDate=__END_DATE__';
var earningFeedUrl = earningFeedUrlPattern.replace('__SERVICE__HOST__', bgConfig.psServiceHost);

//fetching storeData in the beginning to prevent latency later. Will be needed postLogin
chrome.storage.sync.get('aps-store-tag-map',function(obj){
    if(obj && obj['aps-store-tag-map']) {
        var dataObj = JSON.parse(obj['aps-store-tag-map']);
        if(dataObj.tag) {
            storeData = {'stores':dataObj.stores, 'store':dataObj.store, 'tag':dataObj.tag};
        }
    }
});

function broadCastMessage(args) {

    chrome.tabs.query({}, (function(args){
        return (function(tabs){
            for (var i=0; i<tabs.length; ++i) {
                chrome.tabs.sendMessage(tabs[i].id, args);
            }
        });
    })(args));
}
function getPopupView() {
    var popups = chrome.extension.getViews({type: "popup"});
    var popup=null;
    if (0 < popups.length) {
        popup = popups[0];
    }
    return popup;
}

chrome.runtime.onInstalled.addListener(function(details){
    var shouldInsertContentScript = false;

    if(details.reason == "install") {
        console.log("First install for extension.");
        shouldInsertContentScript = true;
    }
    else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Extension updated from version " + details.previousVersion + " to version " + thisVersion);
        shouldInsertContentScript = true;
    }

    var cmsConfigs = amzn_ps_cms_configs();
    cmsConfigs.init();

    if(shouldInsertContentScript) {
        // attach platform-content on all the windows
        chrome.tabs.query({}, function(tabs){
            var tabLength = tabs.length;
            for(var index = 0; index < tabLength; index++) {
                var aTab = tabs[index];
                if (shouldAttachContentScript(aTab)) {
                    attachPlatformContentScript(aTab.id);
                }
            }
        });
    }
});

/*chrome.tabs.onActivated.addListener(function(tab){
 attachPlatformContentScript(tab.tabId);
 });*/

function attachPlatformContentScript(tabId) {
    if(isEnabled) {
        chrome.tabs.executeScript(tabId, {file: "js/platform-content.js"}, function () {
        });
    }
}

function setEarningsData(data){
    var runDay = new Date();
    var today = new Date(runDay.getFullYear(), runDay.getMonth(), runDay.getDate() - 1);
    var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    if(!graphDataMap[storeData.store]) {
        graphDataMap[storeData.store] = {};
    }
    graphDataMap[storeData.store].earningRequestDay = runDay;

    var graphData = {
        labels: [],
        data: []
    };
    graphData.startDate = getFormatedDateForChart(lastWeek, false);
    graphData.endDate = getFormatedDateForChart(today, false);
    graphData.lastUpdate = getFormatedDateForChart(runDay, true);
    graphData.authorized = true;

    data = data.earningObjectList;
    var dataLength = data.length;

    var index = 0;
    for (var d = lastWeek; d <= today; d.setDate(d.getDate() + 1)) {
        var _earning =0;
        if(dataLength !== 0) {
            if(index < data.length) {
                var eDate = data[index].date.split("-"); // converting date to YYYY-mm-dd, js restrictions
                var _date = new Date(eDate[2],eDate[1]-1,eDate[0]);
                if(_date.getTime() === d.getTime() ) {
                    _earning = data[index].earning;
                    index++;
                }
            }
        }
        graphData.labels.push(d.getDate());
        graphData.data.push(_earning);
    }

    graphDataMap[storeData.store].graphData = graphData;
    setGraphDataInPopup(graphData);
}

function getFormatedDateForChart(dateObj, addTime) {
    var d = months[dateObj.getMonth()] + " " + dateObj.getDate();
    if(addTime) {
        var min = dateObj.getMinutes() + "";
        if(min.length == 1) {
            min = "0" + min;
        }
        d += " " + dateObj.getFullYear() + ", " + dateObj.getHours() + ":" + min;
    }
    return d;
}

function sendMessage(args, tab) {
    chrome.tabs.sendMessage(tab.id, args, function(response) {
    });
}
function sendConfigs(data,tab){
    if (shouldAttachContentScript(tab)){
        chrome.tabs.insertCSS(tab.id,  {file: "css/css.css"});
        chrome.tabs.executeScript(tab.id,  {file: "js/creation-content.js"},function(){
            if(data)sendMessage(data,tab);
        });
    }
}

function sendPostPublishJs(data, tab) {
    if (shouldAttachContentScript(tab)){
        chrome.tabs.insertCSS(tab.id,  {file: "css/css.css"});
        chrome.tabs.insertCSS(tab.id,  {file: "css/post-publish.css"});
        chrome.tabs.executeScript(tab.id,  {file: "js/post-publish.js"},function(){
            if(data)sendMessage(data,tab);
        });
    }
}

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
    if(changeInfo.status === 'complete'){
        if (shouldAttachContentScript(tab)) {
            attachPlatformContentScript(tab.id);
            setTimeout(function(){
                return sendMessage({method:'runApp'},tab);
            },300);
        }
    }
});

function shouldAttachContentScript(tab) {
    var flag = true;
    if(tab.url.indexOf("chrome-devtools://") != -1 || tab.url.indexOf("chrome-extension://") != -1 ||
        tab.url.indexOf("chrome://") != -1){
        flag = false;
    }
    return flag;
}

function setGraphDataInPopup(graphData) {
    var popup = getPopupView();
    if(popup) {
        popup.earningsGraph.graphData = graphData;
    }
}

function processEarningsGraphRequest() {
    if(storeData.store != '' && typeof sessionKey != 'undefined') {
        if(!graphDataMap[storeData.store]) {
            graphDataMap[storeData.store] = {};
        }
        var graphData = graphDataMap[storeData.store].graphData;
        if(graphData) {
            setGraphDataInPopup(graphData);
        }

        var earningRequestDay = graphDataMap[storeData.store].earningRequestDay;
        var runDay = new Date();
        // incase we have yesterday's data
        if(earningRequestDay && (earningRequestDay.getTime() <=  ( runDay.getTime() + 86400000))) {
            return;
        }

        var today = new Date(runDay.getFullYear(), runDay.getMonth(), runDay.getDate() - 1);
        var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        var endDate = today.getDate()+"-"+(today.getMonth()+1)+"-"+ today.getFullYear();
        var startDate = lastWeek.getDate()+"-"+(lastWeek.getMonth()+1)+"-"+ lastWeek.getFullYear();

        var success = function(resp){
            if(resp.status == 1){ // show actual graph only when authorised
                console.log(resp.data);
                setEarningsData(resp.data);
            }
            else {
                setupForUnauthorizedGraph();
            }
        };
        var error = function(resp){
            console.log(resp);

            // show actual graph only when authorised.
            // 401 response means request is unauthorized
            if(resp && resp.status == 401){
                setupForUnauthorizedGraph();
            }
            else {
                setGraphDataInPopup(graphDataMap[storeData.store].graphData);
            }
        };

        var url = earningFeedUrl.replace('__REQUEST__ID__', sessionKey)
            .replace('__STORE_ID__', storeData.store)
            .replace('__START_DATE__', startDate)
            .replace('__END_DATE__', endDate);
        browser.makeAjaxCall(url, success, error, false);
    }
}

function setupForUnauthorizedGraph(){
    if(!graphDataMap[storeData.store]) {
        graphDataMap[storeData.store] = {};
    }
    graphDataMap[storeData.store].graphData = {
        authorized: false
    };
    setGraphDataInPopup(graphDataMap[storeData.store].graphData);
}

function removeExtnOptionsTab(){
    // Find and close options tab.
    var optionsTabId = 'chrome-extension://' + chrome.runtime.id + '/options.html';
    chrome.tabs.query({'url': optionsTabId}, function(tabs) {
        if(tabs && tabs.length > 0) {
            chrome.tabs.remove(tabs[0].id);
        }
    });
}

//needed only till all the v1-users have a primary-domain. Remove it afterwards.
function createPrimaryDomain(request, sender, args){
    var successCb = function(response){
        //add domain to list of domainIds
        var domainId = response.domainId;
        domainData[response.storeId][domainId]=1;
        args.$Ctx.domainId = domainId;
        if (request.sendJs) sendPostPublishJs(args, sender.tab);
        else sendMessage(args, sender.tab);
    };
    var failureCb = function(){
        console.log('failed to create domain. Do nothing for now.');
    };

    var storeId = request.$Ctx.storeId, count = 0, serviceUrl='';
    var domainMap = domainData[storeId];
    for(var id in domainMap)count++;
    if(count==0){
        //make ajax call for creation of primary domain
        serviceUrl = 'https://' + bgConfig.psServiceHost + '/services/json/stores/' + storeId +
            '?reqId=' + sessionKey + '&locale=' + bgConfig.locale + '&cb='+Math.random();
        browser.makeAjaxCall(serviceUrl, function(resp){successCb(resp.domains[0]);}, failureCb, false);
    }
    else if(count==1){
        //make ajax call to make the only domain as primary
        serviceUrl = 'https://' + bgConfig.psServiceHost + '/services/json/stores/' + storeId +
            '/domains/' + id + '/markPrimary?reqId=' + sessionKey + '&locale=' + bgConfig.locale + '&cb='+Math.random();
        browser.makeAjaxCall(serviceUrl, successCb, failureCb, false);

    }
    else{
        //run the logic which chooses the primary domain-id from the list of domain-ids
        //make service call to make the chosen domain-id as primary
        console.log('do not do anything because publisher has multiple domains');
    }
}

function verifyDomainAuthorization(request, sender, args){
    var successCb = function(response){
        if(response && response.domainId && response.domainId==request.$Ctx.domainId){
            console.log('authorization successfull for domainId');
            domainData[response.storeId][response.domainId]=1;
            if (request.sendJs) sendPostPublishJs(args, sender.tab);
            else sendMessage(_args, sender.tab);
        }
        else console.log('authorization failed for domainId');
    };
    var failureCb = function(){
        console.log('failed to authorize domain. Do nothing for now.');
    };

    var serviceUrl = 'https://' + bgConfig.psServiceHost + '/services/json/stores/' +
        request.$Ctx.storeId + '/domains/' + request.$Ctx.domainId +
        '?reqId=' + sessionKey + '&locale=' + bgConfig.locale + '&cb='+Math.random();
    browser.makeAjaxCall(serviceUrl, successCb, failureCb, false);
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    var method = request.method;
    console.log(storeData);
    if( method == 'getEarnings') {
        processEarningsGraphRequest();
    }
    else if(method == 'signIn') {
        auth.loadLoginWindow(null, request.relogin, request.args);
        removeExtnOptionsTab();
    }
    else if(method == 'signOut') {
        auth.loadLogoutWindow();
        removeExtnOptionsTab();
    }
    else if (method == 'cmsConfigs') {
        var _data = request;
        _data.method = 'setCmsConfigs';
        sendConfigs(_data,sender.tab);
    }
    else if(method == "openOptions"){
        removeExtnOptionsTab();
        chrome.tabs.create({"url": "options.html"});
    }
    else if(method == "closeOptions"){
        removeExtnOptionsTab();
    }
    else if(method == "clearStorage") {
        clearStorage();
    }
    else if(method == 'updateOptions'){
        storeData.store = request.store;
        storeData.tag = request.tag;
        chrome.storage.sync.set({'aps-store-tag-map':JSON.stringify(storeData)});

        broadCastMessage({'method':'resetPlatform'});

        //need to broadcast new state to all tabs opened
        broadCastMessage({'method':'updateTag', 'tag':request.tag});    //needed only for cms and $$
        broadCastMessage({'method':'sendDomainId'});    //needed only for pp
    }
    else if(method == 'appStatus') {
        isEnabled = request.value;
        resetIcons(isEnabled);
        broadCastMessage({method:'appStatus',value:isEnabled});
        /*
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (shouldAttachContentScript(tabs[0])) {
                attachPlatformContentScript(tabs[0].id);
            }
        });*/
    }
    else if(method == 'attachShortCode') {

        sendConfigs(request, sender.tab);
    }
    else if(method == 'postLogout') {
        loggedIn = false;
        var popup = getPopupView();
        if(popup) {
            popup.settings.loggedIn = false;
        }

        broadCastMessage({'method':'postLogout'});
    }
    else if(method=='verifyDomainId'){ //needed only by post-publish
        if(loggedIn == true){
            var domainId = request.$Ctx.domainId, storeId = request.$Ctx.storeId;
            var domainMap = domainData[storeId];
            if(domainMap){
                var _args = {'method': 'postAuthorize', 'reqId': sessionKey, '$Ctx':request.$Ctx};

                //possibility of this happening is very less. This piece will get removed once we are sure
                // that all old publishers have a primary-domainId
                if(domainId === 'default'){
                    createPrimaryDomain(request, sender, _args);
                }
                else{
                    if (domainMap[domainId]) {
                        if (request.sendJs) sendPostPublishJs(_args, sender.tab);
                        else sendMessage(_args, sender.tab);
                    }
                    else{
                        console.log('user is authorized for the store, but domain-id not present. Updating list of authorized domain-ids once again');
                        verifyDomainAuthorization(request, sender, _args);
                    }
                }

            }
            else{
                //store not present implies that logged-in user is not the owner of the store present in context
                console.log('store - ' +  storeId + ' is not owned by logged-in user');
            }
        }
    }
});

function clearStorage() {
    chrome.storage.sync.get("aps-options", function(obj){
        if(obj && obj["aps-options"]){
            var optionsData = JSON.parse(obj["aps-options"]);

            processForReset(optionsData.cmsPlatformConfigData);
            processForReset(optionsData.shortCodeDomainMap);

            if(optionsData.configFlags){
                optionsData.configFlags.shortenLinks = true;
            }
            else {
                optionsData.configFlags = {
                    'shortenLinks': true
                };
            }

            var storageData = {
                "platform_configs_compose": null,
                "platform_configs_html": null,
                "aps-options": JSON.stringify(optionsData)
            };

            chrome.storage.sync.set(storageData);

            removeExtnOptionsTab();
        }
    });
}

function processForReset(dataMap) {
    if(dataMap){
        for(var p in dataMap){
            dataMap[p].enabled = true;
        }
    }
}

function resetIcons(isEnabled) {
    if(!isEnabled){
        chrome.browserAction.setIcon({
            path: "../img/icon-disabled-38.png"
        });
    }
    else{
        chrome.browserAction.setIcon({
            path: "../img/icon-38.png"
        });
    }
}

var auth = AmznAuthModule(browser);
auth.postLoginRouteBack = function(dataList, loggedinUsername, reqId) {
    loggedIn = true;
    sessionKey = reqId;
    username = loggedinUsername;
    graphDataMap = {};

    //update the stores-tag data in storeData
    var stores = {};
    for(var i=0;i<dataList.length;i++) {
        var data = dataList[i];
        var storeId = data.id;
        stores[storeId] = data.tags;
        var domains = data.domains, map = {};
        for(var j=0;j<domains.length;j++){
            map[domains[j].domainId] = 1;
        }
        domainData[storeId] = map;
    }
    //storeData.stores=stores;

    //if the old selected tag is present in the current storeData, choose it for linking. o/w choose the first tag
    var selectedStore = storeData.store, foundStore=false, foundTag=false;
    if(stores[selectedStore]){
        foundStore=true;
        var tags = stores[selectedStore];
        var selectedTag = storeData.tag;
        for(var j=0;j<tags.length;j++){
            if(selectedTag==tags[j]){
                foundTag=true;
                break;
            }
        }
    }
    if(!foundTag){
        if(foundStore) storeData.tag=stores[selectedStore];
        else {
            storeData.store=dataList[0].id;
            storeData.tag= dataList[0].tags[0];
        }
    }

    chrome.storage.sync.set({'aps-store-tag-map':JSON.stringify(storeData)});

    //need to broadcast new state to all tabs opened
    broadCastMessage({'method':'updateTag', 'tag':storeData.tag});    //needed only for cms and $$
    broadCastMessage({'method':'sendDomainId'});    //needed only for pp

    var popup = getPopupView();
    if(popup) {
        popup.settings.storeData = storeData;
        popup.settings.username = loggedinUsername;
        popup.settings.loggedIn = true;
    }

    processEarningsGraphRequest();
};
auth.postLogoutRouteBack = function() {
    broadCastMessage({'method':'postLogout'});  //needed only for pp
    loggedIn = false;
    graphDataMap = {};
    domainData = {};
    var popup = getPopupView();
    if(popup) {
        popup.settings.loggedIn = false;
    }
};
auth.init();
