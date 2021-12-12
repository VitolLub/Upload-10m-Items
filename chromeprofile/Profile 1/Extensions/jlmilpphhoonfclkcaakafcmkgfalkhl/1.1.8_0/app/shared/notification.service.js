App.factory('notificationService', function($rootScope, ngDialog, activityService) {
	var factory = {},
		now = Date.now(),
		oneDay = 24*60*60*1000,
		twoDays = 2*24*60*60*1000,
		fiveDays = 5*24*60*60*1000,
		oneWeek = 7*24*60*60*1000,
		firstRun;

	chrome.storage.local.get('firstRun', function(data) {
		if (!data.firstRun) {
			firstRun = now;
			chrome.storage.local.set({'firstRun': now});
		} else {
			firstRun = data.firstRun;
		}
	})

	factory.getNotifications = function() {
		chrome.storage.local.get('notifications', function(data) {
			if (!data.notifications) {
				$rootScope.notifications = []
			} else {
				$rootScope.notifications = data.notifications;
			}

			factory.checkNewNotifications();
		})
	}

	factory.checkNewNotifications = function() {
		if ( !factory.isNotificationExist('sharing') ) {
			factory.addNotification('sharing');
		}

		if ( !factory.isNotificationRead('sharing') ) {
			factory.addActiveNotification('sharing');
		}

		if ( !$rootScope.background.unlocked && (firstRun + twoDays) < now ) {
			factory.markNotificationAsActionRequire('sharing');
		}

		if ( !factory.isNotificationExist('rate') && (firstRun + fiveDays) < now ) {
			factory.addNotification('rate')
		}

		factory.saveNotifications();
	}

	factory.addNotification = function(id) {
		if (id == 'sharing') {
			$rootScope.notifications.push({id: id, isRead: false, isActionRequired: false});
		} else {
			$rootScope.notifications.push({id: id, isRead: false, isActionRequired: true});
		}
	}

	factory.addActiveNotification = function(id) {
		$rootScope.activeNotification = id;
	}

	factory.removeActiveNotification = function() {
		factory.markNotificationAsRead($rootScope.activeNotification);
		$rootScope.activeNotification = null;
	}

	factory.markNotificationAsRead = function(id) {
		$rootScope.notifications.forEach( function(item) {
			if (item.id === id) {
				item.isRead = true;
			}
		});
		factory.saveNotifications();
	}

	factory.markNotificationAsDone = function(id) {
		$rootScope.notifications.forEach( function(item) {
			if (item.id === id) {
				item.isActionRequired = false;
			}
		});
		factory.saveNotifications();
	}

	factory.markNotificationAsActionRequire = function(id) {
		$rootScope.notifications.forEach( function(item) {
			if (item.id === id) {
				item.isActionRequired = true;
			}
		});
		factory.saveNotifications();
	}

	factory.isNotificationExist = function(id) {
		var isExist = false;
		$rootScope.notifications.forEach( function(item) {
			if (item.id === id) {
				isExist = true;
			}
		});
		return isExist;
	}

	factory.isNotificationRead = function(id) {
		var isRead = true;
		$rootScope.notifications.forEach( function(item) {
			if (item.id === id) {
				isRead = item.isRead;
			}
		});
		return isRead;
	}

	factory.saveNotifications = function() {
		chrome.storage.local.set({'notifications': $rootScope.notifications});
	}

	return factory;
});
