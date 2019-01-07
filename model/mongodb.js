const config = require('../config')

const mongoose = require('mongoose')
const connectionString = config.dataBaseConfiguration.connectionString

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useFindAndModify: false // For a deprecated warning
})

const db = mongoose.connection

const userDataSchema = new mongoose.Schema({
  token : String,
  expires : Number,
  email : String,
  otp : Number,
  phonenumber : String,
  password : String,
  verified : Boolean
})

//Compiling schema into model
const userData = mongoose.model('data', userDataSchema)

db.on('error', (error) => {
  console.log(error)
  console.log('Error connectiong to the database!')
})

db.once('open', () => {
  console.log('Successfully connected to the database...')
})

function getInsertInfo (data, flag) {
  if(!flag) {
    return new userData({
      token : data.token,
      expires : data.expires,
      email : data.email,
      password : data.password,
      verified : data.verified
    })
  } else {
    return new userData({
      token : data.token,
      expires : data.expires,
      otp : data.otp,
      phonenumber : data.phoneNumber,
      password : data.password,
      verified : data.verified
    })
  }
}

async function insert (data, flag) {
  let info = getInsertInfo(data, flag)
  let insertResult =
    await info.save()
      .catch(insertError => console.log(insertError))
  console.log(insertResult, 'Insert Result')
  // insertResult is a document object
  return insertResult
}

async function fetch (key, value) {
  let fetchResult =
    await userData.find({ [key] : value }) // Computed Property
      .catch(fetchError => console.log(fetchError))
  console.log(fetchResult, 'Fetch Result')
  // fetchResult is an array of objects
  if (fetchResult === undefined) return undefined
  return fetchResult.length
    ? fetchResult[0]
    : {}
}

async function updateVerified(id) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set : { verified : true }})
      .catch(updateError => console.log(updateError))
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updateTokenAndExpires(id, token, expires) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set : { token, expires }})
      .catch(updateError => console.log(updateError))
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updateOtpAndExpires (id, otp, expires) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set: { otp, expires }})
      .catch(updateError => console.log(updateError))
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function updatePassword (password, id) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set : { password }})
      .catch(updateError => console.log(updateError))
  console.log(updateResult, 'Update Result')
  // updateResult is a document object
  return updateResult
}

async function deleteData (id) {
  let deleteResult =
    await userData.findOneAndDelete({ _id : id })
      .catch(deleteError => console.log(deleteError))
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
