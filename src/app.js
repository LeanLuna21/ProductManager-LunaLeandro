import express from "express"
import ProductManager from "./dao/ProductManager.js"
import path from "path"
import __dirname from "./utils.js"

const PORT = 3000
const filePath = path.join(__dirname,"data","productos.json")
const productManager = new ProductManager(filePath)
const app = express()

app.use(express.json()) 
app.use(express.urlencoded({extended:true}))

app.get("/",(req, res)=>{
    res.send("API Productos - Home Page")
})

app.get("/productos", async (req, res)=>{
    try {
        let productos=await productManager.getProducts()
        // console.log(productos)
        res.status(200).send(productos)
    } catch (error) {
        res.status(400).send(`Error interno del server...!!!`)
    }
})

app.get("/productos/:id", async (req, res)=>{
    
    // let id = Number(req.params.id)
    let {id} = req.params
    id = Number(id)

    if (isNaN(id)){
        return res.status(400).send({"ERROR":"product id must be number."})
    }
    
    try {
        let producto=await productManager.getProductById(id)
        // console.log(producto)
        if (!producto){
            return res.status(404).send({"ERROR":`product of id ${id} NOT FOUND.`})
        }

        return res.status(200).send(producto)

    } catch (error) {
        return res.status(500).send({"ERROR":"Internal server error..."})
    }
})

app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
    // console.log(`Reading:  ${filePath}`)
})