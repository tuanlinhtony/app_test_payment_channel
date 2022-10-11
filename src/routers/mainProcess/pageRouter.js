const express = require('express')
const async = require('hbs/lib/async')
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const router = new express.Router()

var corsOptions = {
    origin: 'ec2-13-214-211-215.ap-southeast-1.compute.amazonaws.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Create main  view
router.get('/', cors(corsOptions), async(req,res) => {
    res.render('index')
})

//Create nap_mobile_nhanh view
router.get('/loading', cors(corsOptions), async(req,res) => {
    res.render('loading')
})

//Create nap_mobile_nhanh view
router.get('/qr_code', cors(corsOptions), async(req,res) => {
    res.render('qr_code', {transactionID: uuidv4()})
})

//Create nap_mobile_cham view
router.get('/top_up', cors(corsOptions), async(req,res) => {
    res.render('top_up')
})

//Create buy introduction view
router.get('/pay_out', cors(corsOptions), async(req,res) => {
    res.render('pay_out')
})

module.exports = router
