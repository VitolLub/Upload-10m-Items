App.controller('notificationsController', ['$rootScope', '$scope', '$document', 'ngDialog', 'notificationService',
function($rootScope, $scope, $document, ngDialog, notificationService) {

    $scope.$on('ngDialog.opened', function (e, $dialog) {
        if ($rootScope.activeNotification == 'sharing') {
            notificationService.removeActiveNotification();
        }
    });

}]);

App.controller('SearchNotificationController', ['$rootScope', '$scope', '$document', 'ngDialog', 'notificationService',
function($rootScope, $scope, $document, ngDialog, notificationService) {

    $scope.$on('ngDialog.opened', function (e, $dialog) {
        if ($rootScope.activeNotification == 'sharing') {
            notificationService.removeActiveNotification();
        }
    });

    $scope.addExtension = function() {
        window.open('https://chrome.google.com/webstore/')
    }

}]);
