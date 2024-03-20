const mongoose = require("mongoose")
require("colors")

const connectDB = async ()=> {
    const url = process.env.MONGO_URL
    try {
        await mongoose.connect(url).then((res, req) =>{
            console.log(`Database Connection is success`.bgMagenta.white)
        })
    } catch (error) {
        console.log(`Error while connecting to database. ${error}`.bgRed.white)
    }
}
module.exports = connectDB