App.directive('info', function($http, $timeout, $document, $rootScope) {
	return {
		templateUrl: '/app/components/info/info.view.html',
        controller: 'InfoController',
        link:  function(scope, el) {
        	 el.find("iframe")[0].onload = function(e) {
        	 	scope.timer = setTimeout(function() {
        	 		if (scope.setWidgetSize) {
	        	 		scope.setWidgetSize = false
	        	 	} else {
	        	 		scope.error = true
	        	 		scope.$apply()
	        	 	}
        	 	}, 1000)
        	 }
        }
	}
});
