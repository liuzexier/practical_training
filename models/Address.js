const { sequelize, Sequelize, Model, Op } = require('../db/connect')
class Address extends Model { }
Address.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    user_id: Sequelize.INTEGER(11),
    address: Sequelize.STRING(50),
    postcode: Sequelize.STRING(10),
    name: Sequelize.STRING(20),
    tel: Sequelize.STRING(20)
}, {
    underscored: true,
    tableName: 'address',
    sequelize,
    timestamps: false
})
module.exports = { Address, Op }