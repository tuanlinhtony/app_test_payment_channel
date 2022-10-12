const express = require('express')
const async = require('hbs/lib/async')
const { v4: uuidv4 } = require('uuid');

const router = new express.Router()



//Create main  view
router.get('/',  async(req,res) => {
    res.render('index')
})

//Create nap_mobile_nhanh view
router.get('/loading', async(req,res) => {
    res.render('loading')
})

//Create nap_mobile_nhanh view
router.get('/qr_code', async(req,res) => {
    res.render('qr_code', {transactionID: uuidv4()})
})

//Create nap_mobile_cham view
router.get('/top_up', async(req,res) => {
    res.render('top_up')
})

//Create buy introduction view
router.get('/pay_out', async(req,res) => {
    res.render('pay_out', {transactionID: uuidv4()})
})

module.exports = router
