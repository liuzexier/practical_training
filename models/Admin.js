const { sequelize, Sequelize, Model, Op } = require('../db/connect')

class Admin extends Model { }
Admin.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    admin_name: Sequelize.STRING(20),
    password: Sequelize.STRING(20),
    status: Sequelize.INTEGER(1)
}, {
    sequelize,
    modelName: 'admin',
    timestamps: false
})

module.exports = { Admin, Op }