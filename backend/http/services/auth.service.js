import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import env from "../../env.js";

export async function signup({name, email, password}){

    // does user already exists?
    let existingUser= await prisma.user.findUnique({
        where:{
            email
        }
    }) 

     // if yes, throw an error
    if(existingUser){
        throw new Error ("user already exists")
    }
    // if not, create an user

    try{
        // hash the password before entering it in the db for security purpose
        const salt =await bcrypt.genSalt(10);
        const hashPassword =await bcrypt.hash(password, salt);   

        // adding a new user to the database
        const user= await prisma.user.create({
            data:{
                name,
                email,
                password: hashPassword
            }
        })

        // now after creating a user, the user must have a token to access the application 
        // the token will have name, email and the id of the user as its payload 
        let token= jwt.sign({
            name:user.name,
            email:user.email,
            id:user.id}, process.env.JWT_SECRET)   
            
        await prisma.status.create({
            data: {
                userId: user.id
            }
        });
        
        return {
            token,
            user:{
                name:user.name,
                email: user.email,
                id:user.id
            }
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function login({email, password}) {
    let existingUser= await prisma.user.findUnique({
        where:{
            email
        }
    })
    if(!existingUser){
        throw new Error("invalid user email")
    }
    try{
        // if user exists , compare its password- if it is right or not
        // console.log(password, existingUser.password)
        const ok=await bcrypt.compare(password, existingUser.password);
        // console.log(password, existingUser.password)
        if(!ok){
            throw new Error("invalid user password")
        }

        // create token since every user is not coming first time on app, but they still do require token
        let token= jwt.sign({
            name:existingUser.name,
            email:existingUser.email,
            id:existingUser.id
        }, process.env.JWT_SECRET);
        // console.log(token)
        return{
            token,
            user:{
                name:existingUser.name,
                email:existingUser.email,
                id:existingUser.id
            }
        }
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function updateState({id,online}) {
    try{
        const data= await prisma.user.update({
            where:{
                id:id
            },
            data:{
                isOnline:online,
                lastSeen:new Date()
            }
            // ,
            // select:{
            //     id:true,
            //     lastSeen:true,
            //     isOnline:true
            // }
        })
        return data;  
    }catch(error){
        console.log(error)
    }
}
