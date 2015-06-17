/**
 * @ngdoc service
 * @name techTalk.services.ApiHelper
 * @description
 * Service for managing API service environments, operations and resources
 * @requires ex.breeze
 * @requires $http
 * @requires $q
 */

angular.module('techTalk.services')
    .service('ApiHelper', [
        'breeze',
        '$http',
        '$q',
        function(breeze,$http,$q) {
            var accessToken;

            var env,
                serviceName,
                oauthTokenRes,
                logoutRes,
                checkSessionRes,
                userRes,
                newsRes,
                weatherUrl;

            console.log(window.location.host);
            setEnvironment(window.location.host);

            /**
             *  Public Functions
             */

            /**
             * @ngdoc method
             * @name getAccessToken
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Gets the accessToken
             */
            this.getAccessToken = function() {
                return accessToken;
            };

            /**
             * @ngdoc method
             * @name setAccessToken
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Sets the private variable accessToken and stores in localStorage
             */
            this.setAccessToken = function(token) {
                accessToken = token;
                window.localStorage.setItem('accessToken', token);
            };

            /**
             * @ngdoc method
             * @name removeAccessToken
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Sets the private variable accessToken to false and removes from localStorage
             */
            this.removeAccessToken = function() {
                accessToken = false;
                window.localStorage.removeItem('accessToken');
            };

            /**
             * @ngdoc method
             * @name getServiceName
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the name of the service for the active environment
             * @returns {string} service name
             */
            this.getServiceName = function() {
                return serviceName;
            };

            /**
             * @ngdoc method
             * @name getOauthTokenRes
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the name of the token resource for the active environment
             * @returns {string} service name
             */
            this.getOauthTokenRes = function() {
                return oauthTokenRes;
            };

            /**
             * @ngdoc method
             * @name logoutRes
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the name of the logout resource for the active environment
             * @returns {string} service name
             */
            this.getLogoutRes = function() {
                return logoutRes;
            };

            /**
             * @ngdoc method
             * @name getCheckSessionRes
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the checkSession resource for the active environment
             * @returns {string} service name
             */
            this.getCheckSessionRes = function() {
                return checkSessionRes;
            };

            /**
             * @ngdoc method
             * @name getUserRes
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the name of the user resource for the active environment
             * @returns {string} service name
             */
            this.getUserRes = function() {
                return userRes;
            };

            /**
             * @ngdoc method
             * @name getNewsRes
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the name of the news resource for the active environment
             * @returns {string} service name
             */
            this.getNewsRes = function() {
                return newsRes;
            };

            /**
             * @ngdoc method
             * @name getWeatherUrl
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the name of the weather url for the active environment
             * @returns {string} service name
             */
            this.getWeatherUrl = function() {
                return weatherUrl;
            };

            /************************
             * End Resource Getters *
             ***********************/

            /**
             * @ngdoc method
             * @name getTokenHeader
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Get the headers for Oauth
             * @returns {object} oauth token header
             */
            this.getTokenHeader = function() {
                if (!accessToken) {
                    accessToken = window.localStorage.getItem('accessToken');
                }
                return { 'Authorization' : 'Bearer ' + accessToken };
            };

            /**
             * @ngdoc method
             * @name getParameters
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Ability to add additional parameters for use in a breeze entity request
             * @param {Object} addlParameters the additional parameters to add
             * @returns {Object} parameters
             */

            this.getParameters = function(addlParameters) {
                var defaultParams = {};
                var parameters = breeze.core.extend(defaultParams, addlParameters);
                return parameters;
            };

            /**
             * @ngdoc method
             * @name apiCall
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Simple interface for $http object
             * @param {string} entityTypeString
             * The name of the entity type
             * @returns {Array} Array of Entities
             */
            this.apiCall = function(url,method,params,data,headers,resource) {

                if (resource) {
                    url = url+resource;
                }
                return $http({
                    url            : url,
                    method         : method,
                    params         : params,
                    data           : data,
                    headers        : headers
                });
            };

            /**
             * @ngdoc method
             * @name getSuccessErrorDefer
             * @methodOf techTalk.services.ApiHelper
             * @description
             * Returns a standard $q.defer() object with success and error callbacks added.
             * This is useful when mixing $http promises (which have success/error callbacks)
             * with $q promises (which have then/catch callbacks).
             * Just makes the asynchronous promise logic easier to follow.
             * @returns {Object} Deferred
             */
            this.getSuccessErrorDefer = function() {
                var deferred = $q.defer();
                deferred.promise = addSuccessErrorCallbacks(deferred.promise);

                return deferred;
            };

            /**
             * @ngdoc method
             * @name addSuccessErrorDefer
             * @methodOf techTalk.services.ApiHelper
             * @description
             * returns promise with then/catch mapped to success/error methods
             * @param {Object} promise promise to add success/error callbacks to
             * @returns {Object} Promise
             */
            this.addSuccessErrorCallbacks = function(promise) {
                addSuccessErrorCallbacks(promise);
            };

            /**
             *  Private Functions
             */

            function addSuccessErrorCallbacks(promise) {
                promise.success = function(fn) {
                    promise.then(function(data) {
                        fn(data);
                    });
                    return promise;
                };

                promise.error = function(fn) {
                    promise.then(null, function(data) {
                        fn(data);
                    });
                    return promise;
                };

                return promise;
            }

            function setEnvironment(host) {
                oauthTokenRes = "oauth/token";
                logoutRes = "logout";
                checkSessionRes = "checkSession";
                userRes = "users";
                newsRes = "news";
                weatherUrl = "http://api.openweathermap.org/data/2.5/weather";
                switch(host) {
                    case 'local' :
                        serviceName = 'http://127.0.0.1:3000/';
                        env = "local";
                        break;
                    default:
                        serviceName = 'http://127.0.0.1:3000/';
                        env = "local";

                        break;
                }
            }

        }]);