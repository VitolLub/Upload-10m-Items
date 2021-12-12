App.directive('weather', function($http, $timeout, $document, $rootScope) {
	return {
		templateUrl: '/app/components/weather/weather.view.html',
        controller: 'WeatherController',
	}
});
