const {asyncHandler} = require("../utils/errors")
const userSchema = require("../validations/userValidation")
const {AppError} = require("../utils/errors")
const { hashPassword, genToken, sendCookies, comparePassword } = require("../utils/authentication")
const User = require("../model/user")

const registerUser = asyncHandler(async (req,res)=>{
    const body = req.body

    const isUserExist = await  User.findOne({username:body.email})

    if(isUserExist){
        throw new AppError(402, "Email Already Exist" )
}

    const hashedPassword = await hashPassword(body.password)

    
    // validation       
    // console.log(body)
    const data = await User.create({...body , password:hashedPassword})
    const token = await genToken({id:data.id,username:data.username})

    await sendCookies(res,token)    

    res.status(201).send({message:"Acocunt Created Successfully" , success:true,data,token})

})



// login user

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Check if both email and password are provided
    if (!email || !password) {
        throw new AppError(400, "Please provide email and password");
    }

    // 2. Find user by email (matching your schema's 'username' field mapping)
    const user = await User.findOne({ email: email });
        console.log(user)
    // 3. Verify user existence and password validity
    // Assumes your authentication utility exports a password comparison function
    if (!user || !(await comparePassword(password, user.password))) {
        throw new AppError(401, "Invalid email or password");
    }

    // 4. Generate the JWT token
    const token = await genToken({ id: user.id, username: user.username });

    // 5. Send cookie to the client
    await sendCookies(res, token);

    // 6. Respond with success (excluding the password from response data if desired)
    res.status(200).send({
        message: "Logged in successfully",
        success: true,
        data: {
            id: user.id,
            username: user.username
            // Add any other user details you want to return here
        },
        token
    });
});


const me =   asyncHandler( async (req,res) =>{

const user =  req.user
// console.log(user, "userrrrrrrrrrrr")

res.status(200).send({message:"user Data" , success:true, data:user,})
})



module.exports = {registerUser, loginUser,me}