function amzn_ps_cms_configs () {
    var cmsPlatformConfigData = [
        {
            'composeIframeId': 'iframe#postingComposeBox',
            'htmlIframeId': null,
            'htmlTextAreaId': 'textarea#postingHtmlBox',
            'platform': 'blogger',
            'displayName': 'Blogger'

        },
        {
            'composeIframeId': 'iframe#content_ifr',
            'htmlIframeId': null,
            'htmlTextAreaId': 'textarea#content',
            'platform': 'wordpress',
            'displayName': 'WordPress'
        },
        {
            'composeIframeId': 'iframe#jform_articletext_ifr',
            'htmlIframeId': null,
            'htmlTextAreaId': 'textarea#jform_articletext',
            'platform': 'joomla',
            'displayName': 'Joomla'
        },
        {
            'composeIframeId': null,
            'htmlIframeId': 'iframe.overlay-element.overlay-active',
            'htmlTextAreaId': 'textarea#edit-body-und-0-value',
            'platform': 'drupal',
            'displayName': 'Drupal'
        },

        /*
        {
            'composeIframeId': 'iframe#post_two_ifr',
            'htmlIframeId': null,
            'htmlTextAreaId': null,
            'platform': 'tumblr',
            'displayName': 'Tumblr'
        },*/
        {
            'composeIframeId': 'iframe#body_ifr',
            'htmlIframeId': null,
            'htmlTextAreaId': 'textarea#body',
            'platform': 'typepad',
            'displayName': 'Typepad'
        }
    ];

    var shortCodeDomainMap = [
        {
            "pattern": "/*facebook.com/*",
            "displayName": "Facebook"
        },
        {
            "pattern": "/*twitter.com/*",
            "displayName": "Twitter"
        },
        /*{
            "pattern": "/*reddit.com/*",
            "displayName": "Reddit"
        },*/
        {
            "pattern": "/*linkedin.com/*",
            "displayName": "LinkedIn"
        },
        /*{
            "pattern": "/*plus.google.com/*",
            "displayName": "Google+"
        },*/
        {
            "pattern": "/*youtube.com/*",
            "displayName": "YouTube"
        }
    ];

    var configFlags = {
        'shortenLinks': true
    };

    var initializeOptions = function(){
        browser.get(null, function(obj){
            var optionsObj = null;
            if(obj){
                optionsObj = obj['aps-options'] ? obj['aps-options'] : null;
            }

            // Default CMS
            var savedCmsData = (optionsObj && optionsObj.cmsPlatformConfigData) ? optionsObj.cmsPlatformConfigData : null;
            formatLinkingData(cmsPlatformConfigData, savedCmsData, "platform");

            // Default Sites
            var savedSiteData = (optionsObj && optionsObj.shortCodeDomainMap) ? optionsObj.shortCodeDomainMap : null;
            formatLinkingData(shortCodeDomainMap, savedSiteData, "displayName");

            // Flags
            if(optionsObj && optionsObj.configFlags){
                configFlags.shortenLinks = optionsObj.configFlags.shortenLinks !== null ? optionsObj.configFlags.shortenLinks : true;
            }

            var optionsData = {
                "cmsPlatformConfigData": cmsPlatformConfigData,
                "shortCodeDomainMap": shortCodeDomainMap,
                "configFlags": configFlags
            };

            browser.set('aps-options', JSON.stringify(optionsData));
        });
    };

    var formatLinkingData = function(dataList, savedDataList, identifier) {
        var length = dataList.length;
        for(var index = 0; index < length; index++) {
            var aDatum = dataList[index];
            var matchingSavedData = null;
            if(savedDataList !== null && savedDataList.length > 0) {
                var sLength = savedDataList.length;
                for(var sIndex = 0;  sIndex < sLength; sIndex++) {
                    var savedData = savedDataList[sIndex];
                    if(savedData[identifier] === aDatum[identifier]) {
                        matchingSavedData = savedData;
                        break;
                    }
                }
            }

            if(matchingSavedData !== null) {
                aDatum.enabled = matchingSavedData.enabled;
            }
            else {
                aDatum.enabled = true;
            }
        }
    };

    return {
        init: initializeOptions
    };
}
