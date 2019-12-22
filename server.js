const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport')
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.static('assets'))
//上传的文件路径
app.use(express.static('client/public'))
// 使用 express-fileupload 中间件
app.use(fileUpload());

// 引入user
const users = require('./routers/api/users')
// 引入adminUser
const admins = require('./routers/api/admins')
// 引入types
const types = require('./routers/api/types')
// 引入goods
const goods = require('./routers/api/goods')
//引入 upload
const upload = require('./routers/api/upload')
//引入 cart
const cart = require('./routers/api/carts')
//引入 order
const order = require('./routers/api/orders')
//引入 address
const address = require('./routers/api/address')

require('./models/related/index')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//passport 初始化
app.use(passport.initialize());
require('./config/passport').userPassport(passport);
// require('./config/passport').adminPassport(passport);

//解决跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.use('/api/users', users)
app.use('/api/admins', admins)
app.use('/api/types', types)
app.use('/api/goods', goods)
app.use('/api/upload', upload)
app.use('/api/carts', cart)
app.use('/api/orders', order)
app.use('/api/address', address)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server runing on port ${port} `);
})