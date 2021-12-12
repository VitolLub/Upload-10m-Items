App.filter('highlight', function($sce) {
    return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
            '<em>$1</em>')
        return $sce.trustAsHtml(text)
    }
});
