/**
 * User: mikeroth
 * Date: 4/15/15
 * Time: 12:38 PM
 */

module.exports = function(sequelize, DataTypes) {
    /**
     *  Permission
     *  @class Permission
     *  @property {integer} id
     *  @property {string} name
     */
    var Permission = sequelize.define('Permission', {
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
            defaultValue: 'Permission'
        }
    }, {
        classMethods: {
            associate: function(models) {
                Permission.belongsToMany(models.Role, {through: 'role_permissions'});
            }
        }
    });



    return Permission;
};