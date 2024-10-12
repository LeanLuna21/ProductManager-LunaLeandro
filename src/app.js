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
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let producto=await productManager.getProductById(id)
        // console.log(producto)
        if (!producto){
            return res.status(404).send({ERROR:`product of id ${id} NOT FOUND.`})
        }

        return res.status(200).send(producto)

    } catch (error) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.post("/productos", async (req, res)=>{
    let {title, description, code, price, status, stock, category, thumbnail} = req.body
    // Validar que ninguno de los campos llegue vacio
    if (!title || !description || !code || !price || !status|| !stock|| !category || !thumbnail){
        return res.status(400).send({ERROR:`Missing required fields. ${req.body}`})
    }

    try {
        let productos = await productManager.getProducts()
        // Validar que no se repita el campo “code”
        if (productos.find(prod => prod.code === code)){
            return res.status(400).send({ERROR:`Product code ${code} already exists.`})
        }

        await productManager.addProduct(title, description, code, price, status, stock, category, thumbnail)

        return res.status(200).send({CONFIRMATION:"Product added successfully", product:req.body})

    } catch (err) {
        res.status(400).send({Error:`Error interno del server...!!! ${err}`}) 
    }

})

app.delete("/productos/:id", async (req, res)=>{
    // let id = Number(req.params.id)
    let {id} = req.params
    id = Number(id)

    if (isNaN(id)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let product=await productManager.getProductById(id)
        if (!product){
            return res.status(404).send({ERROR:`product of id ${id} NOT FOUND.`})
        }
        await productManager.deleteProduct(id)
        return res.status(200).send({CONFIRMATION:"Product deleted!",product: product})

    } catch (error) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.put("/productos/:id", async (req, res)=>{

})

app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
    // console.log(`Reading:  ${filePath}`)
})