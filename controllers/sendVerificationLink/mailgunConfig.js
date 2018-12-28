const config = require('../../config')

const apiKey = config.mailConfiguration.apiKey
const domain = config.mailConfiguration.domain

function mailgunConfig() {
  return ({
    apiKey,
    domain
  })
}

module.exports = mailgunConfig
