import express from "express";
import { sendMessage, getAllMessages } from "../controllers/chatController.js";
const router = express.Router();

// 📩 Send a Message
router.post("/sendMessage", sendMessage);

// 📩 Get Messages Between Two Users
router.get("/:senderId/:receiverId", getAllMessages);

export default router;
