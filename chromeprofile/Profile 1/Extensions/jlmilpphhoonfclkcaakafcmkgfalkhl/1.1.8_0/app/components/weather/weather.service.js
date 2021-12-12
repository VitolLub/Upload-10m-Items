App.factory('weatherService', function($rootScope, cacheService, $filter, $timeout) {

	var factory = {};

    factory.weatherCallback = function(response, responseCache, error) {

        var weatherSuccess;

        try {
            if (!error) {
                if (response.data) {
                    channel = response.data
                } else {
                    channel = responseCache.data
                }
            } else {
                channel = responseCache.data
            }
            weatherSuccess = true;
        } catch(ev) {
            weatherSuccess = false;
        }

        if (weatherSuccess) {

            $rootScope.weather = {
                'temp': $filter('number')(channel.main.temp, 0),
                'tempF': Math.floor(channel.main.temp * 1.8) + 32,
                'icon': channel.weather[0].icon,
                'icon_id': channel.weather[0].id
            }

			$rootScope.currentWeather = {
				'description': channel.weather[0].description,
				'wind_speed': $filter('number')(channel.wind.speed*3.6, 1) + ' '+ $filter('i18n')('speed_metric'),
				'wind_speed_mph': $filter('number')(channel.wind.speed*2.2369, 1) + ' '+ $filter('i18n')('speed_imperial'),
				'wind_direction': channel.wind.deg,
				'humidity': channel.main.humidity,
				'pressure': Math.floor(channel.main.pressure/1.3332239) + ' '+ $filter('i18n')('pressure_metric'),
				"pressureF": $filter('number')(channel.main.pressure*0.02953, 1) + ' '+ $filter('i18n')('pressure_imperial'),
				'temp': $filter('number')(channel.main.temp, 0),
				'tempF': Math.floor(channel.main.temp * 1.8) + 32,
				'icon': channel.weather[0].icon,
				'icon_id': channel.weather[0].id
			}

            $timeout(function(){
                $rootScope.$apply()
            }, 0);
        }
    }

	factory.getCurrentWeather = function() {

        var lat = $rootScope.weatherSettings.city.lat,
            lon = $rootScope.weatherSettings.city.lon;

        cacheService.get(
            'weather',
            'https://pro.openweathermap.org/data/2.5/weather?lat='+ encodeURIComponent(lat) +'&lon='+ encodeURIComponent(lon) +'&mode=json&units=metric&lang='+ LANG_CODE +'&appid='+ WEATHER_APPID,
            factory.weatherCallback
        );
	}

    factory.refreshWeather = function() {

        var lat = $rootScope.weatherSettings.city.lat,
            lon = $rootScope.weatherSettings.city.lon;

        cacheService.refresh(
            'weather',
            'https://pro.openweathermap.org/data/2.5/weather?lat='+ encodeURIComponent(lat) +'&lon='+ encodeURIComponent(lon) +'&mode=json&units=metric&lang='+ LANG_CODE +'&appid=' + WEATHER_APPID,
            factory.weatherCallback
        );

        cacheService.refresh(
            'hourlyForecast',
            'https://pro.openweathermap.org/data/2.5/forecast?lat='+ encodeURIComponent(lat) +'&lon='+ encodeURIComponent(lon) +'&mode=json&units=metric&cnt=8&lang='+ LANG_CODE +'&appid='+ WEATHER_APPID,
            factory.hourlyForecastCallback
        );

        cacheService.refresh(
            'dailyForecast',
            'https://pro.openweathermap.org/data/2.5/forecast/daily?lat='+ encodeURIComponent(lat) +'&lon='+ encodeURIComponent(lon) +'&mode=json&units=metric&cnt=6&lang='+ LANG_CODE +'&appid='+ WEATHER_APPID,
            factory.dailyForecastCallback
        );
    }

	factory.dailyForecastCallback = function(response) {
		$rootScope.dailyForecast = response.data;
	}

	factory.hourlyForecastCallback = function(response) {
		$rootScope.hourlyForecast = response.data;
	}

	return factory;

});
