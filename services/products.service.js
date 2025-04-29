const Products = require('../models/products.model')

function findAll() {
    const result = Products.find()
    return result
}

function findOne(product) {
    const result = Products.findOne({product:product})
    return result
}

module.exports = { findAll, findOne }