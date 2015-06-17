/**
 * @ngdoc service
 * @name techTalk.services.AuthService
 * @description
 * Service for managing basic auth login, logout, and session checks
 * @requires $http
 * @requires $q
 * @requires ex.base64
 */

angular.module('techTalk.services')
    .service('AuthService', [
        '$q',
        'ApiHelper',
        '$base64',
        function($q,apiHelper,$base64) {

            var user = {
                loggedIn : false
            };

            /**
             *  Public Functions
             */

            /**
             * @ngdoc method
             * @name getUser
             * @methodOf techTalk.services.AuthService
             * @description
             * Gets the User
             * @returns {Object} user object
             */
            this.getUser = function() {
                return user;
            };

            /**
             * @ngdoc method
             * @name setUser
             * @methodOf techTalk.services.AuthService
             * @description
             * Sets the User
             * @returns {Object} user object
             */
            this.setUser = function(newUser) {
                user = newUser;
                if (!user.loggedIn) {
                    apiHelper.removeAccessToken();
                }
                return user;
            };

            /**
             * @ngdoc method
             * @name isLoggedIn
             * @methodOf techTalk.services.AuthService
             * @description
             * Returns true for logged in users
             * @returns {Boolean} isLoggedIn boolean
             */
            this.isLoggedIn = function() {
                return user.loggedIn;
            };

            /**
             * @ngdoc method
             * @name login
             * @methodOf techTalk.services.AuthService
             * @description
             * Basic Auth Login
             * @returns {Object} login http promise
             */
            this.login = function(userName,password) {
                return loginCall(userName,password);
            };

            /**
             * @ngdoc method
             * @name logout
             * @methodOf techTalk.services.AuthService
             * @description
             * Log the user out
             * @returns {Object} logout http promise
             */
            this.logout = function() {
                return logoutCall();
            };

            /**
             * @ngdoc method
             * @name checkSession
             * @methodOf techTalk.services.AuthService
             * @description
             * Checks if there is an active user session
             * @returns {Object} promise which resolves user or rejects with server error
             */

            this.checkSession = function() {

                var deferred = apiHelper.getSuccessErrorDefer();

                checkSessionCall()
                    .success(function(data, status, headers, config) {
                        data.loggedIn = true;
                        var response = {
                            user: data,
                            token: apiHelper.getAccessToken()
                        };
                        deferred.resolve(response);
                    })
                    .error(function(data, status, headers, config) {
                        if (status == 401) {
                            var response = {
                                user: {
                                    loggedIn: false
                                },
                                token: apiHelper.getAccessToken()
                            };
                            deferred.resolve(response);
                        } else {
                            var error = createErrorObject(data,status,headers,config);
                            deferred.reject(error);
                        }
                    });

                return deferred.promise;
            };

            /**
             * Private Functions
             */

            function checkSessionCall() {
                var url = apiHelper.getServiceName() + apiHelper.getCheckSessionRes();
                var method = 'GET';
                var params = null;
                var data = null;
                var headers = apiHelper.getTokenHeader();
                return apiHelper.apiCall(url,method,params,data,headers);
            }

            function createErrorObject(data,status,headers,config) {
                return {
                    method:     config.method,
                    status:     status,
                    data:       data,
                    url:        config.url
                };
            }

            function loginCall(userName,password) {
                var url = apiHelper.getServiceName() + apiHelper.getOauthTokenRes();
                var method = 'POST';
                var params = null;
                var data = {
                    username: userName,
                    password: password,
                    grant_type: 'password'
                };
                var headers = encodeAuthHeaders(userName, password);
                return apiHelper.apiCall(url,method,params,data,headers);
            }

            function logoutCall() {
                var url = apiHelper.getServiceName() + apiHelper.getLogoutRes();
                var method = 'POST';
                var params = null;
                var data = null;
                var headers = apiHelper.getTokenHeader();
                return apiHelper.apiCall(url,method,params,data,headers);
            }

            function encodeAuthHeaders(userName, password) {
                var headers = {
                    'Authorization': 'Basic ' + $base64.encode(userName + ':' + password)
                };

                return headers;
            }

        }]);