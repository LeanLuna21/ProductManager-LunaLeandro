import { Schema, model } from 'mongoose';

const productosColeccion = 'productos'; //nombre de la coleccion en la DB

const productoEsquema = new Schema(
    {
        id: {
            type: Number,
            unique: true,
            required: true
        },
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
            type: Boolean
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
        timestamps: true
    }
);

export const productosModelo = model(productosColeccion, productoEsquema);
