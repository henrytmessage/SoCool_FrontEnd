import React, { useState } from 'react';
import { Form, Input, message, Button, Typography } from 'antd';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { IBodyAuthOTP, IBodyAuthRegister, ILoginGoogle } from '../api/core/interface';
import { postAuthOTP, postAuthRegisterService, postLoginGoogleService } from '../service';
import { logoGoogle } from '../assets';
import { formatDate } from '../function';
import { OTPProps } from 'antd/es/input/OTP';
import { CustomButton } from '../common';

const { Title, Text } = Typography;

const SignUpPage: React.FC = () => {
  const [registerForm] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý thay đổi OTP
  const onOtpChange: OTPProps['onChange'] = (text) => {
    setOtp(text);
  };

  // Cấu hình chung cho Input OTP
  const otpInputProps: OTPProps = {
    onChange: onOtpChange,
  };

  // Hàm gửi OTP
  const handleSendOtp = async (email: string) => {
    const bodyAuthOTP: IBodyAuthOTP = { email, type: 'SIGN_UP' };
    setLoading(true);
    try {
      const data = await postAuthOTP(bodyAuthOTP);
      if (data.status_code === 200) {
        message.success('OTP sent to your email!');
        setOtpSent(true); // OTP đã được gửi, hiển thị trường nhập OTP và thay đổi chức năng nút.
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      message.error('Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  // Hàm đăng ký
  const handleRegister = async (values: any) => {
    const bodyRegister: IBodyAuthRegister = { email: values.email, otp };
    setLoading(true);
    try {
      const data = await postAuthRegisterService(bodyRegister);
      if (data.status_code === 200) {
        message.success('Register successfully!');
        // Lưu trữ thông tin vào localStorage
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('expired_time', data.data.expired_time);
        localStorage.setItem('refresh_token', data.data.refresh_token);
        localStorage.setItem('require_project_or_company_name', data.data.require_project_or_company_name);
        localStorage.setItem('current_emails_count', data.data.current_emails_count);
        localStorage.setItem('max_emails_count', data.data.max_emails_count);
        localStorage.setItem('expired_date_email', formatDate(data.data.exp));
        localStorage.setItem('is_admin',data?.data?.is_admin)
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

  // Hàm xử lý nút Sign up with email
  const handleButtonClick = async () => {
    if (!otpSent) {
      // Nếu chưa gửi OTP, gọi hàm gửi OTP
      handleSendOtp(registerForm.getFieldValue('email'));
    } else {
      // Nếu đã gửi OTP, gọi hàm đăng ký
      registerForm.submit(); // Kích hoạt onFinish của Form để đăng ký
    }
  };

  // Hàm đăng nhập bằng Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const bodyLoginGoogle: ILoginGoogle = { access_token: tokenResponse.access_token };
        const data = await postLoginGoogleService(bodyLoginGoogle);
        if (data.status_code === 200) {
          message.success('Logged in with Google successfully!');
          localStorage.setItem('access_token', data.data.access_token);
          localStorage.setItem('expired_time', data.data.expired_time);
          localStorage.setItem('refresh_token', data.data.refresh_token);
          localStorage.setItem('require_project_or_company_name', data.data.require_project_or_company_name);
          localStorage.setItem('current_emails_count', data.data.current_emails_count);
          localStorage.setItem('max_emails_count', data.data.max_emails_count);
          localStorage.setItem('expired_date_email', formatDate(data.data.exp));
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
        <Title level={2} className="text-center">Sign up with SoCool</Title>
        <Form
          form={registerForm}
          onFinish={handleRegister}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
          >
            <Input
              placeholder="Email (name@email.com)"
              size="large"
              disabled={otpSent} // Vô hiệu hóa trường email nếu đã gửi OTP
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
                {...otpInputProps}
              />
            </Form.Item>
          )}
          <CustomButton
            type="primary"
            size="large"
            onClick={handleButtonClick} // Gọi hàm xử lý nút
            loading={loading}
            classNameCustom="w-full"
          >
            {otpSent ? 'Sign up with email' : 'Send OTP'} {/* Thay đổi text của nút */}
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
          <Text>Already have an account? <a href="/login">Login</a></Text>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
