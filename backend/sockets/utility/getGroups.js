import { PrismaClient } from "@prisma/client";
let prisma= new PrismaClient();

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
                                name:true
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
