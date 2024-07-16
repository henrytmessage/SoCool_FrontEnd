import React from 'react'
import Test from '../test'
import { Route, Routes } from 'react-router-dom'
import ContentChat from '../components/ContentChat'
import OnBoarding from '../components/OnBoarding'
import Login from '../components/Login'
import NotFound from '../components/NotFound'
import Deactivate from '../components/Deactivate'

const AppRouters = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<OnBoarding />} />
      <Route path="/chat" element={<ContentChat />} />
      <Route path="/go" element={<Login />} />
      <Route path="/deactivate" element={<Deactivate />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouters
