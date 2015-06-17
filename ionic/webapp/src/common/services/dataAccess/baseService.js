/**
 * @ngdoc service
 * @name techTalk.services.BaseService
 * @description
 * Service for managing CRUD operations on Claim objects, both remotely and locally
 * @requires ex.breeze
 * @requires techTalk.services.ApiHelper
 * @requires techTalk.services.EntityManager
 */
angular.module('techTalk.services')
    .factory('BaseService', [
        'breeze',
        'ApiHelper',
        'EntityManager',
        function(breeze,ApiHelper,manager) {

            /**
             * BaseService constructor
             * @param resource
             * @param eType
             * @returns {
             * {
             *  load: Function,
             *  get: Function,
             *  getProjection: Function,
             *  getById: Function,
             *  create: Function,
             *  createFromServer: Function,
             *  serverCreate: Function,
             *  serverUpdate: Function,
             *  serverDelete: Function
             *  }
             * }
             */
            var baseSvc = function(resource,eType) {
                return {
                    load : function() {
                        return loadFromServer(resource);
                    },
                    loadById : function(id) {
                        var query = breeze.EntityQuery
                            .from(resource + '/' + id);
                        return manager.executeQuery(query);
                    },
                    get : function() {
                        return getFromCache(eType);
                    },
                    getProjection : function(projection) {
                        var query = breeze.EntityQuery
                            .from(eType)
                            .select(projection);
                        return manager.executeQueryLocally(query);
                    },
                    getById : function(id) {
                        return manager.getEntityByKey(eType,id);
                    },
                    getFromCacheOrServer : function() {
                        return getFromCacheOrServer(resource,eType);
                    },
                    create : function(vals) {
                        return manager.createEntity(eType, vals);
                    },
                    createFromServer : function(vals) {
                        return manager.createEntityFromServer(eType, vals);
                    },
                    serverCreate : function(data) {
                        return serverCreate(data,resource,eType);
                    },
                    serverUpdate : function(entity) {
                        return serverUpdate(entity,resource,eType);
                    },
                    serverDelete : function(entity) {
                        return serverDelete(entity,resource);
                    }
                };
            };

            return baseSvc;

            /*********************
             * Private Functions *
             *********************/

            //get from cache

            function getFromCache(eType) {
                var query = breeze.EntityQuery
                    .from(eType);
                return manager.executeQueryLocally(query);
            }

            // load from server

            function loadFromServer(resource) {
                var query = breeze.EntityQuery
                    .from(resource);
                return manager.executeQuery(query);
            }

            function getFromCacheOrServer(resource,eType) {
                var deferred = ApiHelper.getSuccessErrorDefer();
                var cache = getFromCache(eType);
                if (cache.length > 0) {
                    deferred.resolve(cache);
                } else {
                    loadFromServer(resource).then(function(results) {
                        deferred.resolve(results);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }

                return deferred.promise;
            }

            //create

            function serverCreate(data,resource,eType) {
                var deferred = ApiHelper.getSuccessErrorDefer();
                createEntityCall(data,resource)
                    .success(function(data,status,headers,config) {
                        var serverEntity = manager.createEntityFromServer(eType,data);
                        deferred.resolve(serverEntity);
                    });
                return deferred.promise;
            }

            function createEntityCall(data,resource) {
                var url = ApiHelper.getServiceName() + resource;
                var method = 'POST';
                var params = null;
                var headers = ApiHelper.getTokenHeader();
                return ApiHelper.apiCall(url,method,params,data,headers);
            }

            //update

            function serverUpdate(entity,resource,eType) {
                var deferred = ApiHelper.getSuccessErrorDefer();
                updateEntityCall(entity,resource)
                    .success(function(data,status,headers,config) {
                        //manager.saveChangesLocal();
                        manager.saveChangesLocalForEntityType(eType);
                        deferred.resolve();
                    });
                return deferred.promise;
            }

            function updateEntityCall(entity,resource) {
                var pathParams = "/" + entity.id;
                var url = ApiHelper.getServiceName() + resource + pathParams;
                var method = 'PUT';
                var params = null;
                var headers = ApiHelper.getTokenHeader();
                var data = manager.getDataFromEntity(entity);
                return ApiHelper.apiCall(url,method,params,data,headers);
            }

            //delete

            function serverDelete(entity,resource) {
                var deferred = ApiHelper.getSuccessErrorDefer();
                deleteEntityCall(entity,resource)
                    .success(function(data,status,headers,config) {
                        deferred.resolve();
                    });
                return deferred.promise;
            }

            function deleteEntityCall(entity,resource) {
                var pathParams = "/" + entity.id;
                var url = ApiHelper.getServiceName() + resource + pathParams;
                var method = 'DELETE';
                var params = null;
                var data = null;
                var headers = ApiHelper.getTokenHeader();

                return ApiHelper.apiCall(url,method,params,data,headers);
            }

        }]);