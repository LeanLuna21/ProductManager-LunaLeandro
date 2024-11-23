import { Schema, model } from 'mongoose'

const carritoEsquema = new Schema(
    {
        // id: Number,
        products: {
            type: [
                {
                    // product: Number,
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "productos"
                    },
                    quantity: Number
                }
            ]
        }
    },
    {
        timestamps: true,
        strict: true
    })

export const carritosModelo = model("carritos", carritoEsquema);

carritoEsquema.pre("find", function(){
    this.populate("products.product").lean()
})
carritoEsquema.pre("findOne", function(){
    this.populate("products.product").lean()
})