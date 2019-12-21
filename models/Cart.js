const { sequelize, Sequelize, Model, Op } = require('../db/connect')

class Cart extends Model { }
Cart.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: Sequelize.INTEGER(11),
    goods_id: Sequelize.INTEGER(11),
    create_date: {
        type: Sequelize.DATE
    },
    amount: {
        type: Sequelize.INTEGER(11)
    },
    status: {
        type: Sequelize.INTEGER(1),
        defaultValue: 1
    }
}, {
    sequelize,
    tableName: 'carts',
    modelName: 'cart',
    timestamps: false
})
module.exports = { Cart, Op }