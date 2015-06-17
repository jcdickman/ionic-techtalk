/**
 * @ngdoc object
 * @name techTalk.tab.news
 * @description
 * News module
 */
angular.module( 'techTalk.tab.news', [
    'ionic'
])

/**
 * @ngdoc method
 * @name config
 * @methodOf techTalk.tab.news
 * @description
 * Registers work which needs to be performed on module loading:
 * configure the state associated with this controller,
 * the controllers views, and any dependencies which should be resolved
 * prior to loading controller instance.
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'news', {
            url: '/news/:newsItemId',
            parent: 'tab',
            views: {
                "tab-dashboard": {
                    controller: 'NewsCtrl',
                    templateUrl: 'news/news.tpl.html',
                    resolve: {

                    }
                }
            },
            data: { pageTitle: 'News' }
        });
    })

/**
 * @ngdoc controller
 * @name techTalk.tab.news.controller:NewsCtrl
 * @description
 * Main application controller
 * @requires $scope
 * @requires $state
 */
    .controller( 'NewsCtrl', [
        '$scope',
        '$state',
        'ApiHelper',
        'NewsService',
        '$stateParams',
        function NewsController( $scope, $state, apiHelper, news, $stateParams ) {

            /**
             * Scope Variables
             */
            $scope.newsItem = {};
            /**
             * Local Variables
             */
            var newsItemId = $stateParams.newsItemId;

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
             * @methodOf techTalk.tab.news.controller:NewsCtrl
             * @description
             * Here simply to organize the code that runs on controller init
             */
            function initialize() {
                console.log('init');
                $scope.newsItem = news.getById(newsItemId);
            }

        }
    ])

;