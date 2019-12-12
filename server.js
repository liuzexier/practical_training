const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express();
app.use(express.static('assets'))

// 引入user
const users = require('./routers/api/users')
// 引入admin
const admins = require('./routers/api/admins')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//passport 初始化
app.use(passport.initialize());
require('./config/passport').userPassport(passport);
require('./config/passport').adminPassport(passport);

app.all("*", (req, res, next) => {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        res.send(200);  //让options尝试请求快速结束
    } else {
        next()
    }
})

app.use('/api/users', users)
app.use('/api/admins', admins)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server runing on port ${port} `);
})