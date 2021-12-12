var resetBindings = function() {
    // Unbind events of creation-content.js as the script gets injected again and
    // events were not getting unbound leading to repeated calls
    if(window.amznPs && window.amznPs.bootStrap && window.amznPs.link) {
        var composeBody = window.amznPs.bootStrap.composeBody;
        if(composeBody) {
            composeBody.data('amznPsBmMarker', null);
            composeBody.unbind('click', window.amznPs.link.allowComposeModeLinkCreation);
            composeBody.unbind('keyup', window.amznPs.link.keyboardSelectionWatcher);
        }

        var htmlTextArea = window.amznPs.bootStrap.htmlTextArea;
        if(htmlTextArea) {
            htmlTextArea.data('amznPsBmMarker', null);
            htmlTextArea.unbind('click', window.amznPs.link.allowHtmlModeLinkCreation);
            htmlTextArea.unbind('keyup', window.amznPs.link.keyboardSelectionWatcher);
        }
        $(DOCUMENT).unbind('click', window.amznPs.link.attachImageLinkEvents);
        $(DOCUMENT).unbind('click', window.amznPs.link.attachEditDeleteEventsToLinks);
    }
};

resetBindings();

/**
 * Created by vishalbn on 9/17/14.
 */

function amzn_ps_bm_cms_configs () {
    var cmsPlatformConfigData = [];
    var shortCodeDomainMap = [];
    var configFlags = {};

    var initializeOptions = function(cb){
        var localOptionsConfigKey = window.amznPs.contentBootstrap.getLocalOptionsConfigKey();
        window.amznPs.browser.getPlatformConfigs(localOptionsConfigKey, function(optionsObj){
            if(optionsObj){
                cmsPlatformConfigData = optionsObj.cmsPlatformConfigData;
                shortCodeDomainMap = optionsObj.shortCodeDomainMap;
                configFlags = optionsObj.configFlags;

                if(cb) {
                    cb(cmsPlatformConfigData, shortCodeDomainMap, configFlags);
                }
            }
            else {
                logger.log('Cannot get cms configs from local storage');
            }
        });
    };

    var getCmsConfigs = function(){
        return cmsPlatformConfigData;
    };

    var getConfigFlags = function() {
        return configFlags;
    };

    var getShortCodeDomain = function() {
        var shortCodeDomain = [];
        for(var index in shortCodeDomainMap){
            var aDomain = shortCodeDomainMap[index];
            if(aDomain.enabled){
                shortCodeDomain.push(aDomain.pattern);
            }
        }

        return shortCodeDomain;
    };

    var getShortCodeDomainMap = function() {
        return shortCodeDomainMap;
    };

    return {
        getCmsConfigs: getCmsConfigs,
        getShortCodeDomain: getShortCodeDomain,
        getShortCodeDomainMap: getShortCodeDomainMap,
        getConfigFlags: getConfigFlags,
        init: initializeOptions
    };
}
//
// Module to toggle between console or in-memory logging. We use console logging
// in dev envs (when available) and just keep the output in memory as a string in
// prod. The in-memory log dump is useful for diagnostics.
//

var logger = function() {
    var logContent = '';
    var log;

    var dumpLog = function() {
        return logContent;
    };

    var debugLog = function(msg) {
        logContent += (msg + "\n");
    };

    var init = function(enable) {
        var consoleLoggerPresent = false;

        if((typeof config != 'undefined' && config.enableConsoleLogging) || enable) {
            try {
                if (typeof console != "undefined" && typeof console.log != "undefined") {
                    consoleLoggerPresent = true;
                    log = function () { console.log.apply(console, arguments); };

                    //this should throw an error and get caught if we have any issue in flipping to the console log function
                    //typically happens in chrome
                    log("Checking logger functionality");
                } else {
                    log = debugLog;
                }
            } catch (e) {
                //nothing to do, let the default impl get used
                log = debugLog;
                //if this fails then we really have a problem!
                var msg = "Error setting console log. Falling back to debugLog function";
                if(consoleLoggerPresent) {
                    console.log(msg);
                }
                log(msg);
            }
        } else {
            log = debugLog;
        }
    };

    init();
    return {
        'init': init,
        'log': log,
        'dumpLog': dumpLog,
        'debugLog': debugLog
    };
}();

/**
 * Created by misanand on 5/7/14.
 */
/****Browser specific*************/
function amzn_ps_bm_browser() {
    DOCUMENT = document;
    var interfaceMembers = ['getPlatformConfigs','setPlatformConfigs','addLocalPlatformConfig','init']; // these member function that should be implemented across all browsers
    this.getInterfaceMembers = function(){
        return interfaceMembers;
    };
    this.name = 'chrome';
}

