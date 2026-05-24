import React, { useCallback, useEffect, useRef, useState } from 'react'
import useAuth from '../context/AuthProvider';
import useApp from '../context/DashboardProvider';
import useDM from '../context/DMProvider';
import Preview from './Preview';
import axios from "../utils/axios"



const DirectMessages = () => {
    const {setFriendshipId, friendshipId,MessageList, friendName, chatHandler,text, setText, setMessage, messages, receiverId, setReceiverId}= useDM();
    const {isConnected, socket}= useApp();
    const {token, user}= useAuth();
    const messagesEndRef = useRef(null);
    const [showPreview, setShowPreview] = useState(false);
    const [online, setOnline]=useState(false);
    const [lastseen, setLastseen]= useState("");
    const [lastseendate, setLastseendate]= useState("");


    function formatDate(iso) {
      const d = new Date(iso);

      const day = String(d.getDate()).padStart(2, '0');          // 04
      const month = d.toLocaleString('en-US', { month: 'short' }); // Dec
      const year = d.getFullYear().toString().slice(-2);           // 25

      return `${day} ${month}-${year}`;
    }

    // REAL TIME UPDATE- last seen and isonline 
    useEffect(()=>{
      if(!socket)return;
      socket.on("chat:state",({state})=>{
        console.log("state update",state);
        console.log(state.id)
        console.log(receiverId)
        if(state.id==receiverId){
          setOnline(state.isOnline);
          setLastseen(new Date(state.lastSeen).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }));
          const date = state.lastSeen.split("T")[0];
          setLastseendate(formatDate(date));

        }
      })
      return () => socket.off("chat:state");
    },[socket,receiverId])


    // last seen and isonline 
    useEffect(()=>{
      if(!receiverId)return;
      console.log("friendid", receiverId)
      axios.get('/api/user/friendInfo',{
        params:{id:receiverId}
      }).then(({data})=>{
        console.log(data);
        if(data.data.isOnline==true){
          setOnline(true);
        }else{
          setOnline(false);
          setLastseen(new Date(data.data.lastSeen).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true }));
          const date = data.data.lastSeen.split("T")[0];
          setLastseendate(formatDate(date));
        }
      }).catch(error=>{
        console.log(error)
      });
    },[receiverId])


    useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    const fry = useCallback(async () => {
        const {data} = await MessageList();
        console.log(data);
        setMessage(data);
    }, [MessageList, setMessage]);

    useEffect(()=>{
            if(!isConnected) return;
            if(!friendshipId){
                setMessage([])
                return;
            }
            fry();
    },[isConnected,token, friendshipId, fry, setMessage])
    console.log(showPreview)

    // message list set hote hi sare msgs seen hogye send by my friend
    useEffect(()=>{
      if(!receiverId)return;
      if(!friendshipId)return;
      if(!socket)return;
      console.log("recid", receiverId);
      console.log("conversation", friendshipId);
      socket.emit("chat:seenMsgs",{
        receiverId,
        friendshipId
      },(message)=>{
        if(!message.ok){
            console.log(message.error);
            return alert (message.error);
        }
      console.log(message)})
    },[socket,messages,receiverId,friendshipId]);

  return (
    <div className='message-list'>
    <div className="friend-header" 
    style={{
            backgroundColor: !friendshipId ?'#1e1e1e'  : '',
            border: !friendshipId ? 'none' : ''
        }}
    >
        <div>
          {friendshipId && <div>{friendName.current}
          <div>
            {friendshipId && online && <div className='lastseen'>online</div>} 
            {friendshipId && !online && lastseendate && <div className='lastseen'>Last seen at {lastseen} on {lastseendate}</div>}
          </div>
          </div>}
        </div>
        <div >
        {friendshipId &&  <button className="selectPreview nav-button" data-tooltip="MORE.." onClick={()=>setShowPreview(prev=>!prev)}>
          <img src="/menu.png" alt="close" className="close-icon selectPreview" />

          </button>}
        {friendshipId && <button className="nav-button" data-tooltip="close" onClick={()=>{setFriendshipId(""); setReceiverId("")}}>
          <img src="/close.png" alt="close" className="close-icon" />
          </button>}
        </div>
        </div>
    <div className="messages">
            <div className='no-chat'>{!friendshipId && <img src='video-chat.png' alt="chat" className='nochat'/>}
            {!friendshipId && <div className='nochat2'>Let's Connect</div>}</div>
            {messages.map((m, index, arr) => {
              const isMine = m.sender.id === user.id;
              const iso =m.createdAt;
              const date = iso.split("T")[0];
              const prev = arr[index - 1];
              const prevDate = prev ? prev.createdAt.split("T")[0] : null;
              const time = new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
              const theDate = date !== prevDate;
              const dayName = new Date(iso).toLocaleDateString('en-US', { weekday: 'long' });
              const d= formatDate(iso)
              return ( 
                <React.Fragment key={m.id}>
                  {theDate && <span className="newchat">{dayName}, {d}</span>}
                  <div
                    key={m.id}
                    className={`message ${isMine ? "mine" : "theirs"}`}
                  >
    
                    {/* {!isMine && <div className="sender">{m.sender.name}</div>} */}
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
      <Preview name={friendName.current} receiverId={receiverId} setShowPreview={setShowPreview} />
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
        <button className="nav-button" onClick={chatHandler} disabled={!isConnected || !friendshipId}>
             <img src="/paper-plane.png" alt="send" className="nav-icon" />
        </button>
    </div>
    </div>
  )
}

export default DirectMessages
