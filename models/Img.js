const { sequelize, Sequelize, Model, Op } = require('../db/connect')
class Img extends Model { }
Img.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    url: Sequelize.STRING(255),
    goods_id: Sequelize.INTEGER(11)
}, {
    underscored: true,
    sequelize,
    tableName: 'imgs',
    modelName: 'imgs',
    timestamps: false
})
module.exports = { Img, Op }