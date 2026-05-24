import jwt from "jsonwebtoken";
// import env from "../../env.js";
import { PrismaClient } from "@prisma/client";
let prisma=new PrismaClient();

export async function requireAuth(req,res, next) {
    try{
        // this will help us get the token of the user that it has
        const token= req.headers.authorization?.split(" ")[1];

        if(!token){
            return res.status(400).json({
                error:"token required"
            })
        }

        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        // this decoded will give us the payload

        const user= await prisma.user.findUnique({
            where:{
                id:decoded.id
            },
            select:{
                name:true, 
                email:true,
                id:true
            }
        })

        if(!user){
            return res.status(400).json({
                message:"invalid token"
            })
        }

        // to access user anywhere in the app
        req.user= user;
        console.log("user authenticated")
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({
            message: "unauthorized"
        });
    }
}
