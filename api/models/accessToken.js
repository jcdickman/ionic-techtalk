/**
 * User: mikeroth
 * Date: 4/14/15
 * Time: 4:51 PM
 */

module.exports = function(sequelize, DataTypes) {
    /**
     * AccessToken
     * @class AccessToken
     * @property {integer} id
     * @property {string} token
     * @property {integer} userId
     */
    var AccessToken = sequelize.define('AccessToken', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.STRING(1024),
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        classMethods: {
            /**
             * Gets the access token if it exists
             * @memberof AccessToken
             * @param bearerToken {string}
             * @param callback {function}
             */
            getAccessToken : function(bearerToken, callback) {
                AccessToken.find({
                    where: { token: bearerToken }
                }).success(function(accessTokenObj) {
                    //console.log('in model');
                    //console.log(accessTokenObj.clientId);
                    if(accessTokenObj == null) {
                        callback('An active access token does not exist in the database.');
                    }else {
                        callback(false, accessTokenObj);
                    }
                }).failure(function(err) {
                    callback(err);
                });
            },
            /**
             * Saves a new access token in the database
             * @memberof AccessToken
             * @param accessToken {text}
             * @param userId {integer}
             * @param callback {function}
             */
            saveAccessToken : function(accessToken, userId, callback)	{
                AccessToken
                    .findOrCreate( {
                        where : {
                            userId: userId
                        }
                    })
                    .spread(function(token,created) {
                        if(!token) callback(false,null);
                        if(created) {
                            token.setDataValue('token', accessToken);
                            token.save().then(function() {
                                callback(false,token);
                            });
                        } else {
                            callback(false,token);
                        }
                    });
            },
            /**
             * Deletes access token from the database
             * @memberof AccessToken
             * @param accessToken {text}
             * @param userId {integer}
             * @param callback {function}
             */
            deleteAccessToken : function(accessToken, callback)	{
                AccessToken.find({
                    where: { token: accessToken }
                }).success(function(accessTokenObj) {
                    accessTokenObj.destroy().then(function(destroyedToken) {
                        callback(false,destroyedToken);
                    })
                }).failure(function(err) {
                    callback(err);
                });
            },
            associate: function(models) {

            }
        }
    });

    return AccessToken;
};