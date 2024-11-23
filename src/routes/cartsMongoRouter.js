import path from "path";
import { Router } from 'express'; 
import __dirname from "../utils.js";
import CartManager from "../dao/CartMongoManager.js"
import ProductManager from "../dao/ProductMongoManager.js"

import { pidCheck } from '../middlewares/idCheck.js';
import { cidCheck } from '../middlewares/idCheck.js';
import { isValidObjectId } from 'mongoose';

export const router=Router()

router.get("/", async (req, res)=>{ 
    try {
        let cart = await CartManager.getCarts()
        res.status(200).send(cart)
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.post("/", async (req, res)=>{
    try {
        await CartManager.createCart()
        return res.status(200).send({CONFIRMATION:"CART CREATED."})
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.get("/:cid", cidCheck, async (req, res)=>{
    if (!isValidObjectId(req.cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    try {
        let cart1 = await CartManager.getCartById(req.cid)
        if (!cart1){
            return res.status(404).send({ERROR:`cart of id ${req.cid} NOT FOUND.`})
        }
        return res.status(200).send(cart1)
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.post("/:cid/product/:pid", cidCheck,pidCheck, async (req, res)=>{
    if (!isValidObjectId(req.cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(req.pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let cart = await CartManager.getCartById(req.cid)
        if (!cart){
            return res.status(404).send({ERROR:`cart id ${req.cid} NOT FOUND.`})
        }
        let product = await ProductManager.getProductById(req.pid)
        if (!product){
            return res.status(404).send({ERROR:`product id ${req.pid} NOT FOUND.`})
        }

        await CartManager.addOrderToCart(req.cid, req.pid)
        return res.status(200).send({CONFIRMATION:"Order Saved."})
        
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})