import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // or useNavigate for react-router v6
import { Button, Form, Input, message } from 'antd'
import type { FormProps } from 'antd'
import { IBodyAuthOTP, IBodyAuthRegister } from '../api/core/interface'
import { postAuthOTP, postAuthRegisterService } from '../service'
import { useTranslation } from 'react-i18next'

type FieldType = {
  email?: string
  otp?: string
}

const Login: React.FC = () => {
  const { t } = useTranslation()
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate() // or useNavigate for react-router v6
  const currentUrl = window.location.href
  sessionStorage.setItem('url_conversation', JSON.stringify(currentUrl))

  const handleEmailSubmit: FormProps<FieldType>['onFinish'] = async values => {
    if (values.email) {
      setLoading(true)
      const bodyAuthOTP: IBodyAuthOTP = {
        email: values.email
      }
      try {
        const data = await postAuthOTP(bodyAuthOTP)
        if (data.status_code == 200) {
          setShowOtp(true)
          message.success('OTP sent to your email!')
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
        } else if (data.status_code === 406) {
          message.warning(t('tryAgain8Hour'))
        } else {
          message.error(t('invalidOTP!'))
        }
      } catch (error) {
        message.error(t('invalidOTP!'))
      }
      setLoading(false)
    }
  }

  return (
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
  )
}

export default Login
