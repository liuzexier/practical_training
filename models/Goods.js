const { sequelize, Sequelize, Model, Op } = require('../db/connect')
class Goods extends Model { }
Goods.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true
    },
    title: Sequelize.STRING(20),
    type_id: Sequelize.INTEGER(11),
    price: Sequelize.INTEGER(10),
    description: Sequelize.STRING(255),
    count: {
        type: Sequelize.INTEGER(11)
    },
    create_date: {
        type: Sequelize.DATE
    },
    status: Sequelize.INTEGER(1)
}, {
    underscored: true,
    tableName: 'goods',
    sequelize,
    modelName: 'type',
    timestamps: false
})
module.exports = { Goods, Op }