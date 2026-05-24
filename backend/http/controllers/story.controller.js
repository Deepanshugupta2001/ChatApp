import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function storyToResponse(story) {
    return {
        _id: story.id,
        file: `data:${story.contentType};base64,${Buffer.from(story.image).toString("base64")}`,
        create: story.createdAt,
        expire: story.expiresAt
    };
}

export async function addStory(req,res,next) {
    try{
        if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
        }
        const userId = req.user.id || req.body.userId;
        // console.log(req.file)
        // console.log(req.body);

        let story=await prisma.story.create({
            data: {
                userId,
                image: req.file.buffer,
                contentType: req.file.mimetype,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });
        const base64 = `data:${story.contentType};base64,${Buffer.from(story.image).toString("base64")}`;
        res.status(200).json({
            story: {
                _id: story.id,
                createdAt: story.createdAt,
                expiresAt: story.expiresAt
            },
            base64
        })
    }catch(error){
        console.log(error);
        res.status(400).json({error})
    }
}

export async function getStory(req,res,next) {
    try{
        const userId= req.user.id;
        const stories= await prisma.story.findMany({
            where: {
                userId,
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        const storyArray= stories.map(storyToResponse)
        res.status(200).json({storyArray});
    }catch(error){
        console.log(error)
        res.status(400).json({error})
    }
} 

export async function delStory(req,res,next) {
    try{
        const {id}= req.body;
        if (!id) {
            return res.status(400).json({ error: "Story ID is required" });
        }
        const data= await prisma.story.deleteMany({
            where: {
                id,
                userId: req.user.id
            }
        })
        if (data.count === 0) {
            return res.status(404).json({ message: "Story not found" });
        }

        console.log("Deleted story:", id);
        return res.status(200).json({ message: "Story deleted successfully", id });
    }catch(error){
        res.status(400).json({error}) 
    }
}
export async function getUserStory(req,res,next){
    try{
        const {id}=req.query;
        console.log(id);
        if (!id) {
            return res.status(400).json({ error: "Story ID is required" });
        }
        const stories= await prisma.story.findMany({
            where: {
                userId: id,
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        })
        const storyArray= stories.map(storyToResponse)
        res.status(200).json({storyArray});
    }catch(error){
        console.log(error)
        res.status(400).json({error}) 
    }
}
