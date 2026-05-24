import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function changeStatus(req,res,next) {
    try{
        const {newStatus}= req.body;
        const userId = req.user.id;
        const status = await prisma.status.upsert({
            where: {
                userId
            },
            update: {
                status: newStatus
            },
            create: {
                userId,
                status: newStatus
            }
        });
        console.log(status)
        res.status(200).json({status});
    }catch(error){
        console.log(error);
        res.status(400).json({error});
    }

}

export async function getStatus(req,res,next) {
    try{
        const userId= req.user.id;
        const status= await prisma.status.upsert({
            where: {
                userId
            },
            update: {},
            create: {
                userId
            }
        });
        // console.log(status);
        res.status(200).json({status})
    }catch(error){
        console.log(error)
        res.status(400).json({error})
    }
} 

export async function getUserStatus(req,res,next) {
    try{
        const {id}= req.query;
        if (!id) {
            return res.status(400).json({ error: "Story ID is required" });
        }
        const status= await prisma.status.findUnique({
            where: {
                userId: id
            }
        })
        // console.log(status);
        res.status(200).json({status: status || {userId: id, status: "hey! I am using ChatApp"}})
    }catch(error){
        console.log(error)
        res.status(400).json({error})
    }
}

// export async function deleteStaus(req,res,next) {
    
// }
