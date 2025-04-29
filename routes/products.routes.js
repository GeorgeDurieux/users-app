const express = require('express')
const router = express.Router()

const productsController = require('../controllers/products.controller')
const verifyToken = require('../middlewares/auth.middleware').verifyToken
const verifyRoles = require('../middlewares/auth.middleware').verifyRoles

router.get('/', productsController.findAll)
router.get('/:product', productsController.findOne)
router.post('/', productsController.create)

module.exports = router