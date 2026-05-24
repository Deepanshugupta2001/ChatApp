import React, { useCallback, useEffect, useState } from 'react'
import useApp from '../context/DashboardProvider';
import useAuth from '../context/AuthProvider';
import useGroup from '../context/GroupProvider'

const GroupConvo = () => {
  const {isConnected}= useApp();
  const {token, user}= useAuth();
  const {GroupList, setCurrentGrpId, groupName,addGroup, currentGrpId}= useGroup();
  const[groupList, setGroupList]= useState([]);
  const[newCount, setNewCount]= useState(new Map());
  

  const fry = useCallback(async () => {
    const data= await GroupList();
    console.log("list",data);
    setGroupList(data);
    const counts = new Map();
    data.forEach(d=>{
      let count=0;
      d.messages.forEach(el => {
        if(el.senderId!==user.id && el.groupMessages.length>0 && el.groupMessages[0].isRead==false){
          count=count+1;
        }
      });
      counts.set(d.id,count);
    })
    setNewCount(counts);
  }, [GroupList, user.id]);

  useEffect(()=>{
    if(!isConnected)return;
    fry();
  },[isConnected,token,addGroup,fry])

  return (
    <div>
      <ul className="friend-list">
        {groupList.map(g=>{
          return (
            <li key={g.id} 
            onClick={()=>{setCurrentGrpId(g.id)
              console.log(currentGrpId)
              const name= g.name;
              groupName.current= name;
              setNewCount(prev=>{
                  const map= new Map(prev);
                  map.set(g.id,0);
                  return map;
                })
            }}
            className="friend-item"
            style={{color: currentGrpId===g.id ? '#ffffff' :' #d4d4d4',
                  backgroundColor:  currentGrpId===g.id ? 'rgba(255, 255, 255, 0.05)' :'',
                  borderBottomColor: currentGrpId===g.id ? '#C586C0' :''
                }}
            >
              <div className='direct-convo-friend'><div>{g.name}</div>
                  {newCount.get(g.id)>0?(<div className='unreadMsg'>{newCount.get(g.id)}</div>):'' }
              </div>
              </li>
          )
        })}
      </ul>
    </div>
  )
}

export default GroupConvo
