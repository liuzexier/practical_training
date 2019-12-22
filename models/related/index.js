const { Cart } = require('../Cart')
const { Goods } = require('../Goods')
const { Img } = require('../Img')
const { Order } = require('../Order')
const { Type } = require('../Type')
const { User } = require('../User')
const { Address } = require('../Address')

Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Cart.belongsTo(Goods, { foreignKey: 'goods_id', as: 'goods' })

User.hasMany(Cart, { foreignKey: 'user_id', as: 'cart' })

Type.hasMany(Goods, { foreignKey: 'type_id', as: 'goods' })

Goods.belongsTo(Type, { foreignKey: 'type_id', as: 'goodstype' })

Goods.hasMany(Img, { foreignKey: 'goods_id', as: 'imgs' })

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

Order.belongsTo(Goods, { foreignKey: 'goods_id', as: 'goods' })

User.hasMany(Order, { foreignKey: 'user_id', as: 'order' })

Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasMany(Address, { foreignKey: 'user_id', as: 'address' })