import { Button, Dropdown, Form, Input, MenuProps, message, Modal, Typography } from "antd";
import { useEffect, useState } from "react";
import { changeUserStatusService, findUserByEmailService, getAllUserService, getCurrentRoleService, postAuthOTP, updatePlanService } from "../service";
import { ROLE } from "../constant";
import { IUserInfo } from "../api/core/interface";
import { CaretDownOutlined, DownOutlined } from "@ant-design/icons";
import { MenuItemType } from "antd/es/menu/interface";
import { CustomButton } from "../common";
import { formatDate, isExpired } from "../function";
import { OTPProps } from "antd/es/input/OTP";

const { Title, Text } = Typography;

const SiteAdminPage = () => {
  const [form] = Form.useForm();
  const [admin, setAdmin] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState<IUserInfo[]>([])
  const [email, setEmail] = useState('');  
  const [openModalOtp, setOpenModalOtp] = useState(false)
  const [type, setType] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoadingOtp, setLoadingOtp] = useState(false)
  const registeredEmail = localStorage.getItem('email');
  const [otp, setOtp] = useState('')


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

  const handleSendOtp = async () => {
    try {
      const data = await postAuthOTP({
        email: registeredEmail || '',
        type: type
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
      
    }
  };

  const handleModalCancel = () => {
    setOpenModalOtp(false);
  }

  const handleModalOk = () =>{
    if (type == 'CHANGE_PLAN'){
      handleChangePlan(data[currentIndex].package, currentIndex)
    }else{
      changeUserStatus(data[currentIndex].status,data[currentIndex].id)
    }
  }


  const handleChange = (event:any) => {
    setEmail(event.target.value);  
  };

  const handleSearch = async () => {
    try{
      const response = await findUserByEmailService({
        search: email
      })

      if (response?.status_code == 200){
        const dataSearch = response?.data 

        const list:IUserInfo[] = []
        for (const item of dataSearch){
          const user:IUserInfo = {
            id:item.id,
            email: item.email,
            created_date: item.created_date,
            status: item.status,
            package: item.package,
            project_or_company_name: item.project_or_company_name,
            expiration_date: item.expiration_date
          }
          list.push(user)
        }

        setData(list)
        
      }
    }catch(error){
      console.error(error);
    }
  }

  const changeUserStatus = async (status:string, user_id:number) => {
    try{
      const response = await changeUserStatusService({
        user_status: status,
        user_id: user_id
      })
      if (response.status_code == 200){
        message.error('Change status successfully!')
      }else{
        message.error('Change status fail!')
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
                setType('CHANGE_PLAN')
                setCurrentIndex(count)
                handleSendOtp()
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
        <Button className="py-6 px-2">
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
                setType('CHANGE_STATUS')
                setCurrentIndex(count)
                handleSendOtp()
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
        <Button className="py-6 px-2">
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
                <th className="border border-gray-300 p-2  ">Project or company</th>
                <th className="border border-gray-300 p-2  ">Account status</th>
                <th className="border border-gray-300 p-2  ">Plan</th>
                <th className="border border-gray-300 p-2  ">Change plan</th>
                <th className="border border-gray-300 p-2  ">User status</th>
                <th className="border border-gray-300 p-2  ">Change user status</th>
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
                      {user.project_or_company_name}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {isExpired(user.expiration_date) ? 'Expired' : 'Valid'}
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
                  </tr>
                ))
              }
            </tbody>
          </table>

        </Form>
      </div>)
    
  }

  const getAllUser = async () => {
    try{
      const response = await getAllUserService({
        page: page,
        page_size: pageSize
      })

      if (response?.status_code == 200){
        const data = response?.data 
        const list:IUserInfo[] = []
        for (const item of data){
          const user:IUserInfo = {
            id:item.id,
            email: item.email,
            created_date: item.created_date,
            status: item.status,
            package: item.package,
            project_or_company_name: item.project_or_company_name,
            expiration_date: item.expiration_date
          }
          list.push(user)

        }

        setData(list)
      }

    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    const getCurrentRole = async () =>{
      try{
        const response = await getCurrentRoleService()
        if (response?.status_code == 200){
          const data = response?.data 
          if (data == ROLE.ADMIN){
            setAdmin(true)
            await getAllUser()
          }
        }
      }catch(error){
        console.error(error);
      }
    }
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
      <CustomButton classNameCustom="ml-10 mt-5" key='button' onClick={handleSearch}>
              Search
      </CustomButton>
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

  </div>);

}

export default SiteAdminPage;