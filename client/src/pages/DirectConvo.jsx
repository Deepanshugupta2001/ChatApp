import React, { useCallback, useEffect, useState } from 'react'
import useAuth from '../context/AuthProvider';
import useApp from '../context/DashboardProvider';
import useDM from '../context/DMProvider';

const DirectConvo = () => {

    const {isConnected,socket}= useApp();
    const {token, user}= useAuth();
    const {FriendList,setReceiverId,receiverId, setFriendshipId, friendshipId,friendName,addFriend}= useDM();
    const[friendList, setFriendList]= useState([]);
    const[newCount, setNewCount]= useState(new Map());

    
  
    // get all friends if the user is connected
    const fry = useCallback(async () => {
        const {data} = await FriendList();
        console.log(data);
        console.log("received new message, seeting the friend list again")
        setFriendList(data);
        const counts = new Map();
        data.forEach(d=>{
          let count=0;
          d.messages.forEach(el => {
            if(el.senderId!==user.id && el.isRead==false){
              count=count+1;
            }
          });
          counts.set(d.id, count);
        })
        setNewCount(counts);
    }, [FriendList, user.id]);

    useEffect(()=>{
      if(!socket)return;
        if(!isConnected) return;
        console.log("new frindship2")
        fry();
    },[isConnected,token,socket,addFriend,fry])

  return (
    <div>
      <ul className="friend-list">
            {friendList.map(f=>{
              // let count=0;
              // f.messages.forEach(el => {
              //   if(el.senderId!==user.id){
              //     if(el.isRead==false){
              //       count=count+1;
              //     }
              //   }
              // });
                return (<li key={f.id} 
                className="friend-item"
                onClick={()=>{
                const id= f.userA.id !== user.id ? f.userA.id : f.userB.id
                setReceiverId(id)
                console.log(receiverId);
                setFriendshipId(f.id)
                const name= f.userA.id !== user.id ? f.userA.name : f.userB.name
                friendName.current = name; 
                // count=0;
                // console.log("count", count)
                setNewCount(prev=>{
                  const map= new Map(prev);
                  map.set(f.id,0);
                  return map;
                })
                }}
                style={{color: friendshipId===f.id ? '#ffffff' :' #d4d4d4',
                  backgroundColor:  friendshipId===f.id ? 'rgba(255, 255, 255, 0.05)' :'',
                  borderBottomColor: friendshipId===f.id ? '#C586C0' :''
                }}
                >
                <div className='direct-convo-friend'>
                  <div>{f.userA.id !== user.id ? f.userA.name : f.userB.name}</div>
                  {/* {count>0?(<div className='unreadMsg'>{count}</div>):'' } */}
                  {newCount.get(f.id)>0?(<div className='unreadMsg'>{newCount.get(f.id)}</div>):'' }
                </div>
                </li>)
            })}
            </ul>
    </div>
  )
}

export default DirectConvo
