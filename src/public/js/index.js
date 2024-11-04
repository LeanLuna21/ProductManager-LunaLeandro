const socket=io()
const ulprod=document.querySelector("#productos")

socket.on("newProduct", prod=>{
    let liprod = document.createElement("li")
    liprod.id = `${prod.code}`
    liprod.innerHTML = `${prod.title} - ${prod.price}`
    ulprod.append(liprod)
})

socket.on("deleteProduct", prod=>{
    let liprod = document.querySelector(`#${prod.code}`)
    ulprod.removeChild(liprod)
})
