import { PrismaClient } from "@prisma/client";
import { getGroups, getOneGroup, getOrCreateGroup } from "../services/group.service.js";
let prisma= new PrismaClient();


export async function createGroup(req,res,next) {
    try{
        const{groupId, grpName}= req.body;
        const userId= req.user.id;

        // does this group exists?
        const grp= await getOrCreateGroup(groupId, userId, grpName);

        res.status(200).json(grp)

    }catch(error){
        console.log(error);
        res.status(400).json({message: error.message || "Unable to create group"});
    }
} 

export async function addGroup(req,res,next) {
    try{
        const{groupId, grpName}= req.body;
        const userId= req.user.id;
        const grp= await getOrCreateGroup(groupId, userId, grpName);
        res.status(200).json(grp)
    }catch(error){
        console.log(error);
        res.status(400).json({message: error.message || "Unable to add group"});
    }
}

export async function getGroup(req,res,next) {
    try{
        const userId= req.user.id;
        const grps= await getGroups(userId);
        res.status(200).json(grps)
    }catch(error){
        console.log(error);
        res.status(400).json({message: error.message || "Unable to get groups"});
    }
}

export async function getMessages(req,res,next) {
    const {groupId}= req.query;
    try{
        let allMessages= await prisma.messages.findMany({
            where:{
                groupId: groupId
            },
            orderBy:{
                createdAt:"asc"
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
                        name:true,

                    }
                }
            }
        })
        res.status(200).json(allMessages)
    }catch(error){
        console.log(error)
        res.status(400).json({message: error.message || "Unable to get group messages"});
    }
} 

export async function getInfo(req,res,next) {
    try{
        const{id}= req.query;

        const groupData= await getOneGroup(id);
        res.status(200).json(groupData)

    }catch(error){
        console.log(error);
        res.status(400).json({message: error.message || "Unable to get group info"});
    }
} 
