/* eslint no-constant-condition: "off" */

const d3 = require('d3')
const Tabletop = require('tabletop')
const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  capitalize: require('lodash/capitalize'),
  each: require('lodash/each')
}

const InputSanitizer = require('./inputSanitizer')
const Radar = require('../models/radar')
const Quadrant = require('../models/quadrant')
const Ring = require('../models/ring')
const Blip = require('../models/blip')
const GraphingRadar = require('../graphing/radar')
const QueryParams = require('./queryParamProcessor')
const MalformedDataError = require('../exceptions/malformedDataError')
const SheetNotFoundError = require('../exceptions/sheetNotFoundError')
const ContentValidator = require('./contentValidator')
const Sheet = require('./sheet')
const ExceptionMessages = require('./exceptionMessages')
const GoogleAuth = require('./googleAuth')

const plotRadar = function (title, blips, currentRadarName, alternativeRadars) {
  if (title.endsWith('.csv')) {
    title = title.substring(0, title.length - 4)
  }
  document.title = title
  d3.selectAll('.loading').remove()

  var rings = _.map(_.uniqBy(blips, 'ring'), 'ring')
  var ringMap = {}
  var maxRings = 5

  _.each(rings, function (ringName, i) {
    if (i === maxRings) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS)
    }
    ringMap[ringName] = new Ring(ringName, i)
  })

  var quadrants = {}
  _.each(blips, function (blip) {
    if (!quadrants[blip.quadrant]) {
      quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant))
    }
    quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
  })

  var radar = new Radar()
  _.each(quadrants, function (quadrant) {
    radar.addQuadrant(quadrant)
  })

  if (alternativeRadars !== undefined || true) {
    alternativeRadars.forEach(function (sheetName) {
      radar.addAlternative(sheetName)
    })
  }

  if (currentRadarName !== undefined || true) {
    radar.setCurrentSheet(currentRadarName)
  }

  var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133

  new GraphingRadar(size, radar).init().plot()
}

const GoogleSheet = function (sheetReference, sheetName) {
  var self = {}

  self.build = function () {
   // var sheet = new Sheet("sheetReference")

   createBlips();
    /*sheet.validate(function (error) {
      

      if (error instanceof SheetNotFoundError) {
        plotErrorMessage(error)
        return
      }

      self.authenticate(false)
    })*/
    function getRadarUIData () {
      var data = ''
    
      $.ajax({
        url: 'https://radarbackend.azurewebsites.net/hmsRadar/getRecords',
        type: 'GET',
        async: false,
        contentType: false,
        success: function (response) {
          debugger
          console.error('Result --------')
          console.error(response)
          data = response;
         // data = JSON.parse(response);
        },
        error: function (error) {
          debugger
          console.log(error)
        }
      })

      return data;
      
      //return [{"name":"Real time MFT data exchange.","quadrant":"Platforms","ring":"Trial","description":"1. Continuous innovation in existing platform","isNew":"this is a sample"},{"name":"DataRobot","quadrant":"Tools","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"Edge Computing","quadrant":"Techniques","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"Consul","quadrant":"Tools","ring":"Trial","description":"Service discovery/ service registration","isNew":"this is a sample"},{"name":"Virtual Development Environments","quadrant":"Platforms","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"Rsocket as an application protocol","quadrant":"Platforms","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"DataCatalog","quadrant":"Techniques","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"Alteryx as Data Prep","quadrant":"Tools","ring":"Trial","description":"Alteryx as Data Prep tool for Analytics - Trial  / Tool\r\n1. it allows self service / light weight tool for analysts who are not technologically driven \r\n2. Implemented pipelines","isNew":"this is a sample"},{"name":"Decisions for BWE","quadrant":"Platforms","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"SyTrue","quadrant":"Platforms","ring":"Trial","description":"PI LOB intends to use SyTrue as a platform in order to target claims and associated records to load into data store and make it available in a standard digital format. Currently, the medical records are considered unstructured data and come in as paper. SyTrue is thereby expected to boost productivity by reducing manual work and increasing accuracy.","isNew":"this is a sample"},{"name":"Internal stackoverflow.com","quadrant":"Platforms","ring":"Trial","description":"1. will bring knowledge sharing\r\n2. can be reused from stackoverflow cloud to  internal domain","isNew":"this is a sample"},{"name":"Kubernetes","quadrant":"Platforms","ring":"Trial","description":"Kubernetes is a container orchestration system that is more extensive than Docker Swarm and is meant to coordinate clusters of nodes at scale in production in an efficient manner","isNew":"this is a sample"},{"name":"GitHub Actions","quadrant":"Platforms","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"Webex Toolkit - Introduction of AI to our meeting rooms.","quadrant":"Tools","ring":"Trial","description":"To simpllify our end-users experience when having meetings. \r\nFor example, when we walk into a room, the WebEx room kit can identify us via a device we carry with us  When it recognizes you and see that you have a meeting in that room, WebEx will ask you if you want to start your meeting. No more buttons to push.","isNew":"this is a sample"},{"name":"Relatient for Secure Messaging","quadrant":"Platforms","ring":"Trial","description":"What is relatient??  We need a secure messaging platform to promote patient adherence","isNew":"this is a sample"},{"name":"GitHub for Documentation","quadrant":"Tools","ring":"Trial","description":"<limit description to Documentation use case> /what it is ? Where would u use it?","isNew":"this is a sample"},{"name":"CardioLog - Web Analytics","quadrant":"Tools","ring":"Trial","description":"this is a sample","isNew":"this is a sample"},{"name":"Web Trends - WebAnalytics","quadrant":"Tools","ring":"Trial","description":"The tool will be used to provide web analytics from the BUZZ home page as well as other key intranet sites in BUZZ. The analytics data will help our Marketing target the right content to provide to users.unable to use Google Analytics as  it has limitations with regard to how it can represent metrics data based on how URL are created in SharePoint (BUZZ)","isNew":""},{"name":"VITESS","quadrant":"Platforms","ring":"Trial","description":"Vitess is a database solution for deploying, scaling and managing large clusters of MySQL instances. It?s architected to run as effectively in a public or private cloud architecture as it does on dedicated hardware. It combines and extends many important MySQL features with the scalability of a NoSQL database. Vitess can help you with the following problems:\r\n\r\nScaling a MySQL database by allowing you to shard it, while keeping application changes to a minimum.\r\nMigrating from baremetal to a private or public cloud.\r\nDeploying and managing a large number of MySQL instances.","isNew":"this is a sample"},{"name":"Service Mesh","quadrant":"Platforms","ring":"Trial","description":"","isNew":"this is a sample"},{"name":"IBM Eligibility blockchain","quadrant":"Techniques","ring":"Trial","description":"1. IBM Eligibility blockchain POCd recently\r\nAction item: Reggie to provide POC findings to host in EA site & loop back with user on findings","isNew":"this is a sample"},{"name":"Graph Databases","quadrant":"Techniques","ring":"Trial","description":"1. Existing PI Portal using Neo4j\r\n2. Emerging match based use cases\r\n3. Defined patterns / implemenetation recipes for teams to adopt","isNew":"this is a sample"},{"name":"Dockers","quadrant":"Platforms","ring":"Emerging","description":"Docker is an open source software platform to create, deploy and manage virtualized application containers on a common operating system (OS), with an ecosystem of allied tools.","isNew":"FALSE"},{"name":"Flask","quadrant":"Languages or Frameworks","ring":"Emerging","description":"this is a sample","isNew":"FALSE"},{"name":"Serverless","quadrant":"Platforms","ring":"Emerging","description":"Serverless computing is a computing execution model in which the provider runs the server, and dynamically manages the allocation of machine resources. Pricing is based on the actual amount of resources consumed by an application, rather than on pre-purchased units of capacity","isNew":"FALSE"},{"name":"Test Driven Development","quadrant":"Techniques","ring":"Emerging","description":"Test-Driven Development (TDD) is a philosophy and practice that recommends building and executing tests before implementing the code or a component of a system. By validating them against a series of agreed-to tests, TDD?an Agile Testing practice?improves system outcomes by assuring that the system implementation meets its requirements.","isNew":"FALSE"},{"name":"Behavior Driven Development (BDD)","quadrant":"Techniques","ring":"Emerging","description":"Behavior Driven Development (BDD) is a Test-First, Agile Testing practice that provides Built-In Quality by defining (and potentially automating) tests before, or as part of, specifying system behavior.  BDD is a collaborative process that creates a shared understanding of requirements between the business and the Development Team. Its goal is to help guide development, decrease rework, and increase flow. Without focusing on internal implementation, BDD tests are business-facing scenarios that attempt to describe the behavior of a Story, Feature, or Capability from a user?s perspective. When automated, these tests ensure that the system continuously meets the specified behavior even as the system evolves. That, in turn, enables Release on Demand. Automated BDD tests can also serve as the definitive statement regarding the as-built system behavior, replacing other forms of behavioral specifications.","isNew":"FALSE"},{"name":"Neo4j","quadrant":"Platforms","ring":"Emerging","description":"","isNew":"FALSE"},{"name":"Containers","quadrant":"Techniques","ring":"Emerging","description":"this is a sample","isNew":"FALSE"},{"name":"SAFE","quadrant":"Languages or Frameworks","ring":"Emerging","description":"this is a sample","isNew":"FALSE"},{"name":"Kotlin","quadrant":"Languages or Frameworks","ring":"Emerging","description":"this is a sample","isNew":"FALSE"},{"name":"Pivotal Cloud Foundry","quadrant":"Platforms","ring":"Emerging","description":"this is a sample","isNew":"FALSE"},{"name":"Veracode for SAST","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Informatica Data Quality","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Ansible","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Terraform","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Tableau","quadrant":"Tools","ring":"Standard","description":"","isNew":"this is a sample"},{"name":"Automated CI/CD","quadrant":"Techniques","ring":"Standard","description":"1. Established pattern in RA\r\n2. Implemented pipelines\r\n3. Defined patterns / implemenetation recipes for teams to adopt","isNew":"this is a sample"},{"name":"Azure DevOps","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"SonarQube for Continuous code Quality","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Burpsuite for DAST","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Microsoft Thread modelling","quadrant":"Tools","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Spring","quadrant":"Languages or Frameworks","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Springboot","quadrant":"Languages or Frameworks","ring":"Standard","description":"this is a sample","isNew":"this is a sample"},{"name":"Azure DevOps Wiki for Documentation","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"Microsoft Teams - O365","quadrant":"Tools","ring":"Contained","description":"Microsoft Teams is cloud-based team collaboration software that is part of the Office 365 suite of applications. The core capabilities in Microsoft Teams include business messaging, calling, video meetings and file sharing\r\n<Microsoft teams is currently being used in limited fashion. Security policies / controls are being built to open up for enterprise. >","isNew":"TRUE"},{"name":"Vertica Database","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"Azure Key Vault","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"O365 (Office Professional Plus)","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"O365 (SharePoint Online)","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"O365 (One Drive)","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"Jenkins for CI/CD","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"IBM Infosphere Change Data Capture","quadrant":"Tools","ring":"Contained","description":"this is a sample","isNew":"TRUE"},{"name":"Azure Containers","quadrant":"Platforms","ring":"Contained","description":"","isNew":"TRUE"},{"name":"AWS API Gateway","quadrant":"Platforms","ring":"Contained","description":"<CONTAINED to ELIZa only>","isNew":"TRUE"},{"name":"PAXATA","quadrant":"Tools","ring":"Retired","description":"this is a sample","isNew":"this is a sample"}]
    }

    function createBlips () {
      try {
        all = getRadarUIData();
        var blips = _.map(all, new InputSanitizer().sanitize)
        var sheetName = ['']
        // plotRadar(tabletop.googleSheetName + ' - ' + sheetName, blips, sheetName, )
        plotRadar('HMS Tech Radar', blips, 'HMS Tech Radar', sheetName)
      } catch (exception) {
        plotErrorMessage(exception)
      }
    }
  }

  function createBlipsForProtectedSheet (documentTitle, values, sheetNames) {
    if (!sheetName) {
      sheetName = sheetNames[0]
    }
    values.forEach(function (value) {
      var contentValidator = new ContentValidator(values[0])
      contentValidator.verifyContent()
      contentValidator.verifyHeaders()
    })

    const all = values
    const header = all.shift()
    var blips = _.map(all, blip => new InputSanitizer().sanitizeForProtectedSheet(blip, header))
    plotRadar(documentTitle + ' - ' + sheetName, blips, sheetName, sheetNames)
  }

  self.authenticate = function (force = false, callback) {
    GoogleAuth.loadGoogle(function (e) {
      GoogleAuth.login(_ => {
        var sheet = new Sheet(sheetReference)
        sheet.processSheetResponse(sheetName, createBlipsForProtectedSheet, error => {
          if (error.status === 403) {
            plotUnauthorizedErrorMessage()
          } else {
            plotErrorMessage(error)
          }
        })
        if (callback) { callback() }
      }, force)
    })
  }

  self.init = function () {
    plotLoading()
    return self
  }

  return self
}

