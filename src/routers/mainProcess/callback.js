const express = require('express')
const async = require('hbs/lib/async')
const router = new express.Router()
const crypto = require("crypto")

const Callback = require('../../models/callback')

router.post('/callback', async (req, res) => {
    const callback = new Callback(req.body)
    callback.transid = crypto.randomBytes(16).toString("hex")
    console.log(callback)
    //refactor with async/await
    try{
        await callback.save()
        res.status(200).send('succeed')
        console.log('Saved!!')
    }catch(e){
        console.log(e.message)
    }
})

module.exports = router