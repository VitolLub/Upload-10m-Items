var localStorageKeys = {
    MRUs: "MRU_History",
    ScreenSize: "ScreenSize",
    ScreenDepth: "ScreenDepth",
    UserName: "UserName",
    Language: "Language",
    MRU_Version: "MRU_Version",
    //for transfer to apps v2
    settingsStored: "settingsStored",
    mruStored: "mruStored",
    bookmarksStored: "bookmarksStored",
}

function determineIfBackupNeeded() {
    try {
        var settingsStored = toBool(localStorage.getItem(localStorageKeys.settingsStored));
        if (!settingsStored) {
            backupSettings();
        }

        var mruStored = toBool(localStorage.getItem(localStorageKeys.mruStored));
        if (!mruStored) {
            backupMRUs();
        }

        var bookmarksStored = false; //changed because some users bookmarks are not getting saved.
        if (!bookmarksStored) {
            backupBookmarks();
        }
    }
    catch (e) {
        console.log(e);
    }
}

var settingsSaveObj;
function backupSettings() {
    try {
        var stored = false;

        initHelper();

        settingsSaveObj = new Helper.SettingsObject();
        var storedValue = localStorage.getItem(localStorageKeys.ScreenSize);
        settingsSaveObj.values.screensize = coalesce(storedValue, settingsSaveObj.values.screensize);

        storedValue = localStorage.getItem(localStorageKeys.ScreenDepth);
        settingsSaveObj.values.screendepth = coalesce(storedValue, settingsSaveObj.values.screendepth);

        storedValue = localStorage.getItem(localStorageKeys.Language);
        settingsSaveObj.values.language = coalesce(storedValue, settingsSaveObj.values.language);

        settingsSaveObj.save();
        stored = true;

        localStorage.setItem(localStorageKeys.settingsStored, stored.toString());
    }
    catch (e) {
        console.log(e);
    }
}

var mruSaveObj;
function backupMRUs() {
    try {
        var stored = false;

        initHelper();

        mruSaveObj = new Helper.MRUObject();

        var addressString = localStorage.getItem(localStorageKeys.MRUs);
        var userNameString = localStorage.getItem(localStorageKeys.UserName)
        var mruVersion = localStorage.getItem(localStorageKeys.MRU_Version);
        var addressList;
        var userNameList;
        if (!blankNullorUndefined(addressString)) {
            if (mruVersion >= 2) {
                if (addressString.indexOf("|") > 0) {
                    addressList = addressString.split("|");
                }
                else if (addressString.indexOf("\r\n") > 0) {
                    addressList = addressString.split("\r\n");
                }
                else {
                    addressList.push(addressString);
                }
            }
            else {
                addressList = addressString.split(",");
            }

        }
        else {
            addressList = new Array();
        }

        if (!blankNullorUndefined(userNameString)) {
            userNameList = userNameString.split(command.delimeterArgs);
        }
        else {
            userNameList = new Array();
        }

        for (var i = 0; i < addressList.length; i++) {
            mruSaveObj.addMRU(addressList[i], userNameList[i], "");
        }

        stored = true;

        localStorage.setItem(localStorageKeys.mruStored, stored.toString());
    }
    catch (e) {
        console.log(e);
    }
}

var titlePrefix = "Chrome RDP - ";
function backupBookmarks() {
    try {
        chrome.bookmarks.search(titlePrefix, saveRDPBookmarks);
    }
    catch (e) {
        console.log(e);
    }
}

var bookmarkSaveObj;
function saveRDPBookmarks(bookmarkTreeNodes) {
    try {
        initHelper();

        bookmarkSaveObj = new Helper.BookmarkObject();

        var addresses = new Array();
        for (i = 0; i < bookmarkTreeNodes.length; i++) {
            var url = bookmarkTreeNodes[i].url;
            var poundIndex = url.indexOf("#");
            if (poundIndex > 0) {
                var address = url.slice(poundIndex + 1).trim();
                if (!blankNullorUndefined(address)) {
                    var title = bookmarkTreeNodes[i].title.slice(titlePrefix.length).trim();
                    if (blankNullorUndefined(title)) {
                        title = address;
                    }

                    var obj = { title: null, address: null };
                    obj.title = title;
                    obj.address = address;
                    addresses.push(obj);
                }
            }
        }

        if (addresses.length > 0) {
            bookmarkSaveObj.MassAddConnections(addresses, bookmarksSaved)
        }
    }
    catch (e) {
        console.log(e);
    }
}

function bookmarksSaved() {
    try {
        //localStorage.setItem(localStorageKeys.bookmarksStored, 'false');
    }
    catch (e) {
        console.log(e);
    }
}

var Helper = null;
function initHelper() {
    try {
        if (Helper === null) {
            var HelperObj = function () { };

            var initEvent = new CustomEvent(
                "RDPInit",
                {
                    detail: HelperObj,
                    bubbles: true,
                    cancelable: true
                }
            );

            document.dispatchEvent(initEvent);

            Helper = new HelperObj();
        }
    }
    catch (e) {
        console.log(e);
    }
}


determineIfBackupNeeded();