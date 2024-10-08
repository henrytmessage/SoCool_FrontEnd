import React, { useState } from 'react';
import { Tabs, Form, Input, message, Button, GetProps } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import {
  IBodyAuthOTP,
  IBodyAuthRegister,
  ILogin,
  ILoginGoogle,
} from '../api/core/interface';
import {
  postAuthOTP,
  postAuthRegisterService,
  postLoginGoogleService,
  postLoginService,
} from '../service';
import CustomDropDown from '../common/CustomDropDown';
import { logoGoogle } from '../assets';
import { CustomButton } from '../common';
import { formatDate } from '../function';

type OTPProps = GetProps<typeof Input.OTP>;

const AuthPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  const [otpSignInSent, setOtpSignInSent] = useState(false);
  const [otpSignUpSent, setOtpSignUpSent] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('SIGN_IN');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('')


  // Change OTP
  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text)
  };
  
  const sharedProps: OTPProps = {
    onChange,
  };

  const handleLogin = async (values: any) => {
    try {
      const bodyLogin: ILogin = { email: values.email, otp: otp };
      setLoading(true);
      const data = await postLoginService(bodyLogin);
      if (data.status_code === 200) {
        message.success('Login successfully!');
        localStorage.setItem('access_token', data?.data?.access_token);
        localStorage.setItem('expired_time', data?.data?.expired_time);
        localStorage.setItem('refresh_token', data?.data?.refresh_token);
        localStorage.setItem(
          'require_project_or_company_name',
          data?.data?.require_project_or_company_name
        );
        localStorage.setItem('current_emails_count', data?.data?.current_emails_count);
        localStorage.setItem('max_emails_count', data?.data?.max_emails_count);
        localStorage.setItem('expired_date_email', formatDate(data?.data?.exp));

        navigate('/');
      } else {
        message.error(data.error.message);
      }
    } catch (error) {
      message.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    const bodyRegister: IBodyAuthRegister = { email: values.email, otp: otp };
    setLoading(true);
    try {
      const data = await postAuthRegisterService(bodyRegister);
      if (data.status_code === 200) {
        message.success('Register successfully!');
        localStorage.setItem('access_token', data?.data?.access_token);
        localStorage.setItem('expired_time', data?.data?.expired_time);
        localStorage.setItem('refresh_token', data?.data?.refresh_token);
        localStorage.setItem(
          'require_project_or_company_name',
          data?.data?.require_project_or_company_name
        );
        localStorage.setItem('current_emails_count', data?.data?.current_emails_count);
        localStorage.setItem('max_emails_count', data?.data?.max_emails_count);
        localStorage.setItem('expired_date_email', formatDate(data?.data?.exp));
        navigate('/');
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      message.error('Register failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (email: string, type: string) => {
    const bodyAuthOTP: IBodyAuthOTP = { email: email, type: activeTab };
    setLoading(true);
    try {
      const data = await postAuthOTP(bodyAuthOTP);
      if (data.status_code === 200) {
        message.success('OTP sent to your email!');
        if (type === 'SIGN_IN') {
          setOtpSignInSent(true);
        } else {
          setOtpSignUpSent(true);
        }
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      message.error('Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const bodyLoginGoogle: ILoginGoogle = { access_token: tokenResponse?.access_token };
        const data = await postLoginGoogleService(bodyLoginGoogle);
        if (data.status_code === 200) {
          message.success('Logged in with Google successfully!');
          localStorage.setItem('access_token', data?.data?.access_token);
          localStorage.setItem('expired_time', data?.data?.expired_time);
          localStorage.setItem('refresh_token', data?.data?.refresh_token);
          localStorage.setItem(
            'require_project_or_company_name',
            data?.data?.require_project_or_company_name
          );
          navigate('/');
        } else {
          message.error(data.errors?.message);
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
      label: 'Sign in',
      children: (
        <>
          <Form
            form={loginForm}
            onFinish={handleLogin}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <div className='flex gap-4'>
                <Input placeholder="Email" disabled={otpSignInSent} size="large" />
                <CustomButton
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={() => handleSendOtp(loginForm.getFieldValue('email'), 'SIGN_IN')}
                >
                  Send OTP
                </CustomButton>
              </div>
            </Form.Item>
            {otpSignInSent && (
              <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Please enter OTP!' }]}
              >
                <div className='flex gap-4'>
                  <Input.OTP formatter={(str) => str.toUpperCase()} size="large"  value={otp} {...sharedProps} />
                  <CustomButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                  >
                    {'Sign in'}
                  </CustomButton>
                </div>
              </Form.Item>
            )}
          </Form>
          <Button className='w-full' size='large' onClick={()=> loginWithGoogle()}>
            <img src={logoGoogle} alt='Google logo' style={{ width: '20px', height: '20px' }} />
            Sign in with Google
          </Button>
        </>
      ),
    },
    {
      key: 'signup',
      label: 'Sign up',
      children: (
        <>
          <Form
            form={registerForm}
            onFinish={handleRegister}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <div className='flex gap-4'>
                <Input placeholder="Email" size="large" />
                <CustomButton
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={() => handleSendOtp(registerForm.getFieldValue('email'), 'SIGN_UP')}
                >
                  Send OTP
                </CustomButton>
              </div>
            </Form.Item>
            {otpSignUpSent && (
              <Form.Item
                name="otp"
                rules={[{ required: true, message: 'Please enter OTP!' }]}
              >
                <div className='flex gap-4'>
                  <Input.OTP formatter={(str) => str.toUpperCase()} size="large" value={otp}  {...sharedProps}/>
                  <CustomButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                  >
                    {'Sign up'}
                  </CustomButton>
                </div>
              </Form.Item>
            )}
          </Form>
          <Button className='w-full' size='large' onClick={() => loginWithGoogle()} >
            <img src={logoGoogle} alt='Google logo' style={{ width: '20px', height: '20px' }} />
            Sign up with Google
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-[100%] justify-between">
      <div className="flex flex-col w-[80%] max-w-[500px] mt-20 mx-auto">
        <Tabs
          size="large"
          defaultActiveKey="login"
          items={tabsItems}
          onChange={(key) => setActiveTab(key === 'login' ? 'SIGN_IN' : 'SIGN_UP')}
        />
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
