'use strict';

angular.module('auth-app')
.factory('Auth', function ($http, $cookieStore, $rootScope) {

    $cookieStore.remove('user');

    function changeUser(user) {
        _.extend(currentUser, user);
    };

    return {
        isLoggedIn: function (user) {
            if (user === undefined)
                user = currentUser;
            return user.username;
        },
        register: function (user, success, error) {
            $http.post($rootScope.baseUrl + '/register', user).success(function (res) {
                //changeUser(res);
                success();
            }).error(error);
        },
        login: function (user, success, error) {
            $http.post($rootScope.baseUrl + '/login', user).success(function (user) {
                //changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function (success, error) {
            $http.post($rootScope.baseUrl + '/logout').success(function () {
                changeUser({
                    username: ''
                });
                success();
            }).error(error);
        },
        //user: currentUser
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
