const express = require('express');
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express();
app.use(express.static('assets'))

// 引入user
const users = require('./routers/api/users')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
//passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users)
app.get('/', (req, res) => {
    res.send('哈哈哈!wos ')
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server runing on port ${port} `);
})