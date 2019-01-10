const config = require('../config')

const mongoose = require('mongoose')
const connectionString = config.dataBaseConfiguration.connectionString

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useFindAndModify: false // For a deprecated warning
})

const db = mongoose.connection

const UserDataSchema = new mongoose.Schema({
  token: String,
  expires: Number,
  email: String,
  otp: Number,
  phonenumber: String,
  password: String,
  verified: Boolean
})

// Compiling schema into model
const UserData = mongoose.model('data', UserDataSchema)

db.on('error', (error) => {
  console.log('Error connectiong to the database!')
  throw error
})

db.once('open', () => {
  console.log('Successfully connected to the database...')
})

function getInsertInfo (data, flag) {
  if (!flag) {
    return new UserData({
      token: data.token,
      expires: data.expires,
      email: data.email,
      password: data.password,
      verified: data.verified
    })
  } else {
    return new UserData({
      token: data.token,
      expires: data.expires,
      otp: data.otp,
      phonenumber: data.phoneNumber,
      password: data.password,
      verified: data.verified
    })
  }
}

async function insert (data, flag) {
  let info = getInsertInfo(data, flag)
  let insertResult =
    await info.save()
      .catch(error => { throw error })
  console.log(insertResult, 'Insert Result')
  // insertResult is a document object
  return insertResult
}

async function fetch (key, value) {
  let fetchResult =
    await UserData.find({ [key]: value }) // Computed Property
      .catch(error => { throw error })
  console.log(fetchResult, 'Fetch Result')
  // fetchResult is an array of objects
  if (fetchResult === undefined) return undefined
  return fetchResult.length
    ? fetchResult[0]
    : {}
}

async function updateVerified (id) {
  let updateResult =
    await UserData.findOneAndUpdate({ _id: id }, { $set: { verified: true }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updateTokenAndExpires (id, token, expires) {
  let updateResult =
    await UserData.findOneAndUpdate({ _id: id }, { $set: { token, expires }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updateOtpAndExpires (id, otp, expires) {
  let updateResult =
    await UserData.findOneAndUpdate({ _id: id }, { $set: { otp, expires }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updatePassword (password, id) {
  let updateResult =
    await UserData.findOneAndUpdate({ _id: id }, { $set: { password }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function deleteData (id) {
  let deleteResult =
    await UserData.findOneAndDelete({ _id: id })
      .catch(error => { throw error })
  console.log(deleteResult, 'Update Result')
  // deleteResult is a document object
  return deleteResult
}

const mongodb = {
  insert,
  fetch,
  updateVerified,
  updateTokenAndExpires,
  updateOtpAndExpires,
  updatePassword,
  deleteData
}

module.exports = mongodb
