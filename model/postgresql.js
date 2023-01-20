const authConfig = require("../../../../authConfig");

const { Client } = require("pg");
const connectionString = authConfig.dataBaseConfiguration.connectionString;
const client = new Client(connectionString);

(async function () {
  await client.connect().catch((error) => {
    console.log(error);
    process.exit(0);
  });
  console.log("\nSuccessfully connected to the database...\n");
})();

(async function () {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS authaccount (
    _id serial PRIMARY KEY,
    expires BIGINT NOT NULL,
    verified BOOLEAN NOT NULL,
    token CHARACTER (32) UNIQUE NOT NULL,
    email VARCHAR (355) UNIQUE,
    password CHARACTER (60) NOT NULL,
    phone VARCHAR (20) UNIQUE,
    otp integer
  )`;

  await client.query(createTableQuery).catch((error) => {
    console.log(error);
    process.exit(0);
  });
})();

// Formulating different queries
function getInsertQuery(data, isPhone) {
  let insertQuery;
  if (!isPhone) {
    insertQuery = {
      text: "INSERT INTO authaccount(token, email, expires, password, verified) VALUES($1, $2, $3, $4, $5) RETURNING *",
      values: [
        data.token,
        data.email,
        data.expires,
        data.password,
        data.verified,
      ],
    };
  } else {
    insertQuery = {
      text: "INSERT INTO authaccount(token, otp, phone, expires, password, verified) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      values: [
        data.token,
        data.otp,
        data.phone,
        data.expires,
        data.password,
        data.verified,
      ],
    };
  }
  return insertQuery;
}

function getFetchQuery(field, value) {
  const fetchQuery = {
    text: `SELECT * FROM authaccount where ${field} = $1`,
    values: [value],
  };
  return fetchQuery;
}

function getUpdateVerifiedQuery(id) {
  const updateQuery = {
    name: "set-verified-to-true",
    text: "UPDATE authaccount SET verified = true WHERE _id = $1",
    values: [id],
  };
  return updateQuery;
}

function getupdateTokenAndExpiresQuery(id, token, expires) {
  const updateQuery = {
    name: "set-newtoken-newexpires",
    text: "UPDATE authaccount SET token = $1, expires = $2 WHERE _id = $3",
    values: [token, expires, id],
  };
  return updateQuery;
}

function getupdateOtpAndExpiresQuery(id, otp, expires) {
  const updateQuery = {
    name: "set-newotp-newexpires",
    text: "UPDATE authaccount SET otp = $1, expires = $2 WHERE _id = $3",
    values: [otp, expires, id],
  };
  return updateQuery;
}

function getUpdatePasswordQuery(password, id) {
  const updateQuery = {
    name: "set-new-password",
    text: "UPDATE authaccount SET password = $1 WHERE _id = $2",
    values: [password, id],
  };
  return updateQuery;
}

function getDeleteQuery(id) {
  const deleteQuery = {
    name: "delete-user-data",
    text: "DELETE FROM authaccount WHERE _id = $1",
    values: [id],
  };
  return deleteQuery;
}

async function insert(data, isPhone) {
  const insertQuery = getInsertQuery(data, isPhone);
  const insertResult = await client.query(insertQuery).catch((error) => {
    throw error;
  });
  // console.log(insertResult.rows, 'Insert Result')
  return insertResult;
}

async function fetch(field, value) {
  const fetchQuery = getFetchQuery(field, value);
  const fetchResult = await client.query(fetchQuery).catch((error) => {
    throw error;
  });
  // console.log(fetchResult.rows, 'Fetch Result')
  return fetchResult.rows.length ? fetchResult.rows[0] : {};
}

async function updateVerified(id) {
  const updateQuery = getUpdateVerifiedQuery(id);
  const updateResult = await client.query(updateQuery).catch((error) => {
    throw error;
  });
  // console.log(updateResult, 'Update Result') // update.rows yeilds empty array
  return updateResult;
}

async function updateTokenAndExpires(id, token, expires) {
  const updateQuery = getupdateTokenAndExpiresQuery(id, token, expires);
  const updateResult = await client.query(updateQuery).catch((error) => {
    throw error;
  });
  // console.log(updateResult, 'Update Result')
  return updateResult;
}

async function updateOtpAndExpires(id, otp, expires) {
  const updateQuery = getupdateOtpAndExpiresQuery(id, otp, expires);
  const updateResult = await client.query(updateQuery).catch((error) => {
    throw error;
  });
  // console.log(updateResult, 'Update Result')
  return updateResult;
}

async function updatePassword(password, id) {
  const updateQuery = getUpdatePasswordQuery(password, id);
  const updateResult = await client.query(updateQuery).catch((error) => {
    throw error;
  });
  // console.log(updateResult, 'Update Result')
  return updateResult;
}

async function deleteData(id) {
  const deleteQuery = getDeleteQuery(id);
  const deleteResult = await client.query(deleteQuery).catch((error) => {
    throw error;
  });
  // console.log(deleteResult, 'Delete Result')
  return deleteResult;
}

const postgresql = {
  insert,
  fetch,
  updateVerified,
  updateTokenAndExpires,
  updateOtpAndExpires,
  updatePassword,
  deleteData,
};

module.exports = postgresql;
