/**
 * @ngdoc object
 * @name techTalk
 * @description
 * Main application module
 */
angular.module('techTalk', [
    'templates-app',
    'templates-common',
    'ionic',
    'breeze.angular',
    'techTalk.services',
    'techTalk.models',
    'base64',
    'techTalk.login',
    'techTalk.tab.dashboard',
    'techTalk.tab.settings',
    'techTalk.tab.news'
])

/**
 * @ngdoc method
 * @name config
 * @methodOf techTalk
 * @description
 * Registers work which needs to be performed on module loading: default route, start google maps configure and load
 */
    .config(function myAppConfig($stateProvider, $urlRouterProvider, $sceProvider, $httpProvider) {
        $sceProvider.enabled(false);
        //moment.tz.setDefault("UTC");

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        /**
         * @ngdoc object
         * @name techTalk.tab
         * @description
         * Tab abstract state
         */
        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                views: {
                    component: {
                        templateUrl: 'tabs.tpl.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/login');
    })
/**
 * @ngdoc method
 * @name run
 * @methodOf techTalk
 * @description
 * Registers work which should be performed when the injector is done loading all modules.
 */
    .run([
        '$ionicPlatform',
        'breeze',
        '$rootScope',
        '$exceptionHandler',
        '$state',
        '$http',
        function ($ionicPlatform, breeze, $rootScope, $exceptionHandler, $state, $http, ErrorService) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleLightContent();
                }
            });
        }
    ])
/**
 * @ngdoc controller
 * @name techTalk.controller:AppCtrl
 * @description
 * Main application controller
 */
    .controller('AppCtrl', [
        '$scope',
        '$location',
        '$state',
        function AppCtrl($scope, $location, $state) {
            $scope.$on('$stateChangeSuccess',
                function (event, toState, toParams, fromState, fromParams) {
                    if (angular.isDefined(toState.data.pageTitle)) {
                        $scope.pageTitle = toState.data.pageTitle + ' | techTalk';
                    }
                });
        }
    ])

;
/**
 * @ngdoc overview
 * @name techTalk.services
 * @description
 * Main module to hold all sub services
 */
angular.module("techTalk.services", []);

/**
 * @ngdoc overview
 * @name techTalk.models
 * @description
 * Main module to hold all model object factories
 */
angular.module("techTalk.models", []);

/**
 * @ngdoc overview
 * @name ex
 * @description
 * Placeholder for links to documentation of all external dependencies.
 * If its loaded in bower.json and injected as a dependency somewhere,
 * it should have @requires ex.dependencyName
 */
/**
 * @ngdoc object
 * @name ex.breeze
 * @description
 *  JavaScript ORM. Breeze.js brings rich data management to Javascript clients.
 *  Breeze.js communicates with any service that speaks HTTP and JSON and runs natively on any JS client
 *  - {@link http://getbreezenow.com breeze}
 */

/**
 * @ngdoc overview
 * @name ng
 * @description
 * Placeholder for links to documentation of all angular services.
 * If it's a native angular service injected as dependency, it should have @requires $serviceName.
 * The "ng." namespace will be added automatically in the docs.
 */
/**
 * @ngdoc object
 * @name ng.$q
 * @description
 *  A service that helps you run functions asynchronously, and use their return values (or exceptions) when they are done processing.
 *  - {@link https://docs.angularjs.org/api/ng/service/$q $q}
 */
/**
 * @ngdoc object
 * @name ng.$http
 * @description
 *  The $http service is a core Angular service that facilitates communication with the remote HTTP
 *  servers via the browser's XMLHttpRequest object or via JSONP.
 *  - {@link https://docs.angularjs.org/api/ng/service/$http $http}
 */
/**
 * @ngdoc object
 * @name ex.$modal
 * @description
 *  The $modal service is a child of the ui.bootstrap directive
 *  - {@link https://angular-ui.github.io/bootstrap ui.bootstrap}
 */