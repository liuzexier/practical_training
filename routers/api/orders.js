const express = require('express')
const router = express.Router()
const { Order, Op } = require('../../models/Order')
const { Goods } = require('../../models/Goods')
const { Cart } = require('../../models/Cart')
const passport = require('passport')
const { sequelize } = require('../../db/connect')

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

module.exports = router