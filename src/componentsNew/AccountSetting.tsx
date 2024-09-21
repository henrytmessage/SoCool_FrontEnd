import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, GetProps, Input, message, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getAccountSettingService, postAuthOTP, postUpdateAccountSettingService } from '../service';
import { IUpdateAccountSetting } from '../api/core/interface';
import ModalPlan from './ModalPlan';

const { Title, Text } = Typography;
type OTPProps = GetProps<typeof Input.OTP>;
const AccountSettings: React.FC = () => {
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [plan, setPlan] = useState('')
  const [receivedEmail, setReceivedEmail] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isSendOtp, setIsSendOtp] = useState(false);
  const [openModalOtp, setOpenModalOtp] = useState(false)
  const [otp, setOtp] = useState('')
  const [isPlanModalVisible, setIsPlanModalVisible] = useState<boolean>(false);

  const showPlanModal = () => {
    setIsPlanModalVisible(true);
  };

  const hidePlanModal = () => {
    setIsPlanModalVisible(false);
  };

  const handleDeleteAccount = () => {
    // Logic to delete account
    console.log('Delete account clicked');
  };

  const toggleEditCompany = () => {
    setIsEditingCompany(!isEditingCompany);
    setIsSendOtp(true)
  };

  const toggleEditEmail = () => {
    setIsEditingEmail(!isEditingEmail);
    setIsSendOtp(true)
  };

  const handleSendOtp = async () => {
    const bodyAuthOTP = {
      email: receivedEmail,
      type: 'CHANGE_NOTIFY_EMAIL'
    }
    try {
      const data = await postAuthOTP(bodyAuthOTP)
      if(data.status_code === 200) {
        message.success('OTP sent to your email!');
        setOpenModalOtp(true)
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalOk =  async () => {
    const bodyUpdateAccount: IUpdateAccountSetting = {
      project_or_company_name: companyName,
      received_email: receivedEmail,
      registered_email: registeredEmail,
      otp: otp
    }
    try {
      const data = await postUpdateAccountSettingService(bodyUpdateAccount)
      if(data.status_code === 200) {
        message.success('Update account setting successful!');
        setOpenModalOtp(false)
      } else {
        message.error(data.errors?.message);
        setOpenModalOtp(false)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleModalCancel = () => {
    setOpenModalOtp(false);
  }

  // Change OTP
  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text)
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  useEffect(() => {
    const getInfoAccount = async () => {
      try {
        const res = await getAccountSettingService()
        if(res.status_code === 200) {
          setCompanyName(res?.data?.company_or_project_name)
          setPlan(res?.data?.plan_name)
          setReceivedEmail(res?.data?.received_email)
          setRegisteredEmail(res?.data?.registered_email)
        }
      } catch (error) {
        console.log("error.", error);
      }
    }
    getInfoAccount()
  }, [])

  return (
    <div className="p-6">
      <Card className="shadow-lg">
        <Title level={2}>Account Settings</Title>

        <div className='flex gap-10 items-center'>
          <div className="mb-4 flex items-center justify-center gap-5">
            <Text strong>Plan Name: </Text>
            <span>{plan}</span>
            <Button type="primary" onClick={showPlanModal} className="ml-4">
              Change Plan
            </Button>
          </div>
        </div>
        <Divider style={{  borderColor: '#9999' }} />

        <div className="mb-4 flex items-center gap-5">
          <Text strong>Company Name or Project Name:</Text>
          {isEditingCompany ? (
            <div>
              <Input 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>
          ) : (
            <div >{companyName}</div>
          )}
          <Button 
            icon={<EditOutlined />} 
            onClick={toggleEditCompany} 
             
          />
        </div>
        <Divider style={{  borderColor: '#9999' }} />

        <div className="mb-4 flex items-center gap-5">
          <Text strong>Registered Emails to receive CV screening results from the smart emails:</Text>
          {isEditingEmail ? (
            <div>
              <Input 
                value={registeredEmail} 
                onChange={(e) => setRegisteredEmail(e.target.value)} 
                 
              />
          </div>
          ) : (
            <div >{registeredEmail}</div>
          )}
          <Button 
            icon={<EditOutlined />} 
            onClick={toggleEditEmail} 
             
          />
        </div>
        <Divider style={{  borderColor: '#9999' }} />

        <div className='mb-4 flex items-center gap-5'>
          <Text strong>Initial Signed-Up Emails: </Text>
          <span>{receivedEmail}</span>
        </div>
        <Divider style={{  borderColor: '#9999' }} />

        <div className='flex gap-10'>
          <Button type="primary" danger onClick={handleDeleteAccount}>
            Delete My Account
          </Button>

          {isSendOtp && (
            <Button type="primary" onClick={handleSendOtp} className="mb-4">
              Confirm Change
            </Button>
          )}
        </div>
      </Card>
      <Modal
        title="Enter OTP"
        visible={openModalOtp}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input.OTP
          value={otp}
          formatter={str => str.toUpperCase()}
          {...sharedProps}
        />
      </Modal>
      <ModalPlan visible={isPlanModalVisible} onClose={hidePlanModal} />
    </div>
  );
};

export default AccountSettings;