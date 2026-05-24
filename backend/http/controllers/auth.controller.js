import { login, signup } from "../services/auth.service.js";

export async function postSignup(req,res,next){
    const {name, email, password}= req.body;
    try{
        const data= await signup({name, email, password})
        res.status(200).json({data})
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"unable to signup",
            error
        }) 
    } 
} 
 
export async function postLogin(req,res,next){
    const {email, password}= req.body;
    try{
        const data= await login({email, password});
        res.status(200).json({data});
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"unable to login user",
            error
        })
    }
} 

export async function getMe(req, res, next){
    res.status(200).json({
        user: req.user
    })
}  
