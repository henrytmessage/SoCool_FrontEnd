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
  const [isUserTurn, setIsUserTurn] = useState(true)

  const handleChangeInputChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChat(e.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAnimating || !inputChat) {
      return
    }

    if (isUserTurn) {
      const userMessage = { type: 'user', message: inputChat }
      setChatLog(prevChatLog => [...prevChatLog, userMessage])
      setIsLoading(true)
    } else {
      setIsAnimating(true)
      setIsLoading(true)
      const botMessage = { type: 'bot', message: inputChat }
      setChatLog(prevChatLog => [...prevChatLog, botMessage])
      setIsAnimating(false)
      setIsLoading(false)
    }

    setInputChat('')
    setIsUserTurn(!isUserTurn)
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
              <div className="mx-4">
                <div className={`${message.type === 'user' ? ' text-right' : ''} font-semibold pb-1`}>{message.type === 'bot' ? 'SoCool' : 'Elon Musk'}</div>
                <div
                  className={`${
                    message.type === 'user' ? 'bg-[#F4F4F4]' : 'bg-[#F4F4F4]'
                  } rounded-3xl p-4 text-[#0D0D0D] max-w-lg break-words`}
                  style={{ wordBreak: 'break-word' }}
                >
                  {message.type === 'bot' ? (
                    <TextAnimation text={message.message} setIsAnimating={setIsAnimating} />
                  ) : (
                    message.message
                  )}
                </div>
              </div>
              {message.type === 'user' && (
                <div className="">
                  <Avatar
                    src={
                      <img
                        src="data:image/jpeg;base64,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"
                        alt="avatar"
                      />
                    }
                  />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div key={chatLog.length} className="flex justify-start">
              <div>
                <Avatar src={<img src={logoSoCool} alt="avatar" />} />
              </div>
              <div
                className="bg-[#F4F4F4] rounded-3xl p-4 text-[#0D0D0D] max-w-sm ml-4 break-words"
                style={{ wordBreak: 'break-word' }}
              >
                <TypingAnimation />
              </div>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex-none p-6 font-semibold">
        <div className="flex rounded-3xl border border-[#b6b5b5] bg-[#F4F4F4]">
          <Input
            variant="borderless"
            className="px-4 py-2 bg-transparent"
            type="text"
            placeholder={isUserTurn ? t('placeHolderMessage') : 'Enter bot message'}
            value={inputChat}
            onChange={handleChangeInputChat}
          />
          <Button type="primary" htmlType="submit" size="large" className={`rounded-3xl ${!inputChat && 'opacity-80'}`}>
            {t('send')}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatTest
