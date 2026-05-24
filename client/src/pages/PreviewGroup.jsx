import React, { useEffect, useRef, useState } from 'react'
import useAuth from '../context/AuthProvider';
import axios from "../utils/axios"

const PreviewGroup = ({name,currentGrpId, setShowPreview}) => {
    const {token}= useAuth();
    const[member, setMember]=useState([]);
    const memberCount= useRef();
    
    useEffect(()=>{
        if(!currentGrpId) return;
        axios.get('/api/group/info',{params:{id:currentGrpId}})
        .then(({data})=>{
        console.log(data.participants)
        memberCount.current= data.participants.length;
        setMember(data.participants);
        }).catch(error=>{
        console.log(error);
        })
    },[token,currentGrpId])

  return (
    <div className='preview-page'>
      <button className='preview-back' onClick={()=>setShowPreview(false)}>
        <img className="preview-icon"  src="/left-arrow.png" alt="back" />
      </button>

      <div className="userid-content">
        <div className="userheading">{name} ID:</div>
        <div className='userid'>
          <div>{currentGrpId}</div> 
        </div>
      </div>

      <div className="userstatus-content">

        <div className="userheading">{memberCount.current} MEMBERS:</div>

        <div className='usermember'>
            {member.map(m=>{
                return(
                    <>
                    <div className='Onemember'  key={m.user.id} >{m.user.name}</div>
                    <div className='memberid'>{m.user.id}</div>
                    </>
                )
            })}
        </div>

      </div>
  
    </div>
  )
}

export default PreviewGroup
