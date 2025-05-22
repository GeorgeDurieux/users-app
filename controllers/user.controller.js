const User = require("../models/user.model");
const userService = require("../services/user.service");
const bcrypt = require("bcrypt");

const logger = require("../logger/logger");

exports.findAll = async (req, res) => {

    try {
        const result = await userService.findAll();
        res.status(200).json({ status: true, data: result });
        logger.info("Success in reading all users");
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error("Problem in reading all users", err);
    }
};

exports.findOne = async (req, res) => {
    let username = req.params.username;

    try {
        const result = await userService.findOne(username);

        if (result) {
            res.status(200).json({ status: true, data: result });
        } else {
            res.status(404).json({ status: false, data: "User does not exist" });       
        }
        logger.info("Success in finding specific user");
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error("Problem in finding specific user", err);
    }
};

exports.create = async (req, res) => {
    let data = req.body;
    const SaltOrRounds = 10;

    let hashedPassword = "";
    if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, SaltOrRounds);
    }    

    const newUser = new User({
        username: data.username,
        password: hashedPassword,
        name: data.name,
        surname: data.surname,
        email: data.email,
        address: {
            area: data.address.area,
            road: data.address.road,
        },
    });

    try {
        const result = await newUser.save();
        res.status(200).json({ status: true, data: result });
        logger.info('Success in creating user')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.error("Problem in creating user", err);
    }
};

exports.update = async (req, res) => {
    const username = req.body.username;
    const updateUser = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        address: {
            area: req.body.address.area,
            road: req.body.address.road,
        },
    };

    try {
        const result = await User.findOneAndUpdate(
            { username: username },
            updateUser,
            { new: true }
        );
        res.status(200).json({ status: true, data: result });
        logger.info('Success in updating user')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.err("Problem in updating user", err);
    }
};

exports.deleteByUsername = async (req, res) => {
    const username = req.params.username;

    try {
        const result = await User.findOneAndDelete({ username: username });
        res.status(200).json({ status: true, data: result });
        logger.info('Success in updating user')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.err("Problem in deleting user", err);
    }
};

exports.deleteByEmail = async (req, res) => {
    const email = req.params.email;

    try {
        const result = await User.findOneAndDelete({ email: email });
        res.status(200).json({ status: true, data: result });
        logger.info('Success in updating user')
    } catch (err) {
        res.status(400).json({ status: false, data: err });
        logger.err("Problem in deleting user", err);
    }
};

exports.checkDuplicateEmail = async(req, res) => {
    const mail = req.params.email

    try {
        const result = await User.findOne({email: email})
        if (result) {
            res.status(400).json({status: false, data: result})
        } else {
            res.status(200).json({status: true, data: result})
        }
    } catch (err) {
        res.status(400).json({status: false, data: err})
    }
}
