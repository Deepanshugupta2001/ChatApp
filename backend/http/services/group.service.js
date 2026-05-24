import { PrismaClient } from "@prisma/client";
let prisma= new PrismaClient();

export async function getOrCreateGroup(groupId, userId, grpName) {
    let group;
    if (!groupId && !grpName?.trim()) {
        throw new Error("Group name is required");
    }
    // does group exists
    if(groupId){
        group= await prisma.groups.findUnique({
            where:{
                id:groupId
            },
            include:{
                participants:true
            }
        })
    }

    // if group do not exists, then create it and and a new row to participant table also updating user and groupId
    if(!group){
        group= await prisma.groups.create({
            data:{
                creatorId:userId,
                name:grpName,
                memberCount:1,
                participants:{
                    create:[
                        {
                         userId:userId
                        }
                    ]
                }
            },
            include:{
                participants:true
            }
        })
        // socket.join(`grp:${group.id}`);
        return group;
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
        participant= await prisma.groupParticipants.create({
            data:{
                userId:userId,
                groupId:groupId
            }
        })

        group= await prisma.groups.update({
            where:{
                id:groupId
            },
            data:{
                memberCount:{
                    increment:1
                }
            },
            include:{
                participants:true
            }
        })
    }

    return group;

}

export async function getGroups(userId) {
    try{
        let group= await prisma.user.findUnique({
            where:{
                id:userId
            },
            include:{
                groupParticipants:{
                    select:{
                        group:{
                            select:{
                                id:true,
                                name:true,
                                messages:{
                                    select:{
                                        senderId:true,
                                        groupMessages:{
                                            where:{
                                                userId
                                            },
                                            select:{
                                                isRead:true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        // console.log(group.groupParticipants) 
        const grps = group.groupParticipants.map(gp => gp.group);
        console.log(grps);
        return grps;
    }catch(error){
        console.log(error);  
    }
}
export async function getOneGroup(id) {
    try{
        let groupData= await prisma.groups.findUnique({
            where:{
                id:id
            },
            select:{
                participants:{ 
                    select:{
                        user:{
                            select:{
                                name:true,
                                id:true
                            }
                        }
                    }
                }
            }
        })
        console.log(groupData);
        return groupData;
    }catch(error){
        console.log(error)
    }
}
