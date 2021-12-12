App.directive('countdown', [
    'Util', '$interval', function(Util, $interval) {
      return {
        restrict: 'A',
        scope: {
          leftTime: '=leftTime'
        },
        link: function(scope, element) {
          var leftTime = scope.leftTime;

          var countdown = $interval(function() {
            leftTime = leftTime - 1;

            if (leftTime <= 0) {
                $interval.cancel(countdown);
                return element.text('0h 0m 0s');
            }

            return element.text(Util.dhms(leftTime));

          }, 1000);

          element.on('$destroy', function() {
              $interval.cancel(countdown);
          });

        }
      };
    }
  ]).factory('Util', [
    function() {
      return {
        dhms: function(t) {
          var days, hours, minutes, seconds;
          days = Math.floor(t / 86400);
          t -= days * 86400;
          hours = Math.floor(t / 3600) % 24;
          t -= hours * 3600;
          minutes = Math.floor(t / 60) % 60;
          t -= minutes * 60;
          seconds = t % 60;
          return [days > 0 ? days + 'd' : '', hours + 'h', minutes + 'm', seconds + 's'].join(' ');
        }
      };
    }
  ]);
