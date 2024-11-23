import { Schema, model } from 'mongoose'

export const carritosModelo = model(
    'carritos',
    new Schema(
        {
            id: Number,
            products: {
                type: [
                    { 
                        product: Number, 
                        quantity: Number
                    }
                ]
            }
        },
        {
            timestamps:true
        }
    )
)