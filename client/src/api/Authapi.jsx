import axios from "../utils/axios"
import auth from "../lib/auth";

export async function signup({name, email, password}){
    try{
        const {data:{data}}= await axios({
            method:'post',
            url:'/api/auth/signup',
            data:{name, email, password}
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function login({email, password}){
    const {data:{data}}=await axios({
        method:"post",
        url:"/api/auth/login",
        data:{
            email,
            password
        }
    })
    console.log(data);
    return data;
}
async function me() {
  const {
    data,
  } = await axios({
    method: "get",
    url: "/api/auth/me",
    headers: {
      Authorization: `Bearer ${auth.token || ""}`,
    },
  });
  return data.user;
}

const Authapi={
    signup,
    login,
    me
}
export default Authapi;
