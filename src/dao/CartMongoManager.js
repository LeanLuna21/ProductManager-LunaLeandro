import { carritosModelo } from "./models/carritoModelo.js"

export default class CartManager{
    static async getCarts(){
        return await carritosModelo.find().lean()
    }

    static async getCartById(cartID){
        let cart = await carritosModelo.findOne( {id:cartID} )
        if (!cart) {
            return
        }
        return cart
    }

    static async createCart() {
        let carts = await carritosModelo.find().lean()
        let id = 1
        if(carts.length>0){
            id=Math.max(...carts.map(cart=>cart.id))+1
        }
        let orders = []
        let cart = {id:id,products:orders}
        let newCart = await carritosModelo.create(cart)

        return newCart.toJSON()
    }

    static async addOrderToCart(cartID, productID){
        let cart = await this.getCartById(cartID)
        let quantity = 1
        
        let prodInCart = cart.products.find(prod => prod.product === productID)
        if (prodInCart){
            cart.products.forEach(prod => {
                if (prod.product === productID){
                    ++prod.quantity 
                }             
            });
        } else {
            cart.products.push(
                {
                    product:productID,
                    quantity:quantity
                }
            )
        }
        console.log(cart)
        return await carritosModelo.findOneAndUpdate({ id:cartID }, cart, { new: true })
    }
}

