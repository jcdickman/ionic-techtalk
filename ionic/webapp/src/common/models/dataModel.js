/**
 * @ngdoc service
 * @name techTalk.services.DataModel
 * @description
 * Service for managing the breeze metadata store which holds all the model objects
 * @requires ex.breeze
 */
angular.module('techTalk.services')
    .service('DataModel', [
        'breeze',
        'userModel',
        'newsItemModel',
        function(breeze,userModel,newsItemModel) {

            /**
             * @ngdoc method
             * @name initialize
             * @methodOf techTalk.services.DataModel
             * @param {Object} metadataStore the metadata store to initialize
             */
            this.initialize = function(metadataStore) {
                /**
                 * Add model definitions from model factories
                 */
                metadataStore.addEntityType(userModel);
                metadataStore.addEntityType(newsItemModel);

            };

        }]);