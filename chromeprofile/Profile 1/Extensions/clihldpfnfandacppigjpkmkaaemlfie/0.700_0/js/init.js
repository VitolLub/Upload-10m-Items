function openUrl (url) {
    alert(url);

}

var settings = (function($) {
    var chromeDefaultUrl = 'chrome://newtab/';

    var loggedIn = false,
        storeData = {}, username = '',
        $loggedInBlock = null,
        $loggedOutBlock = null,
        $storeSelector = null,
        $tagSelector = null;

    function sendMessage(args) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, args, function(response) {
                //now dashboard will work without content-scripts, so commenting this code
                /*if(typeof response === 'undefined') {
                 chrome.tabs.create({'url': 'https://affiliate-program.amazon.com/'});
                 }*/
            });
        });
    }

    function sendMessageToBg(args) {
        chrome.runtime.sendMessage(args);
    }

    function populateTags(tags) {
        var tagSelector = $tagSelector || document.getElementById('amznps-tags-drop-down');

        //remove old tags if already present, this will not trigger onchange
        var length = tagSelector.options.length;
        for (var i = length-1; i >=0; i--) {
            tagSelector.options[i] = null;
        }

        tagSelector.className = tagSelector.className.replace(/\bamznps-hidden\b/,'');
        var selectedTag = storeData.tag;

        //populate new tags
        for(var i=0;i<tags.length;i++) {
            var tag = tags[i];
            var option = document.createElement('option');
            option.setAttribute('value', tag);
            option.text = tag;
            tagSelector.appendChild(option);
            if(selectedTag && selectedTag === tag) {
                option.selected = true;
            }
        }
    }

    function populateStores() {
        var storeSelector = $storeSelector || document.getElementById('amznps-stores-drop-down');
        if(!storeSelector) return;

        var map = storeData.stores;
        if(!map) return;

        var length = storeSelector.options.length;
        for (var i = length-1; i >=0; i--) {
            storeSelector.options[i] = null;
        }

        var selectedStore = storeData.store;
        var populated = false;
        for(var key in map) {
            var option = document.createElement('option');
            option.setAttribute('value', key);
            option.text = key;
            storeSelector.appendChild(option);
            if(selectedStore && selectedStore === key) {
                option.selected = true;
                var tags = map[key];
                populateTags(tags);
            }
            populated = true;
        }

        if(populated) storeSelector.className = storeSelector.className.replace(/\bamznps-hidden\b/,'');
    }

    function resetHeight() {
        var height = "200px";
        if(loggedIn) {
            if(earningsGraph.graphData && earningsGraph.graphData.authorized === false) {
                height = "275px";
            }
            else {
                height = "450px";
            }
        }

        // Setting height of the body explicitly so that the browser action popup renders correctly.
        document.body.style.height = height;
    }

    var settings ={'loggedIn':false, storeData:{}};

    settings.resetHeight = resetHeight;

    Object.defineProperties(settings, {
        'loggedIn': {
            'set': function(value) {
                if($loggedInBlock) {
                    $loggedInBlock.css({
                        'display': value ? 'block' : 'none'
                    });
                    $loggedOutBlock.css({
                        'display': value ? 'none' : 'block'
                    });
                }
                loggedIn = value;

                resetHeight();
            },
            'get': function() {
                return loggedIn;
            }
        },
        'storeData': {
            // make sure to do the dirty check
            'set':function(value) {
                storeData = value;
                populateStores();
            },
            'get': function() {
                return storeData;
            }
        },
        'username': {
            'set':function(value) {
                username = value;
                $('.amznps-username').text(value);
            },
            'get':function() {
                return username;
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function () {

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            $loggedInBlock = $('#amznps-loggedin');
            $loggedOutBlock = $('#amznps-loggedout');
            $storeSelector = document.getElementById('amznps-stores-drop-down');
            $tagSelector = document.getElementById('amznps-tags-drop-down');

            var bgWindowObj = chrome.extension.getBackgroundPage();
            //settings.storeData = bgWindowObj.storeData;
            settings.username = bgWindowObj.username;
            settings.loggedIn = bgWindowObj.loggedIn==='unknown' ? false : bgWindowObj.loggedIn;


            sendMessage({'method':'userAction'});

            var signIn = document.getElementById('amzn-ps-ext-signin');
            signIn.onclick = function(){
                var args = {'method':'signIn'};
                sendMessageToBg(args);
            };

            var signOut = document.getElementById('amzn-ps-ext-signout');
            signOut.onclick = function(){
                var args = {'method':'signOut'};
                sendMessageToBg(args);
            };

            var extnOptions = document.getElementById('amzn-ext-options');
            extnOptions.onclick = function(){
                var args = {'method':'openOptions'};
                sendMessageToBg(args);
            };

            var stat = document.getElementById('stat');
            if(stat) {
                stat.checked = bgWindowObj.isEnabled;
                stat.onchange = function(){
                    var args = {'method':'appStatus',value : stat.checked };
                    sendMessageToBg(args);
                };
            }
            /*var cls = document.getElementById('amzn-clr-local-plt');
             cls.onclick = function(){
             var args = {'method':'clearStorage'};
             sendMessage(args);
             sendMessageToBg(args);
             };*/
            var links = document.getElementsByClassName('link');
            for(var i=0; i < links.length;i++) {
                var url = links[i].href;
                links[i].onclick = function(url) {
                    return function(){
                        chrome.tabs.create({'url': url});
                    };
                }(url);
            }

            /*$storeSelector.onchange = function() {
                var selectedStore = $storeSelector.options[$storeSelector.selectedIndex].value;
                populateTags(storeData.stores[selectedStore]);
                var selectedTag = $tagSelector.options[$tagSelector.selectedIndex].value;
                storeData.tag = bgWindowObj.selectedTag = selectedTag;
                storeData.store = bgWindowObj.selectedStore = selectedStore;
                var args = {'method':'changeTag', 'store':selectedStore, 'tag':selectedTag};
                sendMessage(args);
            };
            $tagSelector.onchange = function() {
                var selectedTag = $tagSelector.options[$tagSelector.selectedIndex].value;
                storeData.tag = bgWindowObj.selectedTag = selectedTag;
                var args = {'method':'changeTag', 'store':storeData.store, 'tag':selectedTag};
                sendMessage(args);
            }*/
        });
    });

    return settings;

}(AmznJ));

//todo remove dependency on AmznJ, user native JS