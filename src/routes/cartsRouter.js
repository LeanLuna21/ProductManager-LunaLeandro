import path from "path";
import { Router } from 'express'; 
import __dirname from "../utils.js";
import CartManager from "../dao/CartManager.js"

export const router=Router()

const cartFilePath = path.join(__dirname,"data","carts.json")
const cartManager = new CartManager(cartFilePath)


router.post("/", async (req, res)=>{
    try {
        await cartManager.createCart()
        return res.status(200).send({CONFIRMATION:"CART CREATED."})
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

router.get("/", async (req, res)=>{ 
    try {
        let cart = await cartManager.getCarts()
        // console.log(productos)
        res.status(200).send(cart)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

router.get("/:cid", async (req, res)=>{
    
    let {cid} = req.params
    let id = Number(cid)

    if (isNaN(id)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let cart = await cartManager.getCartById(id)
        if (!cart){
            return res.status(404).send({ERROR:`cart of id ${cid} NOT FOUND.`})
        }
        res.status(200).send(cart)
    } catch (err) {
        res.status(500).send({ERROR:"Internal server error..."})
    }
})

router.post("/:cid/product/:pid", async (req, res)=>{
    
    let {cid, pid} = req.params
    cid = Number(cid)
    pid = Number(pid)

    if (isNaN(cid)){
        return res.status(400).send({ERROR:"cart id must be number."})
    }
    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    
    try {
        let cart = await cartManager.getCartById(cid)
        if (!cart){
            return res.status(404).send({ERROR:`cart id ${cid} NOT FOUND.`})
        }

        let product = await productManager.getProductById(pid)
        if (!product){
            return res.status(404).send({ERROR:`product id ${pid} NOT FOUND.`})
        }

        await cartManager.addOrderToCart(cid, pid)
        
        return res.status(200).send({CONFIRMATION:"Order Saved."})
        
    } catch (err) {
        return res.status(500).send({ERROR:"Internal server error..."})
    }
})