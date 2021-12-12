var extnOptions = (function($) {

    var storeData = null;
    var optionsData = null;

    var storeSelector = null;
    var tagSelector = null;
    var blogsContainer = null;
    var sitesContainer = null;
    var notificationContainer = null;
    var notificationMsgContainer = null;

    var blogs = null;
    var blogsFallbackCompose = null;
    var blogsFallbackHtml = null;
    var sites = null;
    var otherFlags = null;
    var isDirty = false;

    function backgroundMessageListener(request, sender) {
        if (request.method == "postLogout") {
            closeOptionsTab();
        }
    }

    function markDirty() {
        isDirty = true;
    }

    function markClean() {
        isDirty = false;
    }

    function handleWidgetChange() {
        markDirty();
    }

    function closeOptionsTab(){
        var args = {'method': 'closeOptions'};
        browser.sendMessageToBg(args);
    }

    function initializeOptions (){
        browser.get(null, function(obj){
            var fallbackCompose = [];
            var fallbackHtml = [];

            if(obj) {
                if(obj["aps-options"]) {
                    optionsData = obj["aps-options"];
                }
                else{
                    optionsData = {};
                }

                if(obj.platform_configs_compose) {
                    fallbackCompose = obj.platform_configs_compose;
                }
                if(obj.platform_configs_html) {
                    fallbackHtml = obj.platform_configs_html;
                }
            }

            // Fallback for compose
            optionsData.fallbackCompose = fallbackCompose;

            // Fallback for html
            optionsData.fallbackHtml = fallbackHtml;

            storeSelector = document.getElementById('amznps-options-storeid');
            tagSelector = document.getElementById('amznps-options-trackingid');

            try {
                showMask();
                var bgWindowObj = chrome.extension.getBackgroundPage();
                bgWindowObj.auth.reloadStoreData(successCb, errorCb);
            }
            catch(error) {
                console.error(error);
            }

            // Linking options
            setupLinkingOptions();

            // Other flags
            setupOtherFlags();
        });
    }

    function showMask() {
        document.getElementById("amznps-options-overlay").style.display = "block";
    }
    function hideMask() {
        document.getElementById("amznps-options-overlay").style.display = "none";
    }

    function successCb(resp) {
        try {
            var status = resp.status;

            if("SUCCESS" == status.status_type) {
                // Need to ensure that store data also gets set properly everywhere
                processStoreData(resp.stores);
                hideMask();
            }
            else {
                alert("Could not get the latest store data. Please sign in again.");
                closeOptionsTab();
                console.error("Error in initializeOptions - status : " + status);
            }
        } catch (e) {
            alert("Could not get the latest store data. Please sign in again.");
            closeOptionsTab();
            console.error("Error in initializeOptions - success : " + e.message);
        }
    }

    function errorCb() {
        alert("Could not get the latest store data. Please sign in again.");
        console.error("Error in initializeOptions - error");
        closeOptionsTab();
    }

    function processStoreData(dataList) {
        storeData = {};
        var stores = {};
        if(dataList.length > 0) {
            for(var i=0;i<dataList.length;i++) {
                var data = dataList[i];
                var storeId = data.id;
                stores[storeId] = data.tags;
            }
            storeData.stores = stores;

            var bgWindowObj = chrome.extension.getBackgroundPage();
            var selectedStore = bgWindowObj.storeData.store ? bgWindowObj.storeData.store : dataList[0].id;
            var selectedTag = bgWindowObj.storeData.tag ? bgWindowObj.storeData.tag : dataList[0].tags[0];

            setupStoreIds(stores, selectedStore, selectedTag);
        }
    }

    function setupStoreIds(stores, selectedStore, selectedTag) {
        if(!storeSelector) {
            return;
        }

        var length = storeSelector.options.length;
        for (var i = length-1; i >=0; i--) {
            storeSelector.options[i] = null;
        }
        storeSelector.options.length = 0;

        if(!stores) {
            return;
        }

        for(var storeId in stores) {
            var option = document.createElement('option');
            option.setAttribute('value', storeId);
            option.text = storeId;
            storeSelector.appendChild(option);
        }

        storeSelector.value = selectedStore;
        setupTrackingIds(stores[selectedStore], selectedTag);
    }

    function setupTrackingIds(tags, selectedTag) {
        if(!tagSelector) {
            return;
        }

        var length = tagSelector.options.length;
        for (var i = length-1; i >=0; i--) {
            tagSelector.options[i] = null;
        }
        tagSelector.options.length = 0;

        if(!tags) {
            return;
        }

        for(var index in tags) {
            var tagId = tags[index];
            var option = document.createElement('option');
            option.setAttribute('value', tagId);
            option.text = tagId;
            tagSelector.appendChild(option);
        }

        tagSelector.value = selectedTag;
    }

    function setupLinkingOptions(){
        blogsContainer = blogsContainer ? blogsContainer : document.getElementById("amznps-options-blogs");
        sitesContainer = sitesContainer ? sitesContainer : document.getElementById("amznps-options-sites");

        blogs = {};
        blogsFallbackCompose = {};
        blogsFallbackHtml = {};
        sites = {};

        createLinkingOption(blogsContainer, optionsData.cmsPlatformConfigData, blogs, "platform");
        createLinkingOption(blogsContainer, optionsData.fallbackCompose, blogsFallbackCompose, "displayName");
        createLinkingOption(blogsContainer, optionsData.fallbackHtml, blogsFallbackHtml, "displayName");
        createLinkingOption(sitesContainer, optionsData.shortCodeDomainMap, sites, "displayName");
    }

    function setupOtherFlags() {
        otherFlags = {};
        otherFlags.shortenLinks = document.getElementById("amznps-options-shortlink-social");
        otherFlags.shortenLinks.checked = optionsData.configFlags.shortenLinks;
    }

    function createLinkingOption(container, dataList, elementMap, identifier) {
        var length = dataList.length;
        for(var index = 0; index < length; index++) {
            var aDatum = dataList[index];
            var id = aDatum[identifier];

            var wrapper = document.createElement('div');
            wrapper.setAttribute('class', aDatum.enabled ? "amznps-extn" : "amznps-extn-disabled");
            container.appendChild(wrapper);

            var text = document.createElement('span');
            text.setAttribute('class', "amznps-extn-text");
            text.appendChild(document.createTextNode(aDatum.displayName));
            wrapper.appendChild(text);

            var actionWrapper = document.createElement('span');
            actionWrapper.setAttribute('class', "amznps-extn-close");
            wrapper.appendChild(actionWrapper);

            var actionId = "amznps-options-linking-" + id;
            var action = document.createElement('input');
            action.setAttribute('type', "checkbox");
            action.setAttribute('name', actionId);
            action.setAttribute('id', actionId);
            if(aDatum.enabled) {
                action.setAttribute('checked', true);
            }

            elementMap[id] = action;
            action.onchange = processLinkingOptionChange.bind(action);

            actionWrapper.appendChild(action);

            var actionLabel = document.createElement('label');
            actionLabel.setAttribute('for', actionId);
            actionWrapper.appendChild(actionLabel);
        }
    }

    function processLinkingOptionChange() {
        this.parentElement.parentElement.className = this.checked ? "amznps-extn" : "amznps-extn-disabled";
        markDirty();
    }

    function saveOptions() {
        try {
            if(isDirty) {
                // Update options for CMS and sites
                updateLinkingOptions(blogs, optionsData.cmsPlatformConfigData, "platform"); // CMS
                updateLinkingOptions(sites, optionsData.shortCodeDomainMap, "displayName"); // Sites
                updateOtherFlags(otherFlags, optionsData.configFlags); // Flags
                browser.set('aps-options', JSON.stringify(optionsData)); // Persit data in local storage

                // Update linking options for Fallback
                var composeFallbackDataList  = getUpdatedFallbackOptions(blogsFallbackCompose, optionsData.fallbackCompose);
                var htmlFallbackDataList  = getUpdatedFallbackOptions(blogsFallbackHtml, optionsData.fallbackHtml);
                browser.set('platform_configs_compose', JSON.stringify(composeFallbackDataList)); // Persist in local storage
                browser.set('platform_configs_html', JSON.stringify(htmlFallbackDataList)); // Persist in local storage

                // Update store and tag
                var args = {
                    'method': 'updateOptions',
                    'store': storeSelector.value,
                    'tag': tagSelector.value
                };
                browser.sendMessageToBg(args);
            }

            showSuccessNotification("Settings saved successfully.");
            markClean();
        }
        catch(exception) {
            showErrorNotification("Error occurred while trying to save settings. Please try again.");
        }
    }

    function showSuccessNotification(message) {
        showNotification("success", message);
    }

    function showErrorNotification(message) {
        showNotification("error", message);
    }

    function showNotification(type, message) {
        var className = "amznps-options-notification " + (type === "success" ? "amznps-options-notification-success" : "amznps-options-notification-error");
        notificationContainer.firstElementChild.className = className;
        notificationContainer.style.display = "block";
        notificationMsgContainer.innerText = message;

        if(type === "success") {
            var notificationTimer = setTimeout(function(){
                hideNotification();
                clearTimeout(notificationTimer);
            }, 3000);
        }
    }

    function hideNotification() {
        if(notificationContainer){
            notificationContainer.style.display = "none";
        }
    }

    function getUpdatedFallbackOptions(elementMap, dataMap) {
        var dataList = [];
        for(var index in dataMap) {
            var aDatum = dataMap[index];
            aDatum.enabled = elementMap[aDatum.displayName].checked;
            dataList.push(aDatum);
        }
        return dataList;
    }

    function updateOtherFlags(elementsMap, dataMap) {
        for(var flag in elementsMap) {
            dataMap[flag] = elementsMap[flag].checked;
        }
    }

    function updateLinkingOptions(elementMap, dataList, identifier) {
        var length = dataList.length;
        for(var index = 0; index < length; index++) {
            var aDatum = dataList[index];
            var id = aDatum[identifier];
            aDatum.enabled = elementMap[id].checked;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {

        browser.queryTabs({active: true, currentWindow: true}, function(tabs) {
            var signOut = document.getElementById('amznps-options-signout');
            signOut.onclick = function() {
                var args = {'method':'signOut'};
                browser.sendMessageToBg(args);
            };

            var storeSelector = storeSelector || document.getElementById('amznps-options-storeid');
            var tagSelector = document.getElementById('amznps-options-trackingid');

            storeSelector.onchange = function() {
                var selectedTag = null;
                var tags = storeData.stores[storeSelector.value];
                if(tags && tags.length > 0) {
                    selectedTag = tags[0];
                }
                setupTrackingIds(tags, selectedTag);
                markDirty();
            };

            tagSelector.onchange = function() {
                markDirty();
            };

            var saveButton = document.getElementById("amznps-options-save");
            saveButton.onclick = function() {
                saveOptions();
            };

            var shortenLinksFlag = document.getElementById("amznps-options-shortlink-social");
            shortenLinksFlag.onchange = function() {
                markDirty();
            };

            notificationContainer = document.getElementById("amznps-options-notification");
            notificationMsgContainer = document.getElementById("amznps-options-notification-msg");
            var notificationAction = document.getElementById("amznps-options-notification-close");
            notificationAction.onclick = function() {
                hideNotification();
            };

            // init
            initializeOptions();
        });

        // Add message listener for background messages
        chrome.runtime.onMessage.addListener(backgroundMessageListener);

    });

    var options = {};


    return options;

}(AmznJ));
