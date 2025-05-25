const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/auth.middleware").verifyToken;
const verifyRoles = require("../middlewares/auth.middleware").verifyRoles;

router.get("/", verifyToken, verifyRoles('READER'), userController.findAll);
router.get("/:username", verifyToken, userController.findOne);
router.post("/", verifyToken, verifyRoles("EDITOR"), userController.create);
router.patch(
    "/:username",
    verifyToken,
    verifyRoles("EDITOR"),
    userController.update
);
router.delete(
    "/:username",
    verifyToken,
    verifyRoles("ADMIN"),
    userController.deleteByUsername
);
router.delete(
    "/:username/email/:email",
    verifyToken,
    verifyRoles("ADMIN"),
    userController.deleteByEmail
);
router.get('/check_duplicate_email/:email', userController.checkDuplicateEmail)

module.exports = router;
