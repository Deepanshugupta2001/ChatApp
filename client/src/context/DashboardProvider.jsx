import React, { createContext, useContext, useEffect, useState } from "react"
import { io } from 'socket.io-client'
import useAuth from "./AuthProvider";

const dashboardContext= createContext();

export const DashboardProvider= ({children})=>{

    const {token}= useAuth();
    const[socket, setSocket]=useState(null);
    const[isConnected, setIsConnected]= useState(false);
    

    useEffect(()=>{
        if(!token) {
          setSocket(null);
          setIsConnected(false);
          return;
        }
        //this is the bundle that server send to frontend, and to connect we ned to call io
        const socket= io(import.meta.env.VITE_API_URL,{
         auth:{
                 token
               }
        })
    
        socket.on("connect",()=>{
          console.log("user connected")
          setIsConnected(true);
        })

        socket.on("connect_error",(error)=>{
          console.log("socket connection error", error.message)
          setIsConnected(false);
        })

        socket.on("disconnect",()=>{
          console.log("user disconnected")
          setIsConnected(false);
        })
    
        setSocket(socket);
    
        return()=>{
          setIsConnected(false);
          socket.disconnect()
        }
      },[token])

    return(
        <dashboardContext.Provider value={{socket, isConnected}}  >
            {children}
        </dashboardContext.Provider>
    )
}

export default function useApp(){
    return useContext(dashboardContext);
}
