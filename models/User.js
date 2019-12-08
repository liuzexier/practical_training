// const { query, responseDoReturn} = require('../db/dbpool')
const { sequelize, Sequelize, Model, Op } = require('../db/connect')

class User extends Model { }
User.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true
    },
    name: Sequelize.STRING(20),
    password: Sequelize.STRING(20),
    email: Sequelize.STRING(20),
    phone: Sequelize.STRING(15),
    address_id: Sequelize.INTEGER(11),
    paypin: Sequelize.STRING(6),
    avatar: Sequelize.STRING(50),
}, {
    sequelize,
    modelName: 'user',
    timestamps: false
})

module.exports = { User, Op }