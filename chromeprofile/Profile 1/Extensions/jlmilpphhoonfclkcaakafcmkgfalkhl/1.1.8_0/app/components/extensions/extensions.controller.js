App.controller('ExtensionsController', ['$scope', '$filter', function($scope, $filter) {

    $scope.extensionId = chrome.runtime.id;

    $scope.getExtensions = function() {
        chrome.management.getAll(function(data) {
            $scope.extensions = $filter('installType')(data);
            $scope.$apply();
        });
    }

    $scope.getExtensions();

    $scope.enable = function(item) {
        chrome.management.setEnabled(item.id, item.enabled, function() {
            //$scope.getExtensions();
        });
    }

    $scope.uninstall = function(id) {
        chrome.management.uninstall(id, {'showConfirmDialog':true}, function() {
            $scope.getExtensions();
            $scope.$apply();
        });
    }

    $scope.appLaunch = function(appId) {
        chrome.management.launchApp(appId);
    }

    $scope.goToExtensionsPage = function(id) {
        var url = 'chrome://extensions';

        if (id) {
            url = 'chrome://extensions/?id='+ id;
        }

        chrome.tabs.create({'url': url}, function(tab) {});
    }

}]);
