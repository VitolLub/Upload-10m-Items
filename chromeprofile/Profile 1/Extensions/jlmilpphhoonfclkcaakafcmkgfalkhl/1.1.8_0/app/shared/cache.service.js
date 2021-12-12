App.factory('cacheService', function($http) {

	var factory = {};

	factory.get = function(name, url, callback) {
		chrome.storage.local.get(name, function(response){
			if (response[name]) {
				if (response[name]['refresh_time'] >= Date.now()) {
					callback(response[name]['data']);
				} else {
					factory.refresh(name, url, callback, response[name]['data'])
				}
			} else {
				factory.refresh(name, url, callback)
			}
		});
	}

	factory.refresh = function(name, url, callback, cacheData) {
		$http.get(url).then(function(data){
			factory.set(name, 3600 * 1000, data, callback, cacheData);
		}, function(data){
			callback(data, cacheData, true)
		});
	}

	factory.set = function(name, ttl, data, callback, cacheData) {

		var item = {};

		item[name] = {
			'refresh_time': Date.now() + ttl,
			'data': data
		}

		chrome.storage.local.set(item, callback(data, cacheData, null));
	}

	return factory;
});
