/**
 * @ngdoc service
 * @name techTalk.services.UserService
 * @description
 * Service for managing CRUD operations on Claim objects, both remotely and locally
 * @requires ex.breeze
 * @requires techTalk.services.ApiHelper
 * @requires techTalk.services.EntityManager
 */
angular.module('techTalk.services')
    .factory('NewsService', [
        'breeze',
        'ApiHelper',
        'EntityManager',
        'BaseService',
        function(breeze,ApiHelper,manager,BaseService) {
            /**
             * Extend the BaseService
             * @type {BaseService}
             */
            var resource = ApiHelper.getNewsRes();
            var eType = "NewsItem";
            var svc = new BaseService(resource,eType);


            /**
             * Add Custom properties and methods to svc
             */

            return svc;

        }]);