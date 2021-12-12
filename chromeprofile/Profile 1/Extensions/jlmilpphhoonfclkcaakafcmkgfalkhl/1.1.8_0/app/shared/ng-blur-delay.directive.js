App.directive('ngBlurDelay',['$timeout',
function ($timeout) {
    return {
        scope: {
            ngBlurDelay:'&'
        },
        link: function(scope, element, attr) {
            element.bind('blur',function() {
                $timeout(scope.ngBlurDelay, 200);
            });
        }
    };
}])
