import { Router } from 'express';
import ProductManager from '../dao/ProductMongoManager.js';
//middleware para checkear el id que llega por parámetro
import { pidCheck } from '../middlewares/idCheck.js';

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

router.get("/:pid", pidCheck, async (req, res) => {
    if (!isValidObjectId(req.pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let producto = await ProductManager.getProductById(req.pid)
        if (!producto) {
            return res.status(404).send({ ERROR: `product of id ${req.pid} NOT FOUND.` })
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
        let id = 1
        if(productos.length>0){
            id=productos[productos.length - 1].id + 1
        }
        let newProduct = { id, title, description, code, price, status, stock, category, thumbnail }
        await ProductManager.addProduct(newProduct)
        req.io.emit("newProduct", newProduct)
        return res.status(201).json({ newProduct })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }

})

router.put("/:pid", pidCheck, async (req, res) => {
    if (!isValidObjectId(req.pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    let product = await ProductManager.getProductById(req.pid)
    if (!product) {
        return res.status(404).send({ ERROR: `product of id ${req.pid} NOT FOUND.` })
    }

    let fields = req.body

    try {
        await ProductManager.updateProduct(req.pid, fields)
        return res.status(200).send({ CONFIRMATION: `Product ${req.pid} updated!` })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })

    }
}
)

router.delete("/:pid", pidCheck, async (req, res) => {
    if (!isValidObjectId(req.pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `Invalid Product ID!` })
    }
    try {
        let product = await ProductManager.getProductById(req.pid)
        if (!product) {
            return res.status(404).send({ ERROR: `product of id ${req.pid} NOT FOUND.` })
        }
        await ProductManager.deleteProduct(req.pid)
        req.io.emit("deleteProduct", product)

        return res.status(200).send({ CONFIRMATION: "Product deleted!" })

    } catch (err) {
        return res.status(500).send({ ERROR: `${err.message}` })
    }
})



