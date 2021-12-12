// Copyright (c) 2012 Google Inc.

var copyPasteSandBoxId = 'copypastesandbox';

var updatePollInterval = null; //= setTimeout(UpdateClipboardCache_, 500);
var clipboardTypesCache = [];
var callback_ = null;

{
    try {
        var copypastesandbox = document.createElement('textarea');
        copypastesandbox.setAttribute("id", copyPasteSandBoxId);

        document.body.appendChild(copypastesandbox);
    }
    catch (e) {
        console.log(e);
    }
}

var UpdateClipboardCache_ = function UpdateClipboardCache() {
    try {
        var copypastesandbox = document.getElementById(copyPasteSandBoxId);

        var pasteHandler = function pasteHandler(e) {
            if (e.clipboardData) {
                e.preventDefault();

                clipboardTypesCache = [];

                if (e.clipboardData.items != null) {
                    for (var i = 0; i < e.clipboardData.items.length; i++) {
                        clipboardTypesCache.push(e.clipboardData.items[i].type);
                    }
                }
            }
        }

        copypastesandbox.addEventListener('paste', pasteHandler, false);

        copypastesandbox.value = '';
        copypastesandbox.focus();

        document.execCommand('paste')
        copypastesandbox.removeEventListener('paste', pasteHandler);

        if (callback_ != null) {
            callback_();
        }

        updatePollInterval = setTimeout(UpdateClipboardCache_, 500);
    }
    catch (e) {
        console.log(e);
    }
}

function GetData(type) {
    try {
        var copypastesandbox = document.getElementById(copyPasteSandBoxId);
        var r;

        var pasteHandler = function (e) {
            if (e.clipboardData) {
                e.preventDefault();
                r = e.clipboardData.getData(type);
            }
        }

        copypastesandbox.addEventListener('paste', pasteHandler, false);

        copypastesandbox.value = '';
        copypastesandbox.focus();

        document.execCommand('paste')
        copypastesandbox.removeEventListener('paste', pasteHandler);

        return r;
    }
    catch (e) {
        console.log(e);
    }
}

function GetClipboardTypes() {
    try {
        return clipboardTypesCache;
    }
    catch (e) {
        console.log(e);
    }
}

function AddItems(items) {
    try {
        var copypastesandbox = document.getElementById(copyPasteSandBoxId);

        var copyHandler = function (e) {
            if (e.clipboardData) {
                e.preventDefault();
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    e.clipboardData.setData(item.type, item.value);
                }
            }
        };

        copypastesandbox.addEventListener('copy', copyHandler, false);

        copypastesandbox.value = '';
        copypastesandbox.focus();

        document.execCommand('copy')

        copypastesandbox.removeEventListener('copy', copyHandler);
    }
    catch (e) {
        console.log(e);
    }
}

function AttachClipboardHelper(callback) {
    try {
        updatePollInterval = setTimeout(UpdateClipboardCache_, 500);
        callback_ = callback;
    }
    catch (e) {
        console.log(e);
    }
}