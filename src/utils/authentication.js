const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
cookieParser = require('cookie-parser')
// hash Password
const hashPassword = async (password) => {
const hashed = await bcrypt.hash(password, 12);
return hashed;

}

// compare password

const comparePassword = async (password  , dbPassword)=>{

const compared = await bcrypt.compare(password , dbPassword);
return compared

}



// generate token

const genToken =  async (payload) =>{

    const token  = jwt.sign(payload , process.env.JWT_SECRET ,{expiresIn:"7d"})
return token;

}


const sendCookies = (res,token) =>{
     return res.cookie('token', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expires after 15 minutes (in milliseconds)
        httpOnly: true,  // Prevents client-side JS from accessing the cookie
        secure: true,    // Requires HTTPS
        sameSite: 'strict'
    });


}


module.exports = {hashPassword, comparePassword,genToken,sendCookies }