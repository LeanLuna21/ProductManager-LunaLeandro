import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import __dirname from "./utils.js"
// import { router as productsRouter } from "./routes/productsRouter.js"
import { router as productsRouter}  from "./routes/productsMongoRouter.js"
// import { router as cartsRouter } from "./routes/cartsRouter.js"
import { router as cartsRouter } from "./routes/cartsMongoRouter.js"
// import { router as viewsRouter } from "./routes/viewsRouter.js"
import { router as viewsRouter } from "./routes/viewsMongoRouter.js"
import { conectarDB } from './connectDB.js';
import { config } from './config/dbconfig.js';

const PORT = 3000
let io
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '\\public'))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "\\views")

app.use("/", viewsRouter)
app.use(
    "/api/products",
    (req, res, next) => {
        req.io = io
        next()
    },
    productsRouter
)
app.use("/api/carts", cartsRouter)

// app.get("/",(req, res)=>{
//     res.send("API - Home Page")
// })

const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`)
})

io = new Server(server) 

conectarDB(config.MONGO_URI, config.DB_NAME)