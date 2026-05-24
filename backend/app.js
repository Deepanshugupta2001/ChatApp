import 'dotenv/config';
import express from 'express';
const app= express();

// import dotenv from 'dotenv';
// dotenv.config() //config function to load the variables before they are used

import {createServer} from 'http';
import {Server} from 'socket.io';
    
const PORT=process.env.PORT || 4441;
   
import cors from 'cors'; 
import authRoutes from './http/routes/auth.routes.js';
import { socketAuth } from './sockets/middlewares/requireAuth.js';
import chatHandler from './sockets/handlers/chatHandlers.js';
import userRoutes from './http/routes/user.routes.js';
import { requireAuth } from './http/middlewares/requireAuth.js';
import { groupHandler } from './sockets/handlers/groupHandler.js';
import grpRoutes from './http/routes/group.routes.js';
import { getGroups } from './sockets/utility/getGroups.js';
import statusRoutes from './http/routes/status.routes.js';
import storyRoutes from './http/routes/story.routes.js';
import { updateState } from './http/services/auth.service.js';
// import path from 'path';
// import { fileURLToPath } from 'url';
  
// // because __dirname is in commonjs script not defined in es module type
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use('/uploads', express.static(path.join(__dirname,'uploads')))
 

app.use(express.urlencoded({extended:true})) //x-www-form-urlencoded format incoming data
app.use(express.json()); //json format incoming data

app.use(cors({
    origin:process.env.FRONTEND_URL
}))

const httpServer= createServer(app);
const io= new Server(httpServer,{
    cors:{
        origin:process.env.FRONTEND_URL
    }
});
  
// does user has authentication to chat
io.use(socketAuth);


io.on('connection',async (socket)=>{ //socket is an object that we get when connection is made, after handshake from frontend
    console.log("client connected");

    socket.join(`user:${socket.user.id}`) //creating a room
    console.log("userid", socket.user.id )
    // it can be done with hashmap also, socketId and userId when connected added, and deleted when disconnected

    const update= await updateState({
        id:socket.user.id,
        online:true   });
    console.log( "update",update);
    socket.broadcast.emit("chat:state",{state:update});

    // it handles chat operations
    chatHandler(socket,io);

    // it will get al the groups and join room for that
    let data=await getGroups(socket.user.id);
    const ids=data.map(m=>m.id)
    for(let id of ids){
        socket.join(`grp:${id}`)
    }

    // async function newGroupJoin(newid) {
    //     await socket.join(`grp:${newid}`);
    // }

    // to handle group chats
    groupHandler(socket,io);

    socket.on('disconnect',async()=>{
        console.log(`${socket.user.name} disconnected`)
        const update= await updateState({
            id:socket.user.id,
            online:false   
        });
        console.log(update);
        socket.broadcast.emit("chat:state",{state:update});

    })
})
// export const joinGrp= newGroupJoin();
 
app.use('/api/auth', authRoutes);
app.use('/api/user',requireAuth, userRoutes)
app.use('/api/group',requireAuth, grpRoutes)
app.use('/api/status', requireAuth, statusRoutes)
app.use('/api/story', requireAuth, storyRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
});
  
httpServer.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})
