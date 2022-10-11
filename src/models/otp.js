const mongoose = require('mongoose')
const  validator = require('validator')

const otpSchema = new mongoose.Schema(
        {
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

const Otp = mongoose.model('otp', otpSchema)

module.exports = Otp