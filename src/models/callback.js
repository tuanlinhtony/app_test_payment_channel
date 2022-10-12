const mongoose = require('mongoose')
const  validator = require('validator')

const callbackSchema = new mongoose.Schema(
        {
        transid: {
            type: String,
            required: true
        },
        sign: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        message: {
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