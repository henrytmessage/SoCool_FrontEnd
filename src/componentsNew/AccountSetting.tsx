import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, GetProps, Input, message, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { deleteUserService, getAccountSettingService, postAuthOTP, postUpdateAccountSettingService } from '../service';
import { IUpdateAccountSetting } from '../api/core/interface';
import ModalPlan from './ModalPlan';
import PopupModal from './PopupModal';
import { useNavigate } from 'react-router-dom';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState(false)
  const navigate = useNavigate();

  const showPlanModal = () => {
    setIsPlanModalVisible(true);
  };

  const hidePlanModal = () => {
    setIsPlanModalVisible(false);
  };

  const handleDeleteAccount = () => {
    handleRemove()
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
      email: registeredEmail,
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
      project_or_company_name: companyName ? companyName : '',
      received_email: receivedEmail ? receivedEmail : '',
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

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleRemove = () => {
    setIsModalVisible(true)
  }

  const deleteUser = async () => {
    setLoadingPopup(true)
    const response = await deleteUserService()
    try{
      if (response.status_code == 200 ){
        localStorage.clear(); 
        navigate('/login'); 
        message.success('Your account have been deleted!')
      }else{
        message.error(response.errors.message)
      }
    }catch(error){
      message.error(response.error)
    }finally{
      setLoadingPopup(true)
      hideModal()
    }
  }

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
    <div className="p-6 ml-8">
      {/* <Card className=""> */}
        <Title level={2}>Account Settings</Title>

        <div className='flex gap-10 items-center'>
          <div className="mb-2 mt-10 flex items-center justify-center gap-5">
            <Text strong>Plan Name: </Text>
            <span>{plan}</span>
            <Button type="primary" onClick={showPlanModal} className="ml-4">
              Change Plan
            </Button>
          </div>
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className="mb-2 flex items-center gap-5">
          <Text strong>Company Name or Project Name:</Text>
          {isEditingCompany ? (
            <div>
              <Input 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
              />
            </div>
          ) : (
            <div style={{ color: '#c0c0c0' }}  >{companyName}</div>
          )}
          <Button 
            icon={<EditOutlined />} 
            onClick={toggleEditCompany} 
             
          />
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className="mb-2 flex items-center gap-5">
          <Text strong>Registered Emails to receive CV screening results from the smart emails:</Text>
          {isEditingEmail ? (
            <div>
              <Input 
                value={receivedEmail} 
                onChange={(e) => setReceivedEmail(e.target.value)} 
                 
              />
          </div>
          ) : (
            <div style={{ color: '#c0c0c0' }}  >{receivedEmail}</div>
          )}
          <Button 
            icon={<EditOutlined />} 
            onClick={toggleEditEmail} 
             
          />
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className='mb-2 flex items-center gap-5'>
          <Text strong>Initial Signed-Up Emails: </Text>
          <span style={{ color: '#c0c0c0' }} >{registeredEmail}</span>
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

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
      {/* </Card> */}
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

      <PopupModal isVisible = {isModalVisible} hideModal={hideModal} confirm = { deleteUser } loading = {loadingPopup} title='Are you sure to delete your account?'/>
    </div>
  );
};

export default AccountSettings;
