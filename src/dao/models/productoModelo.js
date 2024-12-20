import { Schema, model } from 'mongoose'
import paginate from "mongoose-paginate-v2"

const productosColeccion = 'productos'; //nombre de la coleccion en la DB

const productoEsquema = new Schema(
    {
        title: {
            type: String,
            required: [true, `El nombre del producto es obligatorio`]
        },
        description: {
            type: String,
        },
        code: {
            type: String,
            unique: true
        },
        price: {
            type: Number
        },
        status: {
            type: Boolean,
            default: true    
        },
        stock: {
            type: Number
        },
        category: {
            type: String
        },
        thumbnail: {
            type: String,
            default: "Sin imagen"
        },
        fechaAlta: {
            type: Date,
            default: Date.now()
        }
    },
    {
        timestamps: true,
        // strict: true
    }
);

productoEsquema.plugin(paginate)

export const productosModelo = model(productosColeccion, productoEsquema);
