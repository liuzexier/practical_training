const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express();
app.use(express.static('assets'))

// 引入user
const users = require('./routers/api/users')
// 引入adminUser
const admins = require('./routers/api/admins')
// 引入types
const types = require('./routers/api/types')
// 引入goods
const goods = require('./routers/api/goods')

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

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server runing on port ${port} `);
})