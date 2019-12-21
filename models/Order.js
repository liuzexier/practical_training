const { sequelize, Sequelize, Model, Op } = require('../db/connect')
class Order extends Model { }
Order.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    create_date: Sequelize.DATE,
    status: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    user_id: Sequelize.INTEGER(11),
    goods_id: Sequelize.INTEGER(11),
    amount: Sequelize.INTEGER(11),
    cost: Sequelize.INTEGER(11)
}, {
    sequelize,
    tableName: 'orders',
    modelName: 'cart',
    timestamps: false
})

module.exports = { Order, Op }