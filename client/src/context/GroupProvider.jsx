import { createContext, useCallback, useContext, useState, useRef, useEffect } from "react"
import useAuth from "./AuthProvider";
import useApp from "./DashboardProvider";
import Groupapi from "../api/Groupapi";

const GroupContext= createContext();

export const GroupProvider=({children})=>{

    const {socket, isConnected}= useApp();
    const {user}= useAuth();

    // const[existingGrpId, setExistingGrpId]= useState("")
    // const[grpMessages, setGrpMessages]= useState("")

    const[currentGrpId, setCurrentGrpId]= useState("");
    const groupName= useRef("");
    const[text, setText]= useState("");
    // to show the message on side D
    const[grpText, setGrpText]= useState([])

    const[addGroup, setAddGroup]= useState(false);

    const createGroup= useRef();
    const existingGrpId=useRef();
    const currentGrpIdRef = useRef(currentGrpId);

    useEffect(() => {
      currentGrpIdRef.current = currentGrpId;
    }, [currentGrpId]);

    useEffect(()=>{
        if (!socket) return;
        // if(!currentGrpId)return;
        
        const handler= (data)=>{
            console.log(data);
            if(currentGrpIdRef.current==data.groupId){
              setGrpText((prevgrpmsgs)=>[...prevgrpmsgs,data]);
            }else{
              console.log("setting again")
              setAddGroup(prev => !prev);
            }
        }

        socket.on("grp:new",handler)
        // socket.on("grp:new",(data)=>{
        //   setGrpText((prevgrpmsgs)=>[...prevgrpmsgs,data]);
        // })

        return () => {
            socket.off("grp:new", handler);  // remove this EXACT handler
        };

    },[socket])


    const GroupList = useCallback(async function GroupList() {
        const {data}= await Groupapi.getAllGroups();
        console.log(data);
        return data;
    }, []);

    const GroupMessageList = useCallback(async function GroupMessageList() {
    console.log("in GroupMessageList")
        const {data}= await Groupapi.getGroupMessages(currentGrpId);
        console.log(data);
        return data;
    }, [currentGrpId]);

    const groupHandler = useCallback(function groupHandler(){
      if(!socket || !isConnected){
        alert("Chat is still connecting. Please try again in a moment.");
        return;
      }
      if(text.length==0){
        return;
      }
        socket.emit("grp:send",{
          existingGrpId:currentGrpId,
          grpMessages:text
        },(msg)=>{
          if(!msg.ok){
            console.log(msg.error)
            return alert (msg.error);
          }
          console.log("new mesg:" ,msg.message.senderId);
          console.log("new mesg:" ,msg.message.text);
          setText("");
        })
      }, [currentGrpId, isConnected, socket, text]);
    
      const createGrpHandler = useCallback(async function createGrpHandler(){
        if(!socket || !isConnected){
          alert("Chat is still connecting. Please try again in a moment.");
          return false;
        }
        const grpName= createGroup.current?.value?.trim();
        if (!grpName) {
          return false;
        }
        const userId= user.id;
        try {
          const data= await Groupapi.createGroup(grpName, userId);
          if (data?.data?.id) {
            socket?.emit("grp:join", { groupId: data.data.id });
          }
          if (createGroup.current) createGroup.current.value = "";
          setAddGroup(prev => !prev);
          return true;
        } catch (error) {
          alert(error.response?.data?.message || "Unable to create group");
          return false;
        }
      }, [isConnected, socket, user.id]);
    
      const addGrpHandler = useCallback(async function addGrpHandler(){
        if(!socket || !isConnected){
          alert("Chat is still connecting. Please try again in a moment.");
          return false;
        }
        const groupId= existingGrpId.current?.value?.trim();
        if (!groupId) {
          return false;
        }
        const userId= user.id;
        try {
          const data= await Groupapi.addGroup(groupId,userId);
          if (data?.data?.id) {
            socket?.emit("grp:join", { groupId: data.data.id });
          }
          if (existingGrpId.current) existingGrpId.current.value = "";
          setAddGroup(prev => !prev);
          return true;
        } catch (error) {
          alert(error.response?.data?.message || "Unable to add group");
          return false;
        }
        // axios.post('/api/group/add',{
        //   groupId,
        //   userId: user.id
        // }).then(({data})=>{
        //   setGroupList(prev=>[...prev,data])
        //   console.log(data);
        // }).catch(error=>{
        //   console.log(error)
        // })
      }, [isConnected, socket, user.id]);
    


    return(
        <GroupContext.Provider value={{
            GroupList,
            currentGrpId,
            setCurrentGrpId,
            groupName,
            grpText,
            setGrpText,
            GroupMessageList,
            text,
            setText,
            groupHandler,
            addGroup,
            createGroup,
            createGrpHandler,
            existingGrpId,
            addGrpHandler
        }}>
            {children}
        </GroupContext.Provider>
    )
}

export default function useGroup(){
    return useContext(GroupContext)
}
