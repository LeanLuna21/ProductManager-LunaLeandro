
import { productosModelo } from "./models/productoModelo.js"

export default class ProductManager {
    static async getProducts(page=1, limit=4) {
        return await productosModelo.paginate(
            {},   // filtro válido de mongodb, por ej: {code:{$gt:2500}}
            {page, limit, lean:true, sort:{code:1}}
        )
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