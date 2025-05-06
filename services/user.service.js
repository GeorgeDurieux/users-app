const User = require('../models/user.model')

function findAll() {
  const result = User.find()
  return result
}

function findOne(username) {
  const result = User.findOne({username:username})
  return result;
}

async function findLastInsertedUser(){
  try {
    const result = await User.find().sort({_id:-1}).limit(1)
    return result[0]
  } catch (err){
    logger.err("Problem in finding last inserted user", err)
    return false
  }
}

module.exports = { findAll, findOne, findLastInsertedUser }