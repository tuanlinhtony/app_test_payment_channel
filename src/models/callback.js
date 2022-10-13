const mongoose = require('mongoose')
const  validator = require('validator')

const callbackSchema = new mongoose.Schema({
        balance: {
            type: Number,
            required: false
        },
        callbackType: {
            type: String,
            required: false
        },
        code: {
            type: String,
            required: false
        },
        forControl: {
            type: String,
            required: false
        },
        message: {
            type: String,
            required: false
        },
        orderId: {
            type: String,
            required: false
        },
        realAmount: {
            type: String,
            required: false
        },
        qrCode: {
            type: String,
            required: false
        },
        redirectUrl: {
            type: String,
            required: false
        },
        sign: {
            type: String,
            required: false
        },
        transactionId: {
            type: String,
            required: false
        },
    }
    ,
    {
        timestamps: true
    }
)

const Callback = mongoose.model('Callback', callbackSchema)

module.exports = Callback