amzn_ps_bm_browser.prototype.getPlatformConfigs = function (key,callback){
    chrome.storage.sync.get(key,function(obj){
        var configs = null;
        if(key !== null){
            var configs = obj[key];
            if(typeof(configs) === 'string'){
                configs = JSON.parse(configs);
            }else configs = [];
        }
        else{
            if(obj){
                configs = {};
                for(var index in obj){
                    configs[index] = JSON.parse(obj[index]);
                }
            }
        }
        callback(configs);
    });
};

//change it to setConfigs, used to store non-platform data as well.
amzn_ps_bm_browser.prototype.setPlatformConfigs = function(key,data) {
    var obj = {};
    obj[key] = data;
    chrome.storage.sync.set(obj);
};

amzn_ps_bm_browser.prototype.addLocalPlatformConfig = function(key,data) {
    var self = this;
    self.getPlatformConfigs(key,function (configs) {
        configs.push(data);
        configs = JSON.stringify(configs);
        self.setPlatformConfigs(key,configs);
    });
};

amzn_ps_bm_browser.prototype.sendMessage = function(data, cb) {
    if(!cb) {
        cb = function(response){}
    }
    chrome.runtime.sendMessage(data, cb);
};

amzn_ps_bm_browser.prototype.initPlatformConfigs = function() {
    if(bStrap.platform == "fallback") {
        window.amznPs.link.deAttachTextLinkEventToCompose();
        window.amznPs.link.deAttachTextLinkEventToHtml();
    }
};

amzn_ps_bm_browser.prototype.onUrlChange = function(data) {
    // Dummy impl to maintain the interface. Not needed in Chrome.
};


amzn_ps_bm_browser.prototype.init = function(utilites){

    var interfaceMembers = this.getInterfaceMembers();
    for(var _inst in interfaceMembers)
        if(typeof(this[interfaceMembers[_inst]] ) != 'function') {
            //window.amznPs.logger.log('Browser interface not implemented, some extension api may break');
        }

    chrome.runtime.onMessage.addListener(utilites.browserMessages().listen);
};


function amzn_ps_fallback() {

    var fallbackEnabled = true;

    var findComposePlatform = function() {
        var urlPatterns = [
            new RegExp("^"+window.location.protocol+"//"+window.location.href),
            new RegExp("^"+"//"+window.location.href),
            new RegExp("^"+"javascript")
        ];
        checkComposePlatform(DOCUMENT,urlPatterns);
    };

    var checkComposePlatform = function(element,urlPatterns) {
        var contentBootstrap = window.amznPs.contentBootstrap;
        var target = element.querySelectorAll('iframe');
        var _check = function(_ele) {
            var src = _ele.getAttribute('src');
            if(src) {
                var  matchFound = false;
                for(var i=0;i<urlPatterns.length;i++) {
                    if(urlPatterns[i].exec(src) != null) {
                        matchFound = true;
                        break;
                    }
                }
                if(!matchFound) return;
            }
            var composeWindow = _ele.contentWindow;
            var selection = window.amznPs.platformUtils.getWindowSelection(_ele);
            if(selection.length > 0) {
                var composeIframeId = _ele.getAttribute('id');
                if(!composeIframeId && _ele.getAttribute('class') ) {
                    var classes = _ele.getAttribute('class').split(" ");
                    var composeIframeId =  _ele.tagName.toLowerCase();
                    var amznClasses = contentBootstrap.getAmznSpecificClass();
                    for(var i=0;i<classes.length;i++) {
                        var _class = classes[i].trim();
                        if( !amznClasses[_class] ) composeIframeId +="."+_class; // not storing amazon specific classes in config
                    }
                } else composeIframeId = "#" + composeIframeId;

                var configData = {
                    'composeIframeId':composeIframeId,
                    'displayName': getPlatformName(_ele.baseURI),
                    'enabled': true
                };
                window.amznPs.contentBootstrap.setPlatform(configData,'compose');
                window.amznPs.browser.addLocalPlatformConfig(contentBootstrap.getLocalComposeConfigsKey(), configData);
                return true;
            }
            try {
                return checkComposePlatform(_ele.contentDocument,urlPatterns); // incase the compose iframe is hidden below several iframes
            }
            catch(e) {
                window.amznPs.logger.log(e); // catching cross site xss attempt exception
            }
        };
        for(var i=0;i<target.length;i++) {
            _check(target[i]);
        }
    };

    var getPlatformName = function(url) {
        var platformName = "";

        url = url.replace("https://", "").replace("http://", "");
        platformName = url.substring(0, url.indexOf("/"));

        return platformName;
    };

    var findHTMLPlatform = function() {
        checkHTMLPlatform(DOCUMENT);
    };

    var checkHTMLPlatform = function(element) {

        window.amznPs.logger.log("checking all editable elements");
        var selector = 'textarea,input[type="text"]';
        var target = element.querySelectorAll(selector);
        var contentBootstrap = window.amznPs.contentBootstrap;
        var _check = function(_ele){
            var _length = window.amznPs.platformUtils.getCaretSelection(_ele);
            if( _length  > 0) {
                var htmlTextAreaId =  _ele.getAttribute('id');
                if(!htmlTextAreaId && _ele.getAttribute('class')) {
                    var classes = _ele.getAttribute('class').split(" ");
                    var htmlTextAreaId =  _ele.tagName.toLowerCase();
                    var amznClasses = contentBootstrap.getAmznSpecificClass();
                    for(var i=0;i<classes.length;i++) {
                        var _class = classes[i].trim();
                        if( !amznClasses[_class] )htmlTextAreaId +="." + _class;
                    }
                } else htmlTextAreaId = "#" + htmlTextAreaId;

                var configData = {
                    'htmlIframeId': null,
                    'htmlTextAreaId': htmlTextAreaId,
                    'displayName': getPlatformName(_ele.baseURI),
                    'enabled': true
                };

                contentBootstrap.setPlatform(configData,'html');
                window.amznPs.browser.addLocalPlatformConfig(contentBootstrap.getLocalHtmlConfigsKey(), configData);
                return true;
            }
        };
        for(var i=0;i<target.length;i++) {
            _check(target[i]);
        }
    };

    var disable = function() {
        fallbackEnabled = false;
    };

    var init = function() {
        if(fallbackEnabled) {
            var composeFallbackData = window.amznPs.contentBootstrap.getPlatform('compose');
            if(!composeFallbackData) {
                findComposePlatform();
            }

            var htmlFallbackData = window.amznPs.contentBootstrap.getPlatform('html');
            if(!htmlFallbackData) {
                findHTMLPlatform();
            }
        }
    };

    return {
        init:init,
        disable:disable
    };
}

