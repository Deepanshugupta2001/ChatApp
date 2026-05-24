
import { PrismaClient } from "@prisma/client";
import { getOrCreateConversation } from "../utility/coversationExists.js";
let prisma= new PrismaClient();

export default async function chatHandler(socket, io){

    // receive messages, capture the event, server is getting message from frontend
    socket.on("chat:send", async(payload, cb)=>{
        // let receiverId='';
        try{
            // payload data
            // console.log(payload)
            const{receiverId, text}= payload; 
            // console.log(email)
            // const senderId= socket.user.id; 

            // const {id}= await prisma.user.findUnique({
            //     where:{
            //         email:email
            //     },
            //     select:{  
            //         id:true
            //     }
            // }) 
            // receiverId= id;
            // console.log("new chat",receiverId)
            // return;
            // const{receiverId, text}= payload; 
            const senderId= socket.user.id; 

            const convo= await getOrCreateConversation(receiverId,senderId);

            const message= await prisma.messages.create({
                data:{
                    conversationId:convo.id,
                    senderId:senderId,
                    text:text,

                }, 
                // include is used to fetch data from that specific row
                include:{
                    sender:{select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
                }
            })
            // jo is room me hoga unko message bhejdo
            console.log(message)
            // io.to(`user:${senderId}`).emit("chat:new",message);
            // io.to(`user:${receiverId}`).emit("chat:new",message);

            // Only send to receiver and let the sender handle local echo
            socket.to(`user:${receiverId}`).emit("chat:new",{ message, receiverId});
            socket.emit("chat:new", {message,receiverId} ); // sender sees message once

 
            cb?.({
                ok:true,
                message
            })

        }catch(error){
            console.log(error)
            cb?.({
                ok:false,
                error: error.message || "Unable to send message"
            })
        }
    })


    socket.on("chat:seenMsgs", async(payload,cb)=>{
        try{
            const{receiverId,friendshipId}= payload;
            const senderId= socket.user.id; 

            const data= await prisma.messages.updateManyAndReturn({
                where:{
                    conversationId:friendshipId,
                    senderId:receiverId
                },
                data:{
                    isRead:true
                }
            })
            console.log("messages", data)
            cb?.({
                ok:true,
                messages: data
            })

        }catch(error){
            console.log(error);
            cb?.({
                ok:false,
                error: error.message || "Unable to mark messages as read"
            })
        }
    })
} 

