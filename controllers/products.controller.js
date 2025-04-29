const Product = require('../models/products.model')
const productsService = require('../services/products.service')
const bcrypt = require('bcrypt')

const logger = require('../logger/logger')

exports.findAll = async(req, res) => {
    console.log("Find all products from collection products")

    try {
        const result = await productsService.findAll()
        res.status(200).json({status: true, data: result})
        console.log('Success in reading all products')
        logger.info('Success in reading all products')
    } catch(err) {
        console.log('Problem in reading all products', err)
        logger.error('Problem in reading all products', err)
        res.status(400).json({status:false, data: err})
    } 
}

exports.findOne = async(req, res) => {
    console.log('Find specific product')
    let product = req.params.product

    try {
        const result = await productsService.findOne(product)

        if (product) {
            res.status(200).json({status:true, data: result})
        } else {
            res.status(404).json({status: false, data: 'Product does not exist'})
        }

    } catch (err) {
        console.log('Problem finding product', err)
        res.status(400).json({status: false, data: err})
    }
}

exports.create = async(req, res) => {
    console.log('Create product')
    let data = req.body
    
    const newProduct = new Product({
        product: data.product,
        cost: data.cost,
        description: data.description,
        quantity: data.quantity
    })

    try {
        const result = await newProduct.save()
        res.status(200).json({status: true, data: result})
    } catch (err) {
        console.log('Problem in creating product', err)
        res.status(400).json({status: false, data: err})
    }
}