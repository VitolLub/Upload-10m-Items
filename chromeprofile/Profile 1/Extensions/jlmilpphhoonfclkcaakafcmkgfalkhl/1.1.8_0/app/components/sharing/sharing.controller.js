App.controller('sharingController', ['$scope', '$document', 'ngDialog', 'notificationService', function($scope, $document, ngDialog, notificationService) {

    $scope.extensionName = chrome.runtime.getManifest().name;

  $scope.shared = function () {
    $scope.closeThisDialog('shared');
    notificationService.markNotificationAsRead('sharing');
    notificationService.markNotificationAsDone('sharing');
  }

}]);
