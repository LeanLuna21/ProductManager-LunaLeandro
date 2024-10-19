import path from "path"
import { Router } from 'express'; 
import __dirname from "../utils.js";
import ProductManager from "../dao/ProductManager.js"

export const router=Router()

const productsFilePath = path.join(__dirname,"data","products.json")
const productManager = new ProductManager(productsFilePath)


router.get("/", async (req, res)=>{
    try {
        let productos=await productManager.getProducts()
        // console.log(productos)
        res.status(200).send(productos)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

router.get("/:pid", async (req, res)=>{
    
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

router.post("/", async (req, res)=>{
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

router.delete("/:pid", async (req, res)=>{
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

router.put("/:pid", async (req, res)=>{
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

