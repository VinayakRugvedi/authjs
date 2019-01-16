#!/usr/bin/env node

const fs = require('fs')

fs.readFile('./node_modules/@vinayakrugvedi/authjs/authConfig.js',
  (error, data) => {
    if (error) {
      console.log(error + '\n')
      console.log('       OOPS, something went wrong, try again!')
      console.log('       If this error still persists, kindly set up your authConfig file manually')
      console.log('       Navigate here to know more about your authConfig file : ')
      console.log('       https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js')
      process.exit(1)
    } else {
      fs.writeFile('authConfig.js', data,
        (error, data) => {
          if (error) {
            console.log(error + '\n')
            console.log('       OOPS, something went wrong, try again!')
            console.log('       If this error still persists, kindly set up your authConfig file manually')
            console.log('       Navigate here to know more about your authConfig file : ')
            console.log('       https://github.com/VinayakRugvedi/authjs/blob/master/authConfig.js')
            process.exit(1)
          } else {
            console.log('Successfully created your authConfig.js file!!!')
          }
        })
    }
  })
