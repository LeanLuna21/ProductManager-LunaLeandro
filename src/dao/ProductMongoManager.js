
import { productosModelo } from "./models/productoModelo.js"

export default class ProductManager {
    static async getProducts(page = 1, limit = 10, categoryFilter = null, sortOrder  = "ASC") {

        const filter = {}
        if (categoryFilter) {
            filter.category = { $regex: categoryFilter, $options: "i" } // Case-insensitive regex for category
        }
        const sort = { price: sortOrder.toUpperCase() === "ASC" ? 1 : -1 }

        return await productosModelo.paginate(
            filter,
            { page, limit, lean: true, sort:sort }
        )
    }

    static async addProduct(prod = {}) {
        return await productosModelo.create(prod)
    }

    static async getProductById(productID) {
        return await productosModelo.findById(productID)
    }

    static async updateProduct(productID, newFields) {
        return await productosModelo.findOneAndUpdate({ _id: productID }, newFields, { new: true })
    }

    static async deleteProduct(productID) {
        return await productosModelo.findOneAndDelete({ _id: productID })
    }
}