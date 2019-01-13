const authConfig = require('../../../../authConfig')

const mongoose = require('mongoose')
const connectionString = authConfig.dataBaseConfiguration.connectionString

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useFindAndModify: false // For a deprecated warning
})

const db = mongoose.connection

const UserDataSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expires: Number,
  email: String,
  otp: Number,
  phone: String,
  password: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    required: true
  }
})

// Compiling schema into model
const AuthAccount = mongoose.model('authaccount', UserDataSchema)

db.on('error', (error) => {
  console.log('Error connectiong to the database!')
  console.log(error)
  process.exit(0)
})

db.once('open', () => {
  console.log('\nSuccessfully connected to the database...\n')
})

function getInsertInfo (data, isPhone) {
  if (!isPhone) {
    return new AuthAccount({
      token: data.token,
      expires: data.expires,
      email: data.email,
      password: data.password,
      verified: data.verified
    })
  } else {
    return new AuthAccount({
      token: data.token,
      expires: data.expires,
      otp: data.otp,
      phone: data.phone,
      password: data.password,
      verified: data.verified
    })
  }
}

async function insert (data, isPhone) {
  let info = getInsertInfo(data, isPhone)
  let insertResult =
    await info.save()
      .catch(error => { throw error })
  console.log(insertResult, 'Insert Result')
  // insertResult is a document object
  return insertResult
}

async function fetch (key, value) {
  let fetchResult =
    await AuthAccount.find({ [key]: value }) // Computed Property
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
    await AuthAccount.findOneAndUpdate({ _id: id }, { $set: { verified: true }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updateTokenAndExpires (id, token, expires) {
  let updateResult =
    await AuthAccount.findOneAndUpdate({ _id: id }, { $set: { token, expires }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updateOtpAndExpires (id, otp, expires) {
  let updateResult =
    await AuthAccount.findOneAndUpdate({ _id: id }, { $set: { otp, expires }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updatePassword (password, id) {
  let updateResult =
    await AuthAccount.findOneAndUpdate({ _id: id }, { $set: { password }})
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function deleteData (id) {
  let deleteResult =
    await AuthAccount.findOneAndDelete({ _id: id })
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