const CSVDocument = function (url) {
  var self = {}

  self.build = function () {
    d3.csv(url).then(createBlips)
  }

  var createBlips = function (data) {
    try {
      var columnNames = data.columns
      delete data.columns
      var contentValidator = new ContentValidator(columnNames)
      contentValidator.verifyContent()
      contentValidator.verifyHeaders()
      var blips = _.map(data, new InputSanitizer().sanitize)
      plotRadar(FileName(url), blips, 'CSV File', [])
    } catch (exception) {
      plotErrorMessage(exception)
    }
  }

  self.init = function () {
    plotLoading()
    return self
  }

  return self
}

const DomainName = function (url) {
  var search = /.+:\/\/([^\\/]+)/
  var match = search.exec(decodeURIComponent(url.replace(/\+/g, ' ')))
  return match == null ? null : match[1]
}

const FileName = function (url) {
  var search = /([^\\/]+)$/
  var match = search.exec(decodeURIComponent(url.replace(/\+/g, ' ')))
  if (match != null) {
    var str = match[1]
    return str
  }
  return url
}

const GoogleSheetInput = function () {
  var self = {}
  var sheet

  self.build = function () {
    var domainName = DomainName(window.location.search.substring(1))
    var queryString = window.location.href.match(/sheetId(.*)/)
    var queryParams = queryString ? QueryParams(queryString[0]) : {}

    sheet = GoogleSheet(queryParams.sheetId, queryParams.sheetName)
    console.log(queryParams.sheetName)
    sheet.init().build()

   /* if (domainName && queryParams.sheetId.endsWith('csv')) {
      sheet = CSVDocument(queryParams.sheetId)
      sheet.init().build()
    } else if (domainName && domainName.endsWith('google.com') && queryParams.sheetId) {
     
    } else {
      var content = d3.select('body')
        .append('div')
        .attr('class', 'input-sheet')
      setDocumentTitle()

      plotLogo(content)

      var bannerText = '<div><h1>Build your own radar</h1><p>Once you\'ve <a href ="https://www.thoughtworks.com/radar/byor">created your Radar</a>, you can use this service' +
        ' to generate an <br />interactive version of your Technology Radar. Not sure how? <a href ="https://www.thoughtworks.com/radar/how-to-byor">Read this first.</a></p></div>'

      plotBanner(content, bannerText)

      plotForm(content)

      plotFooter(content)
    }*/
  }

  return self
}

