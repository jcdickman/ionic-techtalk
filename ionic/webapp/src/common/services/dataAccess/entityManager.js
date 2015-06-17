/**
 * @ngdoc service
 * @name techTalk.services.EntityManager
 * @description
 * Factory for creating breeze Entity Manager
 * @requires ex.breeze
 * @requires techTalk.services.ApiHelper
 * @requires techTalk.services.DataModel
 * @requires techTalk.services.jsonResultsAdapter
 */

angular.module('techTalk.services')
    .factory('EntityManager', [
        'breeze',
        'ApiHelper',
        'DataModel',
        'jsonResultsAdapter',
        function(breeze,ApiHelper,model,jsonResultsAdapter) {

            var serviceName = ApiHelper.getServiceName();

            var ds = new breeze.DataService({
                serviceName: serviceName,
                hasServerMetadata: false,
                jsonResultsAdapter: jsonResultsAdapter
            });

            var manager = new breeze.EntityManager({dataService: ds});

            //var newQo = new breeze.QueryOptions( { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });
            //
            //manager.setProperties( { queryOptions: newQo });
            setQueryOptions(false);

            model.initialize(manager.metadataStore);

            // get the current default Breeze AJAX adapter
            var ajaxAdapter = breeze.config.getAdapterInstance('ajax');
            // set fixed headers
            ajaxAdapter.requestInterceptor = function(requestInfo) {
                //console.log(requestInfo);
                requestInfo.config.headers = ApiHelper.getTokenHeader();
            };

            /****************************************
             * Add custom methods to entity manager *
             ***************************************/

            manager.includeDeletedInQueries = function() {
                setQueryOptions(true);
            };
            manager.excludeDeletedFromQueries = function() {
                setQueryOptions(false);
            };

            /**
             * Change Tracking, Saving and Rollback
             */

            /**
             * @ngdoc method
             * @name saveChangesLocal
             * @methodOf techTalk.services.EntityManager
             * @description
             * Sets entities in local cache to "unchanged", effectively "saving" them locally
             * i.e. Breeze will no longer view them as modified or added entities
             * @returns {Array} Array of Entities
             */
            manager.saveChangesLocal = function() {
                var changes = this.getChanges();
                angular.forEach(changes, function (change) {
                    if(change.entityAspect.entityState != 'Deleted') {
                        change.entityAspect.setUnchanged();
                    }else {
                        change.entityAspect.setDetached();
                    }
                });

                return changes;
            };

            /**
             * @ngdoc method
             * @name saveChangesLocalForEntityType
             * @methodOf techTalk.services.EntityManager
             * @description
             * Sets entities of a specific entity type in local cache to "unchanged", effectively "saving" them locally
             * i.e. Breeze will no longer view them as modified or added entities
             * @params {Sting} Entity Type name
             * @returns {Array} Array of Entities
             */
            manager.saveChangesLocalForEntityType = function(eType) {
                var changes = this.getChanges();
                angular.forEach(changes, function (change) {
                    if (change.entityType.shortName == eType) {
                        if(change.entityAspect.entityState != 'Deleted') {
                            change.entityAspect.setUnchanged();
                        }else {
                            change.entityAspect.setDetached();
                        }
                    }
                });

                return changes;
            };

            /**
             * @ngdoc method
             * @name rollBackChanges
             * @methodOf techTalk.services.EntityManager
             * @description
             * Rejects changes on all changed entities in cache
             */
            manager.rollBackChanges = function() {
                var changes = manager.getChanges();
                angular.forEach(changes,function(change) {
                    change.entityAspect.rejectChanges();
                });
            };

            /**
             * @ngdoc method
             * @name rollBackChangesOnEntity
             * @methodOf techTalk.services.EntityManager
             * @description
             * Rejects changes on a specific changed entity in cache
             * @param {object} entity the entity on which the changes will be rolled back
             */
            manager.rollBackChangesOnEntity = function (entity) {
                console.log(entity);
                entity.entityAspect.rejectChanges();
            };

            /**
             * @ngdoc method
             * @name getChangesForEntityType
             * @methodOf techTalk.services.EntityManager
             * @description
             * Get changes from entity manager. Returns a array of all changed entities of the specified EntityTypes.
             * A 'changed' Entity has has an EntityState of either Added, Modified or Deleted.
             * @param {string} entityTypeString
             * The name of the entity type
             * @returns {Array} Array of Entities
             */
            manager.getChangesForEntityType = function(entityTypeString) {
                var entityType = manager.metadataStore.getEntityType(entityTypeString);
                return manager.getChanges(entityType);
            };

            /**
             * @ngdoc method
             * @name createEntityFromServer
             * @methodOf techTalk.services.EntityManager
             * @description
             * Creates a new entity of a specified type and initializes it.
             * This method is used for entities retrieved from server outside of breeze, when those entities need to be treated
             * as "Unchanged" (as opposed to "Added") and also to apply the mergeStrategy specified in the manager's queryOptions.
             * @param {string} type entityType
             * @param {Object} vals initial values object for breeze entity
             * @returns {Object} Entity
             */
            manager.createEntityFromServer = function(type,vals) {
                var mergeStrategy = manager.queryOptions.mergeStrategy;
                entity = manager.createEntity(type, vals, breeze.EntityState.Unchanged, mergeStrategy);

                return entity;
            };

            /**
             * @ngdoc method
             * @name getEntitiesByMap
             * @methodOf techTalk.services.EntityManager
             * @description
             * Handles Many to Many entity retrievals
             * @param {string} entityNavProp name of navigation property on map object to access entities
             * @param {string} mapType entityType of map object
             * @param {string} key name of foreignId to find on the map object
             * @param {string} val value to match against the value of the foreignId / key
             * @param {Boolean} projection true to retrieve flat json, null to retrieve breeze entity
             * @returns {Array} Array of Entities
             */
            manager.getEntitiesByMap = function(entityNavProp,mapType,key,val,projection) {
                var mapQuery = breeze.EntityQuery
                    .from(mapType)
                    .where(key, "eq", val);

                var Maps = manager.executeQueryLocally(mapQuery);
                var entities = [];
                angular.forEach(Maps, function(map) {
                    if (map[key] == val) {
                        if (map[entityNavProp] !== null) {
                            if (projection==null) {
                                entities.push(map[entityNavProp]);
                            } else {
                                entities.push(getDataFromEntity(map[entityNavProp]));
                            }
                        }
                    }
                });

                return entities;
            };

            /**
             * @ngdoc method
             * @name getDataFromEntity
             * @methodOf techTalk.services.EntityManager
             * @description
             * Create simple javascript data object for an entity's non navigation properties
             * Useful for sending to the server, or otherwise avoid circular references in serialization
             * or data binding/watching.
             * @param {Object} entity A Breeze Entity
             * @returns {Object} Simple javascript data object
             */
            manager.getDataFromEntity = function(entity) {
                return getDataFromEntity(entity);
            };

            return manager;

            function setQueryOptions(includeDeleted) {
                var newQo = new breeze.QueryOptions( {
                    mergeStrategy: breeze.MergeStrategy.OverwriteChanges,
                    includeDeleted: includeDeleted
                });
                manager.setProperties( { queryOptions: newQo });
            }

            function getDataFromEntity(entity) {
                var data = {};
                //console.log(entity);
                angular.forEach(entity.entityType.dataProperties, function(dataProp) {
                    //console.log(dataProp);
                    //console.log(entity.getProperty(dataProp.name));
                    if ((dataProp.isDataProperty) && (!dataProp.isNavigationProperty)) {
                        data[dataProp.name] = entity.getProperty(dataProp.name);
                    }
                });
                return data;
            }
        }
    ]);