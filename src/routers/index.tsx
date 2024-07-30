import React from 'react'
import Test from '../test'
import { Route, Routes } from 'react-router-dom'
import ContentChat from '../components/ContentChat'
import OnBoarding from '../components/OnBoarding'
import Login from '../components/Login'
import NotFound from '../components/NotFound'
import Deactivate from '../components/Deactivate'
import Terms from '../components/Terms'
import PrivatePolicy from '../components/PrivatePolicy'
import ChatTest from '../components/ChatTest'
const AppRouters = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<OnBoarding />} />
      <Route path="/chat" element={<ContentChat />} />
      <Route path="/testChat" element={<ChatTest />} />
      <Route path="/go" element={<Login />} />
      <Route path="/deactivate" element={<Deactivate />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/Policy" element={<PrivatePolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouters
