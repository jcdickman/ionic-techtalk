/**
 * @ngdoc service
 * @name techTalk.services.WeatherService
 * @description
 * Service for making the call to get the current weather
 * @requires $http
 */

angular.module('techTalk.services')
    .service('WeatherService', [
        'ApiHelper',
        function(apiHelper) {

            /**
             * @ngdoc method
             * @name get
             * @methodOf techTalk.services.WeatherService
             * @description
             * Gets the Weather
             * @returns {Promise} HTTP Promise
             */
            this.get = function() {
                return getWeatherCall();
            };

            function getWeatherCall() {
                var url = apiHelper.getWeatherUrl();
                var method = 'GET';
                var params = {
                    zip: '63017,us',
                    units: 'imperial'
                };
                var data = null;
                var headers = null;
                return apiHelper.apiCall(url,method,params,data,headers);
            }

        }]);