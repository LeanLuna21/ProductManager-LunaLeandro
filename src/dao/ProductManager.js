import fs from "fs"

export default class ProductManager{
    #path = ""
    constructor(filePath){
        this.#path = filePath 
    } 
    
    async getProducts(){
        let check_file = fs.existsSync(this.#path)
        // console.log(this.#path);
        // console.log(check_file);

        if (check_file) {
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        } else {
            return []
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        // validar que no lleguen campos vacios
        if (!title || !description || !price || !thumbnail || !code || !stock){
            console.log(`Error: All fields are required to be complete.`)
            return
        }

        let productos = await this.getProducts()

        // Validar que no se repita el campo “code” y que todos los campos sean obligatorios
        if (productos.find(prod => prod.code === code)){
            console.log(`Error: Product code ${code} already exists.`);
            return
        }
        // se crea con un id autoincrementable
        let id = productos.length+1

        let newProduct = {id, title, description, price, thumbnail, code, stock}
    
        productos.push(newProduct)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 4))

        return newProduct
    }


    async #checkProductID(productID){
        let productos = await this.getProducts()
        return productos.findIndex(prod => prod.id === productID)
    }

    async getProductById(productID){
        //buscar en el arreglo el producto que coincida con el id, si no, error::NOT FOUND
        let productos = await this.getProducts()
        let productIndex = await this.#checkProductID(productID)
        if (productIndex === -1){
            return 
        }
        return productos[productIndex]
    }

    async updateProduct(productID, newFields){
        let productos = await this.getProducts()
        let product = productos.find(prod => prod.id === productID)
        if (!product){
            console.log(`Error: Product of id '${productID}' NOT FOUND.`)
            return
        }
        if ('id' in newFields) {
            delete newFields.id; // Ignora el cambio de id
        }
        Object.assign(product, newFields)
        
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 4))

        console.log(`Product ${productID} updated`)
        return product
    }

    async deleteProduct(productID){
        let productos = await this.getProducts()
        let productIndex = await this.#checkProductID(productID)
        if (productIndex === -1){
            console.log(`Error: Product does not exist.`)
            return
        }
        productos = productos.filter(prod => prod.id !== productID)
    
        await fs.promises.writeFile(this.#path, JSON.stringify(productos, null, 4))
        console.log('Product deleted!')

        return
    }
}