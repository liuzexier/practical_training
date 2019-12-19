const express = require('express')
const router = express.Router()
const { Type, Op } = require('../../models/Type')
const { Goods } = require('../../models/Goods')

/**
 * $router GET /api/types/findall
 * @desc return all types
 * @access  private
 */
router.get('/findall', (req, res) => {
    // return res.status(200).json({msg:'succ'})
    Type.findAll().then(data => {
        res.status(200).json({ status: 1, msg: '查询成功', data: data })
    })
})

/**
 * $router POST /api/types/deletebyid
 * @desc return
 * @access  private
 * @param id:number|string
 */
router.post('/deletebyid', (req, res) => {
    // return res.status(200).json({msg:'succ'})
    let id = req.body.id || ''
    if (id == 1 || id == '') {
        return res.status(200).json({ status: 0, msg: '删除失败' })
    }
    Goods.update({ type_id: 1 }, { where: { type_id: id } }).then(() => {
        return Type.destroy({ where: { id } })
    }).then(data => {
        res.status(200).json({ status: 1, msg: '删除成功', data: data })
    }).catch(err => {
        res.status(500).json({ status: 0, msg: '删除失败', err })
    })
})

/**
 * $router POST /api/types/updatetypebyid
 * @desc return
 * @access  private
 * @param id:number|string, name:string
 */
router.post('/updatetypebyid', (req, res) => {
    let id = req.body.id || ''
    let name = req.body.name || ''
    if (name === '') {
        return res.status(200).json({ status: 0, msg: '修改失败,名称不能为空' })
    } else {
        Type.update({ name }, { where: { id } }).then(data => {
            return res.status(200).json({ status: 1, msg: '修改成功', data })
        })
    }
})

/**
 * $router POST /api/types/updatetypebyid
 * @desc return
 * @access  private
 * @param id:number|string, name:string
 */
router.post('/addtype', (req, res) => {
    let name = req.body.name || ''
    if (name === '') {
        return res.status(200).json({ status: 0, msg: '添加失败,名称不能为空' })
    } else {
        Type.create({ name }).then(data => {
            return res.status(200).json({ status: 1, msg: '添加成功', data })
        })
    }
})
module.exports = router