const express = require('express')
const router = express.Router()
const { Goods, Op } = require('../../models/Goods')
const { Type } = require('../../models/Type')

// hasMany
// Type.hasMany(Goods, { foreignKey: 'type_id', as: 'goods' })
//belongsTo
Goods.belongsTo(Type, { foreignKey: 'type_id', as: 'goodstype' })

/**
 * $router GET /api/goods/findbypage
 * @desc return all goods
 * @access  private
 */
router.get('/findbypage', (req, res) => {
    // return res.status(200).json({msg:'succ'})
    let page = req.body.page || 0
    let pageSize = req.body.pageSize || 10
    Goods.findAndCountAll({
        include: {
            model: Type,
            as: 'goodstype'
        },
        offset: page * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize//每页限制返回的数据条数
    }).then(data => {
        res.json({ status: 1, msg: '查询成功', data: data })
    })
})

/**
 * $router GET /api/goods/addgoods
 * @desc return goods
 * @access  private
 */
router.post('/addgoods', (req, res) => {
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
})

module.exports = router