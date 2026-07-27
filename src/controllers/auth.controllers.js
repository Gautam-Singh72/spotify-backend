const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

async function registerUser(req, res){

    const {username, email, password, role="user"}= req.body;

    const isUserExist=await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    if(isUserExist){
        return res.status(409).json({ //409 conflict
            message: "User already exists"
        })
    }

    //hash the password to maintain security of the user data in database
    const hash=await bcrypt.hash(password, 10);

    const user=await userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const token=jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("jwt", token); //store the token in cookie storage of browser

    res.status(201).json({
        message: "User registered successfully",
        token: token,
    })
}

async function loginUser(req, res){

    const {username, email, password}=req.body;

    const isUserExist=await userModel.findOne({
        $or: [
            {username: username},
            {email: email}
        ]
    })

    // console.log(isUserExist);
    if(!isUserExist){
        return res.status(401).json({ //401 unauthorized
            message: "user is not registered"
        })
    }

    const isPasswordValid=await bcrypt.compare(password, isUserExist.password);
    // console.log(isPasswordValid);
    if(!isPasswordValid){
        return res.status(401).json({
            message: "invalid password"
        })
    }

    const token = jwt.sign({
        id: isUserExist._id,
        role: isUserExist.role
    }, process.env.JWT_SECRET);

    res.cookie("jwt", token);

    res.status(200).json({ //200 ok
        message: "user logged in successfully",
        // user: isUserExist
    });

}

async function logoutUser(req, res){

    res.clearCookie("jwt");

    return res.status(200).json({
        message: "user logged out successfully"
    });
}

module.exports={registerUser, loginUser, logoutUser};