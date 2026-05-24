import React, { useEffect, useState } from 'react'
import useAuth from '../context/AuthProvider';
import axios from "../utils/axios"

const Preview = ({name,receiverId, setShowPreview}) => {

  // const {isConnected, socket}= useApp();

  const {token}= useAuth();
  const[Status, setStatus]= useState("");
  // const{receiverId}= useDM();

  const[story, setStory]= useState([]);
  const [openStory, setOpenStory] = useState(null);

  useEffect(()=>{
    if(!receiverId) return;
    axios.get('/api/status/getUserStatus',{params:{id:receiverId}})
    .then(({data})=>{
      let status= data.status.status
      console.log(data.status.status);
      setStatus(status);
    }).catch(error=>{
      console.log(error);
    })
  },[token,receiverId])

  useEffect(()=>{
    if(!receiverId) return;
    console.log(receiverId)
     axios.get('/api/story/allUserStory',{params:{id:receiverId}})
    .then(({data})=>{
      console.log(data);
      console.log(data.storyArray.length)
      setStory(data.storyArray);
      console.log("set story")
    })
    .catch(error=>{
      console.log(error);
    })
  },[token,receiverId]);


  return (
    <div className='preview-page'>
        <button className='preview-back' onClick={()=>setShowPreview(false)}>
          <img className="preview-icon"  src="/left-arrow.png" alt="back" /></button>
  
      <div className="userid-content">

        <div className="userheading">{name} ID:</div>
        <div className='userid'>
          <div>{receiverId}</div> 
        </div>

      </div>
      <div className="userstatus-content">

        <div className="userheading">STATUS:</div>
        <div className='userstatus'>
          <div>{Status}</div> 
        </div>

      </div>

      <div className="userstory-content">
   
        <div className="userheading">STORY:</div>
        <div className="userstory-previews">
        {story.map((s)=>{
          return(
          <div className="userstory-wrapper" key={s._id}>
          <img key={s._id} src={s.file} alt="story" className="userstory-circle"
           onClick={() => setOpenStory(s)} 
          />
          </div>
        )
        })}
      </div>

      {openStory && (
        <div className="story-modal" onClick={() => setOpenStory(null)}>
          <img
            src={openStory.file}
            alt="full-story"
            className="story-full"
          />
        </div>
      )}
      </div>

    </div>
  )
}

export default Preview
