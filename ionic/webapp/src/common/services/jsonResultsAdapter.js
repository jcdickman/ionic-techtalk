/**
 * @ngdoc service
 * @name techTalk.services.jsonResultsAdapter
 * @description
 * A JsonResultsAdapter instance is used to provide custom extraction and parsing logic on the json results returned by any web service.
 * This facility makes it possible for breeze to talk to virtually any web service and return objects that will be first class 'breeze' citizens.
 * .value() registers a value service with the $injector, such as a string, a number, an array, an object or a function.
 * This is short for registering a service where its provider's $get property is a factory function that takes no arguments and returns the value service.
 * Value services are similar to constant services, except that they cannot be injected into a module configuration function but they can be overridden by an Angular decorator.
 */
angular.module('techTalk.services')
    .value('jsonResultsAdapter',
    new breeze.JsonResultsAdapter({

        name: "jsonAdapter",

        /**
         * @ngdoc method
         * @name extractResults
         * @methodOf techTalk.services.jsonResultsAdapter
         * @param {Object} data response from web service call
         * @returns {Array|Object} results
         */
        extractResults: function (data) {
            var results = data.results;
            console.log('extracting results');
            console.log(results);
            if (!results) {
                return false;
            }
            return results;
        },

        /**
         * @ngdoc method
         * @name visitNode
         * @methodOf techTalk.services.jsonResultsAdapter
         * @param {string} node node within json results
         * @description
         * A visitor method that will be called on each node of the returned payload.
         * @returns {Object} node
         */
        visitNode: function (node, parseContext, nodeContext) {
            if (node.hasOwnProperty('entityType')) {

                if (node.entityType == "User") {
                    return { entityType: "User" };
                }

                if (node.entityType == "NewsItem") {
                    return { entityType: "NewsItem" };
                }

            }
        }

    }));