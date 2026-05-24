import axios from "../utils/axios"

export async function getFriendList() {
    try{
        const data=await axios({
            method: 'get',
            url: '/api/user/friends'
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
    }
}

export async function getMessages(friendshipId) {
    try{
        const data=await axios({
            method: 'get',
            url: '/api/user/messages',
            params:{
                conversationId:friendshipId
            }
        })
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
    }
}

const DMApi= {
    getFriendList,
    getMessages
}

export default DMApi;