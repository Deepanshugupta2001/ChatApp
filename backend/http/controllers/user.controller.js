import { PrismaClient } from "@prisma/client";
let prisma= new PrismaClient();

export async function getFriends(req,res, next){
    try{
        let allFrinds= await prisma.directConversation.findMany({
            where:{
                OR:[
                    {userAId:req.user.id},
                    {userBId:req.user.id} 
                ]
            }
            ,
            include:{
                userA:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }, 
                userB:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                },
                messages:{
                    select:{
                        senderId:true,
                        isRead:true
                    }
                }
            }
        })
        console.log(allFrinds) 
        res.status(200).json(allFrinds)
    }catch(error){
        console.log(error);
        res.status(500).json(error) 
    }
    
}
 
export async function getMessages(req,res,next) {
    try{
        const{conversationId}= req.query
        let allMessages= await prisma.messages.findMany({
            where:{
                conversationId:conversationId
            },
            include:{
                sender:{
                    select:{
                        id:true,
                        name:true,
                        email:true
                    }
                }
            } 
        })
        res.status(200).json(allMessages)
    }catch(error){
        console.log(error)
    }
}

export async function getFriendInfo(req,res,next) {
    try{
        const{id}= req.query;
        const data= await prisma.user.findUnique({
            where:{
                id:id
            },
            select:{
                lastSeen:true,
                isOnline:true 
            }
        })
        console.log(data);
        res.status(200).json({data});
    }catch(error){ 
        console.log(error)
    }
} 