function setDocumentTitle () {
  document.title = 'Build your own Radar'
}

function plotLoading (content) {
  content = d3.select('body')
    .append('div')
    .attr('class', 'loading')
    .append('div')
    .attr('class', 'input-sheet')

  setDocumentTitle()

  plotLogo(content)

  var bannerText = '<h1>Building your radar...</h1><p>Your Technology Radar will be available in just a few seconds</p>'
  plotBanner(content, bannerText)
  plotFooter(content)
}

function plotLogo (content) {
  content.append('div')
    .attr('class', 'input-sheet__logo')
    .html('<a href="https://www.thoughtworks.com"><img src="/images/tw-logo.png" / ></a>')
}

function plotFooter (content) {
  content
    .append('div')
    .attr('id', 'footer')
    .append('div')
    .attr('class', 'footer-content')
    .append('p')
    .html('Powered by <a href="https://www.thoughtworks.com"> ThoughtWorks</a>. ' +
      'By using this service you agree to <a href="https://www.thoughtworks.com/radar/tos">ThoughtWorks\' terms of use</a>. ' +
      'You also agree to our <a href="https://www.thoughtworks.com/privacy-policy">privacy policy</a>, which describes how we will gather, use and protect any personal data contained in your public Google Sheet. ' +
      'This software is <a href="https://github.com/thoughtworks/build-your-own-radar">open source</a> and available for download and self-hosting.')
}

