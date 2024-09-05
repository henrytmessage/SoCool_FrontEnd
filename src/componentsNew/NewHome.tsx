import React, { ReactNode, useState } from 'react';
import { Form, Input, Button, DatePicker, Upload, Steps, Avatar, message, Select, Row, Col, InputNumber, DatePickerProps } from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { logoSoCool } from '../assets'
import { useTranslation } from 'react-i18next';
import { CustomButton, CustomModalSuccess, CustomTextArea } from '../common';
import { IBodyCreateLink, IBodyGenerateAnswerByAi, IBodyGenerateQuestion, IQuestion } from '../api/core/interface';
import { postCreateLinkService, postLinkGenerateAnswerByAiService, postLinkGenerateQuestionService, postLinkUploadFileService } from '../service';
import CustomDropDown from '../common/CustomDropDown';

interface ScoreField {
  label?: string;
  minScore: number;
  recommendScore?: number;
}

interface AvatarWithTextProps {
  text: string
  children?: ReactNode  
}

const { Step } = Steps;
const { Option } = Select;

const scoreFields: ScoreField[] = [
  { label: 'Background (include: ability, skill, religious)', minScore: 20, recommendScore: 30 },
  { label: 'Expectation (include: salary, benefit, growth)', minScore: 20, recommendScore: 30 },
  { label: 'Value', minScore: 0, recommendScore: 20 },
  { label: 'Ability', minScore: 0, recommendScore: 10 },  
  { label: 'Personality (include: hobby, interest)', minScore: 0, recommendScore: 10 },
];

