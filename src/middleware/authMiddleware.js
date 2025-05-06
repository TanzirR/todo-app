import jwt from 'jsonwebtoken'

//for every network requests, verify the user token is correct

function authMiddleware(req, res, next){
    //read the token from the heads of the incoming request
    const token = req.headers['authorization']

    if (!token){
        return res.status(401).send({message: "No token provided"})
    }
    //Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).send({message:"Invalid token"})
        }
        req.userId = decoded.id
        next()
    })

}

export default authMiddleware
