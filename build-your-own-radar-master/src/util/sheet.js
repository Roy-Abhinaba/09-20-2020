/* global gapi */
const SheetNotFoundError = require('../../src/exceptions/sheetNotFoundError')
const UnauthorizedError = require('../../src/exceptions/unauthorizedError')
const ExceptionMessages = require('./exceptionMessages')

const Sheet = function (sheetReference) {
  var self = {};

  (function () {
    var matches = sheetReference.match('https:\\/\\/docs.google.com\\/spreadsheets\\/d\\/(.*?)($|\\/$|\\/.*|\\?.*)')
    self.id = matches !== null ? matches[1] : sheetReference
  })()

  self.validate = function (callback) {
    var enableGoogleAuth = process.env.ENABLE_GOOGLE_AUTH || false
    var feedURL = enableGoogleAuth ? 'https://sheets.googleapis.com/v4/spreadsheets/' + self.id + '?key=' + process.env.API_KEY : 'https://spreadsheets.google.com/feeds/worksheets/' + self.id + '/public/basic?alt=json'

    // TODO: Move this out (as HTTPClient)
    var xhr = new XMLHttpRequest()
    xhr.open('GET', feedURL, true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return callback()
        } else if (xhr.status === 404) {
          return callback(new SheetNotFoundError(ExceptionMessages.SHEET_NOT_FOUND))
        } else {
          return callback(new UnauthorizedError(ExceptionMessages.UNAUTHORIZED))
        }
      }
    }
    xhr.send(null)
  }

  self.getSheet = function () {
    return gapi.client.sheets.spreadsheets.get({ spreadsheetId: self.id })
  }

  self.getData = function (range) {
    return gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: self.id,
      range: range
    })
  }

  self.processSheetResponse = function (sheetName, createBlips, handleError) {
    self.getSheet().then(response => processSheetData(sheetName, response, createBlips, handleError)).catch(handleError)
  }

  function processSheetData (sheetName, sheetResponse, createBlips, handleError) {
    const sheetNames = sheetResponse.result.sheets.map(s => s.properties.title)
    sheetName = !sheetName ? sheetNames[0] : sheetName
    self.getData(sheetName + '!A1:E')
      .then(r => {
        var x = createBlips(sheetResponse.result.properties.title, r.result.values, sheetNames)
        console.log(x)
        return x
      })
      .catch(handleError)
  }

  return self
}

module.exports = Sheet