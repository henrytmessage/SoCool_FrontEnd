import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { postSendMessageService } from '../service'
import TypingAnimation from './TypingAnimation'
import { Avatar, Button, Input } from 'antd'
import { logoSoCool } from '../assets'
import TextAnimation from './TextAnimation'
import { IBodyConversation } from '../api/core/interface'
import { postConversation } from '../api/core'
import { useNavigate } from 'react-router-dom'
import { ACTION_CHAT, KEY_CHOOSE_SOMETHING } from '../constant'
import { formatVND, removeSpaces } from '../function'
import CustomModalWarning from '../common/CustomModalWarning'

interface IChatLog {
  type: string
  message: string
  action?: string
}

interface IResponseConversation {
  link: {
    id: number
    url?: string
    title?: string
    note?: string
    price?: string
    type?: string
    currency?: string
    is_active?: boolean
    user_count?: number
    iat?: string
    exp?: string
    created_at?: string
    initChat: string
    action?: string
  }
  user?: any
}

interface ISendMessage {
  role?: string
  content?: string
  conversation_id?: number
  parent_id?: string
  type: string
  price?: string
  phone?: string
  currency?: string
  action?: string
  lang?: string
  content_type?: string
}

const ContentChat = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const chatRef = useRef<HTMLDivElement>(null)

  const [initConversation, setInitConversation] = useState<IResponseConversation>()
  const [inputChat, setInputChat] = useState('')
  const [language, setLanguage] = useState('')
  const [chatLog, setChatLog] = useState<IChatLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [conversationId, setConversationId] = useState(0)
  const [parentId, setParentId] = useState('')
  const [initCurrency, setInitCurrency] = useState('')
  const [actionMessage, setActionMessage] = useState('NONE')
  const [inputPrice, setInputPrice] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [disableInputPhoneNumber, setDisableInputPhoneNumber] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [titleWarning, setTitleWarning] = useState('')
  const [negotiation, setNegotiation] = useState('')

  const handleChangeInputChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChat(e.target.value)
  }

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputNumberPrice = e.target.value.replace(/\s/g, '')

    if (inputNumberPrice === '') {
      setInputPrice(inputNumberPrice)
      return
    }

    if (initCurrency === 'USD') {
      if (
        /^\d*\.?\d*$/.test(inputNumberPrice) &&
        inputNumberPrice.split('.').length <= 2 &&
        !isNaN(parseFloat(inputNumberPrice))
      ) {
        setInputPrice(inputNumberPrice)
      }
    } else {
      if (/^\d*$/.test(inputNumberPrice)) {
        const formattedPrice = formatVND(inputNumberPrice)
        setInputPrice(formattedPrice)
      }
    }
  }

  const handleChangePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const sanitizedValue = value.replace(/[^\d+]/g, '')
    setPhoneNumber(sanitizedValue)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const returnSubmit = !inputChat && !inputPrice && !phoneNumber
    if (isAnimating || returnSubmit) {
      return
    }
    setChatLog(prevChatLog => [
      ...prevChatLog,
      { type: 'user', message: inputChat || phoneNumber || inputPrice + ' ' + initCurrency }
    ])
    phoneNumber ? onSendMessage(inputChat, ACTION_CHAT.CONFIRM_DEAL) : onSendMessage(inputChat)

    setInputChat('')
    setInputPrice('')
    setPhoneNumber('')
  }

  const onSendMessage = async (messageChat: string, newContentType?: string) => {
    try {
      setIsLoading(true)
      setIsAnimating(true)

      const bodySendMessage: ISendMessage = {
        role: 'user',
        content: messageChat,
        conversation_id: conversationId,
        type: 'manual',
        lang: language
        // price: 0,
        // currency: initCurrency,
        // action: 'NONE',
      }
      if (parentId) {
        bodySendMessage.parent_id = parentId
      }
      if (newContentType) {
        bodySendMessage.content_type = newContentType
      }
      if (inputPrice) {
        bodySendMessage.price = removeSpaces(inputPrice)
      }
      if (phoneNumber) {
        bodySendMessage.phone = phoneNumber
      }

      const data = await postSendMessageService(bodySendMessage)
      if (data && data.status_code === 200) {
        setParentId(data.data.id)
        setActionMessage(data.data.action)
        const isEnterPhone = data.data.action === ACTION_CHAT.ENTER_PHONE
        if (isEnterPhone) {
          setDisableInputPhoneNumber(true)
        }
        // set lại mảng cập nhật thêm câu trả lời từ bot
        setChatLog(prevChatLog => [
          ...prevChatLog,
          { type: 'bot', message: data.data.message, action: isEnterPhone ? ACTION_CHAT.ENTER_PHONE : '' }
        ])
        setActionMessage(data.data.action)
      } else if (data.status_code === 406) {
        setIsModalWarning(true)
        setTitleWarning(t('linkNotActive'))
      } else {
        setChatLog(prevChatLog => [...prevChatLog, { type: 'bot', message: t('tryAgain') }])
      }
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setChatLog(prevChatLog => [...prevChatLog, { type: 'bot', message: t('tryAgain') }])
      setIsLoading(false)
    }
  }

  const handleClickYes = () => {
    setDisableInputPhoneNumber(false)
  }

  const handleClickNo = () => {
    setPhoneNumber(t('no'))
    onSendMessage('')
  }

  const renderInputField = () => {
    switch (actionMessage) {
      case ACTION_CHAT.ENTER_PRICE:
        return (
          <Input
            suffix={initCurrency}
            variant="borderless"
            className="px-4 py-2 bg-transparent"
            placeholder={t('enterPrice')}
            value={inputPrice}
            onChange={handleChangePrice}
          />
        )
      case ACTION_CHAT.ENTER_PHONE:
        return (
          <Input
            variant="borderless"
            className="px-4 py-2 bg-transparent"
            maxLength={10}
            placeholder={t('phoneNumber')}
            disabled={disableInputPhoneNumber}
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
          />
        )
      default:
        return (
          <Input
            variant="borderless"
            className="px-4 py-2 bg-transparent"
            type="text"
            placeholder={t('placeHolderMessage')}
            value={inputChat}
            onChange={handleChangeInputChat}
          />
        )
    }
  }

  const handleCloseModalWarning = () => {
    setIsModalWarning(false)
    navigate('/')
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchDataConversation = async () => {
      const urlConversation = sessionStorage.getItem('url_conversation');
      if (urlConversation) {
        setIsLoading(true);
        setIsAnimating(true);

        const bodyConversation = {
          url: JSON.parse(urlConversation)
        };

        try {
          const response = await postConversation(bodyConversation);
          const data = response.data;

          if (data.status_code === 200) {
            window.dataLayer.push({
              event: 'conversation_created',
              url: urlConversation
            });
            console.log('window', window);
            setInitConversation(data.data);
            setConversationId(data.data.id);
            setInitCurrency(data.data.link.currency);
            setActionMessage(data.data.link.action);
            if (data.data.link.type === KEY_CHOOSE_SOMETHING.SELL_SOMETHING) {
              setNegotiation(t('negotiationSell'));
            } else {
              setNegotiation(t('negotiationBuy'));
            }
            if (data.data.link.currency === 'USD') {
              i18n.changeLanguage('en');
              setLanguage('en');
              localStorage.setItem('language', 'en');
            } else {
              i18n.changeLanguage('vn');
              setLanguage('vn');
              localStorage.setItem('language', 'vn');
            }
            setIsLoading(false);
          } else if (data.status_code === 421) {
            setIsLoading(false);
            setIsAnimating(false);
            navigate('/not-found');
          } else if (data.status_code === 406) {
            if (data.errors.message === 'You are owner of this link') {
              setIsModalWarning(true);
              setTitleWarning(t('pleaseAnotherEmail'));
            } else {
              setIsModalWarning(true);
              setTitleWarning(t('tryAgain3Hour'));
            }
          } else if (data.status_code === 404) {
            setIsModalWarning(true);
            setTitleWarning(data.errors.message);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoading(false);
          navigate('/not-found');
        }
      } else {
        // navigate('/not-found');
      }
    };

    const timer = setTimeout(() => {
      fetchDataConversation();
    }, 1000); // Delay by 1 second

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatLog])

  return (
    <div className="flex flex-col h-[85%] md:h-full bg-grey-900 sm:mx-40">
      <div className="flex-grow p-6 overflow-y-auto" ref={chatRef}>
        <div className="flex flex-col space-y-4">
          {initConversation && (
            <div className={'flex justify-start'}>
              <div>
                <Avatar src={<img src={logoSoCool} alt="avatar" />} />
              </div>
              <div className={'bg-[#F4F4F4] ml-4 rounded-3xl p-4 text-[#0D0D0D] max-w-lg'}>
                <TextAnimation
                  text={initConversation.link.initChat + '. ' + negotiation}
                  setIsAnimating={setIsAnimating}
                />
              </div>
            </div>
          )}
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
                  <>
                    <TextAnimation text={message.message} setIsAnimating={setIsAnimating} />
                    {actionMessage === ACTION_CHAT.ENTER_PHONE &&
                      message.action === ACTION_CHAT.ENTER_PHONE &&
                      disableInputPhoneNumber && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Button
                            key="yes"
                            onClick={handleClickYes}
                            className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                          >
                            {t('yes')}
                          </Button>
                          <Button
                            key="no"
                            onClick={handleClickNo}
                            className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                          >
                            {t('no')}
                          </Button>
                        </div>
                      )}
                  </>
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

      {actionMessage !== ACTION_CHAT.CONFIRM_DEAL && (
        <form onSubmit={event => handleSubmit(event)} className="flex-none p-6">
          <div className="flex rounded-3xl border border-[#b6b5b5] bg-[#F4F4F4]">
            {renderInputField()}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={`rounded-3xl ${!inputChat && !phoneNumber && !inputPrice && 'opacity-80'}`}
              loading={isLoading}
            >
              {t('send')}
            </Button>
          </div>
        </form>
      )}
      <CustomModalWarning
        isOpen={isModalWarning}
        titleWarning={titleWarning}
        textButtonConfirm={t('confirm')}
        onCloseModalWarning={handleCloseModalWarning}
      />
    </div>
  )
}

export default ContentChat
