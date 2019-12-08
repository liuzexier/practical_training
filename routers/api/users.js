//@login register
const express = require('express')
const router = express.Router()
const { User, Op } = require('../../models/User')
const bcrypt = require('bcrypt')

/**
 * $router GET /api/users/test
 * @desc 返回请求的json数据
 * @access  public
 */
router.get('/test', (req, res) => {
    res.json({ msg: 'user login' })
})
/**
 * $router POST /api/users/register
 * @desc 返回请求的json数据
 * @access  public
 */
router.post('/register', (req, res) => {
    // console.log(req.body)
    User.findOne({
        where: {
            [Op.or]: [{ email: req.body.email }, { phone: req.body.phone }]
        }
    }).then(user => {
        // console.log(user)
        // res.send(user)
        if (user) {
            return res.status(400).json({ status: 1, msg: '邮箱或手机号已被占用' })
        } else {
            new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        if (err) throw err;
                        req.body.password = hash
                        resolve(req)
                    });
                });
            }).then(req => {
                User.create({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email,
                    phone: req.body.phone,
                    address_id: null,
                    paypin: null,
                    avatar: null
                }).then(user => {
                    // console.log(user)
                    return res.status(200).json({ status: 0, msg: '注册成功', data: { user } })
                })
            })
        }
    })

})

module.exports = router