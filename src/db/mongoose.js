const mongoose = require('mongoose')

// mongoose.connect(process.env.MONGODB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("Database connected!"))
// .catch(err => console.log(err))


mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err))