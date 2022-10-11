const express = require('express')
const async = require('hbs/lib/async')
const router = new express.Router()
const crypto = require("crypto")

const Transaction = require('../../models/transaction')
const {otpViettel, viettelProcess} = require('../chargeMobileProcess/viettel')
const {otpMobifone, mobifoneProcess} = require('../chargeMobileProcess/mobifone') 

router.post('/charging', async (req, res) => {
    const transaction = new Transaction(req.body)
    transaction.transid = crypto.randomBytes(16).toString("hex")
    console.log(transaction)
    //refactor with async/await
    try{
        await transaction.save()
        res.status(200).send('succeed')
        console.log('Saved!!')
        switch (transaction.provider){
            case 'viettel' : {
                viettelProcess(transaction, (error) => {
                    if(error){
                        return console.log(error)
                    }
                })
                break;
            }
            case 'mobifone' : {
                mobifoneProcess(transaction, (error) => {
                    if(error){
                        return console.log(error)
                    }
                })
                break;
            }
            case 'vinaphone' : {
                // do some thing
                break;
            }
            case 'vietnammobile' : {
                // do some thing
                break;
            }
            case 'gmobile' : {
                // do some thing
                break;
            }
            default : {
                // do something
            }
        }
        
    }catch(e){
        console.log(e.message)
    }
})

module.exports = router