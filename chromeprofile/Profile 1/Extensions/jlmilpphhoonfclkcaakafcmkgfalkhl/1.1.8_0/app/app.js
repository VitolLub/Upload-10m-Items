var LANG_CODE = window.navigator.language;

document.title = chrome.i18n.getMessage('newtab');

var App = angular.module('App', ['ngRoute', 'ngAnimate', 'ngDialog', 'ngSanitize', 'ui.tree'])

    .config(['$routeProvider', '$locationProvider', '$compileProvider', 'ngDialogProvider',
    function ($routeProvider, $locationProvider, $compileProvider, ngDialogProvider) {
      $routeProvider
        .when('/weather', {
          controller: 'WeatherController',
          templateUrl: 'app/components/weather/weather.view.html'
        })
        .when('/to-do', {
          controller: 'TodoController as ctrl',
          templateUrl: 'app/components/to-do/to-do.view.html'
        })
        .when('/extensions', {
          controller: 'ExtensionsController',
          templateUrl: 'app/components/extensions/extensions.view.html'
        })
        .when('/notes', {
          controller: 'NotesController',
          templateUrl: 'app/components/notes/notes.view.html'
        })
        .when('/bookmarks', {
          controller: 'BookmarksController',
          templateUrl: 'app/components/bookmarks/bookmarks.view.html'
        })
        .when('/history', {
          controller: 'HistoryController',
          templateUrl: 'app/components/history/history.view.html'
        })
        .when('/settings', {
          controller: 'SettingsController',
          templateUrl: 'app/components/settings/settings.view.html'
        })
        .when('/quick-bar', {
          controller: 'QuickBarSettingsController',
          templateUrl: 'app/components/quick-bar/quick-bar-settings.view.html'
        })
        .when('/page/contact-us', {
          controller: 'ContactUsController',
          templateUrl: 'app/components/contact-us/contact-us.view.html'
        })
        .when('/page/:name', {
          controller: 'PageController',
          templateUrl: 'app/components/page/page.view.html'
        })
        .otherwise({
          redirectTo: '/'
        });

        ngDialogProvider.setDefaults({
            showClose: false
        });

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|chrome|chrome-extension):/);

    }]);

var WEATHER_APPID = 'cdd6336eb33f226c6d28d43f0f337371',
    MAIN_DOMAIN = 'start.cryptobrowser.site';

var animationPause;

$ = function(element) {
    return angular.element(element)
}

function closest(el, selector) {
    var matches = el.webkitMatchesSelector ? 'webkitMatchesSelector' : (el.msMatchesSelector ? 'msMatchesSelector' : 'matches');

    while (el.parentElement) {
    	if (el[matches](selector)) return el;
    	el = el.parentElement;
    }

    return null;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
    	j = Math.floor(Math.random() * i);
    	x = a[i - 1];
    	a[i - 1] = a[j];
    	a[j] = x;
    }
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeID (length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  let result = ''

  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}