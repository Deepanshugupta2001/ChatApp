import { PrismaClient } from "@prisma/client";
let prisma= new PrismaClient();

export async function groupExists(existingGrpId, userId) {

    const groupId= existingGrpId;

    let group= await prisma.groups.findUnique({
            where:{
                id:groupId
            },
            select:{
                name:true
            }
        })

    // if group do not exists
    if(!group){
        let err = new Error("group do not exists");
        err.status = 401;
        throw err; 
    }

    // if group exists then check , does the particpant exists
    let participant= await prisma.groupParticipants.findUnique({
        where:{
            userId_groupId:{
                userId,
                groupId
            }

        }
    })

    // if participant does not exists but the group exists, add user to the participant table as well updating grp table next
    if(!participant){
        let err = new Error("user is not a part of the group");
        err.status = 401;
        throw err;
    }

    console.log(group);

    return{
        ok:true,
        group
    }
}