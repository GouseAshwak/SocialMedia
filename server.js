const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const passport = require('passport')
const app = express()
const i18n = require('i18n')
const initMongo = require('./config/mongo')
const appInfo = require('./settings.json')
const path = require('path')

global.appInfo = appInfo
// Setup express server port from ENV, default: 3000
app.set('port', appInfo.PORT || 3000)

// for parsing json
app.use(
  bodyParser.json({
    limit: '100mb'
  })
)
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: '100mb',
    extended: true
  })
)

// i18n
i18n.configure({
  locales: ['en', 'es'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en',
  objectNotation: true
})
app.use(i18n.init)

// Init all other stuff
app.use(cors())
app.use(passport.initialize())
app.use(compression())
app.use(helmet())
app.use(express.static('public'))
//app.set('views', path.join(__dirname, 'views'))
//app.engine('html', require('ejs').renderFile)
//app.set('view engine', 'html')
app.get('/', function(req, res) {
	res.send('Welcome to One CC backend application!!!');
});
app.use(require('./app/routes'))
app.listen(app.get('port'))

// Init MongoDB
initMongo()

module.exports = app // for testing
