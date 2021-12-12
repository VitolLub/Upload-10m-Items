App.controller('InfoController', ['$scope', '$rootScope', '$sce', '$timeout',
function($scope, $rootScope, $sce, $timeout) {
    $scope.online = navigator.onLine;
    $scope.error = false

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };

    window.addEventListener("message", function(e){
        var data = e.data;

        if (data.setWidgetSize) {
            $scope.height = data.setWidgetSize.height
            $scope.width = data.setWidgetSize.width
            $scope.setWidgetSize = true
            $scope.$apply()

            $rootScope.loaded = true
            $rootScope.$apply()
        }

        if (data.over) {
            $scope.hovered = data.over;
            $scope.content = data.content;
            
            if (data.style) {
                $scope.style = data.style
            }
            
            $scope.$apply();
        }

        if (data.out) {
          $scope.hovered = '';
          $scope.content = '';
          $scope.style = '';
          $scope.$apply();
        }
    });
}]);
