App.controller('rateController', ['$scope', '$location', '$rootScope', 'ngDialog', 'notificationService',
function($scope, $location, $rootScope, ngDialog, notificationService) {

    $scope.extensionName = chrome.runtime.getManifest().name;

    $scope.stars = [
        {'active': true},
        {'active': true},
        {'active': true},
        {'active': true},
        {'active': false}
    ];

    $scope.rating = 4;

    $scope.rate = function() {
        if ($scope.rating > 3) {
            window.open('https://chrome.google.com/webstore/detail/' + chrome.runtime.id + '/reviews');
        }
        notificationService.markNotificationAsDone('rate');
        ngDialog.close();
    }

    $scope.toggleRate = function(index){
        for (var i=0; i < $scope.stars.length; i++) {
            if (i <= index) {
                $scope.stars[i].active = true
            } else {
                $scope.stars[i].active = false
            }
            $scope.rating = index+1;
        }
    }

    $scope.$on('ngDialog.closing', function (e, $dialog) {
        notificationService.markNotificationAsRead('rate');
    });

}]);
