App.controller('WeatherSettingsController', ['$scope', '$rootScope', 'ngDialog', 'weatherService',
function($scope, $rootScope, ngDialog, weatherService) {

    $scope.units = $rootScope.weatherSettings.units;

    $scope.updateCity = function(city) {
        $scope.city = city;
    }

    $scope.saveChanges = function() {
        $rootScope.weatherSettings.units = $scope.units;
        $rootScope.weatherSettings.city = $rootScope.city = $scope.city;

        chrome.storage.local.set({
            'weatherSettings': $rootScope.weatherSettings
        });

        weatherService.refreshWeather();
        ngDialog.close();
    }

}]);
