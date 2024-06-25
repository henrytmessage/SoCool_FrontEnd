import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getExample } from '../service';
import TypingAnimation from './TypingAnimation'
import { Avatar, Button } from 'antd';
import {logoSoCool} from '../assets'
import TextAnimation from './TextAnimation';

interface IChatLog {
  type: string,
  message: string,
}

const ContentChat = () => {
  const { t } = useTranslation();
  const [inputChat, setInputChat] = useState('')
  const [chatLog, setChatLog] = useState<IChatLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false);
  

  const handleChangeInputChat = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChat(e.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAnimating) {
      console.log("isAnimating", isAnimating);
      return;
    };
    setChatLog((prevChatLog) => [...prevChatLog, {type: 'user', message: inputChat}])
    onSendMessage(inputChat)
    setInputChat('')
  }

  // đang fake dữ liệu sau sẽ thay thế = api của mình
  const onSendMessage = async (messageChat: string)  => {
   // gọi api post đang fake
    try {
      setIsLoading(true);
      setIsAnimating(true)

      const data = await getExample(messageChat); 
      const MOCK_DATA = "Khi SaleGPT chat với 1 buyer thì mục tiêu là thuyết phục buyer mua với mức giá càng cao càng tốt (nhưng ko được tiết lộ mức giá mục tiêu B).		Khi chat sẽ hướng tới tìm 1 mức giá phù hợp, lấy từ dữ liệu mà buyer input.		Cần đánh giá sự nghiêm túc - quan tâm thật sự khi buyer input giá mua. Tránh các case trolling, chỉ dò hỏi giá.		Cùng 1 email, trong 1 ngày chỉ dc xác nhận 1 lần gửi negotiation."
  
      // set lại mảng cập nhật thêm câu trả lời từ bot
      setTimeout(() => {
        setChatLog((prevChatLog) => [...prevChatLog, {type: 'bot', message: MOCK_DATA}]);
        setIsLoading(false);
      }, 3000);

    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  }
 
  return (
    // <div className='container mx-auto max-w-[1200px]'>
      <div className='flex flex-col h-screen bg-grey-900'>
        <div className='flex-grow p-6'>
          <div className='flex flex-col space-y-4'>
            {
              chatLog.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end': 'justify-start'}`}>
                  {  
                    message.type === 'bot' && <Avatar src={<img src={logoSoCool} alt="avatar" />} />
                  }
                  <div  className={`${
                    message.type === 'user' ? 'bg-[#F4F4F4]' : 'bg-[#F4F4F4] ml-4'
                    } rounded-3xl  p-4 text-[#0D0D0D] max-w-lg `}>
                    {message.type =='bot' ? <TextAnimation text={message.message} setIsAnimating={setIsAnimating}/> : message.message}
                  </div>
                </div>
              ))
            }
            {
              isLoading && <div key={chatLog.length} className='flex justify-start'>
                <Avatar src={<img src={logoSoCool} alt="avatar" />} />

                <div className='bg-[#F4F4F4] rounded-3xl  p-4 text-white max-w-sm ml-4'>
                  <TypingAnimation/>
                </div>
              </div>
            }
          </div>
        </div>
    
      <form onSubmit={event => handleSubmit(event)} className='flex-none p-6'>
        <div className='flex rounded-3xl  border border-[#b6b5b5] bg-[#F4F4F4]'>
          <input className='flex-grow px-4 py-2 bg-transparent text-[#0D0D0D] focus:outline-none' type="text"  placeholder={t('placeHolderMessage')} value={inputChat} onChange={(e) => handleChangeInputChat(e)}/>
          <Button type="primary" htmlType="submit"  size='large' className='rounded-3xl' loading={isLoading}>
            {t('send')}
          </Button>
        </div>
      </form>
      </div>
    // </div>
  )
}

export default ContentChat