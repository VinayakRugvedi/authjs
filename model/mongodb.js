const config = require('../config')

const mongoose = require('mongoose')
const connectionString = config.dataBaseConfiguration.connectionString

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useFindAndModify: false //For a deprecated warning
})

const db = mongoose.connection

const userDataSchema = new mongoose.Schema({
  token : String,
  expires : Number,
  email : String,
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

async function insert(data) {
  let info = new userData({
    token : data.token,
    expires : data.expires,
    email : data.email,
    password : data.password,
    verified : data.verified
  })

  let insertResult =
    await info.save()
      .catch((insertError) => console.log(insertError))
  console.log(insertResult, 'inserttttttt')
  //insertResult is a document object
  return insertResult
}

async function fetch(key, value) {
  let fetchResult =
    await userData.find({ [key] : value }) //Computed Property
      .catch((fetchError => console.log(fetchError)))
    console.log(fetchResult)
  //fetchResult is an array of objects
  return fetchResult.length
         ? fetchResult[0]
         : {}
}

async function updateVerified(id) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set : { verified : true }})
      .catch((updateError) => console.log(updateError))
  console.log(updateResult)
  //updateResult is a document object
  return updateResult
}

async function updateTokenAndExpires(id, token, expires) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set : { token, expires }})
      .catch((updateError) => console.log(updateError))
  console.log(updateResult)
  //updateResult is a document object
  return updateResult
}

async function updatePassword(password, id) {
  let updateResult =
    await userData.findOneAndUpdate({ _id : id }, { $set : { password }})
      .catch((updateError) => console.log(updateError))
  console.log(updateResult)
  //updateResult is a document object
  return updateResult
}

async function deleteData(id) {
  let deleteResult =
    await userData.findOneAndDelete({ _id : id })
      .catch((deleteError) => console.log(deleteError))
  console.log(deleteResult)
  //deleteResult is a document object
  return deleteResult
}

const mongodb = {
  insert,
  fetch,
  updateVerified,
  updateTokenAndExpires,
  updatePassword,
  deleteData
}

module.exports = mongodb