/**
 * Created by misanand on 4/30/14.
 */

//todo functions getWindowSelection and getCaretSelection can be pulled out in a separate common module
var platformUtils = {
    'getCaretSelection' : function(el) {

        var text = '';
        if (typeof(el.selectionStart) !== 'undefined' && el.value) {
            text = el.value.substring(el.selectionStart,el.selectionEnd)
        } else if ( typeof(DOCUMENT.selection) !== 'undefined') {
            el.focus();

            var r = DOCUMENT.selection.createRange();
            if (r == null) {
                return 0;
            }

            var re = el.createTextRange(),
                rc = re.duplicate();
            re.moveToBookmark(r.getBookmark());
            rc.setEndPoint('EndToStart', re);

            text = rc.text;
        }
        text = text.trim();
        return text.length;
    },

    'getWindowSelection' : function(iframe) {
        var win = null;
        var doc = null;
        var text = "";

        try {
            win = iframe.contentWindow;
            doc = iframe.contentDocument || win.document;
        }
        catch(e) {
            return text;
        }

        if (win.getSelection) {
            if(win.getSelection())
                text = win.getSelection().toString();
        } else if (doc.selection && doc.selection.type != "Control") {
            text = doc.selection.createRange().text;
        }
        return text;
    },

    'browserMessages' :  function () {
        var actions = {
            'getCmsConfigs' : function(request){
                // send the stored configs
                window.amznPs.sendCmsConfigs();
            },
            'ping' : function(request) {
                // do nothing
            },
            'userAction': function(request) {
                // user clicked on extension button call fallback
                window.amznPs.fallback.init();
            },
            'sendDomainId': function(request) { //needed by post-publish
                if($Ctx && $Ctx.domainId) {
                    window.amznPs.browser.sendMessage({'method':'verifyDomainId', '$Ctx':$Ctx,
                        'sendJs':(typeof psPostPublishJsInitialized == 'undefined')});
                }
            },
            'resetPlatform' : function(req) {
                resetBindings();
                window.amznPs.contentBootstrap.reinitConfigs();
            }
        };
        var listen = function (request, sender, sendResponse) {
            var _call = request.method;
            if (_call && ( typeof actions[_call] == 'function')) {
                actions[_call](request);
            }
        };
        return{
            actions: actions,
            listen: listen
        };
    }
};


