const express = require('express')
const router = express.Router()
const { Type, Op } = require('../../models/Type')

/**
 * $router GET /api/types/findall
 * @desc return all types
 * @access  private
 */
router.get('/findall', (req, res) => {
    // return res.status(200).json({msg:'succ'})
    Type.findAll().then(data => {
        res.json({ status: 1, msg: '查询成功', data: data })
    })
})

module.exports = router