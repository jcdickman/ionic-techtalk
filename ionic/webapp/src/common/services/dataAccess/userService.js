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
    .factory('UserService', [
        'breeze',
        'ApiHelper',
        'EntityManager',
        'BaseService',
        'AuthService',
        '$q',
        function(breeze,ApiHelper,manager,BaseService,AuthService,$q) {
            /**
             * Extend the BaseService
             * @type {BaseService}
             */
            var resource = ApiHelper.getUserRes();
            var eType = "User";
            var svc = new BaseService(resource,eType);


            /**
             * Add Custom properties and methods to svc
             */

            /**
             * @ngdoc method
             * @name initUser
             * @methodOf techTalk.services.UserService
             * @description
             * Initialize a logged in user and their required associations
             * @returns {Promise} Success or Fail callbacks
             */
            svc.initUser = function(token,userId) {

                var deferred = ApiHelper.getSuccessErrorDefer();

                ApiHelper.setAccessToken(token);
                getUser(userId)
                    .success(function(data) {
                        console.log(data);
                        var breezeUser = manager.createEntityFromServer('User',data.user);
                        breezeUser.loggedIn = true;
                        AuthService.setUser(breezeUser);
                        angular.forEach(data.urMaps, function(urMap) {
                            var urMapEntity = manager.createEntityFromServer('UserRoleMap', urMap);
                            console.log(urMapEntity);
                        });
                        deferred.resolve(breezeUser);
                    })
                    .error(function(data, status, headers, config) {
                        deferred.reject(data);
                    });

                return deferred.promise;
            };


            function getUser(userId) {
                var url = ApiHelper.getServiceName();
                var resource = ApiHelper.getUserRes() + "/" + userId;
                var method = 'GET';
                var params = '';
                var headers = ApiHelper.getTokenHeader();
                var data = null;

                return ApiHelper.apiCall(url,method,params,data,headers,resource);
            }

            return svc;

        }]);