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
        function LoginController( $scope, $state, AuthService ) {

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
            $scope.login = function() {
                loginCall(this.username,this.password);
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
                            //userService.initUser(token,userId)
                            //    .success(function(data) {
                                    $state.go('dashboard');
                                //})
                                //.error(function(error) {
                                //    console.log(error);
                                //});
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