const { sequelize, Sequelize, Model, Op } = require('../db/connect')
class Type extends Model { }
Type.init({
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(20)
}, {
    underscored: true,
    sequelize,
    modelName: 'type',
    timestamps: false
})
module.exports = { Type, Op }