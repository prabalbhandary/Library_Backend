// Imports
const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
require("colors")
const cors = require("cors")
const userRoutes = require("./routes/userRoutes")
const bookRoutes = require("./routes/bookRoutes")

// Dotenv Configuration
dotenv.config()

// Initializing App
const app = express()

// Database Connection
connectDB();

// Routes
app.use(cors())
app.use(express.json())
app.use("/api/v1", bookRoutes)
app.use("/api/v1",userRoutes)

// Variables
const port = process.env.PORT || 4000
const mode = process.env.NODE_MODE || development

// Listening Function
app.listen(port, ()=>{
    console.log(`Server running in ${mode} mode on http://localhost:${port}`.bgMagenta.white)
})