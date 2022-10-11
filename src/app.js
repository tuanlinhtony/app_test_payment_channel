const express = require('express')
require('./db/mongoose')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require("cors");

//Add routers
const pageRouter = require('./routers/mainProcess/pageRouter')
const transRouter = require('./routers/mainProcess/transactions')
const otpDeliver = require('./routers/chargeMobileProcess/otpDeliver')

//create Express Application
const app = express()

var corsOptions = {
    origin: 'ec2-13-214-211-215.ap-southeast-1.compute.amazonaws.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

//Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//pares incoming requests with JSON payloads and is based on body-parser.
app.use(bodyParser.json())
app.use(express.json())

//call router
app.use(pageRouter)
app.use(transRouter)
app.use(otpDeliver)


//Export module
module.exports = app