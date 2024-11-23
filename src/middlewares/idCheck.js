export const pidCheck = async(req, res, next)=>{
       
    let {pid} = req.params
    req.pid = Number(pid)

    if (isNaN(pid)){
        return res.status(400).send({ERROR:"product id must be number."})
    }
    else{
        next()
    }
}

export const cidCheck = async(req, res, next)=>{
       
    let {cid} = req.params
    req.cid = Number(cid)

    if (isNaN(cid)){
        return res.status(400).send({ERROR:"cart id must be number."})
    }
    else{
        next()
    }
}
