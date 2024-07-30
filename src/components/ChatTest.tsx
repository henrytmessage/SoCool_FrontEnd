import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TypingAnimation from './TypingAnimation'
import { Avatar, Button, Input } from 'antd'
import { logoSoCool } from '../assets'
import TextAnimation from './TextAnimation'

interface IChatLog {
  type: string
  message: string
}

const ChatTest = () => {
  const { t } = useTranslation()
  const chatRef = useRef<HTMLDivElement>(null)

  const [inputChat, setInputChat] = useState('')
  const [chatLog, setChatLog] = useState<IChatLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleChangeInputChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChat(e.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAnimating || !inputChat) {
      return
    }

    const userMessage = { type: 'user', message: inputChat }
    setChatLog(prevChatLog => [...prevChatLog, userMessage])
    setInputChat('')
    
    setIsAnimating(true)
    setIsLoading(true)

    setTimeout(() => {
      const botMessage = { type: 'bot', message: userMessage.message }
      setChatLog(prevChatLog => [...prevChatLog, botMessage])
      setIsAnimating(false)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatLog])

  return (
    <div className="flex flex-col h-[85%] md:h-full bg-grey-900 sm:mx-40">
      <div className="flex-grow p-6 overflow-y-auto" ref={chatRef}>
        <div className="flex flex-col space-y-4">
          {chatLog.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'bot' && (
                <div>
                  <Avatar src={<img src={logoSoCool} alt="avatar" />} />
                </div>
              )}
              <div
                className={`${
                  message.type === 'user' ? 'bg-[#F4F4F4]' : 'bg-[#F4F4F4] ml-4'
                } rounded-3xl  p-4 text-[#0D0D0D] max-w-lg `}
              >
                {message.type === 'bot' ? (
                  <TextAnimation text={message.message} setIsAnimating={setIsAnimating} />
                ) : (
                  message.message
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div key={chatLog.length} className="flex justify-start">
              <div>
                <Avatar src={<img src={logoSoCool} alt="avatar" />} />
              </div>
              <div className="bg-[#F4F4F4] rounded-3xl p-4 text-white max-w-sm ml-4">
                <TypingAnimation />
              </div>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={event => handleSubmit(event)} className="flex-none p-6 font-semibold">
        <div className="flex rounded-3xl border border-[#b6b5b5] bg-[#F4F4F4]">
          <Input
            variant="borderless"
            className="px-4 py-2 bg-transparent"
            type="text"
            placeholder={t('placeHolderMessage')}
            value={inputChat}
            onChange={handleChangeInputChat}
          />
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className={`rounded-3xl ${!inputChat && 'opacity-80'}`}
            loading={isLoading}
          >
            {t('send')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatTest
