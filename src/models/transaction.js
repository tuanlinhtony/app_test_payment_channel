const mongoose = require('mongoose')
const  validator = require('validator')

const transactionSchema = new mongoose.Schema(
        {
        transid: {
            type: String,
            required: true
        },
        numberPhone: {
            type: String,
            required: true
        },
        provider: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: "pending"
        },
        otp: {
            type: String,
            default: "null"
        }
    }
    ,
    {
        timestamps: true
    }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction