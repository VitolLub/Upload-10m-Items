App.factory('bgService', function($rootScope) {

	var factory = {};

	factory.backgrounds = backgroundStyles;

	factory.getBgSettings = function() {
		chrome.storage.sync.get('background', function(data) {

			var bgSettings = {},
				currentBgIndex = 0;

			if (!data.background) {
				bgSettings = {
					'changeMode': 'random',
					'order': [0, 1],
					'nextLoading': Date.now(),
					'unlocked': false
				}
				currentBgIndex = 0;
			} else {
				bgSettings = data.background;
				currentBgIndex = data.background.order[0];
			}

			if ( bgSettings.nextLoading <= Date.now() || !bgSettings.nextLoading ) {

				bgSettings.order.splice(0,1);

				if (bgSettings.order.length == 0) {
					bgSettings.order = factory.createNewBgOrder(bgSettings);
				}

				bgSettings.bg = factory.backgrounds[ bgSettings.order[0] ];

				factory.saveBgSettings( bgSettings, currentBgIndex );
			} else {
				bgSettings.bg = factory.backgrounds[currentBgIndex];
			}

			$rootScope.background = bgSettings;
			$rootScope.$apply();

		});
	}

	factory.saveBgSettings = function(bgSettings, currentBgIndex) {
		if (currentBgIndex == undefined) {
			bgSettings.order = factory.createNewBgOrder(bgSettings);
			var selectedBgIndex = factory.backgrounds.indexOf(bgSettings.bg);
			bgSettings.order.splice(selectedBgIndex, 1);
			bgSettings.order.unshift(selectedBgIndex);
		}
		bgSettings.nextLoading = factory.getNextLoadingTime(bgSettings.changeMode);

		chrome.storage.sync.set({
			'background': bgSettings
		});
	}

	factory.getNextLoadingTime = function(changeMode) {

		var now = new Date(),
			nextLoading;

		switch ( changeMode ) {
			case 'never':
				nextLoading = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate() );
				break;
			case 'everyday':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
				break;
			case 'everyhour':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours()+1);
				break;
			case 'random':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
				break;
			case '30sec':
				nextLoading = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()+30);
				break;
		}

	 	return nextLoading.getTime();
	}

	factory.createNewBgOrder = function(bgSettings){

		var bgOrder = [],
			max = bgSettings.unlocked ? 42 : 21;

		for (var i=0; i<max; i++) {
			bgOrder.push(i);
		}

		shuffle(bgOrder);

		return bgOrder;
	}

	return factory;

});
