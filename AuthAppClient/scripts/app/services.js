/// <reference path="../libs/underscore.js" />
/// <reference path="../libs/angular.js" />

angular.module('auth-app')
.factory('Auth', function ($http, $rootScope) {
    
    function changeUser(user) {
        localStorage.setItem("username", user.username);
    };

    return {
        isLoggedIn: function (user) {
            if (localStorage.getItem("username")) {
                return true;
            }
                
            return false;
        },
        register: function (user, success, error) {
            $http.post($rootScope.baseUrl + '/register', user).success(function (user) {
                changeUser(user);
                success(user);
            }).error(error);
        },
        login: function (user, success, error) {
            $http.post($rootScope.baseUrl + '/login', user).success(function (user) {
                changeUser(user);
                success(user);
            }).error(error);
        }
    };
});

angular.module('auth-app')
.factory('Users', function ($http) {
    return {
        getAll: function (success, error) {
            $http.get($rootScope.baseUrl + '/users').success(success).error(error);
        }
    };
});
