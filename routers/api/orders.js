const express = require('express')
const router = express.Router()
const { Order, Op } = require('../../models/Order')
const { Goods } = require('../../models/Goods')
const { Cart } = require('../../models/Cart')
const passport = require('passport')
const { sequelize } = require('../../db/connect')
const { verificationPaypin } = require('../../utils/baseUtils')

/**
 * $router POST /api/orders/createorderincart
 * @desc 通过商品id生成订单
 * @desc return goods
 * @access  private
 * @prams id:string|number
 */
router.post('/createorderincart', passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = Number(req.body.id)
    sequelize.transaction(t => {
        return Cart.findOne({ where: id, include: { model: Goods, as: 'goods' }, transaction: t }).then(data => {
            return Cart.destroy({ where: { id }, transaction: t }).then(() => {
                return Order.create({ user_id: req.user.id, create_date: (new Date).valueOf(), status: 0, goods_id: data.goods_id, amount: data.amount, cost: data.amount * data.goods.price }, { transaction: t })
            })
        })
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '添加订单成功', data })
    })
})

/**
 * $router POST /api/orders/createorderdirect
 * @desc 直接购买生成订单
 * @desc return goods
 * @access  private
 * @prams id:string|number
 */
router.post('/createorderdirect', passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = Number(req.body.id)
    let number = Number(req.body.number)
    sequelize.transaction(t => {
        return Goods.findOne({ where: id, transaction: t }).then(data => {
            if (data.count >= number) {
                return Goods.update({ count: data.count - number }, { where: { id }, transaction: t }).then(() => {
                    return Order.create({ user_id: req.user.id, create_date: (new Date).valueOf(), status: 0, goods_id: data.id, amount: number, cost: number * data.price }, { transaction: t })
                })
            }
            return res.status(500).json({ status: 1, msg: '添加订单失败,选择商品数量大于库存' })
        })
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '添加订单成功', data })
    })
})

/**
 * $router POST /api/orders/deleteorder
 * @desc 删除订单
 * @desc return goods
 * @access  private
 * @prams id:string|number
 */
router.post('/deleteorder', passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = Number(req.body.id)
    sequelize.transaction(t => {
        return Order.findOne({ where: { id }, include: { model: Goods, as: 'goods' }, transaction: t }).then(data => {
            return Goods.update({ count: data.goods.count + data.amount }, { where: { id: data.goods_id }, transaction: t }).then(() => {
                return Order.destroy({ where: { id }, transaction: t })
            })
        })
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '删除成功' })
    })
})

/**
 * $router GET /api/orders/user/findorderbypage
 * @desc 分页查询用户的订单
 * @desc return orders
 * @access  private
 * @prams page
 */
router.get('/user/findorderbypage', passport.authenticate("jwt", { session: false }), (req, res) => {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 10
    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    }
    Order.findAndCountAll({
        where: { user_id: req.user.id },
        include: { model: Goods, as: 'goods' },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        distinct: true // 去除分页的重复
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router GET /api/orders/admin/findorderbypage
 * @desc 分页查询用户的订单
 * @desc return orders
 * @access  private
 * @prams page
 */
router.get('/admin/findorderbypage', passport.authenticate("jwt", { session: false }), (req, res) => {
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 10
    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    } else if (req.user.identity !== 'admin') {
        return res.status(401).json({ status: 0, msg: '不是管理员' })
    }
    Order.findAndCountAll({
        include: { model: Goods, as: 'goods' },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        distinct: true // 去除分页的重复
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router GET /api/orders/admin/findorderbyuser
 * @desc 分页查询用户的订单
 * @desc return orders
 * @access  private
 * @prams page idF
 */
router.get('/admin/findorderbyuser', passport.authenticate("jwt", { session: false }), (req, res) => {
    let user_id = req.query.id
    let page = req.query.page || 1
    let pageSize = req.query.pageSize || 10
    if (!req.user) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    } else if (req.user.identity !== 'admin') {
        return res.status(401).json({ status: 0, msg: '不是管理员' })
    }
    Order.findAndCountAll({
        where: { user_id },
        include: { model: Goods, as: 'goods' },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        distinct: true // 去除分页的重复
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})
/**
 * $router POST /api/orders/user/commitorders
 * @desc 用户支付订单
 * @desc return 
 * @access  private
 * @prams ids[]
 */
router.post('/user/commitorders', passport.authenticate("jwt", { session: false }), (req, res) => {
    let user = req.user
    let paypass = req.body.paypass
    let ids = JSON.parse(req.body.ids)
    let items = ids.map(item => {
        obj = {
            id: item,
            status: 1
        }
        return obj
    })
    verificationPaypin(paypass, user).then(() => {
        Order.bulkCreate(items, { updateOnDuplicate: ['status'], where: { user_id: req.user.id } }).then(data => {
            return res.status(200).json({ status: 1, msg: '支付成功', data })
        })
    }).catch(err => {
        res.send(err)
    })

})

module.exports = router