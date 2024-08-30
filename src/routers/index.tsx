import React from 'react'
import Test from '../test'
import { Route, Routes } from 'react-router-dom'
import ContentChat from '../components/ContentChat'
import OnBoarding from '../components/OnBoarding'
import Login from '../components/Login'
import NotFound from '../components/NotFound'
import UpComing from '../components/UpComing'
import Deactivate from '../components/Deactivate'
import Terms from '../components/Terms'
import PrivatePolicy from '../components/PrivatePolicy'
import ChatTest from '../components/ChatTest'
import Home from '../componentsNew/Home'
import AiRunOnRice from '../componentsNew/AiRunOnRice'
import NewHome from '../componentsNew/NewHome'

const AppRouters = () => {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      {/* <Route path="/" element={<UpComing />} /> */}
      {/* <Route path="/test" element={<Test />} /> */}
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<NewHome />} />
      <Route path="/AiRunOnRice" element={<AiRunOnRice />} />
      {/* <Route path="/" element={<OnBoarding />} />
      <Route path="/chat" element={<ContentChat />} />
      <Route path="/testChat" element={<ChatTest />} />
      <Route path="/go" element={<Login />} /> */}
      <Route path="/deactivate" element={<Deactivate />} />
      <Route path="/Terms" element={<Terms />} />
      <Route path="/Policy" element={<PrivatePolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouters
