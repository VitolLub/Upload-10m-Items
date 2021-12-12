App.controller('BookmarksController', ['$scope', '$filter', '$document',
function($scope, $filter, $document) {

    $scope.query = '';

    $scope.activeTab = 'bookmarksBar';
    $scope.defaultParent = '1';

    $scope.getBookmarks = function() {
        chrome.bookmarks.getTree(function(data) {
            $scope.bookmarks = $scope.bookmarksBar = data[0].children[0].children;
            $scope.otherBookmarks = data[0].children[1].children;
            $scope.$apply();
        });
    }

    $scope.getBookmarks();

    $scope.switchTab = function(tabName) {
      $scope.activeTab = tabName;
      switch ($scope.activeTab ) {
        case 'bookmarksBar':
          $scope.bookmarks = $scope.bookmarksBar;
          $scope.defaultParent = '1';
          break;
        case 'other':
          $scope.bookmarks = $scope.otherBookmarks;
          $scope.defaultParent = '2';
          break;
        default:

      }
    }

    $scope.searchBookmarks = function() {

        if (!$scope.query) {
            return;
        }

        chrome.bookmarks.search($scope.query, function(data) {
            $scope.allBookmarks = $filter('filter')(data, function(value, index, array) {
                if (value.url) return value;
            });
            $scope.$apply();
        });
    }

    $scope.$watch('query', function() {
        $scope.searchBookmarks();
    });

    $scope.removeBookmark = function(item, arr, event) {
        event.preventDefault();
        chrome.bookmarks.removeTree( item.id, function() {
            var index = arr.indexOf(item);
            arr.splice(index, 1);
            $scope.$apply();
        });
    }

    $scope.removeFromAll = function(item, event) {
        event.preventDefault();
        chrome.bookmarks.remove( item.id, function() {
            var index = $scope.allBookmarks.indexOf(item);
            $scope.allBookmarks.splice(index, 1);
            $scope.getBookmarks();
            $scope.$apply();
        });
    }

    $scope.openBookmark = function(url){
      window.top.location = url;
    }

    $scope.toggleBookmarks = function(event, first) {
      var li = closest(event.target, 'li'),
        ulElements = $(li).find('ul'),
        left;

      if ((li.getBoundingClientRect().left + 420) > document.body.clientWidth) {
        left = true;
      }

      if (first) {
        var ulToHide = document.querySelectorAll('.bookmarks-list > li ul');
        for (var j = 0; j < ulToHide.length; j++) {
          if (ulElements[0] != ulToHide[j]) {
            ulToHide[j].style.display = 'none'
          }
        }
      }

      if (ulElements[0].style.display == 'block') {
        for (var i = 0; i < ulElements.length; i++) {
          ulElements[i].style.display = 'none';
        }
      } else {
        ulElements[0].style.display = 'block';
        if (ulElements[0].childNodes.length <= 3) {
          ulElements[0].innerHTML = '<li class="empty">(empty)</li>'
        }

        if (!first) {
          if (left) {
            ulElements[0].style.right = '208px';
            ulElements[0].style.left = 'auto';
          } else {
            ulElements[0].style.left = '208px';
            ulElements[0].style.right = 'auto';
          }
        }
      }
    }

    $document.on('click keydown', function(ev) {
      if (!closest(ev.target, '.bookmarks-list')) {
        var bookmarksUl = document.querySelectorAll('.bookmarks-list ul');
        for (var i = 0; i < bookmarksUl.length; i++) {
          bookmarksUl[i].style.display = 'none'
        }
      }
    });

    $scope.bookmarksOptions = {
        dropped: function(event) {
            //console.log(event)
            let id = event.source.nodeScope.$modelValue.id,
                oldIndex = event.source.index,
                newIndex = event.dest.index,
                oldParentId = event.source.nodeScope.$modelValue.parentId,
                newParentId = event.dest.nodesScope.$parent.$modelValue ? event.dest.nodesScope.$parent.$modelValue.id : $scope.defaultParent;

            if (oldParentId === newParentId && oldIndex < newIndex) {
                newIndex++;
            }

            chrome.bookmarks.move(id, {parentId: newParentId, index: newIndex}, function(result) {

            });
        }
    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };

}]);
