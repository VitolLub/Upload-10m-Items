var backgroundStyles = [
    'back_01', 'back_02', 'back_03', 'back_04', 'back_05', 'back_06', 'back_07',
    'back_08', 'back_09', 'back_10', 'back_11', 'back_12', 'back_13', 'back_14',
    'back_15', 'back_16', 'back_17', 'back_18', 'back_19', 'back_20', 'back_21',
    'back_22', 'back_23', 'back_24', 'back_25', 'back_26', 'back_27', 'back_28',
    'back_29', 'back_30', 'back_31', 'back_32', 'back_33', 'back_34', 'back_35',
    'back_36', 'back_37', 'back_38', 'back_39', 'back_40', 'back_41', 'back_42',
];

chrome.storage.sync.get('background', function(data) {
    var index;

    if (data.background) {
        if ( data.background.nextLoading <= Date.now() ) {
            index = data.background.order[1];
        } else {
            index = data.background.order[0];
        }
    } else {
        index = 1;
    }

    if (index != undefined && backgroundStyles[index].indexOf('anim') == -1) {
        document.body.classList.add(backgroundStyles[index]);
    }
});

chrome.storage.sync.get('settings', function(data) {
    if (data.settings != undefined && !data.settings.apps) {
        document.getElementById('apps').style.display = 'none';
        document.querySelector('.search').style.marginBottom = '50px';
    }
});

chrome.runtime.sendMessage({newtabcreated: true});
