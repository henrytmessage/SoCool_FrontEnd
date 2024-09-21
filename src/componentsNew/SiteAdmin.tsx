import { Button, Dropdown, Form, MenuProps, message } from "antd";
import { useEffect, useState } from "react";
import { getAllUserService, getCurrentRoleService, updatePlanService } from "../service";
import { ROLE } from "../constant";
import { IUserInfo } from "../api/core/interface";
import { DownOutlined } from "@ant-design/icons";

const SiteAdminPage = () => {
  const [form] = Form.useForm();
  const [admin, setAdmin] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState<IUserInfo[]>([])
  const [index , setIndex] = useState(-1)

  const handleChangePlan = async (newPackage:string) =>{
    try{
      const response = await updatePlanService({
        newPackage: newPackage
      })

      if (response?.status_code == 200){
        const dataPlan = response?.data 
        if (dataPlan?.affected == 1){
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

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'FREE',
      onClick: () => handleChangePlan('FREE'),
    },
    {
      key: '2',
      label: 'S9',
      onClick: () => handleChangePlan('S9'),
    },
    {
      key: '3',
      label: 'S19',
      onClick: () => handleChangePlan('S19'),
    },
    {
      key: '4',
      label: 'S29',
      onClick: () => handleChangePlan('S29'),
    }
  ];

  const dropdown = () => {
    return (
      <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
        <Button className="py-6 px-2">
          <>
            <DownOutlined className="ml-2" />
          </>
          <>
            <div>Change plan</div>
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
                <th className="border border-gray-300 p-2 ">Phone</th>
                <th className="border border-gray-300 p-2  ">Full name</th>
                <th className="border border-gray-300 p-2  ">Project or company</th>
                <th className="border border-gray-300 p-2  ">Receiced email</th>
                <th className="border border-gray-300 p-2  ">Current plan</th>
                <th className="border border-gray-300 p-2  ">Change plan</th>
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
                      {user.phone}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.full_name}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.project_or_company_name}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.notification_email}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {user.package}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {dropdown()}
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
            email: item.email,
            phone: item.phone,
            full_name: item.full_name,
            package: item.package,
            project_or_company_name: item.project_or_company_name,
            expiration_date: item.expiration_date,
            notification_email: item.notificationEmail
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
    <strong>Admin</strong>
    </div>
    
    {
      admin ? (data.length > 0 ? siteAdmin.content: '') : <div/>
    }

  </div>);

}

export default SiteAdminPage;