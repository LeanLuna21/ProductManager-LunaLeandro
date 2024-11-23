import { Router } from 'express';
import ProductManager from '../dao/ProductMongoManager.js';

import { isValidObjectId } from 'mongoose';

export const router = Router()

router.get('/', async (req, res) => {
    try {
        let productos = await ProductManager.getProducts()
        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({ productos })
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ error: `${error.message}` })
    }

})

router.get("/:pid", async (req, res) => {
    let {pid} = req.params
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let producto = await ProductManager.getProductById(pid)
        if (!producto) {
            return res.status(404).send({ ERROR: `product of id ${pid} NOT FOUND.` })
        }
        return res.status(200).json(producto)

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})

router.post("/", async (req, res) => {
    let {title, description, code, price, status, stock, category, thumbnail } = req.body
    // Validar que ninguno de los campos llegue vacio
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send({ ERROR: `Missing required fields. ${req.params}` })
    }
    try {
        let productos = await ProductManager.getProducts()
        let existe = productos.find(prod => prod.code === code)
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe un prod con codigo ${code}` })
        }
        let newProduct = { title, description, code, price, status, stock, category, thumbnail }
        let productAdded = await ProductManager.addProduct(newProduct)
        req.io.emit("newProduct", productAdded)
        return res.status(201).json({ productAdded })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }

})

router.put("/:pid", async (req, res) => {
    let {pid} = req.params
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    let product = await ProductManager.getProductById(pid)
    if (!product) {
        return res.status(404).send({ ERROR: `product of id ${pid} NOT FOUND.` })
    }

    let fields = req.body

    try {
        let product_u = await ProductManager.updateProduct(pid, fields)
        return res.status(200).json({ CONFIRMATION: `Product ${pid} updated!`, prod_updated:product_u })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })

    }
}
)

router.delete("/:pid", async (req, res) => {
    let {pid} = req.params
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let product = await ProductManager.getProductById(pid)
        if (!product) {
            return res.status(404).send({ ERROR: `product of id ${pid} NOT FOUND.` })
        }
        await ProductManager.deleteProduct(pid)
        req.io.emit("deleteProduct", product)

        return res.status(200).json({ CONFIRMATION: "Product deleted!", prod_deleted:product })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})



