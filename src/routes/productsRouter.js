import path from "path"
import { Router } from 'express'; 
import __dirname from "../utils.js";
import ProductManager from "../dao/ProductManager.js"

//middleware para checkear el id que llega por parámetro
import { idCheck } from '../middlewares/idCheck.js';

export const router=Router()

const productsFilePath = path.join(__dirname,"data","products.json")
ProductManager.path = productsFilePath


router.get("/", async (req, res)=>{
    try {
        let productos=await ProductManager.getProducts()
        // console.log(productos)
        res.status(200).send(productos)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

router.get("/:pid", idCheck, async (req, res)=>{
    try {
        let producto=await ProductManager.getProductById(req.pid)
        // console.log(producto)
        if (!producto){
            return res.status(404).send({ERROR:`product of id ${req.pid} NOT FOUND.`})
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
        let productos = await ProductManager.getProducts()
        // Validar que no se repita el campo “code”
        if (productos.find(prod => prod.code === code)){
            return res.status(400).send({ERROR:`Product code ${code} already exists.`})
        }

        await ProductManager.addProduct(title, description, code, price, status, stock, category, thumbnail)

        return res.status(201).send({CONFIRMATION:"Product added successfully"})

    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."}) 
    }

})

router.delete("/:pid",idCheck, async (req, res)=>{
    try {
        let product = await ProductManager.getProductById(req.pid)
        if (!product){
            return res.status(404).send({ERROR:`product of id ${req.pid} NOT FOUND.`})
        }
        await ProductManager.deleteProduct(req.pid)
        return res.status(200).send({CONFIRMATION:"Product deleted!"})

    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})

router.put("/:pid",idCheck, async (req, res)=>{
    let productos = await ProductManager.getProducts()
    let product = productos.find(prod => prod.id === req.pid)
    let fields = req.body

    if (!product){
        return res.status(404).send({ERROR:`product of id ${req.pid} NOT FOUND.`})
    }
    
    try {
        await ProductManager.updateProduct(req.pid, fields)
        return res.status(200).send({CONFIRMATION:`Product ${req.pid} updated!`})
    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }

})

