import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Divider, Alert } from 'antd';
import { MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { getJobDescriptionService } from '../service';

const { Title, Paragraph } = Typography;

interface JobDetails {
  companyProjectName: string;
  alias: string;
  expireTime: string;
  jdContent: string;
}

const LandingPage = () => {
  const code = window.location.search?.substring(1);

  const [expireDate, setExpireDate] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jdContent, setJdContent] = useState('')
  const [mailAlias, setMailAlias] = useState('')

  useEffect(() => {
    const getJobDes = async () => {
      const body = {
        code: code
      }
      try {
        const response = await getJobDescriptionService(body);
        console.log("response", response);
        setMailAlias(response?.data?.alias)
        setJdContent(response?.data?.jd_content)
        setCompanyName(response?.data?.company_project_name)
        setExpireDate(response?.data?.expire_time)
      } catch (error) {
        console.error('Error fetching response:', error);
      }
    };

    getJobDes();
  }, []); 

  return (
    <div className="container mx-auto p-4">
      <Card>
        <Title level={2}>{companyName}</Title>
        {/* <Row gutter={[16, 16]}>
          <Col span={16}>
            <div className="info-box flex gap-2">
              <MailOutlined style={{ color: '#1677ff', fontSize: '18px' }} />
              <span className="info-text">{mailAlias}</span>
            </div>
          </Col>
        </Row> */}
        {/* <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col span={16}>
            <div className="info-box flex gap-2">
              <ClockCircleOutlined style={{ color: '#1677ff', fontSize: '18px' }} />
              <span className="info-text">Expire Time: {expireDate}</span>
            </div>
          </Col>
        </Row> */}
        <Divider />
        <Title level={4}>Job Description</Title>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{jdContent}</Paragraph>
        <div className='flex gap-4 flex-col'>
        <Alert
          description={
            <>
              Please submit your CV to the corresponding 
              <span className="font-semibold mx-2">{mailAlias}</span> 
              address to complete your application.
            </>
          }
          type="info"
          showIcon
        />
          <Alert
            // message="Note"
            description="Please submit your CV to the provided email address. Results will be provided within 3 days after submission. Please only apply once to avoid being marked as spam."
            type="info"
            showIcon
          />
          <Alert
            description="Please submit your application only once for each job to avoid being marked as spam."
            type="warning"
            showIcon
          />
          <Alert
            description={`This link will expire after ${expireDate}`}
            type="warning"
            showIcon
          />
        </div>
      </Card>
    </div>
  );
};

export default LandingPage;