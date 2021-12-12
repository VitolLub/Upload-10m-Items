App.factory('activityService', function($rootScope) {

	var factory = {};

	factory.getActivity = function() {
		let activity = {},
			now = Date.now(),
			threeDays = 3*24*60*60*1000;
		chrome.storage.sync.get('activity', function(data) {
			if (!data.activity) {
				activity = {
					quickBarTipWatched: false,
					loginPageWatched: false
				}
			} else {
				activity = data.activity;
			}

			$rootScope.activity = activity;

		});
	}

	factory.save = function(activity) {
		chrome.storage.sync.set({
			'activity': $rootScope.activity
		});
	}

	return factory;

});
