/**
 * @ngdoc object
 * @name techTalk.tab.dashboard
 * @description
 * Dashboard module
 */
angular.module( 'techTalk.tab.dashboard', [
    'ui.router'
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
        function DashboardController( $scope, $state ) {

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
             * @methodOf techTalk.tab.dashboard.controller:DashboardCtrl
             * @description
             * Here simply to organize the code that runs on controller init
             */
            function initialize() {
                console.log('init');
            }

        }
    ])

;