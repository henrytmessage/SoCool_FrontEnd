import React, { useEffect, useState } from 'react';
import { Card, Typography, Divider, Alert, message } from 'antd';
import { getJobDescriptionService } from '../service';
import { formatDate } from '../function';
import { CustomButton } from '../common';

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
  const [mailAlias, setMailAlias] = useState('')
  const [jobPosition, getJobPosition] = useState('')
  const [jobResponsibilities, getJobResponsibilities] = useState('')
  const [jobRequirements, setJobRequirements] = useState('')

  const handleCopy = async (mail:string) => {
    await navigator.clipboard.writeText(mail);
    message.success('The email has been copied.')
  }

  useEffect(() => {
    const getJobDes = async () => {
      const body = {
        code: code
      }
      try {
        const response = await getJobDescriptionService(body);
        console.log("response", response);
        setMailAlias(response?.data?.alias)
        getJobPosition(response?.data?.job_position)
        getJobResponsibilities(response?.data?.job_responsibilities)
        setJobRequirements(response?.data?.job_requirements)
        setCompanyName(response?.data?.company_project_name)
        setExpireDate(formatDate(response?.data?.expire_time))
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
        <Divider />
        <div>Job Description</div>
        <Title level={4}>{jobPosition}</Title>
        <div style={{ whiteSpace: 'pre-wrap' }}>Job Responsibilities:</div>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>- {jobResponsibilities}</Paragraph>
        <div style={{ whiteSpace: 'pre-wrap' }}>Job Requirements:</div>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{jobRequirements}</Paragraph>
        <div className='flex gap-4 flex-col'>
        <Alert
        description={
          <div className="flex items-center"> 
            <span className="flex-grow">
              Please submit your CV (in either PDF or DOC format) to:
              <span className="font-semibold mx-1">{mailAlias}</span>
            </span>
            <CustomButton classNameCustom="ml-5" key='button' onClick={() => handleCopy(mailAlias)}>
              Copy
            </CustomButton>
          </div>
          }
          type="info"
          showIcon
          className="flex items-center"  
        />

        <ul>
          <li>
           - After receiving your CV, we will notify you of the results within a maximum of 3 days. Please only apply once to avoid being marked as spam.
          </li>
          <li>{`- The application deadline for this position is ${expireDate}`}</li>
        </ul>
        </div>
      </Card>
    </div>
  );
};

export default LandingPage;