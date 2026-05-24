import axios from "../utils/axios"

export async function getAllGroups() {
    try{
        const data= await axios({
            method:'get',
            url:'/api/group/allGroups'
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error)
    }
}

export async function getGroupMessages(currentGrpId) {
    console.log("get messages")
    try{
        const data=await axios({
            method:'get',
            url:'/api/group/messages',
            params:{
                groupId:currentGrpId
            }
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error)
    }
}

export async function createGroup(grpName, userId) {
    console.log(grpName);
    console.log(userId)
    try{
        const data= await axios({
            method:'post',
            url:'/api/group/create',
            data:{
                grpName,
                userId
            }
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

export async function addGroup(groupId, userId) {
    console.log(groupId);
    console.log(userId)
    try{
        const data= await axios({
            method:'post',
            url:'/api/group/add',
            data:{
                groupId,
                userId
            }
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
        throw error;
    }
}

const Groupapi= {
    getAllGroups,
    getGroupMessages,
    createGroup,
    addGroup
}

export default Groupapi;
