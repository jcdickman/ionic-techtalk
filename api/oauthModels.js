/**
 * oauthModels
 * Here we are simply mapping the methods required by oauthserver to the respective class methods on our model objects.
 * We are doing this because oauthserver expects one model object with these methods,
 * but we want to follow the best practice of separating our models in to separate classes
 */
var models = require('./models');

module.exports.getUser = models.User.getUser;
module.exports.getClient = models.oauth_client.getClient;
module.exports.grantTypeAllowed = models.oauth_client.grantTypeAllowed;
module.exports.saveAccessToken = models.oauth_access_token.saveAccessToken;
module.exports.getAccessToken = models.oauth_access_token.getAccessToken;