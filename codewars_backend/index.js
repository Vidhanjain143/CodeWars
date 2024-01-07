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
app.use(express.urlencoded({ extended: true }));
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
const readyUser={};
let startTime;
const time={ "easy":20,"medium":30,"hard":45};
app.post('/create-room',async (req,res)=>{
    try{
        const {category}=req.body;
        const roomid=uuidv4();
        const newRoom=await Room.create({
            roomId:roomid,
            category:category,
            problems:[1,2],
        });
        res.json(newRoom);
    }catch(err){
        console.log("Room error=> ",err);
    }  
})
app.get('/get-room',async(req,res)=>{
    const roomId=req.query.roomId;
    const room=await Room.findOne({roomId:roomId})
    res.send(room);
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
    socket.on('user-ready',({userId,roomId,category})=>{
        if(!readyUser[roomId])
        readyUser[roomId]=new Set();       
        readyUser[roomId].add(userId);
        console.log(readyUser);
        if(readyUser[roomId].size<=2){
        startTime=Date.now();
        const remainingTime=time[category]*60;
        if(readyUser[roomId].size===1)
        io.to(roomId).to(userId).emit('timer',{timer:remainingTime,timerStarted:false});
        else io.to(roomId).emit('timer',{timer:remainingTime,timerStarted:true})
      }
      else {
        const elapsedTime=Math.floor((Date.now()-startTime)/1000);
        const remainingTime=(time[category]*60)-elapsedTime;
        io.to(roomId).to(userId).emit('timer',{timer:remainingTime,timerStarted:true});
      }
      io.to(roomId).emit('chat-message',{userId:1,text:`${users[userId].userName} is ready ⚔️`})
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





