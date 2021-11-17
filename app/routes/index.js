const express = require('express')
const router = express.Router()
const fs = require('fs')
const routesPath = `${__dirname}/`
const { removeExtensionFromFile } = require('../middleware/utils')
const baseUr = '/1cc/api/'
/*
 * Load routes statically and/or dynamically
 */
// Load Auth route
router.use(baseUr, require('./auth'))

router.use(baseUr, require('./profile'))

router.use(baseUr, require('./post'))

router.use(baseUr, require('./chat'))

router.use(baseUr, require('./exercise'))

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter((file) => {
  // Take filename and remove last part (extension)
  const routeFile = removeExtensionFromFile(file)
  // Prevents loading of this file and auth file
  return routeFile !== 'index' && routeFile !== 'auth' && file !== '.DS_Store'
    ? router.use(`/${routeFile}`, require(`./${routeFile}`))
    : ''
})

/*
 * Setup routes for index
 */
router.get('/', (req, res) => {
  res.render('index')
})

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
  res.status(404).json({
      message: 'url_not_found'
  })
})

module.exports = router
