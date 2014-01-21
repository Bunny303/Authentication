/// <reference path="../libs/angular.js" />
/// <reference path="../libs/angular-route.js" />

angular.module('auth-app', ['ngCookies', 'ngRoute'])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {            

        $routeProvider.when('/', ///login
            {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            });
        $routeProvider.when('/register',
            {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl'
            });
        $routeProvider.when('/game',
            {
                templateUrl: 'views/game.html'
                //controller: 'RegisterCtrl'
            });
        $routeProvider.when('/404',
            {
                templateUrl: '404'
            });
        $routeProvider.otherwise({ redirectTo: '/404' });

        $locationProvider.html5Mode(true);

        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            }
        });

    }])

    .run(['$rootScope', '$location', '$http', 'Auth', function ($rootScope, $location, $http, Auth) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            $rootScope.baseUrl = "http://localhost:8000";
            //if (Auth.isLoggedIn()) $location.path('/');
            //else $location.path('/login');
        });

    }]);