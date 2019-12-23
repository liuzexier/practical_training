//@login register
const express = require('express')
const router = express.Router()
const { User, Op } = require('../../models/User')
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
    const phone = req.body.phone || ''
    const email = req.body.email || ''
    User.findOne({
        where: {
            [Op.or]: [{ email: email }, { phone: phone }]
        }
    }).then(user => {

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
                    paypin: null,
                    identity: 'admin'
                }).then(user => {
                    return res.status(200).json({ status: 0, msg: '注册成功', data: { user } })
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
    const email = req.body.email || ''
    const phone = req.body.phone || ''
    const password = req.body.password || ''
    //查询数据库
    User.findOne({
        where: {
            [Op.or]: [
                { email: email }, { phone: phone }, { identity: 'user' }
            ]
        }
    }).then(user => {
        if (user) {
            // Load hash from your password DB.
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    // jwt.sign('规则','名字',{过期时间},function)
                    const rule = { id: user.id, name: user.name, avatar: user.avatar, identity: user.identity, paypin: user.paypin }
                    jwt.sign(rule, secretOrKey, { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err
                        return res.status(200).json({ status: 1, msg: '登录成功', data: { user, token: 'Bearer ' + token } })
                    })
                } else {
                    return res.status(200).json({ status: 0, msg: '用户名或密码不正确' })
                }
            })
        } else {
            return res.status(200).json({ status: 0, msg: '用户不存在' })
        }
    })
})
/**
 * $router GET /api/users/current
 * @desc return current user
 * @access  private
 */
router.get('/getInfo', passport.authenticate("jwt", { session: false }), (req, res) => {
    return res.json({
        status: 1, msg: '请求成功', data: {
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                avatar: req.user.avatar,
                identity: req.user.identity
            }
        }
    })
})
/**
 * $router POST /api/users/setpaypass
 * @desc 返回请求的json数据
 * @access  public
 * @params paypass:string
 */
router.post('/setpaypass', passport.authenticate("jwt", { session: false }), (req, res) => {
    let paypass = req.body.paypass
    if (!req.user) {
        return res.status(401).send({ status: 0, msg: '用户未登录' })
    } else if (!paypass) {
        return res.status(500).send({ status: 0, msg: '不能为空' })
    }
    new Promise((resolve, reject) => {
        return bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(paypass, salt, (err, hash) => {
                // Store hash in your password DB.
                if (err) throw err;
                paypass = hash
                resolve(paypass)
            });
        })
    }).then(paypass => {
        return User.update({ paypin: paypass }, { where: { id: req.user.id } })
    }).then(data => {
        return res.send(data)
    })
})



module.exports = router