import { carritosModelo } from "./models/carritoModelo.js"

export default class CartManager {
    static async getCarts() {
        return await carritosModelo.find().populate({
            path: "products.product"
        }).lean()
    }

    static async getCartById(cartID) {
        return await carritosModelo.findById(cartID).populate({
            path: "products.product"
        }).lean()
    }

    static async createCart() {
        let orders = []
        let cart = { products: orders }
        return await carritosModelo.create(cart)
    }

    static async addOrderToCart(cart, product) {
        if (cart.products.find(prod => prod.product.equals(product._id))) {
            cart.products.forEach(prod => {
                if (prod.product.equals(product._id)) {
                    ++prod.quantity
                }
            })
        }
        else {
            cart.products.push(
                {
                    product: product._id,
                    quantity: 1
                }
            )
        }
        return await carritosModelo.findOneAndUpdate({ _id: cart._id }, cart, { new: true })
    }

    static async updateCartProduct(cart, productID, quantity) {
        let prodIndex = cart.products.findIndex(prod => prod.product.equals(productID))

        cart.products[prodIndex].quantity = quantity
        // $set -> operador para  reemplazar el valor de un campo con el valor especificado 
        await carritosModelo.findByIdAndUpdate(cart._id, { $set: { products: cart.products } }, { new: true })
    }

    static async emptyCart(cartID) {
        return await carritosModelo.findByIdAndUpdate(cartID, {$set: { products: [] }}, { new: true })
    }

    static async removeProduct(cart, productID) {
        let prodIndex = cart.products.findIndex(p => p.product.equals(productID))
        if (prodIndex === -1) {
            return
        }
        cart.products.splice(prodIndex, 1)
                                            // $set -> operador para  reemplazar el valor de un campo con el valor especificado 
        return await carritosModelo.findByIdAndUpdate(cart._id, { $set: { products: cart.products } }, { new: true })
    }
}

