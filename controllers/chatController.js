import Message from "../models/MessageModel.js";

const sendMessage = async (req, res) => {
  const { senderId, receiverId, message, timestamp, sender } = req.body;

  try {
    const newMessage = new Message({ senderId, receiverId, message, timestamp, sender });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Message could not be sent" });
  }
}

const getAllMessages = async (req, res) => {
    console.log(req.params.senderId, req.params.receiverId);
    try {
      const messages = await Message.find({
        $or: [
          { senderId: req.params.senderId, receiverId: req.params.receiverId },
          { senderId: req.params.receiverId, receiverId: req.params.senderId }
        ]
      }).sort({ timestamp: 1 });
  
      res.json({success : true, messages: messages});
    } catch (error) {
      res.status(500).json({ error: "Could not fetch messages" });
    }
  }

export { sendMessage, getAllMessages };

