const express = require("express")
const colors = require("colors")
const dotenv = require("dotenv")
const userRoutes = require("./routes/userRoute")
const doctorRoutes = require("./routes/doctorRoute")
const adminRoutes = require("./routes/adminRoute")
const connectDb = require("./config/connectDb")
const cors = require("cors")
const morgan = require("morgan")
const path = require("path")

dotenv.config()
connectDb()

const app = express()

app.use(express.json())
app.use(cors({origin: true}))
app.use(morgan("dev"))

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/doctor", doctorRoutes)

const staticFilePath = path.join(__dirname, "client", "build")
app.use(express.static(staticFilePath))

app.get("*", (req, res) => {
    res.sendFile(path.join(staticFilePath), "index.html")
})

const port = process.env.PORT || 4000
const mode = process.env.MODE || "production"

app.listen(port, () => {
    console.log(`Server Running on ${mode} mode in http://localhost:${port}`.bgMagenta.white)
})

app.use((err, req, res, next) => {
    console.error(`${err.stack}`.bgRed.white)
    res.status(500).send("Something Broke!")
})