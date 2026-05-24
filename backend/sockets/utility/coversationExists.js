import { PrismaClient } from "@prisma/client";
let prisma= new PrismaClient();

function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getOrCreateConversation(receiverId, senderId){
    const receiverInput = receiverId?.trim();
    if (!receiverInput) {
        throw new Error("Please enter a user ID, email, or name");
    }

    const receiverWhere = isUuid(receiverInput)
        ? { id: receiverInput }
        : {
            OR: [
                { email: { equals: receiverInput, mode: "insensitive" } },
                { name: { equals: receiverInput, mode: "insensitive" } }
            ]
        };

    const receiver = await prisma.user.findFirst({
        where: receiverWhere,
        select: {
            id: true
        }
    });

    if (!receiver) {
        throw new Error("No user found with this ID, email, or name");
    }

    receiverId = receiver.id;

    if (receiverId === senderId) {
        throw new Error("You cannot start a chat with yourself");
    }

    const[a,b]=[receiverId,senderId].sort(); //to get a and b sorted and then find it in DC table
    try{

        let convo= await prisma.directConversation.findUnique({
            where:{
                userAId_userBId:{
                    userAId:a,
                    userBId:b
                }
            } 
        })

        if(!convo){
            convo= await prisma.directConversation.create({
                data:{
                    userAId:a,
                    userBId:b
                }
            })
        }

        return convo;

    }catch(error){
        console.log(error);
        throw error;
    }
}
