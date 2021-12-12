//
// Contains logic for handling authentication. We open a login window and run a
// timer in the background till login is completed or the window is closed.
// other functions include keeping track of the reqId (CSRF checks), tracking
// login expiry etc
//

function AmznAuthModule(storeType) {

    function authInstance(storeType) {
        var constants = {
            'logoutUrl': 'https://' + '__SERVICE__HOST__' + '/services/logout?locale=__LOCALE__',
            'loginUrl': 'https://' + '__SERVICE__HOST__' + '/services/login?reqId=__REQUEST__ID__&locale=__LOCALE__',
            'pingUrl': 'https://' + '__SERVICE__HOST__' + '/services/v2/checkSession?reqId=__REQUEST__ID__&locale=__LOCALE__'
        };

        

        var loginRetryMsgId = "LOGIN-RETRY",
            loginWaitTimeoutMsgId = "LOGIN-WAIT-TIMEOUT",
            unauthorizedLoginMsgId = "UNAUTHORIZED-LOGIN",
            loginExpiredMsgId = "LOGIN-EXPIRED",
            loginFailedMsg = "LOGIN-CHECK-FAILED",
            associateLoggedIn = false,
            sessionKey=undefined,
            pendingSessionCheck = false,
            startedLogin = false,
            loginWaitCount = 0,
            maxLoginWaitCount = 200,
            loginMonitorTimer = null,
            sessionInitRetryAttempt = 0,
            sessionInitMaxRetryCount = 15,
            cancelLoginCheck = false,
            loginExpiryCheckInterval = 30 * 60 * 1000,
            sessionKeyCookieName = "aps-req-id",
            loginPopup = undefined,
            logoutPopup =undefined,
            pingUrl='', pingUrlPattern='', loginUrl='', loginUrlPattern='',
            logoutUrl='',
            that = this;

        var resetLoginMonitor = function() {

            //spawn a login check job anticipating expiry after some time
            clearTimeout(loginMonitorTimer);
            loginMonitorTimer = setTimeout(function() {
                checkLogin(true);
            }, loginExpiryCheckInterval);
        };

        var onLoginExpired =  function(type) {
            /*notifications.createUniqueErrorMsg("LOGIN-EXPIRED",
             strings.get("ps-login-expired") , strings.get("ps-login-expired-msg"));*/
            postLogout();
        };

        var onLoginCheckFailed =  function(type) {
            /*notifications.createUniqueErrorMsg(loginFailedMsg,
             strings.get("ps-working-on-it") , strings.get("ps-server-down"));*/
            postLogout();
        };

        var onLoginCheckCancelled = function(msgId) {
            cancelLoginCheck = true;
            onLoginCheckFailed("cancel");
            /*amznpubstudio_jQuery(notifications.reusableNotifications[msgId]).remove();*/
            return false;
        };

        var onLoginTimeout = function() {
            //close the loginPopup so that users don't come back and try using it
            if(loginPopup) {
                browser.closeTab(loginPopup);
            }
            loginPopup = undefined;

            loginWaitCount = 0;
            startedLogin = false;

            /*var msg = strings.get("ps-sign-in-timeout");
             notifications.createUniqueErrorMsg(loginWaitTimeoutMsgId, "" , msg);*/

            console.log('calling postLogout after login timed out');
            postLogout();
        };

        //can show a timer in the dashboard while check is in progress
        var onAuthStart = function() {

        };

        var reloadUrlsUsingSessionKey = function() {
            console.log("reqId param: " + sessionKey);

            pingUrl = pingUrlPattern.replace('__REQUEST__ID__', sessionKey);
            loginUrl = loginUrlPattern.replace('__REQUEST__ID__', sessionKey);
        };

        var postLogin = function(stores, username) {

            //remove all login error messages
            cleanUpLoginErrorMessages();
            reloadUrlsUsingSessionKey();
            pendingSessionCheck = false;
            startedLogin = false;
            associateLoggedIn = true;
            cancelLoginCheck = false;
            sessionInitRetryAttempt = 0;

            if(loginPopup) {
                browser.closeTab(loginPopup);
            }
            loginPopup = undefined;

            that.postLoginRouteBack(stores, username, sessionKey);

            console.log('updated dashboard state in postLogin');

            resetLoginMonitor();
        };

        var checkLogin = function(noRetry) {
            try {

                if(cancelLoginCheck) {
                    console.log("Login check cancelled.");
                    return;
                }
                pendingSessionCheck = true;
                console.log("Pinging server - " + pingUrl);
                browser.makeAjaxCall(pingUrl+'&cb='+Math.random(), success, error);

            } catch (e) {
                console.log("Error in checkLogin - " + e.message);
            }
        };

        var success = function(resp) {
            try {
                var status = resp.status;
                sessionInitRetryAttempt = 0; //reset error retry count;
                cleanUpLoginErrorMessages();

                console.log("Ping successful");
                if("SUCCESS" == status.status_type) {
                    //we are doing a check within a valid session, so don't initialize/reset anything
                    if(associateLoggedIn) {
                        console.log("No change in logged in state");
                        pendingSessionCheck = false;
                        resetLoginMonitor();
                    } else {
                        console.log("Session is valid. Initializing components");
                        postLogin(resp.stores, resp.username);
                    }
                } else {
                    //means that login window was opened
                    if(startedLogin) {
                        if(loginWaitCount > maxLoginWaitCount) {
                            console.log("Login timed out...");
                            onLoginTimeout();
                        }
                        else if(!browser.isTabOpen(loginPopup)) {
                            console.log("Login window is closed. Stopping wait");
                            postLogout();
                            //run checkLogin just once more with default-pingUrl
                            checkLogin(true);
                        }
                        else {
                            console.log("Not authenticated yet. Continuing wait - " + loginWaitCount);
                            loginWaitCount++;
                            setTimeout(function() {
                                checkLogin(false);
                            }, 1000);
                        }
                    }
                    else if("INVALID_CREDENTIALS" == status.details) {
                        console.log("Not authenticated. Loading login");
                        postLogout();
                    }
                    //no csrf because only our extension can talk to this code
                    else if("MISMATCH_IN_SESSION_KEY" == status.details) {
                        browser.get(sessionKeyCookieName,
                            function(storedSessionKey) {
                                if(storedSessionKey != sessionKey) {
                                    sessionKey = storedSessionKey;
                                    reloadUrlsUsingSessionKey();
                                    //trigger a check again, to make sure the new key is valid
                                    setTimeout(function() {
                                        checkLogin(true);
                                    }, 100);
                                }
                                else {
                                    console.log("Failed to use existing reqId. Re-login required - " + status.details);
                                    postLogout();
                                }
                            },
                            true);
                    }
                    else if("UNAUTHORIZED_STORE" == status.details ||
                        "UNAUTHORIZED_DOMAIN" == status.details ) {
                        console.log("Logged in user is not authorized");
                        postLogout();
                    }
                    else {
                        console.log("Unknown status data - " + status.details);
                        postLogout();
                    }
                }
            } catch (e) {
                console.log("Error in auth.success - " + e.message);
            }
        };

        var error = function(noRetry) {
            try {
                if(cancelLoginCheck) {
                    console.log("Login check cancelled.");
                    return;
                }

                if(noRetry) {
                    console.log("Error checking login status - not retrying since the noRetry flag is specified");
                    return;
                }

                //TODO check once again
                if(startedLogin && (!browser.isTabOpen(loginPopup))) {
                    console.log("Login window is closed. Stopping wait");
                    postLogout();
                    return;
                }

                sessionInitRetryAttempt++;

                if(sessionInitRetryAttempt > sessionInitMaxRetryCount) {
                    console.log("Too many errors in login attempt - giving up");
                    onLoginCheckFailed("timeout");
                } else {
                    console.log("Failed to ping server - Retrying login check: " + sessionInitRetryAttempt);
                    if(sessionInitRetryAttempt > 1) { //raise an alert only if we fail more than a couple of times
                        showSessionInitializationErrorMessage();
                    }

                    //not limiting the retry count when we fail to contact the server
                    setTimeout(function() {
                        checkLogin(noRetry);
                    }, 1000);
                }

            } catch (e) {
                console.log("Error in auth.error - " + e.message);
            }
        };

        var showSessionInitializationErrorMessage = function() {
        };

        var cleanUpLoginErrorMessages = function() {
        };

        var postLogout =  function(popup) {
            //remove username and stores from extension dashboard drop-down
            that.postLogoutRouteBack();

            if(popup) {
                logoutPopup = popup;
            }

            //close the logout window after a while
            setTimeout((function(popover){
                return (function() {
                    if(popover!= undefined) {
                        browser.closeTab(popover);
                    }
                    logoutPopup = undefined;
                });
            })(logoutPopup), 4000);

            startedLogin = false;
            associateLoggedIn = false;
            pendingSessionCheck = false;
            sessionInitRetryAttempt = 0;
            reloadUrlsUsingSessionKey();
        };

        var getNotificationMsg = function() {
            return [loginExpiredMsgId, 'Session has expired. Please login again'];
        };

        this.loadLoginWindow = function(window, relogin, args) {
            console.log('inside loadLoginWindow');

            if(pendingSessionCheck) {
                console.log('checkLogin is already in progress, so not opening the login window');
                return;
            }

            if(!sessionKey || sessionKey.toString().length==0) {
                sessionKey = Math.floor(Math.random() * new Date());
                browser.set(sessionKeyCookieName, sessionKey.toString(), null, true);
                reloadUrlsUsingSessionKey();
            }

            var url=loginUrl;

            if(args){
                var params = '&storeId='+args.storeId+'&domainId='+args.domainId;
                url+=params;
                //change pingUrl to make it storeSpecific
                pingUrl+=params;
            }
            if(relogin){
                url=logoutUrl+ "&routeBackUrl=" + encodeURIComponent(url);
                associateLoggedIn = false;
                that.postLogoutRouteBack();
            }

            startedLogin = true;
            sessionInitRetryAttempt = 0;
            cancelLoginCheck = false;

            browser.openTab(window, url, function(loginPage) {
                loginPopup = loginPage;

                setTimeout(function(){checkLogin(false)}, 1000);

                onAuthStart();
            });
        };

        this.loadLogoutWindow = function(window) {
            if(pendingSessionCheck) {
                console.log('checkLogin is already in progress, so not opening the logout window');
                return;
            }

            browser.openTab(window, logoutUrl, function(logoutPage) {
                postLogout(logoutPage);
            }, {height: 160, width: 410});
        };

        this.init = function() {
            loginUrlPattern =  constants.loginUrl.replace('__SERVICE__HOST__', bgConfig.psServiceHost)
                .replace('__LOCALE__', bgConfig.locale);
            pingUrlPattern = constants.pingUrl.replace('__SERVICE__HOST__', bgConfig.psServiceHost)
                .replace('__LOCALE__', bgConfig.locale);
            logoutUrl = constants.logoutUrl.replace('__SERVICE__HOST__', bgConfig.psServiceHost)
                .replace('__LOCALE__', bgConfig.locale);

            browser.get(sessionKeyCookieName, function(reqId) {
                    sessionKey = reqId;
                    reloadUrlsUsingSessionKey();
                    checkLogin(true);
                },
                true);
        };

        this.reloadStoreData = function(successCb, errorCb) {
            reloadData(successCb, errorCb);
        };

        var reloadData = function(successCb, errorCb) {
            browser.makeAjaxCall(pingUrl+'&cb='+Math.random(), successCb, errorCb, false);
        };

        //interfaces - need to be implemented by the user
        this.postLogoutRouteBack = function() {};
        this.postLoginRouteBack = function() {};
    };

    return new authInstance(storeType);
}



