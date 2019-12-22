const express = require('express')
const router = express.Router()
const { Address, Op } = require('../../models/Address')
const passport = require('passport')
const { User } = require('../../models/User')
const { deleteUndefindKey } = require('../../utils/baseUtils')

/**
 * $router POST /api/address/createaddress
 * @desc 用户添加地址
 * @desc return address
 * @access  private
 * @prams address:string, postcode:string, name:string, tel:string
 */
router.post('/createaddress', passport.authenticate("jwt", { session: false }), (req, res) => {
    let address = req.body.address
    let postcode = req.body.postcode
    let name = req.body.name
    let tel = req.body.tel

    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    }
    Address.create({ user_id: req.user.id, address, postcode, name, tel }).then(data => {
        return res.status(200).json({ status: 1, msg: '添加成功', data })
    })
})

/**
 * $router GET /api/address/user/findaddressbypage
 * @desc 用户查找地址
 * @desc return address[]
 * @access  private
 * @prams page
 */
router.get('/user/findaddressbypage', passport.authenticate("jwt", { session: false }), (req, res) => {
    let page = Number(req.query.page) || 1
    let pageSize = Number(req.query.pageSize) || 10

    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    }
    let user_id = req.user.id
    Address.findAndCountAll({
        where: { user_id },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        // distinct: true
    }).then(data => {
        res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router GET /api/address/admin/findaddressbypage
 * @desc 管理员查找所有地址[]
 * @desc return address
 * @access  private
 * @prams page
 */
router.get('/admin/findaddressbypage', passport.authenticate("jwt", { session: false }), (req, res) => {
    let page = Number(req.query.page) || 1
    let pageSize = Number(req.query.pageSize) || 10

    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    } else if (req.user.identity !== 'admin') {
        return res.status(401).json({ status: 0, msg: '不是管理员' })
    }
    Address.findAndCountAll({
        include: { model: User, as: 'user' },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        distinct: true
    }).then(data => {
        res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router GET /api/address/admin/findaddressbyuser
 * @desc 管理员按用户查找查找所有地址
 * @desc return address[]
 * @access  private
 * @prams page
 */
router.get('/admin/findaddressbyuser', passport.authenticate("jwt", { session: false }), (req, res) => {
    let page = Number(req.query.page) || 1
    let pageSize = Number(req.query.pageSize) || 10
    let user_id = req.query.id
    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    } else if (req.user.identity !== 'admin') {
        return res.status(401).json({ status: 0, msg: '不是管理员' })
    }
    Address.findAndCountAll({
        where: { user_id },
        include: { model: User, as: 'user' },
        offset: (page - 1) * pageSize,
        limit: pageSize,
        distinct: true
    }).then(data => {
        res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router POST /api/address/user/updateaddress
 * @desc 用户修改地址
 * @desc return 
 * @access  private
 * @prams id prams
 */
router.post('/user/updateaddress', passport.authenticate("jwt", { session: false }), (req, res) => {
    let prams = {
        address: req.body.address,
        postcode: req.body.postcode,
        name: req.body.name,
        tel: req.body.tel,
    }
    let id = req.body.id
    prams = deleteUndefindKey(prams)
    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    }
    Address.update(prams, { where: { id, user_id: req.user.id } }).then(data => {
        return res.status(200).json({ status: 1, msg: '修改成功' })
    })
})

module.exports = router