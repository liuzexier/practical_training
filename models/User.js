const { sequelize, Sequelize, Model, Op } = require('../db/connect')

class User extends Model { }
User.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(20),
    password: Sequelize.STRING(20),
    email: Sequelize.STRING(20),
    phone: Sequelize.STRING(15),
    identity: Sequelize.STRING(20),
    paypin: Sequelize.STRING(6),
    avatar: {
        type: Sequelize.STRING(50),
        defaultValue: '/img/default_avatar.png'
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: false
})

module.exports = { User, Op }