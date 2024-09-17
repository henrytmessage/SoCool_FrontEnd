import React, { useState } from 'react';
import { Tabs, Form, Input, Button, message } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { IBodyAuthOTP, IBodyAuthRegister, ILogin, ILoginGoogle } from '../api/core/interface';
import { postAuthOTP, postAuthRegisterService, postLoginGoogleService, postLoginService } from '../service';
import { useNavigate } from 'react-router-dom'; // Use for navigation
import CustomDropDown from '../common/CustomDropDown';
import { postLogin } from '../api/core';

type FieldType = {
  email?: string;
  otp?: string;
};

const AuthPage: React.FC = () => {
  const [form] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('SIGN_IN');
  const [loading, setLoading] = useState(false)

  const handleLogin = async (values: any) => {
    try {
      const bodyLogin: ILogin = { email: values.email, otp: values.otp };
      setLoading(true)
      const data = await postLoginService(bodyLogin)
      if (data.status_code === 200){
        message.success('Login successfully!');
        localStorage.setItem('access_token', data?.data?.access_token)
        localStorage.setItem('expired_time', data?.data?.expired_time)
        localStorage.setItem('refresh_token', data?.data?.refresh_token)
        localStorage.setItem('require_project_or_company_name', data?.data?.require_project_or_company_name)
        navigate('/')
      }else{
        message.error(data.error.message)
      }
    } catch (error) {
      message.error('Login failed!');
    }
  };

  const handleRegister = async (values: any) => {
    const bodyRegister: IBodyAuthRegister = { email: values.email, otp: values.otp };
    setLoading(true)
    try {
      const data = await postAuthRegisterService(bodyRegister);
      if(data.status_code === 200) {
        message.success('Register successfully!');
        localStorage.setItem('access_token', data?.data?.access_token)
        localStorage.setItem('expired_time', data?.data?.expired_time)
        localStorage.setItem('refresh_token', data?.data?.refresh_token)
        localStorage.setItem('require_project_or_company_name', data?.data?.require_project_or_company_name)
        navigate('/');

      } else {
        message.error('Register failed!');
      }
      setLoading(false)
    } catch (error) {
      message.error('Register failed!'); 
      setLoading(false)
    }
  }

  const handleSendOtp = async (email: string) => {
    const bodyAuthOTP: IBodyAuthOTP = { email: email, type: activeTab };
    setLoading(true)
    try {
      const data = await postAuthOTP(bodyAuthOTP);
      if(data.status_code === 200) {
        message.success('OTP sent to your email!');
      } else {
        message.error('Failed to send OTP!');
      }
      setOtpSent(true);
      setLoading(false)
    } catch (error) {
      message.error('Failed to send OTP!');
      setLoading(false)
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("tokenResponse", tokenResponse?.access_token);
        const bodyLoginGoogle: ILoginGoogle = { access_token: tokenResponse?.access_token }
        const data = await postLoginGoogleService(bodyLoginGoogle);
        if(data.status_code === 200) {
          message.success('Logged in with Google successfully!');
          localStorage.setItem('access_token', data?.data?.access_token)
          localStorage.setItem('expired_time', data?.data?.expired_time)
          localStorage.setItem('refresh_token', data?.data?.refresh_token)
          localStorage.setItem('require_project_or_company_name', data?.data?.require_project_or_company_name)
          navigate('/'); 
        } else {
          message.error('Google login failed!');
        }
      } catch (error) {
        message.error('Google login failed!');
      }
    },
    onError: () => {
      message.error('Google login failed!');
    },
  });

  const tabsItems = [
    {
      key: 'login',
      label: 'Login',
      children: (
        <>
          <Form form={form} onFinish={handleLogin}>
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Email" disabled={otpSent} size="large" />
            </Form.Item>
            {otpSent && (
              <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Please enter OTP!' }]}
              >
                <Input.OTP formatter={str => str.toUpperCase()} size="large" />
              </Form.Item>
            )}
            <Form.Item>
              {!otpSent ? (
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={() => handleSendOtp(form.getFieldValue('email'))}
                >
                  Send OTP
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                >
                  {activeTab === 'SIGN_IN' ? 'Login' : 'Sign up'}
                </Button>
              )}
            </Form.Item>
          </Form>
          <Button size='large' block onClick={() => loginWithGoogle()}>
            Sign in with Google
          </Button>
        </>
      ),
    },
    {
      key: 'signup',
      label: 'Sign Up',
      children: (
        <>
          <Form form={form} onFinish={handleRegister}>
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>
            {otpSent && (
              <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Please enter OTP!' }]}
              >
                <Input.OTP formatter={str => str.toUpperCase()} size="large" />
              </Form.Item>
            )}
            <Form.Item>
              {!otpSent ? (
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={() => handleSendOtp(form.getFieldValue('email'))}
                >
                  Send OTP
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                >
                  {activeTab === 'SIGN_IN' ? 'Login' : 'Sign up'}
                </Button>
              )}
            </Form.Item>
          </Form>

          <Button size='large' block onClick={() => loginWithGoogle()}>
            Sign up with Google
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[100%] justify-between">
      <div className="flex flex-col w-[80%] max-w-[500px] mt-20 mx-auto">
        <Tabs defaultActiveKey="login" items={tabsItems} onChange={(key) => setActiveTab(key === 'login' ? 'SIGN_IN' : 'SIGN_UP')}/>
      </div>
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
  );
};

export default AuthPage;
