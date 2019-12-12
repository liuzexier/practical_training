//@login register
const express = require('express')
const router = express.Router()
const { Admin, Op } = require('../../models/Admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { secretOrKey } = require('../../config/keys')
const passport = require('passport')

/**
 * $router POST /api/users/signup
 * @desc 返回请求的json数据
 * @access  public
 */
router.post('/signup', (req, res) => {
    const admin_name = req.body.adminName || ''
    // const password = req.body.password || ''
    Admin.findOne({
        where: {
            admin_name
        }
    }).then(admin => {

        if (admin) {
            return res.status(400).json({ status: 1, msg: '账号已经被占用' })
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
                Admin.create({
                    admin_name: req.body.adminName,
                    password: req.body.password,
                }).then(admin => {
                    return res.status(200).json({ status: 0, msg: '注册成功', data: { admin } })
                })
            })
        }
    })
})
/**
 * $router POST /api/users/signin
 * @desc 返回 token jwt passport
 * @access  public
 */
router.post('/signin', (req, res) => {
    // console.log(req.body)
    const admin_name = req.body.adminName || ''
    const password = req.body.password || ''
    //查询数据库
    Admin.findOne({
        where: { admin_name }
    }).then(admin => {
        if (admin) {
            // Load hash from your password DB.
            bcrypt.compare(password, admin.password).then(isMatch => {
                if (isMatch) {
                    // jwt.sign('规则','名字',{过期时间},function)
                    const rule = { id: admin.id, name: admin.admin_name, status: admin.status }
                    jwt.sign(rule, secretOrKey, { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err
                        return res.status(200).json({ status: 1, msg: '登录成功', data: { admin, token: 'Bearer ' + token } })
                    })
                } else {
                    return res.status(400).json({ status: 0, msg: '用户名或密码不正确' })
                }
            })
        } else {
            return res.status(200).json({ status: 0, msg: '用户不存在' })
        }
    })
})

module.exports = router