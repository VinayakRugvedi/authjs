const config = require('../config')

const {Client} = require('pg')
const connectionString = config.dataBaseConfiguration.connectionString
const client = new Client(connectionString)
client.connect()

//Formulating different queries
function getInsertQuery(data) {
  const insertQuery = {
    name : 'store-user-info',
    text : 'INSERT INTO data(token, email, expires, password, verified) VALUES($1, $2, $3, $4, $5) RETURNING *',
    values : [`{${data.token}}`, `{${data.email}}`, data.expires, `{${data.password}}`, data.verified]
  }
  return insertQuery
}

function getFetchQuery(field, value) {
  const fetchQuery = {
    text : `SELECT * FROM data where ${field}[1] = $1`,
    values : [value]
  }
  return fetchQuery
}

function getUpdateVerifiedQuery(id) {
  const updateQuery = {
    name : 'set-verified-to-true',
    text : 'UPDATE data SET verified = true WHERE _id = $1',
    values : [id]
  }
  return updateQuery
}

function getupdateTokenAndExpiresQuery(id, token, expires) {
  const updateQuery = {
    name : 'set-newtoken-newexpires',
    text : 'UPDATE data SET token[1] = $1, expires = $2 WHERE _id = $3',
    values : [token, expires, id]
  }
  return updateQuery
}

function getUpdatePasswordQuery(password, id) {
  const updateQuery = {
    name : 'set-new-password',
    text : 'UPDATE data SET password[1] = $1 WHERE _id = $2',
    values : [password, id]
  }
  return updateQuery
}

function getDeleteQuery(id) {
  const deleteQuery = {
    name : 'delete-user-data',
    text : 'DELETE FROM data WHERE _id = $1',
    values : [id]
  }
  return deleteQuery
}

async function insert(data) {
  const insertQuery = getInsertQuery(data)
  const insertResult =
    await client.query(insertQuery)
      .catch((error) => console.log(error))
  console.log(insertResult, 'Insert Result')
  return insertResult
}

async function fetch(field, value) {
  const fetchQuery = getFetchQuery(field, value)
  const fetchResult =
    await client.query(fetchQuery)
      .catch((error) => console.log(error))
  console.log(fetchResult, 'Fetch Result')
  //Empty or not will be tested
  if(fetchResult === undefined) return undefined
  return fetchResult.rows.length
         ? structuredResultObject(fetchResult.rows[0])
         : {}
}

async function updateVerified(id) {
  const updateQuery = getUpdateVerifiedQuery(id)
  const updateResult =
    await client.query(updateQuery)
      .catch((error) => console.log(error))
  console.log(updateResult, 'Update Result') //update.rows yeilds empty array
  return updateResult
}

async function updateTokenAndExpires(id, token, expires) {
  const updateQuery = getupdateTokenAndExpiresQuery(id, token, expires)
  const updateResult =
    await client.query(updateQuery)
      .catch((error) => console.log(error))
  console.log(updateResult, 'Update Result')
  return updateResult
}

async function updatePassword(password, id) {
  const updateQuery = getUpdatePasswordQuery(password, id)
  const updateResult =
    await client.query(updateQuery)
      .catch((error) => console.log(error))
  console.log(updateResult, 'Update Result')
  return updateResult
}

async function deleteData(id) {
  const deleteQuery = getDeleteQuery(id)
  const deleteResult =
    await client.query(deleteQuery)
      .catch((error) => console.log(error))
  console.log(deleteResult, 'Delete Result')
  return deleteResult
}

function structuredResultObject(object) {
  let result = {
    _id : object._id,
    token : object.token[0],
    expires : object.expires,
    email : object.email[0],
    password : object.password[0],
    verified : object.verified
  }
  console.log(result, 'result object')
  return result
}

const postgresql = {
  insert,
  fetch,
  updateVerified,
  updateTokenAndExpires,
  updatePassword,
  deleteData
}

module.exports = postgresql
