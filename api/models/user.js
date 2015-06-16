module.exports = function(sequelize, DataTypes) {
    var $q = require('q');
    /**
     *  User
     *  @class User
     *  @property {integer} id
     *  @property {string} username
     *  @property {string} password
     *  @property {string} name
     */
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entityType: {
            type: DataTypes.STRING,
            defaultValue: 'User'
        }
    }, {
        classMethods: {

            /**
             * Get the user object based on their user ID
             * @memberof User
             * @param userId {integer}
             * @param callback {function}
             */
            getUser : function(userId, callback) {
                User.find(userId).success(function(user) {
                    if(user == null) {
                        callback('Username and password do not match records in the database.');
                    }else {
                        callback(false, user);
                    }
                }).failure(function(err) {
                    callback(err);
                });
            },
            /**
             * Get the user object based on their username
             * @memberof User
             * @param username {string}
             * @param callback {function}
             */
            getUserByUsername : function(username, callback) {
                User.find({
                    where:  { username: username }
                }).success(function(user) {
                    if(user == null) {
                        callback('Username and password do not match records in the database.');
                    }else {
                        callback(false, user);
                    }
                }).failure(function(err) {
                    callback(err);
                });
            },

            /**
             * Authenticates a user against the database
             * @memberof User
             * @param username {string}
             * @param password {string}
             * @param callback {function}
             */
            authenticate : function(username, password, callback) {
                User.find({
                    where: { username: username, password: password }
                }).success(function(user) {
                    if(user == null) {
                        callback({ status : 401, message : 'Username and password do not match records in the database.' });
                    }else {
                        callback(false, user);
                    }
                }).failure(function(err) {
                    callback(err);
                });
            },
            associate: function(models) {
                User.belongsToMany(models.Role, {through: 'user_roles'})
            }
        },
        instanceMethods: {
            /**
             * Get the permissions for a user based on their user object
             * @memberof User
             * @param user {object}
             * @param callback {function}
             */
            getPermissions : function(callback) {
                this.getRoles()
                    .success(function(roles) {
                        var permissionsArr = [];
                        var promiseArr = [];
                        roles.forEach(function(role) {
                            var deferred = $q.defer();
                            promiseArr.push(deferred.promise);

                            role.getPermissions().success(function(permissions) {
                                permissions.forEach(function(permission) {
                                    permissionsArr.push(permission);
                                });
                                deferred.resolve();

                            });
                        });
                        $q.all(promiseArr).then(function() {
                            callback(false,permissionsArr);
                        });
                    });
            },

            /**
             * Get the permission names as an array of strings for a user based on their user object
             * @memberof User
             * @param user {object}
             * @param callback {function}
             */
            getPermissionNames : function(callback) {
                this.getRoles()
                    .success(function(roles) {
                        var permissionsArr = [];
                        var promiseArr = [];
                        roles.forEach(function(role) {
                            var deferred = $q.defer();
                            promiseArr.push(deferred.promise);

                            role.getPermissions({attributes: ['name']}).success(function(permissions) {
                                permissions.forEach(function(permission) {
                                    permissionsArr.push(permission.name);
                                });
                                deferred.resolve();

                            });
                        });
                        $q.all(promiseArr).then(function() {
                            callback(false,JSON.stringify(permissionsArr));
                        });
                    });
            }
        }
    });

    return User;
};