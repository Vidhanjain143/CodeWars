require('dotenv').config()
const mongoose=require('mongoose')
const {v4:uuidv4}=require('uuid')
const port = process.env.PORT || 5000;
const Room=require('./models/Room');
const {Easy}=require('./models/Problem')
const {Medium}=require('./models/Problem')
const {Hard}=require('./models/Problem')
const cors=require('cors')
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
mongoose.connect(process.env.MONGO_DB_URI)
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
    },
});
const users = {};
app.post('/create-room',async (req,res)=>{
    try{
        const {category}=req.body;
        const roomid=uuidv4();
        const newRoom=await Room.create({
            roomId:roomid,
            problems:[1,2,3],
        });
        res.json(newRoom);
    }catch(err){
        console.log("Room error=> ",err);
    }  
})
io.on('connection',(socket)=>{
    socket.on('join-room',({id,userName,userid})=>{
        users[userid]={socketid:socket.id,userName:userName};
        socket.join(id);
        console.log(`User ${userName} joined room ${id}`)
        const message = {
            userId:1,
            text: `${userName} joined the room 🔥`,
            timestamp: new Date().toISOString(),
          };
        io.to(id).emit('chat-message',message);
        io.to(id).emit('active-users', Object.values(users).map(user => ({ userName: user.userName })));
    }
    )
    socket.on('send-chat-message',(message)=>{
        io.emit('chat-message',message);
    })

    socket.on('disconnect',()=>{
        const userName = Object.keys(users).find(key => users[key].socketid === socket.id);
        if (userName) {
          console.log(`User ${userName} left`);
          delete users[userName];
        }
    })
})
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





