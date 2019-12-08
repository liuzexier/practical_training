const Sequelize = require('sequelize');
const config = require('../db/config')

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
const Model = Sequelize.Model
const Op = Sequelize.Op
module.exports = { sequelize, Sequelize, Model, Op }