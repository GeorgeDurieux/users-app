const Product = require("../models/products.model");
const productsService = require("../services/products.service");
const logger = require("../logger/logger");

exports.findAll = async (req, res) => {
    try {
        const result = await productsService.findAll();
        res.status(200).json({ status: true, data: result });
        logger.info("Success in reading all products");
    } catch (err) {
        logger.error("Problem in reading all products", err);
        res.status(400).json({ status: false, data: err });
    }
};

exports.findOne = async (req, res) => {
    let product = req.params.product;

    try {
        const result = await productsService.findOne(product);

        if (product) {
            res.status(200).json({ status: true, data: result });
        } else {
            res.status(404).json({ status: false, data: "Product does not exist" });
        }
        logger.info('Success finding product')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error('Error finding product', err)
    }
};

exports.create = async (req, res) => {
    let data = req.body;

    const newProduct = new Product({
        product: data.product,
        cost: data.cost,
        description: data.description,
        quantity: data.quantity,
    });

    try {
        const result = await newProduct.save();
        res.status(200).json({ status: true, data: result });
        logger.info('Success creating product')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error('Error creating product', err)
    }
};

exports.update = async (rew, res) => {
    const product = req.body.product;
    const updateProduct = {
        product: req.body.product,
        cost: req.body.cost,
        description: req.body.description,
        quantity: req.body.quantity,
    };

    try {
        const result = await Product.findOneAndUpdate(
            { product: product },
            updateProduct,
            { new: true }
        );
        res.status(200).json({ status: true, data: result });
        logger.info('Success updating product')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error('Error updating product', err)
    }
};

exports.delete = async (req, res) => {
    const product = req.params.product;

    try {
        const result = await Product.findOneAndDelete({ product: product });
        res.status(200).json({ status: true, data: result });
        logger.info('Success deleting product')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error('Error deleting product', err)
    }
};
