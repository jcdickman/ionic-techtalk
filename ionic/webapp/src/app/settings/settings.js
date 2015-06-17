/**
 * @ngdoc object
 * @name techTalk.tab.settings
 * @description
 * Settings module
 */
angular.module( 'techTalk.tab.settings', [
    'ionic'
])

/**
 * @ngdoc method
 * @name config
 * @methodOf techTalk.tab.settings
 * @description
 * Registers work which needs to be performed on module loading:
 * configure the state associated with this controller,
 * the controllers views, and any dependencies which should be resolved
 * prior to loading controller instance.
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'settings', {
            url: '/settings',
            parent: 'tab',
            views: {
                "tab-settings": {
                    controller: 'SettingsCtrl',
                    templateUrl: 'settings/settings.tpl.html',
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
                        }]
                    }
                }
            },
            data: { pageTitle: 'Settings' }
        });
    })

/**
 * @ngdoc controller
 * @name techTalk.tab.settings.controller:SettingsCtrl
 * @description
 * Main application controller
 * @requires $scope
 * @requires $state
 */
    .controller( 'SettingsCtrl', [
        '$scope',
        '$state',
        'AuthService',
        'EntityManager',
        function SettingsController( $scope, $state, AuthService, manager ) {

            /**
             * Scope Variables
             */

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
            $scope.logout = function() {
                logout();
            };

            /**
             * Helper Functions
             */

            /**
             * @ngdoc method
             * @name initialize
             * @methodOf techTalk.tab.settings.controller:SettingsCtrl
             * @description
             * Here simply to organize the code that runs on controller init
             */
            function initialize() {
                console.log('init');
            }

            /**
             * @ngdoc method
             * @name logout
             * @methodOf techTalk.tab.settings.controller:SettingsCtrl
             * @description
             * Logs the user out of the app
             */
            function logout() {
                AuthService.logout()
                    .success(function() {
                        manager.clear();
                        AuthService.setUser({ loggedIn: false });
                        $state.go('login');
                    })
                    .error(function(data) {
                        console.log(data);
                        manager.clear();
                        AuthService.setUser({ loggedIn: false });
                        $state.go('login');
                    });
            }

        }
    ])

;