function amzn_ps_platform() {

    var $eventUnBinder =function (element,event,handler,cb,cbParams) {
        if (element.removeEventListener)
            element.removeEventListener (event,handler,false);
        if (element.detachEvent)
            element.detachEvent ('on'+event,handler);
        if(cb){
            if(cbParams)
                cb.apply(null,cbParams);
            else cb();
        }
    };

    var $eventBinder = function(element,event,handler){
        if(element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else {
            element.attachEvent('on'+event, handler);
        }
    };

    var attachEvent = function(element,event,handler){
        $eventUnBinder(element,event,handler, $eventBinder,[element,event,handler]);
    };

    var verifyComposePlatform = function(index,configs){
        if (window.amznPs.contentBootstrap.getPlatform('compose')) return; // html platform is already present
        if (index >= configs.length) {
            // no configs matched, attach compose mode initialization on each click
            attachEvent(DOCUMENT,'click',initComposeModeElements);
            return;
        }
        var data = configs[index];
        var composeIframe = DOCUMENT.querySelector(data.composeIframeId);
        if( !composeIframe) {
            verifyComposePlatform(index+1,configs);
            return null;
        }
        var composeBody = composeIframe.contentDocument.getElementsByTagName("body");
        var composeWindow = composeIframe.contentWindow;
        //means that the current platform is correct
        if(composeBody && composeBody.length>0) {
            var platformData = {
                composeIframeId: data.composeIframeId,
                platform: data.platform,
                enabled: data.enabled
            };

            $eventUnBinder(DOCUMENT,'click',initComposeModeElements);
            window.amznPs.contentBootstrap.setPlatform(platformData, 'compose');
            return data.platform;
        } else {
            verifyComposePlatform(index+1,configs);
            return null;
        }
    };

    var initComposeModeElements = function() {
        var _f = function(){
            verifyComposePlatform(0,window.amznPs.cmsConfigs);

            window.amznPs.browser.getPlatformConfigs(window.amznPs.contentBootstrap.getLocalComposeConfigsKey(),function(localConfigs){
                window.amznPs.platform.verifyComposePlatform(0,localConfigs);
            });
            window.amznPs.logger.log('Cannot get compose-mode elements');
            return null;
        };
        setTimeout(_f,500);
    };

    var verifyHtmlPlatform = function(index,configs) {
        if (window.amznPs.contentBootstrap.getPlatform('html')) return; // html platform is already present
        if (index >= configs.length) {
            // no configs matched, attach html mode initialization on each click
            attachEvent(DOCUMENT,'click',initHtmlModeElements);
            return;
        }
        var data = configs[index];
        var htmlIframe = DOCUMENT.querySelector(data.htmlIframeId);
        var htmlWindow = window;
        var htmlTextArea =  DOCUMENT.querySelector(data.htmlTextAreaId);
        if(htmlIframe) { // html mode inside a iframe
            htmlWindow =htmlIframe.contentWindow;
            htmlTextArea =htmlIframe.contentDocument.querySelector(data.htmlTextAreaId);
        }
        if(!htmlTextArea) {
            verifyHtmlPlatform(index+1,configs);
            return null;
        }

        var platformData = {
            htmlIframeId: htmlIframe != null ? data.htmlIframeId : null,
            htmlTextAreaId: data.htmlTextAreaId,
            enabled: data.enabled
        };

        window.amznPs.logger.log('Html-mode successfully initialized, unbinding htmlComponentsListener');
        $eventUnBinder(DOCUMENT,'click',initHtmlModeElements);
        window.amznPs.contentBootstrap.setPlatform(platformData, 'html');
        return ;
    };

    var initHtmlModeElements = function() {
        var _f = function(){
            verifyHtmlPlatform(0,window.amznPs.cmsConfigs);

            window.amznPs.browser.getPlatformConfigs(window.amznPs.contentBootstrap.getLocalHtmlConfigsKey(),function(localConfigs){
                window.amznPs.platform.verifyHtmlPlatform(0,localConfigs);
            });
            window.amznPs.logger.log('Cannot get html-mode elements');
            return null;
        };
        setTimeout(_f,500);
    };

    var disableCmsLookup = function() {
        $eventUnBinder(DOCUMENT,'click',initHtmlModeElements);
        $eventUnBinder(DOCUMENT,'click',initComposeModeElements);
    };

    var init = function() {
        if(!window.amznPs.contentBootstrap.getPlatform('html'))
            initHtmlModeElements();

        if(!window.amznPs.contentBootstrap.getPlatform('compose'))
            initComposeModeElements();
    };

    return {
        init:init,
        verifyComposePlatform : verifyComposePlatform,
        verifyHtmlPlatform: verifyHtmlPlatform,
        disableCmsLookup: disableCmsLookup
    };
}

/**
 * Created by misanand on 7/1/14.
 */
function amzn_ps_content_bootstrap() {
    var localComposeConfigsKey = 'platform_configs_compose';
    var localHtmlConfigsKey = 'platform_configs_html';
    var localOptionsConfigKey = 'aps-options';
    var amznSpecificClass = { 'amznps-short-code' : true };
    var platform = {};
    var getLocalComposeConfigsKey = function(){ return localComposeConfigsKey;};
    var getLocalHtmlConfigsKey = function(){ return localHtmlConfigsKey;};
    var getLocalOptionsConfigKey = function(){ return localOptionsConfigKey; };
    var getAmznSpecificClass = function() { return amznSpecificClass;};
    var getPlatform = function(type) { return platform[type];};
    var setPlatform = function(_platform,type) {
        platform[type] = _platform;
        sendCmsConfigs();
    };

    var sendCmsConfigs = function() {
        window.amznPs.browser.sendMessage({platform:platform,method:'cmsConfigs'});
    };
    var initComponents = function() {
        var _configs = amzn_ps_bm_cms_configs();
        window.amznPs = {
            contentBootstrap:amzn_ps_content_bootstrap(),
            fallback:amzn_ps_fallback(),
            platform:amzn_ps_platform(),
            platformUtils :  platformUtils,
            browser: new amzn_ps_bm_browser(),
            logger : logger
        };
        window.amznPs.logger.init(false);
        window.amznPs.browser.init(platformUtils);
        _configs.init(configInitCallback);
    };

    var reinitConfigs = function() {
        platform = {};
        var _configs = amzn_ps_bm_cms_configs();
        _configs.init(configInitCallback);
    };

    var configInitCallback = function(cmsConfigs, shortCodeDomainMap, configFlags) {
        window.amznPs.cmsConfigs = cmsConfigs;
        window.amznPs.options = {
            configFlags: configFlags
        };
        window.amznPs.platform.init();
        setShortCodePlatform(shortCodeDomainMap, configFlags);
    };

    var setShortCodePlatform = function(domains, configFlags) {
        var _href = window.location.href;
        for(var i = 0; i < domains.length; i++) {
            var aDomain = domains[i];
            var reg = new RegExp(aDomain.pattern);
            if(reg.exec(_href)){
                window.amznPs.options.shortCodeInfo = aDomain;
                window.amznPs.browser.sendMessage({
                    method:'attachShortCode',
                    shortCodeInfo: aDomain,
                    configFlags: configFlags
                });
                break;
            }
        }

    };
    return {
        getLocalComposeConfigsKey:getLocalComposeConfigsKey,
        getLocalHtmlConfigsKey:getLocalHtmlConfigsKey,
        getLocalOptionsConfigKey:getLocalOptionsConfigKey,
        getAmznSpecificClass:getAmznSpecificClass,
        getPlatform: getPlatform,
        setPlatform : setPlatform,
        sendCmsConfigs: sendCmsConfigs,
        initComponents : initComponents,
        reinitConfigs: reinitConfigs
    };
}

function initApp() {
    if( typeof window.amznPs == 'undefined' || typeof window.amznPs.platform == 'undefined') {
        var _b = amzn_ps_content_bootstrap();
        _b.initComponents();
    }
    else {
        window.amznPs.contentBootstrap.reinitConfigs();
    }
}
var scriptName = "platform-content";
initApp();

;
if(typeof psHandshakeInitialized != 'undefined') {
    console.log('post-publish handshake listeners already initialized');
}
else {
    var psHandshakeInitialized = true;
    var $Ctx = {};
    (function() {
        var contextListener = function(e) {
            var context = e.detail;
            if(context){
                $Ctx = context;
                DOCUMENT.removeEventListener('AmznPsContext', contextListener);
                DOCUMENT.dispatchEvent(new CustomEvent('AmznPsHandshakeAcknowledge'));
                window.amznPs.browser.sendMessage({'method':'verifyDomainId', '$Ctx':$Ctx, 'sendJs':true});
                window.amznPs.platform.disableCmsLookup();
                window.amznPs.fallback.disable();
            }
        };

        DOCUMENT.addEventListener('AmznPsRelogin',function(e){
            window.amznPs.browser.sendMessage({'method':'signIn', 'relogin':true,
                'args':{'domainId':$Ctx.domainId, 'storeId':$Ctx.storeId}});
        });
        DOCUMENT.addEventListener('AmznPsContext', contextListener);
        DOCUMENT.dispatchEvent(new CustomEvent('AmznPsHandshake'));
    })();
}

