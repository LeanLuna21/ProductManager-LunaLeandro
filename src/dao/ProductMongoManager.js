
import { productosModelo } from "./models/productoModelo.js"

export default class ProductManager {
    static async getProducts() {
        return await productosModelo.find().lean()
    }

    static async addProduct(prod = {}) {
        return await productosModelo.create(prod)
    }

    static async getProductById(productID) {
        return await productosModelo.findById(productID)
    }

    static async updateProduct(productID, newFields) {
        return await productosModelo.findOneAndUpdate({ _id:productID }, newFields, { new: true })
    }

    static async deleteProduct(productID){
       return await productosModelo.findOneAndDelete({ _id:productID })
    }
}