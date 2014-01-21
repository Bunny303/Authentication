'use strict';

angular.module('auth-app').controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth',
    function ($rootScope, $scope, $location, Auth) {

    $scope.user = Auth.user;
        
    $scope.logout = function () {
        Auth.logout(function () {
            $location.path('/login');
        }, function () {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('auth-app').controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth',
    function ($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function () {
        Auth.login({
            username: $scope.username,
            password: $scope.password,
            rememberme: $scope.rememberme
        },
            function (res) {
                $location.path('/game');
            },
            function (err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function (provider) {
        $window.location.href = $rootScope.baseUrl + '/auth/' + provider;
    };
}]);

angular.module('auth-app').controller('RegisterCtrl', ['$rootScope', '$scope', '$location', 'Auth',
    function ($rootScope, $scope, $location, Auth) {
 
    $scope.register = function () {
        Auth.register({
            username: $scope.username,
            password: $scope.password
        },
            function () {
                $location.path('/game');
            },
            function (err) {
                $rootScope.error = err;
            });
    };
}]);



