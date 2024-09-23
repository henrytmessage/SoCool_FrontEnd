import { Button, Form, Input, Typography } from 'antd'
import React, { useState } from 'react'
import { ICompanyProject } from '../api/core/interface';
import { postSaveCompanyOrProjectNameService } from '../service';
import { CustomButton } from '../common';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CompanyOrProject = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()


  const onFinishInit = async (values: any) => {
    try{
      setLoading(true)

      const body : ICompanyProject = { company_or_project_name: values.project_company}

      const response = await postSaveCompanyOrProjectNameService(body)
      
      if(response?.status_code === 200){
        localStorage.setItem('require_project_or_company_name','false')
        navigate('/')
      }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 mt-14">
      <div className="flex flex-col w-full max-w-md bg-white p-6 rounded-lg">
        <Title level={2} className="text-center">Company or project name</Title>
      <Form
      className='mt-5'
        form={form}
        name="project_company_form"
        onFinish={onFinishInit}
        layout= "vertical"
      >

        <Form.Item
          // label="Project or company"
          name="project_company"
          rules={[{ required: true, message: 'Please enter your company or project name!' }]}
        >
          <Input placeholder="Enter your company or project name" size="large"/>
        </Form.Item>

        <Form.Item className='mt-10'>
          <CustomButton type="primary" htmlType="submit" size="large" classNameCustom='w-full' loading = {loading}>
            Done
          </CustomButton>
        </Form.Item>
      </Form>
    </div>
    </div>
  )
}

export default CompanyOrProject