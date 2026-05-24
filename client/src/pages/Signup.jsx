import React, { useRef } from 'react'
import { useNavigate } from 'react-router';
import useAuth from '../context/AuthProvider';
import './Signup.css'

const Signup = () => {
    const navigate = useNavigate();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const {signup} = useAuth();

    async function helper(e){
        try{
          e.preventDefault();
          const name = nameRef.current.value;
          const email = emailRef.current.value;
          const password = passwordRef.current.value;
          const data = await signup({name, email, password});
          console.log(data);

          navigate('/chat')
        }catch(error){
          alert(error.response?.data?.message || error.message || "Unable to sign up")
          console.log(error);
        }
    }
  return (
    <div className="signup-container">
      <div className='chatname' >
                    <img src='/speech-bubble.png' alt="chat" className='chat-icon'/>
                    ChatApp
                    </div>
      <div className="signup-card">
        <h1>Create Account</h1>
        <form onSubmit={helper} className="signup-form">
            <input ref={nameRef} type="text" placeholder="Enter your name" required />
            <input ref={emailRef} type="email" placeholder="Enter your email" required />
            <input ref={passwordRef} type="password" placeholder="Enter your password" required />
          <button type="submit" >Sign Up</button>
        </form>
        <div className="loginlink">
          Already have an account? 
          <button className="linkbtn" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>
    </div>
  )
}

export default Signup
