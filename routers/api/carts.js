const express = require('express')
const router = express.Router()
const passport = require('passport')
const { sequelize } = require('../../db/connect')

const { Cart, Op } = require('../../models/Cart')
const { User } = require('../../models/User')
const { Goods } = require('../../models/Goods')
const { Img } = require('../../models/Img')
const { verificationPaypin } = require('../../utils/baseUtils')

/**
 * $router POST /api/carts/addtocart
 * @desc return cart
 * @access  private
 * @params goodsId:number|string & amount:number|string
 */
router.post('/addtocart', passport.authenticate("jwt", { session: false }), (req, res) => {
    let user_id = req.user.id
    let goods_id = Number(req.body.goodsId)
    let amount = Number(req.body.amount) || 1
    if (!user_id) {
        return res.status(401).json({ status: 0, msg: '用户未登录' })
    } else if (!goods_id) {
        return res.status(200).json({ status: 0, msg: '未选择商品' })
    }
    sequelize.transaction(t => {
        return Cart.findOne({ where: { goods_id, status: 1 }, transaction: t, include: { model: Goods, as: 'goods' } }).then(data => {
            if (data) {
                //TODO: 商品可能被修改为负数
                return Goods.update({ count: data.goods.count - amount }, { where: { id: data.goods_id }, transaction: t }).then(() => {
                    return Cart.update({ amount: data.amount + amount }, { where: { id: data.id }, transaction: t })
                })
            } else {
                return Cart.create({ user_id, goods_id, amount, create_date: (new Date).valueOf() }, { transaction: t }).then(() => {
                    return Goods.findOne({ where: { id: goods_id }, transaction: t }).then(goods => {
                        return Goods.update({ count: goods.count - amount }, { where: { id: goods.id }, transaction: t })
                    })
                })
            }
        })
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '添加成功', data })
    })

})

/**
 * $router GET /api/carts/findallcartbypage
 * @desc return cart
 * @access  private
 * @params page & pageSize
 */
router.get('/findallcartbypage', (req, res) => {
    let page = Number(req.query.page) || 1
    let pageSize = Number(req.query.pageSize) || 10
    Cart.findAndCountAll({
        include: [{ model: Goods, as: 'goods' }, { model: User, as: 'user' }],
        // where: { status: 1 },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        distinct: true // 去除分页的重复
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router GET /api/carts/findusercartbypage
 * @desc return cart
 * @access  private
 * @params page & pageSize
 */
router.post('/findusercartbypage', passport.authenticate("jwt", { session: false }), (req, res) => {
    let page = Number(req.body.page) || 1
    let pageSize = Number(req.body.pageSize) || 10
    let user_id = req.user.id
    Cart.findAndCountAll({
        include: [{
            model: Goods,
            as: 'goods',
            include: [{ model: Img, as: 'imgs' }]
        }],
        where: { status: 1, user_id },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        distinct: true // 去除分页的重复
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})
/**
 * $router POST /api/carts/findcartbyname
 * @desc return cart[]
 * @access  private
 * @params name:string & page & pageSize
 */
router.post('/findcartbyname', (req, res) => {
    let page = Number(req.body.page) || 1
    let pageSize = Number(req.body.pageSize) || 10
    let name = req.body.name || ''
    nameFilter = name ? { name: { [Op.like]: `%${name}%` } } : {}
    User.findAndCountAll({
        where: nameFilter,
        include: [{ model: Cart, as: 'cart', include: [{ model: Goods, as: 'goods' }, { model: User, as: 'user' }] }],
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        // distinct: true // 去除分页的重复
        subQuery: false,
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})

/**
 * $router POST /api/carts/deletecartbyids
 * @desc return cart
 * @access  private
 * @params ids[]
 */
// router.post('/deletecartbyids', passport.authenticate("jwt", { session: false }), (req, res) => {
//     let ids = JSON.parse(req.body.ids).map(item => {
//         let itemObj = {}
//         itemObj.id = item
//         itemObj.status = '0'
//         return itemObj
//     })
//     Cart.bulkCreate(ids, { updateOnDuplicate: ['status'] }).then(data => {
//         return res.status(200).json({ status: 1, msg: '删除成功', data })
//     }).catch(err => {
//         return res.status(500).json(err)
//     });
// })
/**
 * $router POST /api/carts/deletecartbyid
 * @desc return cart
 * @access  private
 * @params id
 */
router.post('/deletecartbyid', passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = req.body.cartid
    sequelize.transaction(t => {
        return Cart.findOne({ where: { id }, include: { model: Goods, as: 'goods' }, transaction: t }).then(data => {
            let num = data.goods.count + data.amount
            return Cart.destroy({ where: { id }, transaction: t }).then(() => {
                return Goods.update({ count: num }, { where: { id: data.goods_id }, transaction: t })
            })
        })
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '删除成功' })
    })
})

/**
 * $router POST /api/carts/updatenumber
 * @desc return cart
 * @access  private
 * @params number & id
 */
router.post('/updatenumber', (req, res) => {
    let number = Number(req.body.number)
    let id = req.body.id
    let diff = 0
    if (!number || !id) {
        return res.status(500).json({ status: 0, msg: '数量不能为空' })
    }
    sequelize.transaction(t => {
        return Cart.findOne({ where: { id }, include: { model: Goods, as: 'goods' } }).then(data => {
            diff = data.amount - number
            return Cart.update({ amount: number }, { where: { id }, transaction: t }).then(() => {
                return Goods.update({ count: data.goods.count + diff }, { where: { id: data.goods_id }, transaction: t })
            })
        })
    }).then(data => {
        res.status(200).send({ status: 1, msg: '修改成功', data })
    }).catch(err => {
        res.status(500).send({ status: 0, msg: '修改失败', err })
    })

})
module.exports = router
