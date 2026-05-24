import jwt from "jsonwebtoken";
// import env from "../../env.js";
import { PrismaClient } from "@prisma/client";
let prisma=new PrismaClient();

export async function socketAuth(socket,next){
    try{
        const token= socket.handshake.auth.token;
        if(!token){
            throw new Error("token required")
        }

        const decoded= jwt.verify(token, process.env.JWT_SECRET);

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
            throw new Error("user not identified")
        }
        // now user details will be availabe throughout the socket
        socket.user= user;
        next()
    }catch(error){
        console.log(error);
        next(new Error("Unauthorized"));
    }

}