const NewHome: React.FC = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm();
  const [isStartNow, setIsStartNow] = useState(false)
  const [current, setCurrent] = useState(0);
  const [higher100, setHigher100] = useState(false)
  const [below100, setBelow100] = useState(false)
  const [questions, setQuestions] = useState<any[]>([]); 
  const [questions2, setQuestions2] = useState<any[]>([]); 
  const [questions3, setQuestions3] = useState<any[]>([]); 
  const answer0Value = Form.useWatch("question_1", form);
  const [dateString, setDateString] = useState('')
  const [backgroundScore, setBackgroundScore] = useState(20)
  const [expectationScore, setExpectationScore] = useState(20)
  const [valueScore, setValueScore] = useState(0)
  const [abilityScore, setAbilityScore] = useState(0)
  const [personalityScore, setPersonalityScore] = useState(0)
  const [tempMail, setTempMail] = useState('')
  const [inputEmail, setInputEmail] = useState('')
  const [isModalSuccess, setIsModalSuccess] = useState(false)
  const [answersWithIds, setAnswersWithIds] = useState<IQuestion[]>([]);
  const [totalScore, setTotalScore] = useState(0)

  const [loading, setLoading] = useState(false)
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false)
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});

  const renderSelectOptions = (minScore: number) => {
    const options = [];
    for (let i = minScore; i <= minScore + 50; i += 5) {
      options.push(
        <Option key={i} value={i}>
          {i}
        </Option>
      );
    }
    return options;
  };

  const OnClickStartNow = () => {
    setIsStartNow(true)
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinishStep1 = (values: any) => {
    const totalScore = values.decidedScore_0 + values.decidedScore_1 + values.decidedScore_2 + values.decidedScore_3 + values.decidedScore_4;
    setTotalScore(totalScore)
    if (totalScore > 100) {
      setHigher100(true)
      setBelow100(false)
      message.error(`The total score is ${totalScore} which is higher than 100. Please reduce it to match exactly 100.`);
    } else if (totalScore < 100) {
      setBelow100(true)
      setHigher100(false)
      message.error(`The total score is ${totalScore} which is below 100. Please increase it to match exactly 100.`);
    } else {
      setHigher100(false);
      setBelow100(false);
      setBackgroundScore(values.decidedScore_0)
      setExpectationScore(values.decidedScore_1)
      setValueScore(values.decidedScore_2)
      setAbilityScore(values.decidedScore_3)
      setPersonalityScore(values.decidedScore_4)
      handleGenerateQuestion(values.decidedScore_0, values.decidedScore_1, values.decidedScore_2, values.decidedScore_3, values.decidedScore_4 )
      next();
      
    }
  };

  const handleGenerateQuestion = async (background_score: number, expectation_score: number, value_score: number, ability_score: number, personality_score: number ) => {
    const body: IBodyGenerateQuestion = {
      background_score,
      expectation_score,
      value_score,
      ability_score,
      personality_score,
    }
    try {
      setLoading(true)
      const data = await postLinkGenerateQuestionService(body)
      if (data.status_code === 200) {
        setQuestions(data.data.step1)
        setQuestions2(data.data.step2)
        setQuestions3(data.data.step3)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
    }
  }

  const handleGenerateAnswerAi = async (index: number, prompt: string) => {
    const body: IBodyGenerateAnswerByAi = {
      prompt: prompt + answer0Value
    }
    setLoadingButtons((prevState) => ({
      ...prevState,
      [index]: true,
    }));
    try {
      const data = await postLinkGenerateAnswerByAiService(body)
      if (data.status_code === 200) {
        form?.setFieldsValue({
          [`question_${index}`]: data?.data,
        });
      }
      setLoadingButtons((prevState) => ({
        ...prevState,
        [index]: false,
      }));
    } catch (error) {
      setLoadingButtons((prevState) => ({
        ...prevState,
        [index]: false,
      }));
      console.error('Error fetching data:', error)
    }
  }

  const onFinishStep2 = (values: any) => {
    const newAnswersWithIds1 = questions.map((question, index) => ({
      question: question.alias,
      answer: values[`question_${question?.id}`],
    }));

    setAnswersWithIds(prevState => [...prevState, ...newAnswersWithIds1]);
    next();
  };

  const onChangeDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
    setDateString(dateString.toString())
  }; 
  

  const beforeUpload = async (file: File) => {
    const isValidFileType =
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
    if (!isValidFileType) {
      message.error('You can only upload PDF or DOC files!');
      return Upload.LIST_IGNORE;
    }
  
    const isValidSize = file.size / 1024 / 1024 < 2; 
    if (!isValidSize) {
      message.error('File must be smaller than 2MB!');
      return Upload.LIST_IGNORE;
    }
  
    return true;
  };
  
  const handleUploadChange = (info: any) => {
    const { status } = info.file;
    if (status === 'uploading') {
      setLoading(true);
    } else if (status === 'done') {
      setLoading(false);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (status === 'error') {
      setLoading(false);
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  
  const customUpload = async ({ file, onSuccess, onError }: any) => {
    const formData = new FormData();
    formData.append('files', file);
  
    try {
      const response = await postLinkUploadFileService(formData);
  
      if (response?.status_code === 200) {
        onSuccess(response); 
        form?.setFieldsValue({
          question_1: response?.data.job_position,
          question_2: response?.data.job_responsibilities,
          question_3: response?.data.job_requirements,
        });

      } else {
        onError(new Error('Upload failed'));
      }
    } catch (err) {
      console.error(err);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value)
  }

  const onFinishStep3 = (values: any) => {
    const newAnswersWithIds2 = questions2.map((question, index) => ({
      question: question.alias,
      answer: question?.type === 'date' ? dateString : values[`question_${question?.id}`],
    }));

    setAnswersWithIds(prevState => [...prevState, ...newAnswersWithIds2]);
    next();
  };

  const onFinishStep4 = async (values: any) => {
    const newAnswersWithIds3 = questions3.map((question, index) => ({
      question: question.alias,
      answer: values[`question_${question?.id}`],
    }));
    
    setAnswersWithIds(prevState => [...prevState, ...newAnswersWithIds3]);
    handleCreateLink()
  };

  const handleCreateLink = async () => {

    const body: IBodyCreateLink = {
      email: inputEmail,
      background_score: backgroundScore,
      expectation_score: expectationScore,
      value_score: valueScore,
      ability_score: abilityScore,
      personality_score: personalityScore,
      questions: answersWithIds
    }
    
    try {
      setIsLoadingGenerate(true)
      const data = await postCreateLinkService(body)
      if (data.status_code === 200) {
        console.log(data.data);
        setTempMail(data.data.alias.alias)
        setIsModalSuccess(true)
      }
      setIsLoadingGenerate(false)
    } catch (error) {
      setIsLoadingGenerate(false)
      console.error('Error fetching data:', error)
    }
  }

  const handleCloseModalSuccess = () => {
    window.location.reload()
  }
  // const handleTextAreaChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newValue = e.target.value;
  //   form.setFieldsValue({ [`question_${index}`]: newValue });
  //   console.log(newValue);
    
  // };

  const steps = [
    {
      title: 'Step 1',
      content: (
        <div >
        <Form form={form} onFinish={onFinishStep1} layout="vertical" >
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Screening Standard (SS)</th>
                <th className="border border-gray-300 p-2">Min Score</th>
                <th className="border border-gray-300 p-2 hidden md:block">Recommend Score</th>
                <th className="border border-gray-300 p-2">Decided Score</th>
              </tr>
            </thead>
            <tbody>
              {scoreFields.map((field, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-4">{field.label}</td>
                  <td className="border border-gray-300 p-2 mr-auto">
                    <Form.Item className='my-4 text-center'>
                      {field.minScore}
                    </Form.Item>
                  </td>
                  <td className="border border-gray-300 p-2 hidden md:block">
                    <Form.Item className='my-4 text-center'>
                      {field.recommendScore}
                    </Form.Item>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <Form.Item
                      className='m-0'
                      name={`decidedScore_${index}`}
                      rules={[{ required: true, message: 'Please select a decided score!' }]}
                    >
                      <Select placeholder="Select score">
                        {renderSelectOptions(field.minScore)}
                      </Select>
                    </Form.Item>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {
            higher100 && <div className='text-red-500'>{`The total score is ${totalScore} which is higher than 100. Please reduce it to match exactly 100.`}</div>
          }
          {
            below100 && <div className='text-red-500'>{`The total score is ${totalScore} which is below 100. Please increase it to match exactly 100.`}</div>
          }
          <Form.Item className="mt-4">
            <CustomButton type="primary" htmlType="submit">
              Next
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
      ),
    },
    {
      title: 'Step 2',
      content: (
        <div>
         <Form form={form} onFinish={onFinishStep2} layout="vertical" className="px-12 py-4 border border-solid border-blue-500 rounded flex-col w-full mx-auto">
          <Form.Item label="Basic Information" name="basicInfo">
            <Upload
              accept=".pdf,.doc,.docx"
              maxCount={1}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              customRequest={customUpload} 
            >
              <Button icon={<UploadOutlined />}>Upload JD (pdf or doc)</Button>
            </Upload>
          </Form.Item>

          {questions?.map((qs, index) => (
            <React.Fragment key={index}>
              <Form.Item
                label={qs?.content}
                name={`question_${qs?.id}`}
                rules={[
                  { required: true, message: 'Please answer this question!' },
                  {
                    validator(_, value) {
                      const maxLength = qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined;
                      if (value && value.length === maxLength) {
                        return Promise.reject(new Error(`You have reached the maximum length of ${maxLength} characters!`));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <CustomTextArea
                  placeholder={qs?.place_holder || 'Your answer here'}
                  value={form.getFieldValue(`question_${qs?.id}`) || ''}
                  maxLength={
                    qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined
                  }
                  // onChange={(e) => handleTextAreaChange(index, e)}
                />
              </Form.Item>

              {qs.id === 2 || qs.id === 3 ? (
                form.getFieldValue('question_1') && form.getFieldValue('question_1').trim() !== '' && (
                  <Form.Item>
                    <CustomButton
                      type="primary"
                      loading={loadingButtons[qs.id]}
                      onClick={() => handleGenerateAnswerAi(qs?.id, qs?.prompt)}
                    >
                      Generate Answer by Ai
                    </CustomButton>
                  </Form.Item>
                )
              ) : null}
            </React.Fragment>
          ))}

          <Form.Item>
            <div className="flex justify-around">
              <CustomButton type="default" onClick={prev}>
                Back
              </CustomButton>
              <CustomButton type="primary" htmlType="submit">
                Next
              </CustomButton>
            </div>
          </Form.Item>
        </Form>

        </div>
      ),
    },
    {
      title: 'Step 3',
      content: (
        <div>
          <Form form={form} onFinish={onFinishStep3} layout="vertical" className="px-12 py-4 border border-solid border-blue-500 rounded flex-col w-full mx-auto">
            {questions2?.map((qs, index) => (
              qs.type != 'date'? 
              <Form.Item key={index} label={qs?.content} name={`question_${qs?.id}`}  rules={[
                  { required: true, message: 'Please answer this question!' },
                  ({ }) => ({
                    validator(_, value) {
                      const maxLength = qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined;
                      if (value && value.length === maxLength) {
                        return Promise.reject(new Error(`You have reached the maximum length of ${maxLength} characters!`));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
               <CustomTextArea 
                    placeholder={qs?.place_holder || 'Your answer here'} 
                    value={form.getFieldValue(`question_${qs?.id}`) || ''}
                    maxLength={qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined}
                  /> 
              </Form.Item>
              : 
              <Form.Item key={index} label={qs?.content} name={`question_${qs?.id}`}  rules={[
                { required: true, message: 'Please answer this question!' } ]}>
                    <DatePicker onChange={onChangeDatePicker} />
              </Form.Item>
            ))}
            <Form.Item>
              <div className='flex justify-around'>
                <CustomButton type="default" onClick={prev} >
                  Back
                </CustomButton>
                <CustomButton type="primary" htmlType="submit">
                  Next
                </CustomButton>
              </div>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: 'Step 4',
      content: (
        <div>
          <Form form={form} onFinish={onFinishStep4} layout="vertical" className="px-12 py-4 border border-solid border-blue-500 rounded flex-col w-full mx-auto">
            {questions3?.map((qs, index) => (
              <Form.Item key={index} label={qs?.content} name={`question_${qs?.id}`} rules={[
                  { required: true, message: 'Please answer this question!' },
                  ({ }) => ({
                    validator(_, value) {
                      const maxLength = qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined;
                      if (value && value.length === maxLength) {
                        return Promise.reject(new Error(`You have reached the maximum length of ${maxLength} characters!`));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <CustomTextArea placeholder={qs?.place_holder || 'Your answer here'}  value={form.getFieldValue(`question_${qs?.id}`) || ''}/>
              </Form.Item>
              
            ))}
             <Form.Item
                  layout="vertical"
                  label="Your email"
                  name="Your email"
                  rules={[{ required: true, message: 'Please input your your email!', type: 'email' }]}
                  tooltip={{ title: 'Register your email to communicate with the smart email!', icon: <InfoCircleOutlined /> }}
                >
                  <Input
                    size="large"
                    placeholder={t('emailHere')}
                    value={inputEmail}
                    onChange={handleChangeEmail}
                  />
                </Form.Item>
              <Form.Item>
              <div className='flex justify-around'>
                <CustomButton type="default" onClick={prev} >
                  Back
                </CustomButton>
                <CustomButton type="primary" htmlType="submit" loading={isLoadingGenerate}>
                  Generate email
                </CustomButton>
              </div>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  const AvatarWithText = ({ text, children }: AvatarWithTextProps) => (
      <div className="flex justify-start w-full">
        <div>
          <Avatar src={<img src={logoSoCool} alt="avatar" />} />
        </div>
        <div className="flex flex-col md:flex-row gap-4 ml-4 md:items-center">
          <div
            className={`bg-gray-200 rounded-3xl p-4 text-gray-800 max-w-screen-xl ${
              children ? '' : 'font-medium'
            } text-lg`}
          >
            {text}
          </div>
          {children}
        </div>
      </div>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="flex-grow flex-col p-6 gap-6 flex m-auto w-full max-w-4xl">
        <AvatarWithText text={t('provideSmart')} />
        <AvatarWithText text={'Are you ready to experience it?'}>
          <CustomButton type="primary" onClick={OnClickStartNow}>
            Start Now
          </CustomButton>
        </AvatarWithText>
        {
          isStartNow && (
            <div className="animate-showSteps">
              <Steps current={current}>
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
              <div className="steps-content mt-6">
                {steps[current].content}
              </div>
            </div>
          )
        }
      </div>
      <div className="text-center pb-2">
        By using SoCool, you agree to our{' '}
        <span className="font-bold">
          <a href="Terms">Terms</a>
        </span>{' '}
        and have read our Privacy{' '}
        <span className="font-bold">
          <a href="Policy">Policy</a>
        </span>
        .
        <CustomDropDown />
      </div>
      <CustomModalSuccess
        isOpen={isModalSuccess}
        titleSuccess={t('alertCheckMail')}
        textButtonConfirm={t('confirm')}
        linkAi={tempMail}
        onCloseModalSuccess={handleCloseModalSuccess}
      />
    </div>
  );  
};

export default NewHome;
