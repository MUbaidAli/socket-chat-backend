const Message = require("../model/message")
const User = require("../model/user")
const { asyncHandler } = require("../utils/errors")

const getAllUsers = asyncHandler( async (req,res)=>{

        const users = await User.find()

        res.status(200).send({message:"All users Fetched" , data:users})

})



const getSingleChat =  asyncHandler(async (req,res) =>{

        const {receiverId,senderId} = req.params


        console.log("chat running")
            const chatHistory = await Message.find({chatType:"private",

                $or:[
                    {sender:senderId, receiver:receiverId},
                    {sender:receiverId, receiver:senderId}
                ]
            }).sort({createdAt:1})
            .populate("sender" , "username  profileUrl")
            .populate("receiver" , "username profileUrl")


console.log(chatHistory, "history")

            res.status(200).send({message:"chat retrived" , data:chatHistory , success:true})


})




module.exports = {getAllUsers,getSingleChat}