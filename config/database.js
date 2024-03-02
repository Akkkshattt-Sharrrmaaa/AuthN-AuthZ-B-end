const mongoose = require("mongoose")
require("dotenv")

exports.connectDB = () => {

    mongoose.connect( process.env.MONGODB_URL , {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then( () => console.log("db connection successful") )
    .catch(
        (error)=>{
            console.log("db connection unsuccessful")
            console.error(error)
            process.exit(1)
        }
    )
}