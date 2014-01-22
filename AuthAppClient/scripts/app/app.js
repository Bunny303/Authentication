/// <reference path="../libs/angular.js" />
/// <reference path="../libs/angular-route.js" />

angular.module('auth-app', ['ngCookies', 'ngRoute'])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {            

        $routeProvider
            .when("/login", {
                templateUrl: "views/login.html",
                controller: "LoginCtrl"
            })
            .when("/register", {
                templateUrl: "views/register.html",
                controller: "RegisterCtrl"
            })
            .when("/game", {
                templateUrl: "views/game.html",
                controller: "GameCtrl"
            })
            //.when('/404', {
            //    templateUrl: '404'
            //})
            .otherwise({
                redirectTo: "/login"
            });
        
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'responseError': function (rejection) {
                    if (rejection.status === 401 || rejection.status === 403) {
                        $location.path('/login');
                        return $q.reject(rejection);
                    }
                    else {
                        return $q.reject(rejection);
                    }
                }
            }
        });

    }])

    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        $rootScope.$on("$locationChangeStart", function () {
            if (Auth.isLoggedIn()) {
                $location.path('/game');
            }
        });
        $rootScope.error = null;
        $rootScope.baseUrl = "http://localhost:8000";
    }]);