import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Signup from './pages/Signup'
import Login from './pages/Login'
import useAuth from './context/AuthProvider'
import { DashboardProvider } from './context/DashboardProvider'
import Chat from './pages/Chat'


const App = () => {
  const {isLoggedin}= useAuth();
 
  return (
    <Routes>
      <Route path='/signup' element=
      {!isLoggedin? <Signup/> : <Navigate to='/chat'/>} />
      <Route path='/login' element=
      {!isLoggedin?<Login/>: <Navigate to='/chat'/>} />
      <Route path='/chat'element=
       {isLoggedin?(<DashboardProvider>
              <Chat />
            </DashboardProvider>): <Navigate to='/login'/>}
      />
      <Route path="*" element={<Navigate to='/signup'/>}/>
    </Routes>
  )
}

export default App
