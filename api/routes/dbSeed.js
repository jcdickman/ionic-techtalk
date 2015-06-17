var express = require('express');
var router = express.Router();
var $q = require('q');
router.get('/', function (req, res) {

    var models = require('../models');

    var permissions = [
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'user:index',
        'role:create',
        'role:read',
        'role:update',
        'role:delete',
        'role:index',
        'permission:read',
        'permission:index',
        'news:create',
        'news:read',
        'news:update',
        'news:delete'
    ];

    var userPermissions = [
        'user:read',
        'user:update',
        'role:read',
        'permission:read',
        'news:read'
    ];

    var news = [
        {
            title: 'Congratulations!!',
            summary: 'Consultant Kenny Rosenkoetter and his wife Megan welcomed daughter Alivia Jade on Friday, June 12th.',
            body: 'Consultant Kenny Rosenkoetter and his wife Megan welcomed daughter Alivia Jade on Friday, June 12th.  Mom, dad, big brother Jackson, and little Alivia are doing great!'
        },
        {
            title: 'TDK Company Picnic - 2015!',
            summary: 'Thanks to all who came!',
            body: 'A great time was had by all at The 2015 TDK Company Picnic! Especially by the reining Hillbilly Golf Champions, Batman & James!'
        }
    ];

    /**
     * Forced update to the Schema, then seed database
     */

    models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(function() {
            return models.sequelize.dropAllSchemas();
        })
        .then(function() {
            return models.sequelize.sync({force: true});
        })
        .complete(function(err) {
            if (err) {
                throw err[0];
            } else {
                return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
            }
        })
        .then(function() {
            dbSeed()
                .then(function(results) {
                    console.log('DB SEED DONE');
                    console.log(results);
                    return res.end('DB SEED DONE');
                });
        });

    function dbSeed() {

        var deferred = $q.defer();

        /**
         * Setup Roles
         */
        var setupAdmin = createRole('admin');
        var setupUser = createRole('user');

        /**
         * Setup Permissions
         */
        var adminPerm = setupAdmin.then(function(role) {
            return addPermissions(permissions,role);
        });
        var userPerm = setupUser.then(function(role) {
            return addPermissions(userPermissions,role);
        });

        /**
         * Setup Users
         */
        var adminUser = setupAdmin.then(function(role) {
            return createUserWithRole(role,'admin','admin123');
        });
        var userUser = setupUser.then(function(role) {
            return createUserWithRole(role,'user','user123');
        });

        /**
         * Setup news
         */
        var addNews = createNews(news);

        $q.all([
            setupAdmin,
            setupUser,
            adminPerm,
            userPerm,
            adminUser,
            userUser,
            addNews
        ]).spread(function(results) {
            console.log('results');
            console.log(results);
            deferred.resolve(results);
        });

        return deferred.promise;
    }

    /**
     * Helper Functions
     */

    function createRole(roleName) {

        var deferred = $q.defer();

        models.Role.findOrCreate({
            where : {name: roleName}
        }).spread(function (role, created) {
            deferred.resolve(role);
        });

        return deferred.promise;
    }

    function addPermissions(permissions,role) {

        var deferred = $q.defer();

        var promises = [];

        permissions.forEach(function(permission) {
            var deferred = $q.defer();
            promises.push(deferred.promise);
            models.Permission.findOrCreate({
                where : {name: permission}
            }).spread(function (permission, created) {
                role.addPermission(permission);
                deferred.resolve(permission);
            });
        });

        $q.all(promises)
            .then(function(results) {
                deferred.resolve(results);
            });

        return deferred.promise;
    }

    function createUserWithRole(role,username,password) {

        var deferred = $q.defer();

        models.User.findOrCreate({
            where : {
                username: username,
                password: password,
                entityType: "User"
            }
        }).spread(function (user, created) {
            user.addRole(role);
            deferred.resolve(user);
        });

        return deferred.promise;
    }

    function createNews(news) {

        var deferred = $q.defer();

        var promises = [];

        news.forEach(function(item) {
            var deferred = $q.defer();
            promises.push(deferred.promise);
            models.NewsItem.findOrCreate({
                where : {
                    title: item.title,
                    summary: item.summary,
                    body : item.body
                }
            }).spread(function (item, created) {
                deferred.resolve(item);
            });
        });

        $q.all(promises)
            .then(function(results) {
                deferred.resolve(results);
            });

        return deferred.promise;
    }

});

module.exports = router;
