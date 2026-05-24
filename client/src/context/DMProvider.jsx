import React , { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import useAuth from "./AuthProvider";
import useApp from "./DashboardProvider";
import DMApi from "../api/DMapi";

const DMContext= createContext();
export const DMProvider=({children})=>{
    const {socket, isConnected}= useApp();
        
    const {user}= useAuth();
    // input boxes
    const[receiverId, setReceiverId]= useState("");
    const[text, setText]= useState("");

    const[friendshipId, setFriendshipId]= useState("");
    

    // to show the message on side B
    const[messages, setMessage]= useState([]);

    const friendName= useRef("");

 
    const[addFriend, setAddFriend]= useState(false);

    const addText= useRef();
    const addReceiverId= useRef();
    const receiverRef = useRef();

    // const[newCount, setNewCount]= useState(new Map());
    useEffect(() => {
        receiverRef.current = receiverId;
    }, [receiverId]);

    useEffect(()=>{
        if (!socket) return;
        // if(!receiverId)return;
        
        socket.on("chat:new",(data)=>{
            console.log(data);
            console.log(user.id)
            console.log(data.receiverId)
            console.log(receiverRef.current)
            console.log(data.message)
            console.log(data.message.senderId)

            if(user.id==data.message.senderId && receiverRef.current==data.receiverId){ 
                //sender interface
                setMessage((prevmsgs)=>[...prevmsgs,data.message])
                
            }else{
                if(user.id==data.receiverId && receiverRef.current==data.message.senderId){ 
                    //receiver interface
                    setMessage((prevmsgs)=>[...prevmsgs,data.message])
                }else{ 
                    //casual msg
                    console.log("new frindship")
                    console.log("received new message")
                    // setNewCount(prev=>{
                    //     const map= new Map(prev);
                    //     map.set(data.message.conversationId,(map.get(data.message.conversationId ||0)+1));
                    // })
                    // console.log("map",newCount);
                    setAddFriend(prev => !prev);
                }
            }
        })

        return()=>{
            socket.off("chat:new")
        }
    },[socket, user.id])

    const FriendList = useCallback(async function FriendList() {
        const data= await DMApi.getFriendList();
        console.log(data);
        return data;
    }, []);

    const MessageList = useCallback(async function MessageList(){
        if(!friendshipId)return;
        const data= await DMApi.getMessages(friendshipId);
        console.log(data);
        return data;
    }, [friendshipId]);


    const chatHandler = useCallback(function chatHandler(){
        if(!socket || !isConnected){
            alert("Chat is still connecting. Please try again in a moment.");
            return;
        }
        if(text.length==0){
            console.log("no length");
            return;
        }
        socket.emit("chat:send",{
        receiverId, 
        text
        },(message)=>{
        if(!message.ok){
            console.log(message.error);
            return alert (message.error);
        }
        console.log(message)
        setText("");
        })
    }, [isConnected, receiverId, socket, text]);

    const newChatHandler = useCallback(function newChatHandler(){
        if(!socket || !isConnected){
            alert("Chat is still connecting. Please try again in a moment.");
            return Promise.resolve(false);
        }
        const receiverValue = addReceiverId.current?.value?.trim();
        const textValue = addText.current?.value?.trim();

        if(!receiverValue || !textValue){
            console.log("no length");
            return Promise.resolve(false);
        }
        return new Promise((resolve) => {
            socket.emit("chat:send",{
            receiverId: receiverValue,
            text:textValue
            },(message)=>{
            if(!message.ok){
                alert(message.error);
                return resolve(false);
            }
            console.log(message)
            if (addReceiverId.current) addReceiverId.current.value = "";
            if (addText.current) addText.current.value = "";
            setAddFriend(prev => !prev);
            resolve(true);
            })
        })
    }, [isConnected, socket]);


    return(
        <DMContext.Provider value={
            {
                chatHandler,
                FriendList,
                receiverId,
                setReceiverId,
                friendshipId,
                setFriendshipId,
                MessageList,
                friendName,
                setText,
                text,
                messages,
                setMessage,
                addFriend,
                // setAddFriend,
                newChatHandler,
                addText,
                addReceiverId,
                // setNewCount,
                // newCount
            }
        }>
            {children}
        </DMContext.Provider>
    )
}

export default function useDM(){
    return useContext(DMContext);
}
