import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // or useNavigate for react-router v6
import { Avatar, Button, Form, Input, message } from 'antd'
import type { FormProps } from 'antd'
import { IBodyAuthOTP, IBodyAuthRegister, IBodyConversation } from '../api/core/interface'
import { getConversationService, postAuthOTP, postAuthRegisterService } from '../service'
import { useTranslation } from 'react-i18next'
import { logoSoCool } from '../assets'
import TypingAnimation from './TypingAnimation'
import TextAnimation from './TextAnimation'
import CustomModalWarning from '../common/CustomModalWarning'
import CustomDropDown from '../common/CustomDropDown'

type FieldType = {
  email?: string
  otp?: string
}

const Login: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const navigate = useNavigate() // or useNavigate for react-router v6
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [textInitInfo, setTextInitInfo] = useState('')
  const [titleWarning, setTitleWarning] = useState('')
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [code, setCode] = useState('')

  let currentUrl = window.location.href

  const handleEmailSubmit: FormProps<FieldType>['onFinish'] = async values => {
    if (values.email) {
      setLoading(true)
      const bodyAuthOTP: IBodyAuthOTP = {
        email: values.email,
      }
      try {
        const data = await postAuthOTP(bodyAuthOTP)
        if (data.status_code === 200) {
          setShowOtp(true)
          message.success('OTP sent to your email!')
        } else if (data.status_code === 406) {
          if (data.errors.message === 'You are owner of this link') {
            setIsModalWarning(true)
            setTitleWarning(t('pleaseAnotherEmail'))
          } else {
            setIsModalWarning(true)
            setTitleWarning(t('tryAgain3Hour'))
          }
        }
      } catch (error) {
        message.error('Failed to send OTP!')
      }
      setLoading(false)
    }
  }

  const handleOtpSubmit: FormProps<FieldType>['onFinish'] = async values => {
    if (values.otp && values.email) {
      setLoading(true)
      const bodyAuthRegister: IBodyAuthRegister = {
        email: values.email,
        otp: values.otp
      }
      try {
        const data = await postAuthRegisterService(bodyAuthRegister)
        if (data.status_code === 200) {
          sessionStorage.setItem('access_token', JSON.stringify(data.data))
          message.success(t('loginSuccessful'))
          navigate('/chat')
        } else if (data.status_code === 400) {
          message.error(t('tryAgain'))
        } else {
          message.error(t('invalidOTP!'))
        }
      } catch (error) {
        message.error(t('invalidOTP!'))
      }
      setLoading(false)
    }
  }

  const renderInitInfoLogin = () => (
    <div className="flex justify-start mb-8">
      <div>
        <Avatar src={<img src={logoSoCool} alt="avatar" />} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-gray-200 ml-4 rounded-3xl p-4 text-gray-800 max-w-screen-xl">
          {isLoadingInfo ? <TypingAnimation /> : <TextAnimation text={textInitInfo} />}
        </div>
      </div>
    </div>
  )

  const handleCloseModalWarning = () => {
    setIsModalWarning(false)
    navigate('/')
  }

  useEffect(() => {
    // clean url when click from facebook
    if (currentUrl.includes('&')) {
      currentUrl = currentUrl.split('?')[0] + '?' + currentUrl.split('?')[1].split('&')[0]
      window.history.replaceState({}, document.title, currentUrl)
    }
    setCode(currentUrl.split('?')[1])
    sessionStorage.setItem('url_conversation', JSON.stringify(currentUrl))
    const fetchDataConversation = async () => {
      setIsLoadingInfo(true)

      const bodyConversation: IBodyConversation = {
        url: currentUrl
      }
      try {
        const response = await getConversationService(bodyConversation)
        if (response.status_code === 200) {
          setTextInitInfo(response.data)
          setIsLoadingInfo(false)
        } else if (response.status_code === 400) {
          setTitleWarning(t('linkHasExpired'))
          setIsLoadingInfo(false)
          setIsModalWarning(true)
        } else if (response.status_code === 404) {
          setIsModalWarning(true)
          setTitleWarning(response.errors.message)
        } else {
          setTextInitInfo(t('startConversation'))
          setIsLoadingInfo(false)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setTextInitInfo(t('startConversation'))
        setIsLoadingInfo(false)
      }
    }

    fetchDataConversation()
  }, [])

  return (
    <div className="flex flex-col h-[100%] justify-between">
      <Form
        form={form}
        name="login"
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 22 }}
        style={{ maxWidth: 500 }}
        onFinish={showOtp ? handleOtpSubmit : handleEmailSubmit}
        autoComplete="off"
        className="flex flex-col w-[80%] max-w-[500px] mt-20 mx-auto"
      >
        {renderInitInfoLogin()}
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Input disabled={showOtp} size="large" />
        </Form.Item>

        {showOtp && (
          <Form.Item<FieldType>
            label="OTP"
            name="otp"
            rules={[{ required: true, message: 'Please input your OTP!' }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input.OTP formatter={str => str.toUpperCase()} size="large" />
          </Form.Item>
        )}

        <Form.Item className="mx-auto">
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {showOtp ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </Form.Item>
      </Form>
      <CustomModalWarning
        isOpen={isModalWarning}
        titleWarning={titleWarning}
        textButtonConfirm={t('confirm')}
        onCloseModalWarning={handleCloseModalWarning}
      />
      <div className="text-center">
        By using SoCool, you agree to our{' '}
        <span className="font-bold">
          <a href="Terms">Terms</a>
        </span>{' '}
        and have read our Privacy{' '}
        <span className="font-bold">
          <a href="Policy">Policy</a>
        </span>
        .
        <CustomDropDown />
      </div>
    </div>
  )
}

export default Login
