export const idCheck= async(req, res, next)=>{
       
    let {pid} = req.params
    req.pid = Number(pid)

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    else{
        next()
    }
}
