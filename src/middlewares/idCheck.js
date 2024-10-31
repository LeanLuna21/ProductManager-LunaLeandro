export const idCheck= async(req, res, next)=>{
    
    console.log("entramos al middleware")
    
    let {pid} = req.params
    console.log(pid)

    req.pid = Number(pid)
    console.log(req.pid)
    
    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    else{
        next()
    }
}
