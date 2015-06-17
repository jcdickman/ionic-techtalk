/**
 * @ngdoc object
 * @name techTalk.login
 * @description
 * Login module
 */
angular.module( 'techTalk.login', [
    'ionic'
])

/**
 * @ngdoc method
 * @name config
 * @methodOf techTalk.login
 * @description
 * Registers work which needs to be performed on module loading:
 * configure the state associated with this controller,
 * the controllers views, and any dependencies which should be resolved
 * prior to loading controller instance.
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'login', {
            url: '/login',
            views: {
                component: {
                    controller: 'LoginCtrl',
                    templateUrl: 'login/login.tpl.html',
                    resolve: {
                        user: ['$q', '$state', 'AuthService', 'UserService', function($q, $state, AuthService, users) {
                            var deferred = $q.defer();
                            AuthService.checkSession()
                                .success(function(data) {
                                    if(data.user.loggedIn) {
                                        users.initUser(data.token,data.user.id)
                                            .success(function(breezeUser) {
                                                $state.go('dashboard');
                                            })
                                            .error(function(error) {
                                                console.log(error);
                                            });
                                    } else {
                                        deferred.resolve(data.user);
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
            data: { pageTitle: 'Login' }
        });
    })

/**
 * @ngdoc controller
 * @name techTalk.login.controller:LoginCtrl
 * @description
 * Main application controller
 * @requires $scope
 * @requires $state
 */
    .controller( 'LoginCtrl', [
        '$scope',
        '$state',
        'AuthService',
        'UserService',
        function LoginController( $scope, $state, AuthService, users ) {

            /**
             * Scope Variables
             */
            $scope.user = {};
            $scope.user.username = null;
            $scope.user.password = null;

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
            $scope.login = function() {
                loginCall($scope.user.username,$scope.user.password);
            };

            /**
             * Helper Functions
             */

            /**
             * @ngdoc method
             * @name initialize
             * @methodOf techTalk.login.controller:LoginCtrl
             * @description
             * Here simply to organize the code that runs on controller init
             */
            function initialize() {
                console.log('init');
            }

            /**
             * @ngdoc method
             * @name loginCall
             * @methodOf techTalk.login.controller:LoginCtrl
             * @description
             * Login the user
             * @param {string} userName
             * The username
             * @param {string} password
             * The password
             */
            function loginCall(userName,password) {
                AuthService.login(userName,password)
                    .success(function(data, status, headers, config) {
                        var token = data.access_token.token;
                        var userId = data.access_token.userId;
                        if(token) {
                            users.initUser(token,userId)
                                .success(function(data) {
                                    $state.go('dashboard');
                                })
                                .error(function(error) {
                                    console.log(error);
                                });
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                        console.log(status);
                        console.log(headers);
                        console.log(config);
                    });
            }

        }
    ])

;