const express = require('express')
const async = require('hbs/lib/async')
const { v4: uuidv4 } = require('uuid');

const router = new express.Router()
const Callback = require('../../models/callback')


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
    res.render('qr_code', {transactionID: Math.floor(Math.random() * 100000000000000000000000000 + 1)})
})

//Create nap_mobile_cham view
router.get('/top_up', async(req,res) => {
    res.render('top_up')
})

//Create buy introduction view
router.get('/pay_out', async(req,res) => {
    res.render('pay_out', {transactionID: Math.floor(Math.random() * 100000000000000000000000000 + 1)})
})

//Create buy introduction view
router.get('/callback_list', async(req,res) => {
    try{
        const callbacks = await Callback.find({})

        var signList = []
        callbacks.forEach(function(item) {
            signList.push(item.sign);
        });
        console.log(signList)
        res.render('callback', {callbacks})
        // res.status(201).send(signList)
        // console.log('Find all results')
    }catch(e){
        res.status(500).send(e.message)
    }

})



module.exports = router
