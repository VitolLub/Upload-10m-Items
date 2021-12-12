App.controller('PageController', ['$scope', '$routeParams', '$http',
function($scope, $routeParams, $http) {

    $scope.loading = true;

    $http.get('https://'+ MAIN_DOMAIN +'/extension/' + $routeParams.name + '/').then( function(data) {
        $scope.content = data.data;
        $scope.loading = false;
    });

}]);
