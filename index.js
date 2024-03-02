const express = require("express")
const app = express()

require("dotenv").config()
const PORT = process.env.PORT
app.listen( PORT , ()=> console.log(`app started on port ${PORT}`) )

app.use(express.json())
require("./config/database").connectDB()

const cookieParser = require("cookie-parser")

const userRoutes = require("./routes/userRoutes")
app.use("/api/v1", userRoutes)

app.get("/", ( req , res ) => {
    res.send( `<h1>Hello jiii</h1>`)
})
