import { carritosModelo } from "./models/carritoModelo.js"

export default class CartManager {
    static async getCarts() {
        return await carritosModelo.find().lean()
    }

    static async getCartById(cartID) {
        let cart = await carritosModelo.findOne({ id: cartID })
        if (!cart) {
            return
        }
        return cart
    }

    static async createCart() {
        let carts = await this.getCarts()
        let id = 1
        if (carts.length > 0) {
            id = Math.max(...carts.map(cart => cart.id)) + 1
        }
        let orders = []
        let cart = { id: id, products: orders }
        let newCart = await carritosModelo.create(cart)

        return newCart.toJSON()
    }

    static async addOrderToCart(cartID, productID) {
        let cart = await this.getCartById(cartID)
        let quantity = 1

        let prodInCart = cart.products.find(prod => prod.product === productID)
        if (prodInCart) {
            cart.products.forEach(prod => {
                if (prod.product === productID) {
                    ++prod.quantity
                }
            });
        } else {
            cart.products.push(
                {
                    product: productID,
                    quantity: quantity
                }
            )
        }
        return await carritosModelo.findOneAndUpdate({ id: cartID }, cart, { new: true })
    }

    static async updateCartProduct(cartID,productID,quantity) {
        let cart = await this.getCartById(cartID)
        let prodIndex = cart.products.findIndex(p => p.product === productID)

        cart.products[prodIndex].quantity = quantity
                                                        // $set -> operador para  reemplazar el valor de un campo con el valor especificado 
        await carritosModelo.findOneAndUpdate({ id: cartID }, { $set: { products: cart.products } }, { new: true })
    }

    static async emptyCart(cartID) {
        let cart = this.getCartById(cartID)
        cart.products = []
        await carritosModelo.updateOne({ id: cartID }, cart, { new: true })
        return cart
    }

    static async removeProduct(cartID, productID) {
        let cart = await this.getCartById(cartID)

        let prodIndex = cart.products.findIndex(p => p.product === productID)
        if (prodIndex === -1) {
            return 
        }
        cart.products.splice(prodIndex, 1)
                                                        // $set -> operador para  reemplazar el valor de un campo con el valor especificado 
        await carritosModelo.findOneAndUpdate({ id: cartID }, { $set: { products: cart.products } }, { new: true })
    }
}

