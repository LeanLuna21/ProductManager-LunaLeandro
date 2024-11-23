
import { productosModelo } from "./models/productoModelo.js"

export default class ProductManager {
    static async getProducts() {
        return await productosModelo.find().lean()
    }

    static async addProduct(prod = {}) {
        let newProduct = await productosModelo.create(prod)
        return newProduct.toJSON()
    }

    static async getProductById(productID) {
        //buscar en el arreglo el producto que coincida con el id, si no, error::NOT FOUND
        let product = await productosModelo.findOne({ id: productID })
        if (!product) {
            return
        }
        return product
    }

    static async updateProduct(productID, newFields) {
        if ('id' in newFields) {
            delete newFields.id; // Ignora el cambio de id
        }
        return await productosModelo.findOneAndUpdate({ id:productID }, newFields, { new: true })
    }

    static async deleteProduct(productID){
       return await productosModelo.findOneAndDelete({ id:productID })
    }
}