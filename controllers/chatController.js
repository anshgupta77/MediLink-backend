import Message from "../models/MessageModel.js";

const sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  try {
    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Message could not be sent" });
  }
}

const getAllMessages = async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: req.params.senderId, receiverId: req.params.receiverId },
          { senderId: req.params.receiverId, receiverId: req.params.senderId }
        ]
      }).sort({ timestamp: 1 });
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Could not fetch messages" });
    }
  }

export { sendMessage, getAllMessages };