function plotBanner (content, text) {
  content.append('div')
    .attr('class', 'input-sheet__banner')
    .html(text)
}

function plotForm (content) {
  content.append('div')
    .attr('class', 'input-sheet__form')
    .append('p')
    .html('<strong>Enter the URL of your <a href="https://www.thoughtworks.com/radar/how-to-byor" target="_blank">Google Sheet or CSV</a> file below…</strong>')

  var form = content.select('.input-sheet__form').append('form')
    .attr('method', 'get')

 
  form.append('p').html("<a href='https://www.thoughtworks.com/radar/how-to-byor'>Need help?</a>")
}

function plotErrorMessage (exception) {
  var message = 'Oops! It seems like there are some problems with loading your data. '

  var content = d3.select('body')
    .append('div')
    .attr('class', 'input-sheet')
  setDocumentTitle()

  plotLogo(content)

  var bannerText = '<div><h1>Build your own radar</h1><p>Once you\'ve <a href ="https://www.thoughtworks.com/radar/byor">created your Radar</a>, you can use this service' +
    ' to generate an <br />interactive version of your Technology Radar. Not sure how? <a href ="https://www.thoughtworks.com/radar/how-to-byor">Read this first.</a></p></div>'

  plotBanner(content, bannerText)

  d3.selectAll('.loading').remove()
  message = "Oops! We can't find the Google Sheet you've entered"
  var faqMessage = 'Please check <a href="https://www.thoughtworks.com/radar/how-to-byor">FAQs</a> for possible solutions.'
  if (exception instanceof MalformedDataError) {
    message = message.concat(exception.message)
  } else if (exception instanceof SheetNotFoundError) {
    message = exception.message
  } else {
    console.error(exception)
  }

  const container = content.append('div').attr('class', 'error-container')
  var errorContainer = container.append('div')
    .attr('class', 'error-container__message')
  errorContainer.append('div').append('p')
    .html(message)
  errorContainer.append('div').append('p')
    .html(faqMessage)

  var homePageURL = window.location.protocol + '//' + window.location.hostname
  homePageURL += (window.location.port === '' ? '' : ':' + window.location.port)
  var homePage = '<a href=' + homePageURL + '>GO BACK</a>'

  errorContainer.append('div').append('p')
    .html(homePage)

  plotFooter(content)
}

function plotUnauthorizedErrorMessage () {
  var content = d3.select('body')
    .append('div')
    .attr('class', 'input-sheet')
  setDocumentTitle()

  plotLogo(content)

  var bannerText = '<div><h1>Build your own radar</h1></div>'

  plotBanner(content, bannerText)

  d3.selectAll('.loading').remove()
  const currentUser = GoogleAuth.geEmail()
  let homePageURL = window.location.protocol + '//' + window.location.hostname
  homePageURL += (window.location.port === '' ? '' : ':' + window.location.port)
  const goBack = '<a href=' + homePageURL + '>GO BACK</a>'
  const message = `<strong>Oops!</strong> Looks like you are accessing this sheet using <b>${currentUser}</b>, which does not have permission.Try switching to another account.`

  const container = content.append('div').attr('class', 'error-container')

  const errorContainer = container.append('div')
    .attr('class', 'error-container__message')

  errorContainer.append('div').append('p')
    .attr('class', 'error-title')
    .html(message)

  const button = errorContainer.append('button')
    .attr('class', 'button switch-account-button')
    .text('SWITCH ACCOUNT')

  errorContainer.append('div').append('p')
    .attr('class', 'error-subtitle')
    .html(`or ${goBack} to try a different sheet.`)

  button.on('click', _ => {
    var queryString = window.location.href.match(/sheetId(.*)/)
    var queryParams = queryString ? QueryParams(queryString[0]) : {}
    const sheet = GoogleSheet(queryParams.sheetId, queryParams.sheetName)
    sheet.authenticate(true, _ => {
      content.remove()
    })
  })
}

module.exports = GoogleSheetInput
