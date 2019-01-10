const config = require('../config')

const { Client } = require('pg')
const connectionString = config.dataBaseConfiguration.connectionString
const client = new Client(connectionString)
client.connect()

// Formulating different queries
function getInsertQuery (data, flag) {
  let insertQuery
  if (!flag) {
    insertQuery = {
      text: 'INSERT INTO data(token, email, expires, password, verified) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [data.token, data.email, data.expires, data.password, data.verified]
    }
  } else {
    insertQuery = {
      text: 'INSERT INTO data(token, otp, phoneNumber, expires, password, verified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [data.token, data.otp, data.phoneNumber, data.expires, data.password, data.verified]
    }
  }
  return insertQuery
}

function getFetchQuery (field, value) {
  const fetchQuery = {
    text: `SELECT * FROM data where ${field} = $1`,
    values: [value]
  }
  return fetchQuery
}

function getUpdateVerifiedQuery (id) {
  const updateQuery = {
    name: 'set-verified-to-true',
    text: 'UPDATE data SET verified = true WHERE _id = $1',
    values: [id]
  }
  return updateQuery
}

function getupdateTokenAndExpiresQuery (id, token, expires) {
  const updateQuery = {
    name: 'set-newtoken-newexpires',
    text: 'UPDATE data SET token = $1, expires = $2 WHERE _id = $3',
    values: [token, expires, id]
  }
  return updateQuery
}

function getupdateOtpAndExpiresQuery (id, otp, expires) {
  const updateQuery = {
    name: 'set-newotp-newexpires',
    text: 'UPDATE data SET otp = $1, expires = $2 WHERE _id = $3',
    values: [otp, expires, id]
  }
  return updateQuery
}

function getUpdatePasswordQuery (password, id) {
  const updateQuery = {
    name: 'set-new-password',
    text: 'UPDATE data SET password = $1 WHERE _id = $2',
    values: [password, id]
  }
  return updateQuery
}

function getDeleteQuery (id) {
  const deleteQuery = {
    name: 'delete-user-data',
    text: 'DELETE FROM data WHERE _id = $1',
    values: [id]
  }
  return deleteQuery
}

async function insert (data, flag) {
  const insertQuery = getInsertQuery(data, flag)
  const insertResult =
    await client.query(insertQuery)
      .catch(error => { throw error })
  console.log(insertResult, 'Insert Result')
  return insertResult
}

async function fetch (field, value) {
  const fetchQuery = getFetchQuery(field, value)
  const fetchResult =
    await client.query(fetchQuery)
      .catch(error => { throw error })
  console.log(fetchResult, 'Fetch Result')
  if (fetchResult === undefined) return undefined
  return fetchResult.rows.length
    ? fetchResult.rows[0]
    : {}
}

async function updateVerified (id) {
  const updateQuery = getUpdateVerifiedQuery(id)
  const updateResult =
    await client.query(updateQuery)
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result') // update.rows yeilds empty array
  return updateResult
}

async function updateTokenAndExpires (id, token, expires) {
  const updateQuery = getupdateTokenAndExpiresQuery(id, token, expires)
  const updateResult =
    await client.query(updateQuery)
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  return updateResult
}

async function updateOtpAndExpires (id, otp, expires) {
  const updateQuery = getupdateOtpAndExpiresQuery(id, otp, expires)
  const updateResult =
    await client.query(updateQuery)
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  return updateResult
}

async function updatePassword (password, id) {
  const updateQuery = getUpdatePasswordQuery(password, id)
  const updateResult =
    await client.query(updateQuery)
      .catch(error => { throw error })
  console.log(updateResult, 'Update Result')
  return updateResult
}

async function deleteData (id) {
  const deleteQuery = getDeleteQuery(id)
  const deleteResult =
    await client.query(deleteQuery)
      .catch(error => { throw error })
  console.log(deleteResult, 'Delete Result')
  return deleteResult
}

const postgresql = {
  insert,
  fetch,
  updateVerified,
  updateTokenAndExpires,
  updateOtpAndExpires,
  updatePassword,
  deleteData
}

module.exports = postgresql
