app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                /**
                 * wrap each socket callback in $scope.$apply to tell angular that it needs to check
                 * the state of the application and update the templates if there was a change after
                 * running the callback passed to it.
                 */
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                /**
                 * wrap each socket callback in $scope.$apply to tell angular that it needs to check
                 * the state of the application and update the templates if there was a change after
                 * running the callback passed to it.
                 */
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});