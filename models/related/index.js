const { Admin } = require('../Admin')
const { Cart } = require('../Cart')
const { Goods } = require('../Goods')
const { Img } = require('../Img')
const { Order } = require('../Order')
const { Type } = require('../Type')
const { User } = require('../User')

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Cart.belongsTo(Goods, { foreignKey: 'goods_id', as: 'goods' })

User.hasMany(Cart, { foreignKey: 'user_id', as: 'cart' })
// hasMany
Type.hasMany(Goods, { foreignKey: 'type_id', as: 'goods' })
//belongsTo
Goods.belongsTo(Type, { foreignKey: 'type_id', as: 'goodstype' })
// hasMany
Goods.hasMany(Img, { foreignKey: 'goods_id', as: 'imgs' })