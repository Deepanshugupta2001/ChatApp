import React, {useState } from 'react'
import useAuth from '../context/AuthProvider';
import DirectConvo from './DirectConvo';
import GroupConvo from './GroupConvo';
import { DMProvider } from '../context/DMProvider';
import DirectMessages from './DirectMessages';
import GroupMessages from './GroupMessages';
import Addons from './Addons';
import { GroupProvider } from '../context/GroupProvider';
import Profile from './Profile';

const Chat = () => {
    const[chatType, setChatType]=useState('directconvo')
    const {logout}= useAuth();
    const [showAddons, setShowAddons] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const[btn, setbtn]= useState("");

  return (
    <>
    <div className='chat-container'>

        <div className="sidebar">
            <div className="addChat">
                <div>
                    <img src='/speech-bubble.png' alt="chat" className='chat-icon'/>
                    {/* <div className='logo'>let's connect</div> */}
                </div>
                <button className="nav-button" data-tooltip="Add Friend" disabled={showProfile} onClick={()=>{setShowAddons(prev => !prev); setbtn("ADD A FRIEND")}}>
                    <img src="/add-friend.png"  alt="Add Friend" className="nav-icon" />
                    </button>
                <button className="nav-button" data-tooltip="Add Group" disabled={showProfile} onClick={()=>{setShowAddons(prev => !prev); setbtn("ADD EXISTING GROUP")}}>
                   <img src="/employees.png"  alt="Add Group" className="nav-icon" /></button>
                <button className="nav-button" data-tooltip="Create Group" disabled={showProfile} onClick={()=>{setShowAddons(prev => !prev); setbtn("CREATE NEW GROUP")}}>
                    <img src="/queue.png"  alt="Create Group" className="nav-icon" /></button>
            </div>

            <div className="user">
                {/* <button>status</button> */}
                <button className="nav-button" data-tooltip="Profile" onClick={()=>{setShowProfile(prev => !prev);  setShowAddons(false)}}>
                    <img src="/account-settings.png"  alt="profile" className="nav-icon" /></button>
                <button  className="navbutton"  data-tooltip="Logout" onClick={() => logout()}>
                    <img  src="/log-out.png"  alt="logout" className="navicon" /></button>
            </div>
        </div>

        <div className="chat-box">

            <div className="list-area">
                <div className='chat-name' >
                    {/* <img src='/speech-bubble.png' alt="chat" className='chat-icon'/> */}
                    ChatApp
                    </div>

                <div className={`select-chat-type`}>
                    <button 
                    style={{
                        backgroundColor: chatType === 'directconvo' ?' #D4D4D4'  : '',
                        color: chatType === 'directconvo' ? '#1a1a1a' : '',
                        border: chatType === 'directconvo' ? '2px solid  #1a1a1a' : ''
                    }}
                    onClick={()=>setChatType('directconvo')}>DIRECT CHAT</button>
                    <button
                    style={{
                        backgroundColor: chatType === 'groupconvo' ?'#D4D4D4'  : '',
                        color: chatType === 'groupconvo' ? '#1a1a1a' : '',
                        border: chatType === 'groupconvo' ? '2px solid #1a1a1a' : ''
                    }}
                    onClick={()=>setChatType('groupconvo')}>GROUP CHAT</button>
                </div>

            </div>
            
            <>
            <DMProvider><GroupProvider>
                {chatType=='directconvo'?(
                    <>
                    <div className="list">
                        <DirectConvo />
                    </div>
                    <div className="chat-area">
                    <DirectMessages />
                    </div>
                    </>
                ):(
                    <>
                    <div className="list">
                        <GroupConvo />
                    </div>
                    <div className="chat-area">
                    <GroupMessages />
                    </div>
                    </>
                )}
                {showAddons && (
                    <div className='addon'>
                    <Addons btn={btn} setShowAddons={setShowAddons} />
                    </div>
                )}
                {showProfile && (
                    <div className="profile">
                        <div className="profile-content">
                            <Profile/>
                        </div>
                    </div>
                )}
            </GroupProvider></DMProvider>
            </>
        </div>

    </div>
      
    </>
  )
}

export default Chat
