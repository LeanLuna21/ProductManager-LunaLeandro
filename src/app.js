import express from "express"
import { engine } from "express-handlebars"

import __dirname from "./utils.js"
import { router as productsRouter } from "./routes/productsRouter.js"
import { router as cartsRouter } from "./routes/cartsRouter.js"
import { router as viewsRouter } from "./routes/viewsRouter.js"

const PORT = 3000 
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use("/static", express.static('./src/public'))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", __dirname+"\\views")

app.use("/", viewsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

// app.get("/",(req, res)=>{
//     res.send("API - Home Page")
// })

const server = app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
})