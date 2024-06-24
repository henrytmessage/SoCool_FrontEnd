import React from 'react'
import Test from '../test'
import { Route, Routes } from 'react-router-dom'
import ContentChat from '../components/ContentChat'
import OnBoarding from '../components/OnBoarding'
import Login from '../components/Login'

const AppRouters = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<OnBoarding />} />
      <Route path="/chat" element={<ContentChat />} />
      <Route path='/login' element={<Login />} />
  </Routes>
  )
}

export default AppRouters