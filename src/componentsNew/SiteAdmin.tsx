import { Button, Dropdown, Form, Input, MenuProps, message, Modal, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { changeUserStatusService, findUserByEmailService, getAllUserService, getCurrentRoleService, getUserTotalService, postAuthOTP, updatePlanService } from "../service";
import { ROLE } from "../constant";
import { IUserInfo } from "../api/core/interface";
import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
import { MenuItemType } from "antd/es/menu/interface";
import { CustomButton } from "../common";
import { formatDate, isExpired } from "../function";
import { OTPProps } from "antd/es/input/OTP";
import StatusButton from "../components/StatusButton";

const { Title, Text } = Typography;

const SiteAdminPage = () => {
  const [form] = Form.useForm();
  const [admin, setAdmin] = useState(false)
  const [pageSize, setPageSize] = useState(50)
  const [data, setData] = useState<IUserInfo[]>([])
  const [email, setEmail] = useState('');  
  const [openModalOtp, setOpenModalOtp] = useState(false)
  const [type, setType] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoadingOtp, setLoadingOtp] = useState(false)
  const registeredEmail = localStorage.getItem('email');
  const [otp, setOtp] = useState('')
  const [currentPackage, setCurrentPackage] = useState('')
  const [currentStatus, setCurrentStatus] = useState('')
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState(false)
  const [loading,setLoading] = useState(false)
  const [onSelect, setOnSelect] = useState<string[]>(['isSelected','normal','normal','normal','normal'])
  const [userTotal, setUserTotal] = useState(0)



  const handleChangePlan = async (newPackage:string, index:number) =>{
    try{
      const response = await updatePlanService({
        newPackage: newPackage,
        user_id: data[index].id
      })
      if (response?.status_code == 200){
        const dataPlan = response?.data 
        
        if (dataPlan?.affected == 1){
          let newData:IUserInfo[]= []
          for(const item of data){
            if (item.id == data[index].id){
              item.package = newPackage
            }
            newData.push(item)
          }
          setData(newData)

          message.success('Change plan sucessfully!')

        }else{
          message.error('Change plan fail!')
        }
      }else{
        message.error('Change plan fail!')
      }

    }catch(error){
      console.error(error);
      message.error('Change plan fail!')
    }
  }

  const handleSendOtp = async (newType:string) => {
    try {
      console.log('newType',newType)
      setType(newType)
      if (newType == 'CHANGE_PLAN'){
        setLoadingPlan(true)
      }else{
        setLoadingStatus(true)
      }
      const data = await postAuthOTP({
        email: registeredEmail || '',
        type: newType
      })
      if(data.status_code === 200) {
        message.success('OTP sent to your email!');
        setOpenModalOtp(true)
      } else {
        message.error(data.errors?.message);
      }
    } catch (error) {
      console.log(error);
    }finally{
      if (newType == 'CHANGE_PLAN'){
        setLoadingPlan(false)
      }else{
        setLoadingStatus(false)
      }
    }
  };

  const handleModalCancel = () => {
    setOpenModalOtp(false);
  }

  const handleModalOk = () =>{
    setOpenModalOtp(false)
    setOtp('')
    console.log('handleModalOk', type)
    if (type == 'CHANGE_PLAN'){
      handleChangePlan(currentPackage, currentIndex)
    }else{
      changeUserStatus(currentStatus,data[currentIndex].id, currentIndex)
    }
  }


  const handleChange = (event:any) => {
    setEmail(event.target.value);  
  };

  const handleSearch = async (newPage:number) => {
    try{
      setLoading(true)
      const response = await findUserByEmailService({

        search: email,
        page: newPage,
        page_size: pageSize
      })

      if (response?.status_code == 200){
        const dataSearch = response?.data 

        const list:IUserInfo[] = []
        for (const item of dataSearch){
          const user:IUserInfo = {
            id:item.id,
            email: item.email,
            created_date: item.created_at,
            status: item.status,
            package: item.package,
            project_or_company_name: item.project_or_company_name,
            expiration_date: item.expiration_date,
            received_cv: item.received_cv,
            link_created:item.link_created,
            manual_cv: item.manual_cv
          }
          list.push(user)
        }

        setData(list)
        
      }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false)
    }
  }

  const changeUserStatus = async (status:string, user_id:number, index: number) => {
    try{
      const response = await changeUserStatusService({
        user_status: status,
        user_id: user_id
      })
      if (response.status_code == 200){
        if (response?.data?.affected == 1){
          let newData:IUserInfo[]= []
          for(const item of data){
            if (item.id == data[index].id){
              item.status = status
            }
            newData.push(item)
          }
          setData(newData)

          message.success('Change status successfully!')

        }else{
          message.error('Change status fail!')
        }
      }else{
        message.error(response?.errors?.message)
      }
    }catch(error){
      console.error(error);
      message.error('Change status fail!')
    }finally{

    }
  }

  const onChange: OTPProps['onChange'] = (text) => {
    setOtp(text)
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'FREE',
    },
    {
      key: '2',
      label: 'S9',
    },
    {
      key: '3',
      label: 'S19',
    },
    {
      key: '4',
      label: 'S29',
    },
  ];

  const getMenu = (count:number) => {
    const menuItemsWithHandlers: MenuProps['items'] = (() => {
      return menuItems
        .filter((item): item is MenuItemType => item !== null) 
        .map((item) => {
          if ('label' in item) {
            return {
              ...item,
              onClick: () => {
                setCurrentPackage(typeof item.label === 'string' ? item.label : '')
                setCurrentIndex(count)
                handleSendOtp('CHANGE_PLAN')
              }
            };
          }
          return item;
        });
    })();

    return menuItemsWithHandlers

  }

  const dropdown = (index:number) => {
    return (
      <Dropdown menu={{ items: getMenu(index) }} placement="bottomRight" arrow>
        <Button className="py-6 px-2" loading = {loadingPlan}>
          <>
            <CaretDownOutlined className="ml-2" />
          </>
          <>
            <div>Change plan</div>
          </>
        </Button>
      </Dropdown>
    );
  };


  const menuItemsStatus: MenuProps['items'] = [
    {
      key: '1',
      label: 'ACTIVE',
    },
    {
      key: '2',
      label: 'DEACTIVATE',
    }
  ];

  const getMenuStatus = (count:number) => {
    const menuItemsWithHandlers: MenuProps['items'] = (() => {
      return menuItemsStatus
        .filter((item): item is MenuItemType => item !== null) 
        .map((item) => {
          if ('label' in item) {
            return {
              ...item,
              onClick: () => {
                setCurrentStatus(typeof item.label === 'string' ? item.label : '')
                setCurrentIndex(count)
                handleSendOtp('CHANGE_STATUS')
              }
            };
          }
          return item;
        });
    })();

    return menuItemsWithHandlers

  }

  const dropdownStatus = (index:number) => {
    return (
      <Dropdown menu={{ items: getMenuStatus(index) }} placement="bottomRight" arrow>
        <Button className="py-6 px-2" loading= {loadingStatus}>
          <>
            <CaretDownOutlined className="ml-2" />
          </>
          <>
            <div>Change status</div>
          </>
        </Button>
      </Dropdown>
    );
  };
  
  
  const siteAdmin = {
    
      content: (
      <div>
        <Form form={form} layout="vertical">
          <table className="w-full border-collapse border border-gray-300 ml-10 mr-10 mt-5">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2  ">Email</th>
                <th className="border border-gray-300 p-2 ">Created date</th>
                <th className="border border-gray-300 p-2  ">Expiration date</th>
                <th className="border border-gray-300 p-2  ">Account status</th>
                <th className="border border-gray-300 p-2  ">Plan</th>
                <th className="border border-gray-300 p-2  ">Change plan</th>
                <th className="border border-gray-300 p-2  ">User status</th>
                <th className="border border-gray-300 p-2  ">Change user status</th>
                <th className="border border-gray-300 p-2  ">No created email</th>
                <th className="border border-gray-300 p-2  ">No submited CV</th>
                <th className="border border-gray-300 p-2  ">No manual CV</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((user,index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-4">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {formatDate(user.created_date)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {formatDate(user.expiration_date)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {isExpired(user.expiration_date) == true ? 'Expired' : 'Valid'}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.package}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {dropdown(index)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.status}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {dropdownStatus(index)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.link_created}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.received_cv}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.manual_cv}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </Form>
      </div>)
    
  }

  const getAllUser = async (newPage:number) => {
    try{
      setLoading(true)
      const response = await getAllUserService({
        page: newPage,
        page_size: pageSize
      })

      if (response?.status_code == 200){
        const data = response?.data 
        const list:IUserInfo[] = []
        for (const item of data){
          const user:IUserInfo = {
            id:item.id,
            email: item.email,
            created_date: item.created_at,
            status: item.status,
            package: item.package,
            project_or_company_name: item.project_or_company_name,
            expiration_date: item.expiration_date,
            received_cv: item.received_cv,
            link_created:item.link_created,
            manual_cv: item.manual_cv
          }
          list.push(user)

        }

        setData(list)
      }

    }catch(error){
      console.error(error);
    }finally{
      setLoading(false)
    }
  }

  const getUserByPage = async(newPage:number) => {
    if (newPage == 1){
      setOnSelect(['isSelected','normal','normal','normal','normal'])
    }else if (newPage == 2){
      setOnSelect(['normal','isSelected','normal','normal','normal'])
    }else if (newPage == 3){
      setOnSelect(['normal','normal','isSelected','normal','normal'])
    }else if (newPage == 4){
      setOnSelect(['normal','normal','normal','isSelected','normal'])
    }else if (newPage == 5){
      setOnSelect(['normal','normal','normal','normal','isSelected'])
    }
    getAllUser(newPage)
  }

  useEffect(() => {
    const getCurrentRole = async () =>{
      try{
        const response = await getCurrentRoleService()
        if (response?.status_code == 200){
          const data = response?.data 
          if (data == ROLE.ADMIN){
            setAdmin(true)
            await getAllUser(1)
          }
        }
      }catch(error){
        console.error(error);
      }
    }

    const getUserTotal = async () =>{
      try{
        const response = await getUserTotalService()
        if (response?.status_code == 200){
          const data = response?.data 
          console.log(data)
          setUserTotal(data)
        }
      }catch(error){
        console.error(error);
      }
    }

    getUserTotal()
    getCurrentRole()
  },[])

  return (<div>
    <div className="ml-10 mt-10">
    <Title level={ 2 }>Admin</Title>

    <div>
    <Input
        placeholder='Enter an email'
        className='md:w-[400px]'
        onChange={handleChange}
      />
      <CustomButton classNameCustom="ml-10 mt-5" key='button' onClick={ () => handleSearch(1)}>
              Search
      </CustomButton>
    </div>
    <div className="mt-5">
    <Text strong>Total users ({userTotal})</Text>
    <StatusButton classNameCustom="ml-5" onClick={ () => getUserByPage(1)} status={onSelect[0]}>
              1
      </StatusButton> 
      <StatusButton classNameCustom="ml-5"  onClick={ () => getUserByPage(2)} status={onSelect[1]}>
              2
      </StatusButton>
      <StatusButton classNameCustom="ml-5"  onClick={ () => getUserByPage(3)} status={onSelect[2]}>
              3
      </StatusButton>
      <StatusButton classNameCustom="ml-5" onClick={ () => getUserByPage(4)}  status={onSelect[3]}>
              4
      </StatusButton>
      <StatusButton classNameCustom="ml-5"onClick={ () => getUserByPage(5)} status={onSelect[4]}>
              5
      </StatusButton>
    </div>
    
    
    </div>
    
    {
      admin ? (data.length > 0 ? siteAdmin.content: '') : <div/>
    }

      <Modal
        title="Enter OTP"
        visible={openModalOtp}
        // onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[
        
          <CustomButton key="submit" onClick={handleModalOk} classNameCustom="ml-6" loading={isLoadingOtp}>
            Submit
          </CustomButton>
        ]}
      >
         <div className='mb-4'><Text strong><div>We need to verify your email to approve the request for the admin permission.</div></Text>
         <div className='mt-2'><Text>We've sent a 6-digit code to <Text strong>{registeredEmail}</Text>. The code expires shortly, so please enter it soon.</Text></div>
         </div>
         
         
        <Input.OTP
          value={otp}
          formatter={str => str.toUpperCase()}
          {...sharedProps}
        />
      </Modal>
      <div className="flex items-center justify-center h-screen" ><Spin spinning = {loading}></Spin></div>
  </div>);

}

export default SiteAdminPage;


