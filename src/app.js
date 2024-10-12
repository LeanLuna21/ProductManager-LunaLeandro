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
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.get("/productos/:pid", async (req, res)=>{
    
    // let pid = Number(req.params.pid)
    let {pid} = req.params
    pid = Number(pid)

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let producto=await productManager.getProductById(pid)
        // console.log(producto)
        if (!producto){
            return res.status(404).send({ERROR:`product of id ${pid} NOT FOUND.`})
        }

        return res.status(200).send(producto)

    } catch (err) {
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

        return res.status(201).send({CONFIRMATION:"Product added successfully"})

    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."}) 
    }

})

app.delete("/productos/:pid", async (req, res)=>{
    // let pid = Number(req.params.pid)
    let {pid} = req.params
    pid = Number(pid)

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let product = await productManager.getProductById(pid)
        if (!product){
            return res.status(404).send({ERROR:`product of id ${pid} NOT FOUND.`})
        }
        await productManager.deleteProduct(pid)
        return res.status(200).send({CONFIRMATION:"Product deleted!"})

    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})

app.put("/productos/:pid", async (req, res)=>{
    let {pid} = req.params
    pid = Number(pid)

    let productos = await productManager.getProducts()
    let product = productos.find(prod => prod.id === pid)
    let fields = req.body

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    if (!product){
        return res.status(404).send({ERROR:`product of id ${pid} NOT FOUND.`})
    }
    
    try {
        await productManager.updateProduct(pid, fields)
        return res.status(200).send({CONFIRMATION:`Product ${pid} updated!`})
    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }

})

app.listen(PORT, ()=>{
    console.log(`Server running at port ${PORT}`)
    // console.log(`Reading:  ${filePath}`)
})