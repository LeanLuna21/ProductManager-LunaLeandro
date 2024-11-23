import { Router } from 'express';
import CartManager from "../dao/CartMongoManager.js"
import ProductManager from "../dao/ProductMongoManager.js"

import { pidCheck } from '../middlewares/idCheck.js';
import { cidCheck } from '../middlewares/idCheck.js';
import { isValidObjectId } from 'mongoose';

export const router = Router()

router.get("/", async (req, res) => {
    try {
        let cart = await CartManager.getCarts()
        res.status(200).json(cart)
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.post("/", async (req, res) => {
    try {
        let newCart = await CartManager.createCart()
        return res.status(200).send({ CONFIRMATION: "CART CREATED.", NEW_CART:newCart })
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.get("/:cid", async (req, res) => {
    let {cid} = req.params
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    try {
        let cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart of id ${cid} NOT FOUND.` })
        }
        return res.status(200).json(cart)
    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let {cid, pid} = req.params
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cid} NOT FOUND.` })
        }
        let product = await ProductManager.getProductById(pid)
        if (!product) {
            return res.status(404).send({ ERROR: `product id ${pid} NOT FOUND.` })
        }

        let modifiedCart = await CartManager.addOrderToCart(cart, product)
        return res.status(200).send({ CONFIRMATION: "Order Saved.", CART:modifiedCart })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.delete("/:cid", async (req, res) => {
    let {cid} = req.params
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    try {
        let cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cid} NOT FOUND.` })
        }
        if (cart.products.length === 0){
            return res.status(404).send({ ERROR: `cart id ${cid} IS EMPTY.` })
        }
        await CartManager.emptyCart(cid)
        return res.status(200).send({ CONFIRMATION: `Cart ${cid} is now empty.`})

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    let {cid, pid} = req.params
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cid} NOT FOUND.` })
        }
        let prodInCart = cart.products.find(prod => {
            if (prod.product.equals(pid)) {
                return prod
            }
        }
        )
        if (!prodInCart){
            return res.status(404).send({ ERROR: `product of id ${pid} NOT FOUND in cart.` })
        }
        await CartManager.removeProduct(cart, pid)
        return res.status(200).send({ CONFIRMATION: "Product Removed." })

    } catch (error) {
        return res.status(500).send({ ERROR: `${error.message}` })
    }

})

router.put("/:cid/products/:pid", async (req, res) => {
    let {cid, pid} = req.params
    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Cart ID!` })
    }
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let cart = await CartManager.getCartById(cid)
        if (!cart) {
            return res.status(404).send({ ERROR: `cart id ${cid} NOT FOUND.` })
        }
        let prodInCart = cart.products.find(prod => {
            if (prod.product.equals(pid)) {
                return prod
            }
        }
        )
        if (!prodInCart){
            return res.status(404).send({ ERROR: `product of id ${pid} NOT FOUND in cart.` })
        }

        let {quantity} = req.body
        quantity = Number(quantity)
        await CartManager.updateCartProduct(cart, pid, quantity)
        return res.status(200).send({ CONFIRMATION: `Product ${pid} quantity updated (now: ${quantity}).`})
    } catch (error) {
        return res.status(500).send({ ERROR: `${error.message}` })
    }

})
