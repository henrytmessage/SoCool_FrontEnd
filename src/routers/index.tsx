import React from 'react'
import Test from '../test'
import { Route, Routes } from 'react-router-dom'
import ContentChat from '../components/ContentChat'
import OnBoarding from '../components/OnBoarding'
import Login from '../components/Login'
import NotFound from '../components/NotFound'
import UpComing from '../components/UpComing'

const AppRouters = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<UpComing />} />
      <Route path="/chat" element={<ContentChat />} />
      <Route path="/go" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouters
