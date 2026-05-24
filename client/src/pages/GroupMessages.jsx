import React, { useCallback, useEffect, useRef, useState } from 'react'
import useGroup from '../context/GroupProvider'
import useApp from '../context/DashboardProvider';
import useAuth from '../context/AuthProvider';
import PreviewGroup from './PreviewGroup';

const GroupMessages = () => {
  const{currentGrpId,setCurrentGrpId, groupName, setGrpText,grpText, GroupMessageList, setText, text, groupHandler}= useGroup();
  const {isConnected,socket}= useApp();
  const {token, user}= useAuth();
  const messagesEndRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  function formatDate(iso) {
      const d = new Date(iso);

      const day = String(d.getDate()).padStart(2, '0');          // 04
      const month = d.toLocaleString('en-US', { month: 'short' }); // Dec
      const year = d.getFullYear().toString().slice(-2);           // 25

      return `${day} ${month}-${year}`;
    }
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [grpText]);

  const fry = useCallback(async () => {
    const data= await GroupMessageList();
    console.log(data);
    setGrpText(data);
  }, [GroupMessageList, setGrpText]);

  useEffect(()=>{
    console.log(currentGrpId);
    if(!isConnected) return;
    if(!currentGrpId){
      setGrpText([]);
      return;
    }
    fry();
  },[isConnected, token, currentGrpId, fry, setGrpText])

  // mark all messages read
  useEffect(()=>{
    if(!socket)return;
    if(!currentGrpId)return;
    // const id= user();
    console.log(user.id)
    socket.emit("group:state",
      {currentGrpId},(message)=>{
        if(!message.ok){
            console.log(message.error);
            return alert (message.error);
        }
      console.log(message)})
  },[socket,grpText,currentGrpId,user.id])

  return (
    <div className='groupMessage-list'>
      <div className="group-header"
      style={{
            backgroundColor: !currentGrpId ?'#1e1e1e'  : '',
            border: !currentGrpId ? 'none' : ''
      }}>
        {currentGrpId && <div>{groupName.current}</div>}
        <div >
        {currentGrpId &&  <button className="selectPreview nav-button" data-tooltip="MORE.." onClick={()=>setShowPreview(prev=>!prev)}>
          <img src="/menu.png" alt="close" className="close-icon selectPreview" />

          </button>}
        {currentGrpId && <button className="nav-button" data-tooltip="close" onClick={()=>{setCurrentGrpId("")}}>
          <img src="/close.png" alt="close" className="close-icon" />
          </button>}
        </div>
        {/* {currentGrpId && <button class="nav-button" data-tooltip="close" onClick={()=>{setCurrentGrpId("")}}>x</button>} */}
      </div>
      <div className="messages">
        <div className='no-chat'>{!currentGrpId && <img src='/video-chat.png' alt="chat" className='nochat'/>}
        {!currentGrpId &&<div className='nochat2'>Let's Connect</div>}</div>
        {grpText.map((m,index,arr)=>{
          const isMine = m.sender.id === user.id;
          const iso = m.createdAt
          const time = new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
          const date = iso.split("T")[0];
          const prev = arr[index - 1];
          const prevDate = prev ? prev.createdAt.split("T")[0] : null;
          const theDate = date !== prevDate;
          const dayName = new Date(iso).toLocaleDateString('en-US', { weekday: 'long' });
          const d= formatDate(iso)
            return (
              <React.Fragment key={m.id}>
                  {theDate && <div className="newchat">{dayName}, {d}</div>}
                <div key={m.id}
                  className={`message ${isMine ? "mine" : "theirs"}`}
                >
                  {!isMine && <div className="sender">{m.sender.name}</div>}
                  {isMine && <div className="ME">you</div>}
                  <div className="bubble">{m.text}
                    <div className='time'>{time}</div>
                  </div>
                </div>
              </React.Fragment>
            );
        })}
        <div ref={messagesEndRef}></div>
      </div>
      <>
      {showPreview && (
        <div className='preview'>
          {/* <button className='preview-back' onClick={()=>setShowPreview(false)}>
            <img className="preview-icon"  src="/left-arrow.png" alt="back" /></button> */}
        <PreviewGroup name={groupName.current} currentGrpId={currentGrpId} setShowPreview={setShowPreview} />
        </div>
      )}
      </>
      <div className="sendMessage">
        <input
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Type a message"
              value={text}
        />
        <button className="nav-button" onClick={groupHandler} disabled={!isConnected || !currentGrpId}>
            <img src="/paper-plane.png" alt="send" className="nav-icon" />
        </button>
    </div>
    </div>
  )
}

export default GroupMessages
