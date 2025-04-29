const mongoose = require('mongoose')

const Schema = mongoose.Schema

let productsSchema = new Schema({
    product: {
        type: String, 
        required: [true, 'Product is required'],
        max: 30,
        unique: true,
        trim: true,
        lowercase: true
    },
    cost: {
        type: Number, 
        required: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number, 
        required: true
    }
})

module.exports = mongoose.model('Products', productsSchema)