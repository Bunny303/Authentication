/// <reference path="../libs/angular.js" />

angular.module('auth-app').controller('GameCtrl', ['$rootScope', '$scope', '$location', 'Auth',
    function ($rootScope, $scope, $location, Auth) {

        $scope.user = localStorage.getItem("username");
                
        $scope.logout = function () {
            localStorage.clear();
        };
}]);

angular.module('auth-app').controller('LoginCtrl', ['$rootScope', '$scope', '$location', '$window', 'Auth',
    function ($rootScope, $scope, $location, $window, Auth) {

    //$scope.rememberme = true;
    $scope.login = function () {
        Auth.login({
            username: $scope.username,
            password: $scope.password
            //rememberme: $scope.rememberme
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



