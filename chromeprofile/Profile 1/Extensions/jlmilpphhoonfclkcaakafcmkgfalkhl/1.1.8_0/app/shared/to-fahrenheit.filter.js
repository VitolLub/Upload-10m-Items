App.filter('toFahrenheit', function() {
    return function(celsius) {
        var fahrenheits = celsius * 9 / 5 + 32;
        return Math.round(fahrenheits);
    };
});
