/**
 * @ngdoc object
 * @name techTalk.login
 * @description
 * Login module
 */
angular.module( 'techTalk.login', [
    'ui.router'
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
        function LoginController( $scope, $state ) {

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

        }
    ])

;