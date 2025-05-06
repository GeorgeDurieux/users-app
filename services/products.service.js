const Products = require('../models/products.model')

function findAll() {
    const result = Products.find()
    return result
}

function findOne(product) {
    const result = Products.findOne({product:product})
    return result
}

async function findLastInsertedProduct(){
  try {
    const result = await Products.find().sort({_id:-1}).limit(1)
    return result[0]
  } catch (err){
    logger.err("Problem in finding last inserted product", err)
    return false
  }
}

module.exports = { findAll, findOne, findLastInsertedProduct }