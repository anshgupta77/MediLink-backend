import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import http from 'http';
import { Server } from 'socket.io';
import adminRouter from './routers/adminRoute.js';
import doctorRouter from './routers/doctorRoute.js';
import userRouter from './routers/userRoute.js';
import chatRouter from './routers/chatRoute.js';
import Message from './models/MessageModel.js';

// app config
const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middleware
app.use(cors());
app.use(express.json());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

const io = new Server(server, {
  cors: {
      origin: '*',
      methods: ['GET', 'POST']
  }
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  // Add user to the online list
  socket.on('clientOnline', ({clientId, doctorName}) => {
    onlineUsers.set(clientId, socket.id);
    console.log(onlineUsers, `${clientId} is online and name of the doctor ${doctorName}`);
  });


  // Handle Sending Messages
  socket.on('sendMessage', async ({senderId, receiverId, message, timestamp, sender}) => {
    console.log("New message received:", { senderId, receiverId, message, timestamp, sender });
    try {
      // Send message to the receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { senderId, receiverId, message, timestamp, sender});
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
   
  });

  // Remove user when disconnected
  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`${userId} disconnected`);
      }
    }
  })
});

app.get('/', (req, res) => {
  res.status(200).send('Api is running');
});

// listen
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    }
);