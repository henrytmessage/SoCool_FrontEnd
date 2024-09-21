import React, { useState } from 'react';
import { Form, Input, message, Button, Typography } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { IBodyAuthOTP, ILogin, ILoginGoogle } from '../api/core/interface';
import { postAuthOTP, postLoginGoogleService, postLoginService } from '../service';
import { logoGoogle } from '../assets';
import { formatDate } from '../function';
import { OTPProps } from 'antd/es/input/OTP';
import { CustomButton } from '../common';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  // Change OTP
  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  // Combined button functionality for sending OTP and logging in
  const handleLoginOrSendOtp = async (values: any) => {
    if (!otpSent) {
      // Send OTP
      try {
        const bodyAuthOTP: IBodyAuthOTP = { email: values.email, type: 'SIGN_IN' };
        setLoading(true);
        const data = await postAuthOTP(bodyAuthOTP);
        if (data.status_code === 200) {
          message.success('OTP sent to your email!');
          setOtpSent(true);
        } else {
          message.error(data.errors?.message);
        }
      } catch (error) {
        message.error('Failed to send OTP!');
      } finally {
        setLoading(false);
      }
    } else {
      // Login
      try {
        const bodyLogin: ILogin = { email: values.email, otp };
        setLoading(true);
        const data = await postLoginService(bodyLogin);
        if (data.status_code === 200) {
          message.success('Login successfully!');
          localStorage.setItem('access_token', data?.data?.access_token);
          localStorage.setItem('expired_time', data?.data?.expired_time);
          localStorage.setItem('refresh_token', data?.data?.refresh_token);
          localStorage.setItem('require_project_or_company_name', data?.data?.require_project_or_company_name);
          localStorage.setItem('current_emails_count', data?.data?.current_emails_count);
          localStorage.setItem('max_emails_count', data?.data?.max_emails_count);
          localStorage.setItem('expired_date_email', formatDate(data?.data?.exp));
          localStorage.setItem('is_admin',data?.data?.is_admin)
          navigate('/');
        } else {
          message.error(data.error.message);
        }
      } catch (error) {
        message.error('Login failed!');
      } finally {
        setLoading(false);
      }
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
          localStorage.setItem('require_project_or_company_name', data?.data?.require_project_or_company_name);
          localStorage.setItem('current_emails_count', data?.data?.current_emails_count);
          localStorage.setItem('max_emails_count', data?.data?.max_emails_count);
          localStorage.setItem('expired_date_email', formatDate(data?.data?.exp));
          localStorage.setItem('is_admin',data?.data?.is_admin)
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

  return (
    <div className="flex flex-col items-center justify-center px-4 mt-14">
      <div className="flex flex-col w-full max-w-md bg-white p-6 rounded-lg">
        <Title level={2} className="text-center">Login with SoCool</Title>
        <Form
          form={loginForm}
          onFinish={handleLoginOrSendOtp}
          layout="vertical"
          className="mt-4 "
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input
              placeholder="Email (name@email.com)"
              size="large"
              disabled={otpSent}
            />
          </Form.Item>
          {otpSent && (
            <Form.Item
              name="otp"
              rules={[{ required: true, message: 'Please enter OTP!' }]}
              className="mt-4 flex justify-center"
            >
              <Input.OTP
                size="large"
                value={otp}
                {...sharedProps}
              />
            </Form.Item>
          )}
          <CustomButton
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            classNameCustom="w-full"
          >
            {otpSent ? 'Login with email' : 'Send OTP'}
          </CustomButton>
        </Form>
        <div className="text-center my-4">OR</div>
        <Button
          className="flex items-center justify-center w-full"
          size="large"
          onClick={() => loginWithGoogle()}
        >
          <img src={logoGoogle} alt="Google logo" className="mr-2" style={{ width: '20px', height: '20px' }} />
          Continue with Google
        </Button>
        <div className="text-center mt-4">
          <Text>New to SoCool? <a href="/signup">Create an account</a></Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
