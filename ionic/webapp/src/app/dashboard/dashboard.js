/**
 * @ngdoc object
 * @name techTalk.tab.dashboard
 * @description
 * Dashboard module
 */
angular.module( 'techTalk.tab.dashboard', [
    'ionic'
])

/**
 * @ngdoc method
 * @name config
 * @methodOf techTalk.tab.dashboard
 * @description
 * Registers work which needs to be performed on module loading:
 * configure the state associated with this controller,
 * the controllers views, and any dependencies which should be resolved
 * prior to loading controller instance.
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'dashboard', {
            url: '/dashboard',
            parent: 'tab',
            views: {
                "tab-dashboard": {
                    controller: 'DashboardCtrl',
                    templateUrl: 'dashboard/dashboard.tpl.html',
                    resolve: {
                        user: ['$q', '$state', 'AuthService', 'UserService', function($q, $state, AuthService, users) {
                            var deferred = $q.defer();
                            AuthService.checkSession()
                                .success(function(data) {
                                    if(data.user.loggedIn) {
                                        users.initUser(data.token,data.user.id)
                                            .success(function(breezeUser) {
                                                deferred.resolve(breezeUser);
                                            })
                                            .error(function(error) {
                                                console.log(error);
                                            });
                                    } else {
                                        $state.go('login');
                                    }
                                })
                                .error(function(error) {
                                    console.log(error);
                                });
                            return deferred.promise;
                        }],
                        news: ['NewsService', function(news) {
                            return news.load();
                        }]
                    }
                }
            },
            data: { pageTitle: 'Dashboard' }
        });
    })

/**
 * @ngdoc controller
 * @name techTalk.tab.dashboard.controller:DashboardCtrl
 * @description
 * Main application controller
 * @requires $scope
 * @requires $state
 */
    .controller( 'DashboardCtrl', [
        '$scope',
        '$state',
        'ApiHelper',
        'NewsService',
        'WeatherService',
        function DashboardController( $scope, $state, apiHelper, news, weather ) {

            /**
             * Scope Variables
             */
            $scope.news = {};
            $scope.weather = {};
            /**
             * Local Variables
             */


            /**
             * Event Handlers
             */

            /**
             * Initialize
             */
            initialize();

            /**
             * Scope Functions
             */

            /**
             * Helper Functions
             */

            /**
             * @ngdoc method
             * @name initialize
             * @methodOf techTalk.tab.dashboard.controller:DashboardCtrl
             * @description
             * Here simply to organize the code that runs on controller init
             */
            function initialize() {
                console.log('init');
                $scope.news.newsItems = news.get();
                console.log($scope.news);
                weather.get()
                    .success(function(data, status, headers, config) {
                        $scope.weather.weatherDetails = data;
                        console.log(data);
                    });
            }



        }
    ])

;