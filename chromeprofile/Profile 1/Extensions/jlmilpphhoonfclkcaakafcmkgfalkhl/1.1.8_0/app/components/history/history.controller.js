App.controller('HistoryController', ['$scope', function($scope) {

    $scope.query = '';

    $scope.getHistory = function() {
        chrome.history.search({text: $scope.query}, function(data) {
            $scope.history = data;
            $scope.$apply();
        });
    }

    $scope.clearHistory = function() {
        chrome.browsingData.removeHistory({'since': 0}, $scope.getHistory);
    }

    $scope.getHistory();

    $scope.removeItem = function(item, event) {
        event.preventDefault();
        chrome.history.deleteUrl({url: item.url}, function() {
            var index = $scope.history.indexOf(item);
            $scope.history.splice(index, 1);
            $scope.$apply();
        });
    }

}]);
