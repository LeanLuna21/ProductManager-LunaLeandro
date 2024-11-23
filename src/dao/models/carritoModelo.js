import { Schema, model } from 'mongoose'
import paginate from "mongoose-paginate-v2"

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
        strictPopulate: false
        // strict: true
    })

// carritoEsquema.plugin(paginate)

export const carritosModelo = model("carritos", carritoEsquema);