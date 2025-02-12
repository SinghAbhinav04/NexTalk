const jwt = require("jsonwebtoken")
const JWT_SECRET = "alphabeta"


function authenticateJWT(req,res,next){
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token){
        return res.status(403).json({message:"Access denied"})
    }

    jwt.verify(token , JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:"Invalid or expired token"})
        }
        req.user = decoded
        next();
    })

}

module.exports = authenticateJWT