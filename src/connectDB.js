import mongoose from "mongoose"
import { productosModelo } from "./dao/models/productoModelo.js"

export const conectarDB=async(url, db)=>{
    try {
        await mongoose.connect(
            url, 
            {
                dbName: db
            }
        )
        console.log(`DB CONNECTED - online!`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}

export const populateDB=async(url, db)=>{
    try {
        await mongoose.connect(
            url,
            {dbName:db}
        )     
        let productos = [
                {
                  "title": "Premium Sports Shoes",
                  "description": "High-quality sports product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE100",
                  "price": 175,
                  "stock": 49,
                  "category": "Sports"
                },
                {
                  "title": "Luxury Home Blanket",
                  "description": "High-quality home product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE101",
                  "price": 53,
                  "stock": 26,
                  "category": "Home"
                },
                {
                  "title": "Organic Face Cream",
                  "description": "High-quality beauty product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE102",
                  "price": 139,
                  "stock": 85,
                  "category": "Beauty"
                },
                {
                  "title": "Classic Hardcover Book",
                  "description": "High-quality books product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE103",
                  "price": 58,
                  "stock": 85,
                  "category": "Books"
                },
                {
                  "title": "Interactive Toy Robot",
                  "description": "High-quality toys product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE104",
                  "price": 160,
                  "stock": 85,
                  "category": "Toys"
                },
                {
                  "title": "Inspirational Book Set",
                  "description": "High-quality books product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE105",
                  "price": 113,
                  "stock": 6,
                  "category": "Books"
                },
                {
                  "title": "Professional Sports Jersey",
                  "description": "High-quality sports product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE106",
                  "price": 194,
                  "stock": 85,
                  "category": "Sports"
                },
                {
                  "title": "Adjustable Dumbbells Set",
                  "description": "High-quality sports product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE107",
                  "price": 181,
                  "stock": 61,
                  "category": "Sports"
                },
                {
                  "title": "Wireless Headphones",
                  "description": "High-quality electronics product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE108",
                  "price": 84,
                  "stock": 44,
                  "category": "Electronics"
                },
                {
                  "title": "Ultra-Soft Bath Towels",
                  "description": "High-quality home product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE109",
                  "price": 90,
                  "stock": 54,
                  "category": "Home"
                },
                {
                  "title": "Puzzle Game Set",
                  "description": "High-quality toys product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE110",
                  "price": 140,
                  "stock": 71,
                  "category": "Toys"
                },
                {
                  "title": "Cotton T-Shirt Pack",
                  "description": "High-quality clothing product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE111",
                  "price": 98,
                  "stock": 46,
                  "category": "Clothing"
                },
                {
                  "title": "4K Smart TV",
                  "description": "High-quality electronics product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE112",
                  "price": 188,
                  "stock": 28,
                  "category": "Electronics"
                },
                {
                  "title": "Yoga Mat",
                  "description": "High-quality sports product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE113",
                  "price": 157,
                  "stock": 82,
                  "category": "Sports"
                },
                {
                  "title": "Winter Jacket",
                  "description": "High-quality clothing product, perfect for your needs. Designed with care and durability in mind.",
                  "code": "CODE114",
                  "price": 133,
                  "stock": 61,
                  "category": "Clothing"
                }
        ]
        console.log(productos)
        productos = productos.map((producto, id) => producto = { id: id += 1, ...producto } )
        await productosModelo.deleteMany()
        productos = await productosModelo.insertMany(productos)
        
        console.log(`DB POPULATED...!!!`)
        process.exit()
    } catch (error) {
        console.log(`Error: ${error.message}`)
    }
}