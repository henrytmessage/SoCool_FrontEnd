import React from 'react'
import Test from '../test'
import { Route, Routes } from 'react-router-dom'
import ContentChat from '../components/ContentChat'
import OnBoarding from '../components/OnBoarding'

const AppRouters = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<OnBoarding />} />
      <Route path="/chat" element={<ContentChat />} />
  </Routes>
  )
}

export default AppRouters