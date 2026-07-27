const jwt=require("jsonwebtoken");

async function authArtist(req, res, next){
    const token=req.cookies.jwt;
    
    if(!token){
        return res.status(401).json({
            message: "unauthorized"
        })
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "artist"){
            return res.status(403).json({ //403 forbidden
                message: "you are not allowed to create album"
            });
        }
        req.decoded=decoded;
    
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({
            message: "unauthorized"
        })
    }
}

async function authUser(req, res, next){

    const token=req.cookies.jwt;

    if(!token){
        return res.status(401).json({
            message: "unauthorized"
        });
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role !== "user" && decoded.role !== "artist"){
            return res.status(403).json({
                message: "you are not allowed to fetch music"
            });
        }

        req.decoded=decoded;

        next()
    }catch(err){
        console.log(err);
        res.status(401).json({
            message: "unauthorized"
        });
    }
}

module.exports={authArtist, authUser};