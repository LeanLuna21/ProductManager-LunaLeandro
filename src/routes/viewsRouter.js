import { Router } from 'express'; 
import __dirname from "../utils.js";
import CartManager from "../dao/CartManager.js"
import ProductManager from "../dao/ProductManager.js"

ProductManager.path=__dirname+"\\data"+"\\products.json"
CartManager.path=__dirname+"\\data"+"\\carts.json"

export const router=Router()

router.get('/',(req,res)=>{
    console.log(__dirname);
    console.log(ProductManager.path);
    console.log(CartManager.path);
    res.render("home")
})

router.get('/products', async(req, res)=>{
    let productos= await ProductManager.getProducts()

    res.render("index", {productos})
})

