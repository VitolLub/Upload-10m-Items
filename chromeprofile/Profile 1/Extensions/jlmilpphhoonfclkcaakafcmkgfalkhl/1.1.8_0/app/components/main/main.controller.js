App.controller('MainController', ['$scope', '$rootScope', '$location', '$filter', 'cacheService', 'ngDialog', '$timeout', '$document', 'bgService', 'activityService', 'weatherService', '$http', '$interval', 'notificationService',
function($scope, $rootScope, $location, $filter, cacheService, ngDialog, $timeout, $document, bgService, activityService, weatherService, $http, $interval, notificationService) {

    extScope = $scope;


    chrome.storage.sync.get('QUICKBAR_ICONS', function(data) {
        if (!data.QUICKBAR_ICONS) {
            $rootScope.QUICKBAR_ICONS = {
                gmail: { name: 'Gmail', url: 'https://gmail.com', icon: 'icon_gmail.svg' },
                youtube: { name: 'YouTube', url: 'https://www.youtube.com/', icon: 'icon_youtube.svg' },
                facebook: {
                    name: 'Facebook',
                    url: 'https://facebook.com',
                    icon: 'icon_facebook.svg',
                    bgColor: '#4861A3'
                },
                google_docs: { name: 'Google Docs', url: 'https://docs.google.com/', icon: 'icon_gdocs.svg' },
                google_drive: { name: 'Google Drive', url: 'https://drive.google.com/', icon: 'icon_gdrive.svg' },
                whatsapp: {
                    name: 'Whatsapp',
                    url: 'https://web.whatsapp.com/',
                    icon: 'icon_whatsapp.svg',
                    bgColor: '#1DC93B'
                },
                bookmarks: {
                    name: $filter('i18n')('widget_title_bookmarks'),
                    url: '/bookmarks',
                    icon: 'icon_bookmarks.svg'
                },
                history: { name: $filter('i18n')('widget_title_history'), url: '/history', icon: 'icon_history.svg' },
                apps: { name: $filter('i18n')('widget_title_apps'), url: '/extensions', icon: 'icon_apps.svg' },
                notes: {
                    name: $filter('i18n')('widget_title_notes'),
                    url: '/notes',
                    icon: 'icon_notes.svg',
                    bgColor: '#F4B709'
                },
                todo: { name: $filter('i18n')('widget_title_todo'), url: '/to-do', icon: 'icon_to-do.svg' },
                booking: { name: 'Booking', url: 'https://www.booking.com/', icon: 'icon_booking.svg' },
                reddit: { name: 'Reddit', url: 'https://www.reddit.com/', icon: 'icon_reddit.svg', bgColor: '#FF4500' },
                linkedin: {
                    name: 'LinkedIn',
                    url: 'https://www.linkedin.com/',
                    icon: 'icon_linkedin.svg',
                    bgColor: '#007AB5'
                },
                twitter: { name: 'Twitter', url: 'https://twitter.com/', icon: 'icon_twitter.svg', bgColor: '#1DA1F2' },
                twitch: { name: 'Twitch', url: 'https://www.twitch.tv/', icon: 'icon_twitch.svg', bgColor: '#5E4599' },
                pinterest: { name: 'Pinterest', url: 'https://www.pinterest.com/', icon: 'icon_pinterest.svg' },
                instagram: { name: 'Instagram', url: 'https://www.instagram.com/', bgImage: 'icon_instagram.svg' },
                netflix: { name: 'Netflix', url: 'https://www.netflix.com/', icon: 'icon_netflix.svg' },
                spotify: { name: 'Spotify', url: 'https://www.spotify.com/', icon: 'icon_spotify.svg' },
                outlook: {
                    name: 'Outlook',
                    url: 'https://outlook.live.com/owa/',
                    icon: 'icon_outlook.svg',
                    bgColor: '#0075C7'
                },
                wikipedia: {
                    name: $filter('i18n')('widget_title_wikipedia'),
                    url: 'https://www.wikipedia.org/',
                    icon: 'icon_wiki.svg'
                },
                espn: { name: 'ESPN', url: 'http://www.espn.com/', icon: 'icon_espn.svg', bgColor: '#DD0000' },
                nbc: {
                    name: $filter('i18n')('widget_title_nbc'),
                    url: 'https://www.nbcnews.com/',
                    icon: 'icon_nbc.svg'
                },
                bbc: { name: 'BBC', url: 'https://www.bbc.com/', icon: 'icon_bbc.svg' },
                cnn: { name: 'CNN', url: 'https://www.cnn.com/', icon: 'icon_cnn.svg' },
                maps: {
                    name: $filter('i18n')('widget_title_maps'),
                    url: 'https://maps.google.com/',
                    bgImage: 'icon_maps.svg'
                },
                soundcloud: { name: 'SoundCloud', url: 'https://soundcloud.com/', icon: 'icon_soundcloud.svg' },
                tumblr: { name: 'Tumblr', url: 'https://www.tumblr.com/', icon: 'icon_tumblr.svg', bgColor: '#36465D' },
                flipboard: {
                    name: 'Flipboard',
                    url: 'https://flipboard.com/',
                    icon: 'icon_flipboard.svg',
                    bgColor: '#F01B23'
                },
                evernote: { name: 'Evernote', url: 'https://evernote.com/', icon: 'icon_evernote.svg' },
                vk: {
                    name: $filter('i18n')('widget_title_vk'),
                    url: 'https://vk.com/',
                    icon: 'icon_vk.svg',
                    bgColor: '#486E95'
                },
                tinder: { name: 'Tinder', url: 'https://tinder.com/', icon: 'icon_tinder.svg' },
                dropbox: { name: 'Dropbox', url: 'https://www.dropbox.com/', icon: 'icon_dropbox.svg' },
                vimeo: { name: 'Vimeo', url: 'https://vimeo.com/', icon: 'icon_vimeo.svg' },
                aliexpress: {
                    name: 'AliExpress',
                    url: 'http://s.click.aliexpress.com/e/bD11urT2',
                    icon: 'icon_aliexpress.svg'
                },
                banggood: {
                    name: 'Banggood',
                    url: 'https://www.banggood.com/?p=TC170523175591201807',
                    icon: 'icon_banggood.svg'
                },
                quora: { name: 'Quora', url: 'https://www.quora.com/', icon: 'icon_quora.svg' },
                amazon: { name: 'Amazon', url: 'https://www.amazon.com/', icon: 'icon_amazon.svg' },
                ebay: { name: 'Ebay', url: 'https://www.ebay.com/', icon: 'icon_ebay.svg' },
                google: { name: 'Google', url: 'https://www.google.com/', icon: 'icon_google.svg' },
                yahoo: { name: 'Yahoo!', url: 'https://www.yahoo.com/', icon: 'icon_yahoo.svg' },
                flickr: { name: 'Flickr', url: 'https://www.flickr.com', icon: 'icon_flickr.svg' },
                yelp: { name: 'Yelp', url: 'https://www.yelp.com', icon: 'icon_yelp.svg' },
                slack: { name: 'Slack', url: 'https://slack.com/', icon: 'icon_slack.svg' },
                px500: { name: '500px', url: 'https://500px.com', icon: 'icon_500px.svg' },
                behance: {
                    name: 'Behance',
                    url: 'https://www.behance.net',
                    icon: 'icon_behance.svg',
                    bgColor: '#0157FF'
                },
                dribbble: {
                    name: 'Dribbble',
                    url: 'https://dribbble.com',
                    icon: 'icon_dribbble.svg',
                    bgColor: '#EA4C89'
                },
                airbnb: { name: 'Airbnb', url: 'https://www.airbnb.com', icon: 'icon_airbnb.svg' },
                hulu: { name: 'Hulu', url: 'https://www.hulu.com/start/content', icon: 'icon_hulu.svg' },
                tuneIn: { name: 'TuneIn', url: 'https://tunein.com/radio/home/', icon: 'icon_tuneIn.svg' },
                github: { name: 'Github', url: 'https://github.com', icon: 'icon_github.svg' },
                telegram: {
                    name: 'Telegram',
                    url: 'https://web.telegram.org/',
                    icon: 'icon_telegram.svg',
                    bgColor: '#31A5E0'
                },
                medium: { name: 'Medium', url: 'https://medium.com', icon: 'icon_medium.svg', bgColor: '#000000' },
                messenger: {
                    name: 'Facebook Messenger',
                    url: 'https://www.messenger.com/',
                    icon: 'icon_messenger.svg'
                },
                feedly: { name: 'Feedly', url: 'https://feedly.com/i/latest', icon: 'icon_feedly.svg' },
                trello: { name: 'Trello', url: 'https://trello.com', icon: 'icon_trello.svg', bgColor: '#1A8BCD' },
                badoo: { name: 'Badoo', url: 'https://badoo.com/encounters/', icon: 'icon_badoo.svg' },
                jettickets: {name: $filter('i18n')('widget_jettickets'), url: 'http://jetradar.com/?marker=234919', icon: 'icon_flights.svg'},
            }
        } else {
            $rootScope.QUICKBAR_ICONS = data.QUICKBAR_ICONS;
        }
    });

    // Search
    $rootScope.searchType = 'web';

    $scope.extensionName = chrome.runtime.getManifest().name;

    $rootScope.userTimezoneOffset = $filter('date')(Date.now(), 'Z');

    $scope.promoWatched = false;

    $rootScope.customButtonColors = [
      '#E87404',
      '#13D469',
      '#13B3E8',
      '#673CA3',
      '#5480B6',
      '#28986C',
      '#DF1E1E',
      '#155F37',
      '#7B8287',
      '#94664C',
      '#E4D027',
      '#ED145B',
      '#E968EA',
      '#B14F36',
      '#94C40D',
      '#22D5C0',
      '#9547E3',
      '#F9B719',
      '#3E82F7',
      '#323232',
      '#AD4C7D',
      '#4138D8'
    ]

    $( document.querySelectorAll('.tabs__item') ).on('click', function() {
        $rootScope.searchType = $(this).text().toLowerCase();
        document.querySelector('.search-form__query').focus();
        $rootScope.$apply();
    });

    $document.on('click keydown', function(event) {

        if ( event.keyCode == 27 || closest(event.target, '.content') && !closest(event.target, '.apps__item') ) {
            $scope.closeSidebar();
        }

        if ( event.keyCode == 27 || !closest(event.target, '.menu__item_dropdown-apps') && !closest(event.target, '.dropdown-apps') ) {
            $scope.hideDropdownApps();
        }
    });

    $scope.closeSidebar  = function() {
        if ($scope.firstRun) $scope.firstRun = false;
        if ($scope.bgTip) {
            $scope.bgTip = false;
            chrome.storage.local.set({
                'bgTip': false
            });
        }
        $location.path('/');
    }

    // Sidebar
    $scope.$location = $location;

    $scope.sidebarHidden = true;

    $scope.$on('$routeChangeSuccess', function(next, current) {
        if ($scope.$location.path() !== '/' && $scope.$location.path().indexOf('/page') != 0) {
            $scope.sidebarHidden = false;
        } else {
            $scope.sidebarHidden = true;
        }
    });

    // City
    var defaultCity = {
        'name': 'New York',
        'lat': '40.7127837',
        'lon': '-74.0059413',
        'tz_offset': '-0400'
    };

	$scope.getCity = function() {
		cacheService.get('city', 'https://'+ MAIN_DOMAIN +'/api/geoapi/city/', function(response) {
            try {
                if (response.data.city == 'empty') {
                    $rootScope.city = defaultCity;
                } else {
                    $rootScope.city = {
                        'name': response.data.city,
                        'lat': response.data.location.latitude,
                        'lon': response.data.location.longitude,
                        'tz_offset': $rootScope.userTimezoneOffset
                    };
                }
            } catch (ev) {
                $rootScope.city = defaultCity;
            }

            chrome.storage.local.get('weatherSettings', function(data) {

                $rootScope.weatherSettings = data.weatherSettings;
                if (!$rootScope.weatherSettings) {
                    $rootScope.weatherSettings = {
                        city: $rootScope.city,
                        units: 'c'
                    }
                } else {
                    $rootScope.city = $rootScope.weatherSettings.city;
                }

                weatherService.getCurrentWeather();

                $rootScope.$apply();
            });
        });
	};

	$scope.getCity();

    chrome.storage.sync.get('settings', function(data) {
        $scope.settings = data.settings;
        if (!$scope.settings) {
            $scope.settings = {
                'bookmarksBar': false,
                'apps': true,
                'showLogo': true,
                'showCtBar': true
            }
        }
        $scope.$apply();
    });

    // Activity
    activityService.getActivity();

    $scope.showPopup = function(popup) {
        ngDialog.open({
            template: '/app/components/'+ popup +'/'+ popup +'.view.html',
        });
    }

    // Background
    bgService.getBgSettings();

    setInterval(function() {
        if ($rootScope.background.changeMode == '30sec') {
            bgService.getBgSettings();
        }
    }, 30*1000)

    chrome.storage.sync.get('todo', function(data) {
        if (data.todo) {
            $rootScope.todoCount = $filter('filter')(data.todo, {'done': false}).length;
        } else {
            $rootScope.todoCount = 0;
        }
        $scope.$apply();
    });

    $scope.openSharingPopup = function() {

        if ($rootScope.activeNotification == 'sharing') {
            notificationService.removeActiveNotification();
        }

        let sharingDialog = ngDialog.open({
            template: '/app/components/sharing/sharing.view.html',
        });

        sharingDialog.closePromise.then(function(data) {
            $scope.unlockBackgrounds(data);
        });
    }

    $scope.unlockBackgrounds = function(data) {
        if (data.value === 'shared') {
            $rootScope.background.unlocked = true;
            bgService.saveBgSettings($rootScope.background);
        }
    }

    $rootScope.promo = {
        enabled: false
    }

    chrome.storage.sync.get('firstRun', function(data) {
        if (data.firstRun === undefined) {
            $scope.firstRun = true;
            chrome.storage.sync.set({
    			'firstRun': false
    		});
        } else {
            $scope.firstRun = false;
        }
    });

    $scope.closeBgTip = function() {
        $scope.bgTip = false;
        chrome.storage.local.set({
            'bgTip': false
        });
        $location.path('/');
    }

    chrome.storage.local.get('promo_popup', function(data) {
        if (data.promo_popup != undefined) {
            $scope.showPromoPopup(data.promo_popup);
        }
    });

    chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

        if (request.action === 'show_popup') {
            $scope.showPromoPopup(request.popup);
        }

        if (request.action === 'show_active_notification') {

            if (request.activeNotificationId == 'search') {

                if (!$rootScope.activity.isSearchExtInstalled) {
                    $rootScope.activity.isSearchActiveNotificationWatched = false;
                    $rootScope.$apply();
                    activityService.save();
                    notificationService.addActiveNotification(request.activeNotificationId);
                }

            } else {
                notificationService.addActiveNotification(request.activeNotificationId);
            }
        }

    });

    $scope.showPromoPopup = function(params) {
        var dialog = ngDialog.open({
            plain: true,
            template: '<iframe src="'+ params.url +'"></iframe>',
            className: 'iframe',
            width: params.width,
            height: params.height
        });
        dialog.closePromise.then(function(data) {
            chrome.storage.local.remove('promo_popup');
        });
    }

    window.addEventListener('message', receiveMessage, false);

    function receiveMessage(event) {
        if (event.data == 'remove_promo_popup') {
            chrome.storage.local.remove('promo_popup');
        }
        if (event.data == 'close_popup') {
            ngDialog.closeAll();
        }
    }

    chrome.storage.sync.get('appsSET3', function(data) {
        if (!data.appsSET3) {
            $rootScope.apps = [
                {id: 'gmail'},
                {id: 'youtube'},
                {id: 'facebook'},
                {id: 'google_docs'},
                {id: 'google_drive'},
                {id: 'whatsapp'},
                {id: 'maps'},
                {id: 'bookmarks'},
                {id: 'history'},
                {id: 'apps'},
                {id: 'notes'},
                {id: 'todo'},
                {id: 'booking'},
                {id: 'jettickets'},
            ];
        } else {
            $rootScope.apps = data.appsSET3;
        }
    });

    chrome.storage.sync.get('hiddenAppsSET3', function(data) {
        if (!data.hiddenAppsSET3) {
            $rootScope.hiddenApps = [
                {id: 'messenger'},
                {id: 'telegram'},
                {id: 'reddit'},
                {id: 'linkedin'},
                {id: 'twitter'},
                {id: 'twitch'},
                {id: 'pinterest'},
                {id: 'instagram'},
                {id: 'netflix'},
                {id: 'spotify'},
                {id: 'outlook'},
                {id: 'wikipedia'},
                {id: 'espn'},
                {id: 'nbc'},
                {id: 'bbc'},
                {id: 'cnn'},
                {id: 'vk'},
                {id: 'soundcloud'},
                {id: 'tumblr'},
                {id: 'flipboard'},
                {id: 'evernote'},
                {id: 'tinder'},
                {id: 'dropbox'},
                {id: 'vimeo'},
                {id: 'aliexpress'},
                {id: 'banggood'},
                {id: 'quora'},
                {id: 'amazon'},
                {id: 'ebay'},
                {id: 'google'},
                {id: 'yahoo'},
                {id: 'maps'},
                {id: 'github'},
                {id: 'slack'},
                {id: 'airbnb'},
                {id: 'yelp'},
                {id: 'px500'},
                {id: 'flickr'},
                {id: 'behance'},
                {id: 'dribbble'},
                {id: 'hulu'},
                {id: 'tuneIn'},
                {id: 'medium'},
                {id: 'feedly'},
                {id: 'trello'},
                {id: 'badoo'}
            ];
        } else {
            $rootScope.hiddenApps = data.hiddenAppsSET3;
        }
    });

    $scope.appsOptions = {
        accept: function(sourceNodeScope, destNodesScope, destIndex) {
            if (sourceNodeScope.$parent.$modelValue == destNodesScope.$modelValue) {
                return true;
            } else {
                $rootScope.destIndex = destIndex;
                var id = $rootScope.apps[destIndex].id;
                var icon = $rootScope.QUICKBAR_ICONS[id].icon;
                var bgColor = $rootScope.QUICKBAR_ICONS[id].bgColor;
                var bgImage = $rootScope.QUICKBAR_ICONS[id].bgImage;
                var style = '';
                var iconHTML = '';

                if (icon) {
                  iconHTML = '<img src="images/'+ $rootScope.QUICKBAR_ICONS[id].icon +'"/>';
                }

                if (bgImage) {
                    style += `background-image: url(images/${bgImage}); `;
                }

                if (!icon && !bgImage) {
                    iconHTML = `<span class="apps__letter">${$rootScope.QUICKBAR_ICONS[id].name[0]}</span>`
                }

                if (bgColor) {
                    style += `background-color: ${bgColor}; `;
                }
                document.querySelector('.quick-bar .angular-ui-tree-hidden').innerHTML = `<a class="apps__item"><span class="apps__icon" style="${style}">${iconHTML}</span><span class="apps__title">${$rootScope.QUICKBAR_ICONS[id].name}</span></a>`;
            }
        },
        dropped: function(event) {
            if ((event.source.index == event.dest.index) && (!event.pos.moving || (Math.abs(event.pos.startX - event.pos.nowX) < 10 && Math.abs(event.pos.startY - event.pos.nowY < 10)))) {
                $scope.goTo($rootScope.QUICKBAR_ICONS[event.source.nodeScope.item.id].url);
            } else {
                if ($location.path() != '/quick-bar') {
                    chrome.storage.sync.set({
                        'appsSET3': angular.copy($rootScope.apps)
                    });
                    chrome.storage.sync.set({
                        'hiddenAppsSET3': angular.copy($rootScope.hiddenApps)
                    });
                }
            }
        }
    }

    $scope.goTo = function(url) {
        if (url[0] == '/') {
            $location.path(url);
        } else {
            if (!/^(http|https):\/\//.test(url)) {
              url = 'http://' + url;
            }

            window.location.href = url;
        }
    }

    notificationService.getNotifications();

    $scope.showNotifications = function() {
		var notificationsDialog = ngDialog.open({
		  template: '/app/components/notifications/notifications.view.html',
          controller: 'notificationsController',
		  className: 'ngdialog-theme-default notifications' + ( $filter('requireAction')($rootScope.notifications).length > 1 ? ' notifications_multiple' : '')
		});

		notificationsDialog.closePromise.then(function(data) {
			$rootScope.notifications.forEach(function(item) {
				notificationService.markNotificationAsRead(item.id);
			})
			$scope.unlockBackgrounds(data);
		});
	}

	$scope.removeActiveNotification = function() {
		notificationService.removeActiveNotification();
	}

    $scope.openActiveNotification = function(id) {
        if (id == 'sharing') {
            $scope.openSharingPopup();
        }
    }

    $scope.toggleDropdownApps = function() {
        $scope.showDropdownApps = !$scope.showDropdownApps;
    }

    $scope.hideDropdownApps = function() {
        $scope.showDropdownApps = false;
    }

    chrome.runtime.sendMessage({getTopTip: true}, function(data) {
        if (data.topTip) {
            $scope.showTopTip(data.topTip);
        } else {
            chrome.storage.local.get('bgTip', function(data) {
                if (data.bgTip === undefined) {
                    $scope.bgTip = true;
                    $location.path('/settings');
                } else {
                    $scope.bgTip = false;
                }
            });
        }
    });

    $scope.showTopTip = function(tip) {
        $scope.topTip = tip;
    }

    $scope.hideTopTip = function() {
        $scope.topTip = null;
        chrome.runtime.sendMessage({removeTopTip: true}, function(data) {

        });
    }

    $scope.openTopTip = function() {
        var url = $scope.topTip.url;
        $scope.hideTopTip();
        chrome.tabs.create({
    		'url': url,
    	}, function( tab ) {

    	});
    }

    window.addEventListener('load', function (event) {
        if (!navigator.onLine) {
          $rootScope.loaded = true;
          $rootScope.$apply();
        }
    })

    setTimeout(function () {
        $rootScope.loaded = true;
        $rootScope.$apply();
    }, 2000)

}]);
