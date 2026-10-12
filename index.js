require("dotenv").config()
const express = require("express")
const http = require("http")
const {Server} = require("socket.io")
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", credentials: true },
})
const cors = require("cors")
const {notFound, errorHandler} = require("./src/middleware/errorHandler")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({origin:"http://localhost:3000",credentials: true }))
// api routes 
const userService = require("./src/routes/user.route")
const messageService = require("./src/routes/message.route")
const connectDB = require("./src/config/connectDB")
const Message = require("./src/model/message")
connectDB()

// REST API endpoint

app.get("/api/health", (req, res) => {   
    res.status(200).json({message: "Server is running"})

 })



 app.use("/api"  , userService)
 app.use("/api"  , messageService)




// Socket.IO connection


const userSockets = new Map();

io.on("connection" , (socket)=>{
    console.log(socket.id , "User socket connected");

    // Must be called by your client context on mount!
    socket.on("login" , (userId)=>{
        if (!userId) return;
        userSockets.set(String(userId), socket.id);     
        socket.userId = String(userId);
        console.log(`User ${userId} authenticated on socket ${socket.id}`);
    });

    // 1. Destructured payload argument to match Frontend's object format
    socket.on("private-message" , async (payload) => {
        try {
            const { receiverId, text } = payload || {};
            
            // Debug logs to trace failure locations
            console.log("Sender Socket UserID:", socket.userId);
            console.log("Incoming Recipient ID:", receiverId);
            console.log("Incoming Message Body:", text);

            if(!socket.userId || !receiverId || !text?.trim()) {
                console.warn("Message blocked: Missing sender, recipient, or text body.");
                return;
            }
                    
            // Ensure field assignments match your Mongo Model keys 
            // Note: Your schema model query used `message` field, but earlier files used `chatType` / `text`
            const message = await Message.create({
                sender: socket.userId,
                receiver: receiverId,
                message: text.trim() // Verify if your model schema uses 'message' or 'text'!
            });

            const populated = await Message.findById(message.id)
                .populate("sender", "username profileUrl")
                .populate("receiver", "username profileUrl");    
            
            // Echo back to the sender client
            socket.emit("private-message", populated);

            // Forward message to target recipient
            const receiverSocket = userSockets.get(String(receiverId));
            if(receiverSocket){
                io.to(receiverSocket).emit("private-message", populated);
                console.log(`Message successfully routed to socket: ${receiverSocket}`);
            } else {
                console.log(`Recipient ${receiverId} is offline. Message saved to DB.`);
            }

        } catch(err) {
            // 3. Keep error logs visible so you can spot validation crashes
            console.error("Database or execution error in private-message:", err);
        }
    });

    // Clean up maps when user tabs close or disconnect
    socket.on("disconnect", () => {
        if (socket.userId) {
            userSockets.delete(socket.userId);
            console.log(`User ${socket.userId} cleared from registry.`);
        }
    });
});


// const userSockets = new Map();

// // const userSocket = {}
// io.on("connection" , (socket)=>{
//     // associate userId with socket
//         console.log(socket.id , "socketttt")
//             socket.on("login" , (userId)=>{
//                 // console.log(userId)
//                userSockets.set(String(userId) , socket.id)     
//                 socket.userId  = String(userId)
//                 // console.log(socket)
//             })

//     // one on one chat
//             socket.on("private-message" , async (receiverId , text )=>{
//                 try{

                    
//                     if(!socket.userId || !receiverId || !text.trim()) return;
                    
//                     console.log(receiverId , text)
//                     const message = await Message.create({sender:socket.userId,receiver:receiverId,message:text.trim()})

//                     const populated = await Message.findById(message.id).populate("sender" , "username profileUrl").populate("receiver" , "username profileUrl")    
//                         socket.emit("private-message" , populated);

//                         const receiverSocket = userSockets.get(receiverId);

//                         if(receiverSocket){
//                             io.to(receiverSocket).emit("private-message" , populated)
//                         }
                        



//                 }   catch(err){
//                     console.log()
//                 }
                    



//             })

            
    // users message and data > check>  save db > populate > emit > check if user is online then send message 



// })





// userId -> socketId
// const userSockets = new Map();


// io.on("connection" ,(socket)=>{
//     console.log("userId")

//     socket.on("login" , (userId)=>{
//         console.log(userId , "user Id")
//         userSockets.set(String(userId),socket.id );
//         socket.userId = String(userId)
//         console.log(socket)
//     })

//     socket.on("private-message" , async ({receiverId , text})=>{
//         if(!receiverId && !text.trim() && !socket.userId) return;


//         const message = await Message.create({sender:sicket.userId,receiver:receiverId,message:text})

//         const populated = await Message.findById(message.id).populate("sender" , "username  profileUrl").populate("reciver" , "username profileURL")

//             socket.emit("private-message" , populated)

//             const receiverSocket = userSockets.get(String(receiverId))
//             if(receiverSocket){
//                 io.to(receiverSocket).emit("private-message" , populated)
//             }

        

//     })


// })






app.use(errorHandler);
app.use(notFound);


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
}   )