const { asyncHandler, AppError } = require('../utils/errors');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const protect =  asyncHandler( async (req,res,next) => {

    // const header = req.headers.cookie;

    let token;

    // console.log(req.headers, "cook")

    // 1. Check for token in cookies first, then fallback to the Authorization header
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }else if(req.headers && req.headers.cookie){
        token = req.headers.cookie  .split("=")[1]
    }
    
    // console.log(token)
    // console.log("checkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    // 2. Return an error if no token is found
    if (!token) {
        throw new AppError(401, 'Not authorized to access this resource. Please log in.');
    }

    try {
        // 3. Verify the token signature using your environment secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Check if the user associated with the token still exists in the database
        const currentUser = await User.findById(decoded.id).select('-password'); // Exclude password from selection
        
        if (!currentUser) {
            throw new AppError(401, 'The user belonging to this token no longer exists.');
        }

        // 5. Grant access: Attach the user profile payload to the request object
        req.user = currentUser;
        next();
        
    } catch (error) {
        // Handle expired tokens or bad signatures gracefully
        if (error.name === 'TokenExpiredError') {
            throw new AppError(401, 'Your session has expired. Please log in again.');
        }
        throw new AppError(401, 'Invalid token. Authorization denied.');
    }
});



module.exports = protect;