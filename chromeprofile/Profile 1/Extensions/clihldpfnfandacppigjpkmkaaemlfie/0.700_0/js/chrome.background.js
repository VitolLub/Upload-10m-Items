var browser = {
    //useLocal = true => do not use sync-storage, use chrome.storage.local
    get: function(key, cb, useLocal) {
        var getCallback = function(obj){
            var configs = null;
            if(key !== null){
                var configs = obj[key];
                if(typeof(configs) === "string") {
                    configs = JSON.parse(configs);
                }
                else {
                    configs = undefined;
                }
            }
            else{
                if(obj){
                    configs = {};
                    for(var index in obj){
                        configs[index] = JSON.parse(obj[index]);
                    }
                }
            }

            if(cb) {
                cb(configs);
            }
        };
        if(useLocal) chrome.storage.local.get(key,getCallback);
        else chrome.storage.sync.get(key,getCallback);
    },
    set: function(key, data, cb, useLocal) {
        var obj = {};
        obj[key] = data;
        if(useLocal) chrome.storage.local.set(obj);
        else chrome.storage.sync.set(obj);
        if(cb) cb();
    },
    add: function(key, data, cb, useLocal) {
        this.get(key,
            function(value) {
                if(!value) {
                    value = [];
                }
                value.push(data);
                this.set(value);
                if(cb) cb(value);
            },
            useLocal
        );
    },
    makeAjaxCall : function(url, successCb, failureCb, sync ) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (function(xhr) {
            return (function() {
                try {
                    if (xhr.readyState == 4 ) {
                        if(xhr.status == 404 || xhr.status == 500 ) {
                            console.log("error in ajax for url - " + url);
                            failureCb();
                        }
                        else if(xhr.status == 401) {
                            console.log("Unauthorized access error in ajax for url -   - " + url);
                            failureCb({status: xhr.status});
                        }
                        else {
                            successCb(JSON.parse(xhr.response));
                        }
                    }
                }
                catch(e) {
                    console.log("error while making ajax call with url - " + url + " with error - " + e.message);
                    failureCb();
                }
            });
        })(xhr);

        try{
            var useAsync = sync ? false : true;
            xhr.open("GET", url, useAsync);
            xhr.send(null);
        }
        catch(exception){
            console.log("error while starting ajax call with url - " + url + " with error - " + exception.message);
            failureCb();
        }
    },
    openTab : function(window, url, cb, options) {
        var h = options && options.height ? options.height : 400;
        var w = options && options.width ? options.width : 670;
        var left = (screen.width/2) - (w/2);
        var top = (screen.height/2) - (h/2);

        var createData = {
            "url":url,
            "focused": true,
            "height": h,
            "width": w,
            "left": left,
            "top": top,
            "type": "popup"
        };

        chrome.windows.create(createData, function(window) {
            browser.loginPopup = window;
            browser.closed = false;
            cb(window);
        });
    },
    isTabOpen : function(window) {
        return !this.closed;
    },
    closeTab : function(window) {
        chrome.windows.remove(window.id);
    },
    sendMessageToBg: function(args) {
        chrome.runtime.sendMessage(args);
    },
    queryTabs: function(args, cb) {
        chrome.tabs.query(args, function(tabs) {
            if(cb) {
                cb(tabs);
            }
        });
    },
    closed : true,
    loginPopup : null
};

chrome.windows.onRemoved.addListener(function afterClose(winId) {
    if(browser.loginPopup && winId == browser.loginPopup.id) {
        browser.closed = true;
        browser.loginPopup = null;
    }
});