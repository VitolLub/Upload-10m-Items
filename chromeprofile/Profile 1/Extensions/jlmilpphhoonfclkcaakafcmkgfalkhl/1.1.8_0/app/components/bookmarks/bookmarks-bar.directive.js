App.directive('bookmarksBar', function($http, $timeout, $document, $rootScope) {
	return {
		templateUrl: '/app/components/bookmarks/bookmarks-bar.view.html',
        controller: 'BookmarksController',
	}
});
