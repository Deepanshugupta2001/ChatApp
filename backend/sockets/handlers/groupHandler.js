import { PrismaClient } from "@prisma/client";
import { groupExists } from "../utility/groupExists.js";
let prisma= new PrismaClient();

export async function groupHandler(socket, io) {
    socket.on("grp:join", async (payload, cb) => {
        try {
            const { groupId } = payload;
            const userId = socket.user.id;
            const { ok } = await groupExists(groupId, userId);

            if (!ok) {
                throw new Error("user is not authenticated for this group");
            }

            socket.join(`grp:${groupId}`);
            cb?.({
                ok: true
            });
        } catch (error) {
            console.log(error);
            cb?.({
                ok: false,
                error: error.message || "Unable to join group"
            });
        }
    });
    
    socket.on("grp:send",async (payload,cb)=>{
        try{
            const{existingGrpId, grpMessages}=payload;
            const userId= socket.user.id;

            // check whether the user is part of the group or not
            const {ok}= await groupExists(existingGrpId, userId)

            if(!ok){
                let err = new Error("user is not authenticated for this group");
                err.status = 401;
                throw err;
            } 

            const message= await prisma.messages.create({
                data:{
                    text:grpMessages,
                    senderId: userId,
                    groupId:existingGrpId
                },
                include:{
                    sender:{
                        select:{
                            id:true,
                            name:true,
                            email:true
                        }
                    },
                    group:{
                        select:{
                            id:true,
                            name:true,
                            memberCount:true
                        }
                    }
                }
            })
            console.log(message)
            // assuming socket is available in this scope
            const roomName = `grp:${existingGrpId}`;

            // check if socket has already joined the room
            if (!socket.rooms.has(roomName)) {
                socket.join(roomName);
            }

            // get group participants
            const participants = await prisma.groupParticipants.findMany({
            where: { groupId:existingGrpId },
            });

            // create read-state entry for each participant
            const add=await prisma.groupMessages.createMany({
                data: participants.map(p => ({
                    messageId: message.id,
                    userId: p.userId,
                    isRead: false
                }))
            });
            console.log("add",add)

            // now emit to all clients in that room
            io.to(roomName).emit("grp:new", message);


            // io.to(`grp:${existingGrpId}`).emit("grp:new",message);

            cb?.({
                ok:true,
                message
            })
            

        }catch(error){
            console.log(error);
            cb?.({
                ok:false,
                error: error.message || "Unable to send group message"
            })
        }

    })


    socket.on("group:state",async(payload,cb)=>{
        try{
            const userId= socket.user.id;
            const {currentGrpId}=payload;

            const data= await prisma.groupMessages.updateManyAndReturn({
                where:{
                    userId,
                    message:{
                        groupId:currentGrpId
                    }
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
            console.log(error)
            console.log(error);
            cb?.({
                ok:false,
                error: error.message || "Unable to mark group messages as read"
            })
        }
    })
}
