const express = require('express')
const async = require('hbs/lib/async')
const router = new express.Router()


const Otp = require('../../models/otp')
const {otpViettel, viettelProcess} = require('../chargeMobileProcess/viettel')

router.post('/authCharge', async (req, res) => {
    const otp = new Otp(req.body)
    try{
        await otp.save()
        console.log("authCharge: " + otp.otp + "|" + otpViettel.otp)
        res.status(200).send('success')
        otpViettel.otp = otp.otp
        console.log('Saved!!')
    }catch(e){
        console.log(e.message)
    }
})
module.exports = router