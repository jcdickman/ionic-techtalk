module.exports = function(sequelize, DataTypes) {
    /**
     *  NewsItem
     *  @class NewsItem
     *  @property {integer} id
     *  @property {string} name
     */
    var NewsItem = sequelize.define('NewsItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        summary: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false
        },
        entityType: {
            type: DataTypes.STRING,
            defaultValue: 'NewsItem'
        }
    }, {
        classMethods: {
            associate: function(models) {

            }
        }
    });

    return NewsItem;
};