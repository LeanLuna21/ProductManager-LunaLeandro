import { Router } from 'express'; 

import CartManager from "../dao/CartMongoManager.js"
import ProductManager from "../dao/ProductMongoManager.js"

export const router=Router()

router.get('/',(req,res)=>{
    res.render("home")
})

router.get('/products', async(req, res)=>{
    try {
        let productos= await ProductManager.getProducts()
        return res.render("index", {productos})
    } catch (error) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
 
})

router.get('/realtimeproducts', async(req, res)=>{
    try {
        let productos= await ProductManager.getProducts()
        return res.render("realTimeProducts", {productos})
    } catch (error) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.get('/addproducts', async(req, res)=>{
    try {
        return res.render("addProductForm")
    } catch (error) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})
