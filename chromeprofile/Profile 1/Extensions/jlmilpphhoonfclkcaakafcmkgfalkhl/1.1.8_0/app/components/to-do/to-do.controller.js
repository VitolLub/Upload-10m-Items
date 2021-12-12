App.controller('TodoController', ['$scope', '$timeout', '$rootScope', '$filter',
function($scope, $timeout, $rootScope, $filter) {

    var ctrl = this;

    ctrl.doneFilter = false;

    $scope.load = function() {
        chrome.storage.sync.get('todo', function(data) {
            if (data.todo) {
                $scope.list = data.todo;
            } else {
                $scope.list = [];
            }

            $scope.updateLists();

            $scope.$apply();
        });
    }

    $scope.load();

    $scope.updateLists = function() {
        $scope.undoneList = $scope.list.filter(function(item) {
            return !item.done;
        });
        $scope.doneList = $scope.list.filter(function(item) {
            return item.done;
        });
    }

    $scope.add = function(type, done = false) {

        var item;

        if (type == 'inline') {
            item = ctrl.newItemInline;
            ctrl.newItemInline = null;
        } else {
            item = ctrl.newItem;
            ctrl.newItem = null;
        }

        if (!item) {
            return;
        }

        $scope.list.push({
            'text' : item,
            'done' : false
        });

        if (done) $scope.done($scope.list[$scope.list.length-1]);

        ctrl.doneFilter = false;
        $scope.save();

        var newItemInput = document.querySelector('.todo__item_new .todo__text');

        if ( type == 'inline' && newItemInput && !$scope.topInputFocused ) {
            newItemInput.focus();
        }

    }

    ctrl.remove = function(item) {
        var index = $scope.list.indexOf(item);
        $scope.list.splice(index, 1);
        $scope.save();
    }

    $scope.save = function() {
        chrome.storage.sync.set({
            'todo': angular.copy($scope.list)
        });
        $scope.updateLists();
        $rootScope.todoCount = $filter('filter')($scope.list, {'done': false}).length;
    }

    $scope.done = function(item) {

        if (!item) {
            return;
        }

        item.inProgress = true;

        $timeout(function() {
            item.done = item.done ? false : true;
            item.inProgress = false;
            $scope.save();
        }, 3000);
    }

    $scope.todoOptions = {
        dropped: function(event) {
            $scope.list = $scope.undoneList.concat($scope.doneList);
            $scope.save();
        }
    };

}]);
