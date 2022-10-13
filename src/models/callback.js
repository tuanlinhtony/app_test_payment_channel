const mongoose = require('mongoose')
const  validator = require('validator')

const callbackSchema = new mongoose.Schema({
        balance: {
            type: Number,
            required: true
        },
        callbackType: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        forControl: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        orderId: {
            type: String,
            required: true
        },
        realAmount: {
            type: String,
            required: true
        },
        sign: {
            type: String,
            required: true
        },
        transactionId: {
            type: String,
            required: true
        },
    }
    ,
    {
        timestamps: true
    }
)

const Callback = mongoose.model('Callback', callbackSchema)

module.exports = Callback