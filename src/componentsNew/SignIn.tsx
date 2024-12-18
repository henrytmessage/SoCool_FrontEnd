import React, { useState } from 'react';
import { Form, Input, message, Button, Typography } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { IBodyAuthOTP, ILoginGoogle } from '../api/core/interface';
import { postAuthOTP, postLoginGoogleService } from '../service';
import { logoGoogle } from '../assets';
import { formatDate } from '../function';
import { CustomButton } from '../common';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loginForm] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (values: any) => {
    try {
      const bodyAuthOTP: IBodyAuthOTP = { email: values.email, type: 'SIGN_IN' };
      setLoading(true);
      const data = await postAuthOTP(bodyAuthOTP);
      if (data.status_code === 200) {
        message.success('OTP sent to your email!');
        setOtpSent(true);
        navigate(`/otp?email=${values?.email}&type=SIGN_IN`);
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
          localStorage.setItem('user_id',data?.data?.user_id)
          localStorage.setItem('access_token', data?.data?.access_token);
          localStorage.setItem('expired_time', data?.data?.expired_time);
          localStorage.setItem('refresh_token', data?.data?.refresh_token);
          localStorage.setItem('require_project_or_company_name', data?.data?.require_project_or_company_name);
          localStorage.setItem('current_emails_count', data?.data?.current_emails_count);
          localStorage.setItem('max_emails_count', data?.data?.max_emails_count);
          localStorage.setItem('expired_date_email', formatDate(data?.data?.exp));
          localStorage.setItem('is_admin',data?.data?.is_admin)
          localStorage.setItem('email',data?.data?.email)
          if (data?.data?.require_project_or_company_name == true || data?.data?.require_project_or_company_name == 'true'){
            navigate('/');
          }else{
            navigate('/')
          }

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
        <Title level={2} className="text-center">Log in with SoCool</Title>
        <Form
          form={loginForm}
          onFinish={handleSendOtp}
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
          <CustomButton
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            classNameCustom="w-full"
          >
            Login with email
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
