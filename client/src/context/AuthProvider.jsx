import React, { createContext, useContext, useEffect, useState } from 'react'
import Authapi from '../api/Authapi';
import auth from '../lib/auth';

const authContext= createContext();

export const AuthProvider = ({children}) => {

    const savedUser = auth.user;
    const savedToken = auth.token || "";
    const [user, setUser]= useState(savedUser && savedToken ? savedUser : null);
    const [token, setToken]= useState(savedUser && savedToken ? savedToken : "");

    useEffect(() => {
        if (!user || !token) {
            auth.logout();
        }
    }, [user, token]);
    
    async function signup({name, email, password}){
        const data= await Authapi.signup({name, email, password})
        // console.log("token",data.token, "user:", data.user);
        auth.token = data.token;
        auth.user = data.user;
        setToken(data.token);
        setUser(data.user)
        return data;
    }

    async function login({email, password}) {
        const data= await Authapi.login({email, password});
        auth.token = data.token;
        auth.user = data.user;
        setToken(data.token);
        setUser(data.user)
        console.log(data.user)
        return data;
    }

    function logout() {
    auth.logout();
    setToken("");
    setUser(null);
  }

  return (
    <authContext.Provider value={
        {signup,
        login,
        user,
        token,
        isLoggedin: Boolean(user && token),
        logout
        }
    }>
      {children}
    </authContext.Provider>
  )
}

export default function useAuth(){
    // useContext is a hook that helps to use value 
    return useContext(authContext);
}
