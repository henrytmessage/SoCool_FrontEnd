import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, GetProps, Input, message, Modal, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { deleteUserService, getAccountSettingService, postAuthOTP, postUpdateAccountSettingService } from '../service';
import { IUpdateAccountSetting } from '../api/core/interface';
import ModalPlan from './ModalPlan';
import PopupModal from './PopupModal';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../common';

const { Title, Text } = Typography;
type OTPProps = GetProps<typeof Input.OTP>;
const AccountSettings: React.FC = () => {
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
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)
  const [isLoadingOtp, setIsLoadingOtp] = useState(false)

  const showPlanModal = () => {
    setIsPlanModalVisible(true);
  };

  const hidePlanModal = () => {
    setIsPlanModalVisible(false);
  };

  const handleDeleteAccount = () => {
    handleRemove()
  };

  const handleSendOtp = async () => {
    const bodyAuthOTP = {
      email: registeredEmail,
      type: 'CHANGE_NOTIFY_EMAIL'
    }
    try {
      setIsLoadingEdit(true)
      const data = await postAuthOTP(bodyAuthOTP)
      if(data.status_code === 200) {
        message.success('OTP sent to your email!');
        setOpenModalOtp(true)
        setIsSendOtp(false)
      } else {
        message.error(data.errors?.message);
      }
      setIsLoadingEdit(false)
    } catch (error) {
      console.log(error);
      setIsLoadingEdit(false)
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
      setIsLoadingOtp(true)
      const data = await postUpdateAccountSettingService(bodyUpdateAccount)
      if(data.status_code === 200) {
        message.success('Update account setting successful!');
        setOpenModalOtp(false)
      } else {
        message.error(data.errors?.message);
      }
      setIsLoadingOtp(false)
    } catch (error) {
      console.log(error);
      setIsLoadingOtp(false)
    }
  }

  const handleModalCancel = () => {
    setOpenModalOtp(false);
  }

  const handleModalEditCancel = () => {
    setIsSendOtp(false);
    setOtp('')
  }

  const onOpenModalEdit = () => {
    setIsSendOtp(true);
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
        <div className='mb-2 flex items-center gap-5'>
          <Text strong>Account: </Text>
          <span  >{registeredEmail}</span>
        </div>
        <Divider className='mt-10' style={{  borderColor: '#eeeee4' }} />

        <div className='flex gap-5 items-center'>
            <Text strong>Plan Name: </Text>
            <span>{plan}</span>
            <Button type="primary" onClick={showPlanModal} className="ml-4">
              Change Plan
            </Button>
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className='mb-2 flex items-center gap-5'>
          <Text strong>Expired Date: </Text>
          <span  >{localStorage.getItem('expired_date_email')}</span>
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className="mb-2 flex items-center gap-5">
          <Text strong>Company Name or Project Name:</Text>
            <div style={{ color: '#c0c0c0' }}  >{companyName}</div>
          <Button 
            icon={<EditOutlined />} 
            onClick={onOpenModalEdit} 
          />
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className="mb-2 flex items-center gap-5">
          <Text strong>Registered Emails to receive CV screening results from the smart emails:</Text>
            <div style={{ color: '#c0c0c0' }}  >{receivedEmail}</div>
          <Button 
            icon={<EditOutlined />} 
            onClick={onOpenModalEdit} 
             
          />
        </div>
        <Divider style={{  borderColor: '#eeeee4' }} />

        <div className='flex gap-10'>
          <Button type="primary" danger onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </div>
      <Modal
        title="Edit Account"
        visible={isSendOtp}
        onCancel={handleModalEditCancel}
        footer={[
          // <CustomButton
          //   key="back"
          //   onClick={handleModalEditCancel}
          //   classNameCustom="outline outline-0 bg-gray-200 text-gray-800 hover:bg-gray-300"
          // >
          //   Back
          // </CustomButton>,
          <CustomButton key="submit" onClick={handleSendOtp} classNameCustom="ml-6" loading={isLoadingEdit}>
            Submit
          </CustomButton>
        ]}
      >
        <div className='flex flex-col gap-5'>
         <div>
            <div className='mb-2'><Text strong>Company Name or Project Name: </Text></div>
            <Input 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
            />
         </div>
          <div>
            <div className='mb-2'><Text strong>Registered Emails to receive CV screening results from the smart emails: </Text></div>
            <Input 
              value={receivedEmail} 
              onChange={(e) => setReceivedEmail(e.target.value)} 
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Enter OTP"
        visible={openModalOtp}
        // onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
          <CustomButton
            key="back"
            onClick={handleModalCancel}
            classNameCustom="outline outline-0 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Back
          </CustomButton>,
          <CustomButton key="submit" onClick={handleModalOk} classNameCustom="ml-6" loading={isLoadingOtp}>
            Submit
          </CustomButton>
        ]}
      >
         <div className='mb-4'><Text strong><div>We need to verify your email to approve the request for updating the information.</div></Text>
         <div className='mt-2'><Text>We've sent a 6-digit code to <Text strong>{registeredEmail}</Text>. The code expires shortly, so please enter it soon.</Text></div>
         </div>
         
         
        <Input.OTP
          value={otp}
          formatter={str => str.toUpperCase()}
          {...sharedProps}
        />
      </Modal>
      <ModalPlan visible={isPlanModalVisible} onClose={hidePlanModal} email={registeredEmail} />

      <PopupModal isVisible = {isModalVisible} hideModal={hideModal} confirm = { deleteUser } loading = {loadingPopup} title='Are you sure to delete your account?'/>
    </div>
  );
};

export default AccountSettings;
