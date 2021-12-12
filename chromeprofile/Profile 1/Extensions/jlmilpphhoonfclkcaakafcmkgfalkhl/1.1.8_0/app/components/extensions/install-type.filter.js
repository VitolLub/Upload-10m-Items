App.filter('installType', function () {
    return function (items) {
        var filtered = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.installType != 'admin') {
                filtered.push(item);
            }
        }
        return filtered;
    };
});
