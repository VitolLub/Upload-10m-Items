App.controller('QuickBarSettingsController', ['$scope', '$location', '$rootScope', 'activityService', 'ngDialog', function($scope, $location, $rootScope, activityService, ngDialog) {

    $scope.saveChanges = function() {
        chrome.storage.sync.set({
            'appsSET3': angular.copy($rootScope.apps)
        });
        chrome.storage.sync.set({
            'hiddenAppsSET3': angular.copy($rootScope.hiddenApps)
        });
    }

    $scope.qbOptions = {
        beforeDrop: function(event) {
            if ($rootScope.destIndex != undefined) {
                $rootScope.hiddenApps.splice(event.dest.index, 1, angular.copy($rootScope.apps[$rootScope.destIndex]) );
            }
        },
        dropped: function(event) {
            if ($rootScope.destIndex != undefined) {
                $rootScope.apps.splice($rootScope.destIndex, 1, angular.copy(event.source.nodeScope.$modelValue) );
                delete $rootScope.destIndex;
            }

            $scope.saveChanges()
        }
    }

    $scope.closeTip = function() {
        $rootScope.activity.quickBarTipWatched = true;
        activityService.save();
    }


    $scope.customButton = {
        color: '',
        name: '',
        url: ''
    }

    $scope.getColors = function () {
        let temp = $rootScope.customButtonColors.map((item, i) => {
            return {
                color: item,
                checked: false
            }
        })

        const index = random(0, temp.length - 1)

        $scope.customButton.color = temp[index].color
        temp[index].checked = true

        return temp
    }

    $scope.addLink = function (valid) {
        const id = makeID(10)

        $scope.submitted = true

        if (!valid) return

        $rootScope.QUICKBAR_ICONS[id] = {
            name: $scope.customButton.name,
            url: $scope.customButton.url,
            icon: '',
            bgColor: $scope.customButton.color
        }

        $rootScope.hiddenApps.unshift({id: id})

        chrome.storage.sync.set({
            'QUICKBAR_ICONS': angular.copy($rootScope.QUICKBAR_ICONS)
        });

        $scope.saveChanges()

        ngDialog.close()
    }


    $scope.colors = $scope.getColors()

    $scope.openLinkCreate = function () {
        $scope.colors = $scope.getColors()

        ngDialog.open({
            controller: 'QuickBarSettingsController',
            template: 'app/components/quick-bar/quick-bar-create-link.view.html'
        });
    }
}]);
