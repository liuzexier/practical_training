const express = require('express')
const router = express.Router()
const { Goods, Op } = require('../../models/Goods')
const { Type } = require('../../models/Type')
const passport = require('passport')

// hasMany
Type.hasMany(Goods, { foreignKey: 'type_id', as: 'goods' })
//belongsTo
Goods.belongsTo(Type, { foreignKey: 'type_id', as: 'goodstype' })

/**
 * $router GET /api/goods/findbypage
 * @desc return all goods
 * @access  private
 */
router.get('/findbypage', (req, res) => {
    // return res.status(200).json({msg:'succ'})
    let page = Number(req.query.page) || 1
    let pageSize = Number(req.query.pageSize) || 10
    // console.log(req.query)
    Goods.findAndCountAll({
        include: {
            model: Type,
            as: 'goodstype'
        },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize//每页限制返回的数据条数
    }).then(data => {
        res.json({ status: 1, msg: '查询成功', data: data })
    })
})

/**
 * $router GET /api/goods/addgoods
 * @desc 添加商品
 * @desc return goods
 * @access  private
 */
router.post('/addgoods', passport.authenticate("jwt", { session: false }), (req, res) => {
    // console.log(req.user)
    if (req.user.identity === 'admin') {
        Goods.create({
            title: req.body.title || '未命名',
            create_date: (new Date).valueOf(),
            type_id: req.body.type_id || 1,
            price: req.body.price || 1,
            description: req.body.description || '',
            count: req.body.count || 1,
            status: req.body.status || 1
        }).then(data => {
            // res.send(data)
            return res.status(200).json({ status: 1, msg: '添加成功', data: data })
        }).catch(err => {
            return res.status(500).json({ status: 0, msg: '添加失败', err: err })
        })
    } else {
        return res.status(200).json({ status: 0, msg: '添加失败,您不是管路员' })
    }
})

/**
 * $router POST /api/goods/deletegoodsbyid
 * @desc 通过id上架或下架商品
 * @desc return goods
 * @access  private
 * @prams ids:Array<string|number> || status:number|string
 */
router.post('/deletegoodsbyid', passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user.identity === 'admin') {
        let ids = JSON.parse(req.body.ids).map(item => {
            let itemObj = {}
            itemObj.id = item
            req.body.status == 0 ? itemObj.status = '0' : itemObj.status = '1'
            return itemObj
        })
        Goods.bulkCreate(ids, { updateOnDuplicate: ['status'] }).then(data => {
            return res.status(200).json({ status: 1, msg: req.body.status == 0 ? '下架成功' : '上架成功', data })
        }).catch(err => {
            return res.status(500).json(err)
        });
    } else {
        return res.status(200).json({ status: 0, msg: '添加失败,您不是管路员' })
    }
})

/**
 * $router GET /api/goods/getgoodsbyid
 * @desc 通过id查询商品
 * @desc return goods
 * @access  private
 * @prams id:string|number
 */
router.get('/getgoodsbyid', (req, res) => {
    let id = req.query.id || 0
    Goods.findOne({
        where: { id: id }
    }).then(data => {
        return res.status(200).json({ status: 1, msg: '查询成功', data: data })
    })
})

/**
 * $router POST /api/goods/updategoods
 * @desc 通过id更新商品
 * @desc return goods
 * @access  private
 * @prams id:string|number || goods
 */
router.post('/updategoods', passport.authenticate("jwt", { session: false }), (req, res) => {
    let id = req.body.id || 0
    let goods = JSON.parse(req.body.goods) || {}
    Goods.update(goods, { where: { id: id } }).then(data => {
        res.status(200).json({ status: 1, msg: '修改成功', data })
    })
})

/**
 * $router POST /api/goods/getgoodsbytype
 * @desc 通过type_id查询商品
 * @desc return goods[]
 * @access  private
 * @prams typeid:number|string
 */
router.get('/getgoodsbytype', (req, res) => {
    let typeid = req.query.id || 0
    let page = Number(req.query.page) || 1
    let pageSize = Number(req.query.pageSize) || 10
    Type.findAndCountAll({
        where: { id: typeid },
        include: {
            model: Goods,
            as: 'goods'
        },
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize//每页限制返回的数据条数
    }).then(data => {
        res.status(200).json({ status: 1, msg: '查询成功', data })
    })
})
module.exports = router