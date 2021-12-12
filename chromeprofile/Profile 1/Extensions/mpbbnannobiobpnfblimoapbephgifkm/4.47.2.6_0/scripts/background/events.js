// Default
chrome.app.runtime.onLaunched.addListener(function (launchData) {
    try {
        logMessage('launched');

        appWindow_Create(null, onLaunched_SendResponse);
    }
    catch (e) {
        onLaunched_SendResponse(e);
    }
});

function onLaunched_SendResponse(result) {
    try {
        logMessage('result=' + result);
    }
    catch (e) {
        logException(e);
    }
}

// Extenal Message
chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
    try {
        logMessage('message=' + message);

        if (message == 'undefined' || message == null || message.messageType == 'undefined' || message.messageType == null) {
            throw "unrecognized message";
        }

        if (message.messageType == 'isInstalled') {
            var manifest = chrome.runtime.getManifest();
            var current_version = manifest.version;

            logMessage('version=' + current_version);

            sendResponse({ "version": current_version });
        }
        else if (message.messageType == 'launch') {
            /*
            if (message.isComputeEngine == 'undefined' || message.isComputeEngine == null || message.isComputeEngine != "true")
            {
                throw "unrecognized message caller";
            }
            */

            appWindow_Create(message);

            logMessage('success=true, message=');

            sendResponse({ success: true, message: "" });
        }
        else {
            throw "unrecognized message type";
        }
    }
    catch (e) {
        logException(e);

        sendResponse({ success: false, message: e.toString() });
    }
});

// Message Handler
function appWindow_Create(message) {
    if (message == null) {
        logMessage("message=null");
    }
    else {
        logMessage("message=" + message);
    }

    chrome.storage.local.get
    (
        "screenSettings",
        function (result) {
            logMessage("chrome.storage.local.get(result=" + result + ")");

            appWindow_CreateCallback(message, result);
        }
    );
}

function appWindow_CreateCallback(message, result) {
    try {
        logMessage("message=" + message + ", result=" + result);

        var screenSettings = null;

        if (typeof result !== 'undefined' && typeof result.screenSettings !== 'undefined' && (result.screenSettings != null || result.screenSettings != 'undefined')) {
            screenSettings = result.screenSettings;
        }

        var left = 0;
        var top = 0;
        var width = screen.width - 200;
        var height = screen.height - 200;
        var state = "normal";

        width -= width % 4;

        //logMessage("width=" + width + ";height=" + height + ";");

        left = (screen.width / 2) - (width / 2);
        top = (screen.height / 2) - (height / 2);

        if (screenSettings != null) {
            var numOpenWindows = chrome.app.window.getAll().length; // going to tile each additional window
            left = screenSettings.left + ((numOpenWindows * 10) % 100);
            top = screenSettings.top + ((numOpenWindows * 10) % 100);
            width = screenSettings.width;
            height = screenSettings.height;

            if (screenSettings.isFullscreen) {
                state = "fullscreen";
            }
            else if (screenSettings.isMaximized) {
                state = "maximized";
            }
        }

        var args = {
            'state': state,
            'innerBounds': {
                'width': width,
                'height': height
            },
            'outerBounds': {
                'left': left,
                'top': top
            }
        };

        var appWindow = null;
        var alreadyOpen = false;

        if (message != null) {
            if (message.id != 'undefined' && message.id != null && message.id.length > 0) {
                args['id'] = message.id;
            }
            else if (message.urlAddress != 'undefined' && message.urlAddress != null && message.urlAddress.length > 0) {
                args['id'] = message.urlAddress;

                appWindow = chrome.app.window.get(args['id']);

                if (appWindow != null) {
                    alreadyOpen = true;
                }
            }
        }

        logMessage("alreadyOpen=" + alreadyOpen);

        //if (id == "") {
        //    appWindow_Instance++;

        //    id = appWindow_Instance.toString();
        //}

        var isComputeEngine = false;
        var appId = "cbkkbcmdlboombapidmoeolnmdacpkch";

        var manifest = chrome.runtime.getManifest();
        var current_version = manifest.version;
        var current_version_parts = current_version.split(".");

        console.log("Creating Chrome RDP Version:" + current_version)

        if (current_version_parts == null || current_version_parts.length < 3) {
            logException("Unknown version");

            return;
        }

        if (current_version_parts[2] == "2") {
            isComputeEngine = true;
            appId = "mpbbnannobiobpnfblimoapbephgifkm";
        }

        chrome.app.window.create('../nacl.html', args,
            function (createdWindow) {
                try {
                    if (createdWindow == null) {
                        logMessage("createdWindow=null");
                    }
                    else {
                        logMessage("createdWindow=" + createdWindow.id);

                        var urlAddress = "";
                        var userName = "";
                        var password = "";

                        if (message != null) {
                            urlAddress = message.urlAddress;
                            userName = message.userName;
                            password = message.password;
                        }

                        message =
                        {
                            "urlAddress": urlAddress,
                            "userName": userName,
                            "password": password,
                            "isComputeEngine": isComputeEngine,
                        };

                        createdWindow.env = message;

                        if (alreadyOpen) {
                            chrome.runtime.sendMessage(appId, { extensionId: id, messageType: "connect", urlAddress: message.urlAddress, userName: message.userName, password: message.password, isComputeEngine: isComputeEngine });
                        }
                    }
                }
                catch (e) {
                    logException(e);
                }
            }
        );
    }
    catch (e) {
        logException(e);
    }
}

var _debug = true;

function logMessage(e) {
    if (_debug) {
        var caller = "events.js";

        if (arguments.callee.caller != null && arguments.callee.caller.name != null && arguments.callee.caller.name != "") {
            caller = arguments.callee.caller.name;
        }

        console.log("Function:" + caller + ";Message:" + e)
    }
}

function logException(e) {
    //if (_debug)
    //{
    var caller = "events.js";

    if (arguments.callee.caller != null && arguments.callee.caller.name != null && arguments.callee.caller.name != "") {
        caller = arguments.callee.caller.name;
    }

    console.log("Function:" + caller + ";Exception:" + e)
    //}
}
