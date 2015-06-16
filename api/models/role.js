/**
 * User: mikeroth
 * Date: 4/15/15
 * Time: 12:36 PM
 */

module.exports = function(sequelize, DataTypes) {
    /**
     *  Role
     *  @class Role
     *  @property {integer} id
     *  @property {string} name
     */
    var Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entityType: {
            type: DataTypes.STRING,
            defaultValue: 'Role'
        }
    }, {
        classMethods: {
            associate: function(models) {
                Role.belongsToMany(models.Permission, { as: 'Permissions', through: 'role_permissions' });
                Role.belongsToMany(models.User, { as: 'Users', through: 'user_roles' });
            }
        }
    });



    return Role;
};