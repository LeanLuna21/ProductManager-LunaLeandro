import { Router } from 'express'; 
import __dirname from "../utils.js";
import CartManager from "../dao/CartManager.js"
import ProductManager from "../dao/ProductManager.js"

ProductManager.path=__dirname+"\\data"+"\\products.json"
CartManager.path=__dirname+"\\data"+"\\carts.json"

export const router=Router()

router.get('/',(req,res)=>{
    res.render("home")
})

router.get('/products', async(req, res)=>{
    try {
        let productos= await ProductManager.getProducts()
        res.render("index", {productos})
    } catch (error) {
        res.status(500).send({ERROR:"Internal server error..."}) 
    }
 
})

router.get('/realtimeproducts', async(req, res)=>{
    try {
        let productos= await ProductManager.getProducts()
        res.render("realTimeProducts", {productos})
    } catch (error) {
        res.status(500).send({ERROR:"Internal server error..."}) 
    }
})

router.get('/addproducts', async(req, res)=>{
    try {
        res.render("addProductForm")
    } catch (error) {
        res.status(500).send({ERROR:"Internal server error..."}) 
    }
})
