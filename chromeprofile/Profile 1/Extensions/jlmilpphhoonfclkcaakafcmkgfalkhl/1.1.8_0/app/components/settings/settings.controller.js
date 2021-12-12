App.controller('SettingsController', ['$scope', '$rootScope', 'cacheService', '$filter', 'bgService', 'weatherService', 'ngDialog', 'notificationService',
function($scope, $rootScope, cacheService, $filter, bgService, weatherService, ngDialog, notificationService) {

    $scope.saveSettings = function() {
        chrome.storage.sync.set({'settings': $scope.settings});
    }

    $scope.extensionName = chrome.runtime.getManifest().name;

    $scope.backgrounds = bgService.backgrounds;

    $scope.saveBackground = function(bg, index) {
        if (index >= 21 && !$rootScope.background.unlocked) {
            let sharingDialog = ngDialog.open({
                template: '/app/components/sharing/sharing.view.html',
            });

            if ($rootScope.activeNotification == 'sharing') {
                notificationService.removeActiveNotification();
            }

            sharingDialog.closePromise.then(function(data) {
                if (data.value === 'shared') {
                    $rootScope.background.unlocked = true;
                    bgService.saveBgSettings( $rootScope.background );
                }
            });
        } else {
            if (bg) {
                $rootScope.background.bg = bg;
                $rootScope.background.changeMode = 'never';
            }
            bgService.saveBgSettings( $rootScope.background );
        }
    }

    $scope.saveCity = function(city) {

        $rootScope.weatherSettings.city = $rootScope.city = city;

        $scope.saveWeatherSettings();

        weatherService.refreshWeather();

    }

    $scope.saveWeatherSettings = function() {
        chrome.storage.local.set({
            'weatherSettings': $rootScope.weatherSettings
        });
    }

}]);
