const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products.controller");
const verifyToken = require("../middlewares/auth.middleware").verifyToken;
const verifyRoles = require("../middlewares/auth.middleware").verifyRoles;

router.get("/", productsController.findAll);
router.get("/:product", verifyToken, verifyRoles("READER"), productsController.findOne);
router.post("/", verifyToken, verifyRoles('EDITOR'), productsController.create);
router.patch("/:product", verifyToken, verifyRoles('EDITOR'), productsController.update);
router.delete("/:product",verifyToken, verifyRoles('EDITOR'), productsController.delete);

module.exports = router;
