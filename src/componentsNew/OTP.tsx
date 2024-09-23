import React, { useEffect, useState } from 'react';
import { Input, Button, Typography, message, Form } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomButton } from '../common';
import { OTPProps } from 'antd/es/input/OTP';
import { postAuthOTP, postAuthRegisterService, postLoginService } from '../service';
import { IBodyAuthOTP, IBodyAuthRegister, ILogin } from '../api/core/interface';
import { formatDate } from '../function';

const { Title, Text } = Typography;

const SendOTP: React.FC = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const isLogin = location.pathname.includes('login');
  const [sendOTPForm] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [type, setType] = useState('')
  const [email, setEmail] = useState('')

  const handleOtpSubmit = () => {
    if (type === 'SIGN_IN') {
      handleLogin(email); 
    } else if (type === 'SIGN_UP') {
      handleRegister(email); 
    }
  };

  const handleResendOtp = async () => {
    try {
      const bodyAuthOTP: IBodyAuthOTP = { email: email, type: type };
      setLoading(true);
      const data = await postAuthOTP(bodyAuthOTP);
      if (data.status_code === 200) {
        message.success('OTP sent to your email!');
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      message.error('Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };


  const onOtpChange: OTPProps['onChange'] = (text) => {
    setOtp(text);
  };

  const otpInputProps: OTPProps = {
    onChange: onOtpChange,
  };

  const handleRegister = async (email: string) => {
    const bodyRegister: IBodyAuthRegister = { email, otp };
    setLoading(true);
    try {
      const data = await postAuthRegisterService(bodyRegister);
      if (data.status_code === 200) {
        message.success('Register successfully!');
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('expired_time', data.data.expired_time);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        localStorage.setItem('require_project_or_company_name', data.data.require_project_or_company_name);
        localStorage.setItem('current_emails_count', data.data.current_emails_count);
        localStorage.setItem('max_emails_count', data.data.max_emails_count);
        localStorage.setItem('expired_date_email', formatDate(data.data.exp));
        localStorage.setItem('is_admin',data?.data?.is_admin)
        localStorage.setItem('email',data?.data?.email)
        navigate('/companyOrProduct');
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      message.error('Register failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string) => {
    setLoading(true);
    try {
      const bodyLogin: ILogin = { email, otp };
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
        localStorage.setItem('email',data?.data?.email)
        if (data?.data?.require_project_or_company_name == true){
          navigate('/companyOrProduct');
        }else{
          navigate('/')
        }
      } else {
        message.error(data.error.message);
      }
    } catch (error) {
      message.error('Login failed!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    const emailParam = searchParams.get('email');

    if (typeParam) {
      setType(typeParam);
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col items-center justify-center px-4 mt-14">
      <div className="flex flex-col w-full max-w-md bg-white p-6 rounded-lg">
      <Title level={2} className="text-center">Check your email for a code</Title>
      <Text>
      We've sent a 6-digit code to <Text strong>{email}</Text>. The code expires shortly, so please enter it soon.
      </Text>
      <Form
          form={sendOTPForm}
          onFinish={handleOtpSubmit}
          layout="vertical"
          className="mt-4"
        >
            <Form.Item
              name="otp"
              rules={[{ required: true, message: 'Please enter OTP!' }]}
              className="mt-4 flex justify-center"
            >
              <Input.OTP
                size="large"
                value={otp}
                {...otpInputProps}
              />
            </Form.Item>
          <CustomButton
            type="primary"
            size="large"
            onClick={handleOtpSubmit} 
            loading={loading}
            classNameCustom="w-full"
          >
            Confirm
          </CustomButton>
        </Form>
      <div className='mt-10 text-center'>
        <Text>Haven't received your code? </Text>
        <Button type="link" onClick={handleResendOtp}>
          Resend code
        </Button>
      </div>
    </div>
    </div>
  );
};

export default SendOTP;
