const express = require("express");
const { getAllUsers, getSingleChat } = require("../controllers/message.controller");
const router = express.Router();


router.get("/users" , getAllUsers);
router.get("/chat/:senderId/:receiverId" , getSingleChat)  




module.exports = router