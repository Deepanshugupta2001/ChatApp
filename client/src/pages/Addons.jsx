import React from 'react'
import useDM from '../context/DMProvider';
import useGroup from '../context/GroupProvider';
import useApp from '../context/DashboardProvider';

const Addons = ({btn,setShowAddons}) => {
    const{newChatHandler,addText,addReceiverId}= useDM();
    const{createGroup, createGrpHandler, existingGrpId, addGrpHandler}=useGroup();
    const {isConnected}= useApp();

    console.log(btn);

    async function closeOnSuccess(handler) {
        try {
            const ok = await handler();
            if (ok) {
                setShowAddons(false);
            }
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || error?.message || "Unable to complete this action");
        }
    }

    function content(){
        if(btn=='ADD A FRIEND'){
            return(
                <>
                <input ref={addReceiverId} type="text" placeholder='friend id, email, or name'/>
                <input ref={addText} type="text" placeholder='enter text'  />
                <button disabled={!isConnected} onClick={()=>closeOnSuccess(newChatHandler)}>add</button>
                </>
            )
        }else if(btn=="ADD EXISTING GROUP"){
            return(
                <>
                <input ref={existingGrpId} type="text" placeholder='group id'/>
                <button disabled={!isConnected} onClick={()=>closeOnSuccess(addGrpHandler)}>add</button>
                </>
            )
        }else{
            return(
                <>
                <input ref={createGroup} type="text" placeholder='group name'/>
                <button disabled={!isConnected} onClick={()=>closeOnSuccess(createGrpHandler)}>create</button>
                </>
            )
        }
    }
  return (
    <div className='addon-content'>
        <div>{btn}</div>
        {content()}
    </div>
  )
}

export default Addons
