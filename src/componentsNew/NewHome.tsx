import React, { ReactNode, useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Upload, Steps, Avatar, message, Select, DatePickerProps, Tooltip, InputNumber, Spin } from 'antd';
import { InfoCircleOutlined, UploadOutlined, DeleteOutlined, PlusOutlined  } from '@ant-design/icons';
import { logoSoCool } from '../assets'
import { useTranslation } from 'react-i18next';
import { CustomButton, CustomModalSuccess, CustomTextArea } from '../common';
import { IBodyCreateLink, IBodyGenerateAnswerByAi, IBodyGenerateQuestion, ICompanyProject, IQuestion } from '../api/core/interface';
import { postCreateLinkService, postLinkGenerateAnswerByAiService, postLinkGenerateQuestionService, postLinkUploadFileService, postSaveCompanyOrProjectNameService } from '../service';
import CustomDropDown from '../common/CustomDropDown';
import dayjs from 'dayjs';
import CustomModalWarning from '../common/CustomModalWarning';
import { useNavigate } from 'react-router-dom';
interface ScoreField {
  label?: string;
  minScore: number;
  recommendScore?: number;
  tooltip?: string;
  selectedScore?: number;
}

interface AvatarWithTextProps {
  text: string
  children?: ReactNode  
  textChild?: string
}

interface FormValuesInit {
  project: string;
  company: string;
}

const { Step } = Steps;
const { Option } = Select;

const scoreFields: ScoreField[] = [
  {
    label: 'Background',
    minScore: 20,
    recommendScore: 30,
    tooltip: 'Background helps ensure people have the right experience, qualifications, and potential to succeed in the role'
  },
  {
    label: 'Expectation',
    minScore: 20,
    recommendScore: 30,
    tooltip: 'Expectation refer to various elements a candidate anticipates or hopes for in a job and how these align with what the role and company offer.'
  },
  {
    label: 'Value',
    minScore: 0,
    recommendScore: 20,
    tooltip: 'Values are what people believe, and rarely change. Shared values ensure that people are aligned on the most fundamental aspects of their relationship and decision-making'
  },
  {
    label: 'Ability',
    minScore: 0,
    recommendScore: 10,
    tooltip: 'Abilities are how people can perform in certain situations, which includes their inherent talents and competencies. Abilities generally change slowly and are harder to acquire or improve upon.'
  },
  {
    label: 'Personality',
    minScore: 0,
    recommendScore: 10,
    tooltip: 'Personality helps ensure a person will fit well with the team and contribute positively to the work environment.'
  },
  {
    label: 'Total',
    minScore: 40,
    recommendScore: 100,
  },
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
  const [inputCompanyName, setInputCompanyName] = useState('')
  const [expireTime, setExpireTime] = useState('')
  const [isModalWarning, setIsModalWarning] = useState(false)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false)
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});

  const [visibleQuestions1, setVisibleQuestions1] = useState(questions.slice(0, 3));
  const [showMoreQuestions1, setShowMoreQuestion1] = useState(false)

  const [visibleQuestions2, setVisibleQuestions2] = useState(questions2.slice(0, 4));
  const [showMoreQuestions2, setShowMoreQuestion2] = useState(false)

  const [fromValue, setFromValue] = useState<number | null>(null);
  const [toValue, setToValue] = useState<number | null>(null);
  const [period, setPeriod] = useState('Monthly'); 
  const [loadingInit, setLoadingInit] = useState(true);
  const [isRequireProject, setIsRequireProject] = useState(false)

  const handleFromChange = (value: number | null) => {
    setFromValue(value);
  };

  const handleToChange = (value: number | null) => {
    setToValue(value);
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const handleShowMoreQuestions1 = () => {
    setShowMoreQuestion1(true);
    setVisibleQuestions1(questions); 
  };

  const handleDeleteQuestions1 = (index: number) => {
    // Xóa các câu hỏi từ vị trí thứ 5 trở đi
    const updatedQuestions = visibleQuestions1.filter((_, i) => i !== index);
    setVisibleQuestions1(updatedQuestions);

    // Nếu tất cả các câu hỏi thêm đã bị xóa, hiện lại nút "Show More"
    if (updatedQuestions.length <= 3) {
      setShowMoreQuestion1(false);
    }
  };

  const handleShowMoreQuestions2 = () => {
    setShowMoreQuestion2(true);
    setVisibleQuestions2(questions2); 
  };

  const handleDeleteQuestions2 = (index: number) => {
    const updatedQuestions = visibleQuestions2.filter((_, i) => i !== index);
    setVisibleQuestions2(updatedQuestions);

    if (updatedQuestions.length <= 4) {
      setShowMoreQuestion2(false);
    }
  };

  const renderSelectOptions = (minScore: number) => {
    const options = [];
    for (let i = minScore; i <= minScore + 60; i += 5) {
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

  const OnClickNavigateLogin = () => {
    navigate('/login')
  }

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleScoreChange = (value: number, index: number) => {
    // Tính toán lại tổng điểm dựa trên giá trị mới
    let newTotalScore = 0;
  
    // Cập nhật từng giá trị đã chọn
    const updatedScores = scoreFields.map((field, i) => {
      if (i === index) {
        field.selectedScore = value;  // Cập nhật điểm đã chọn cho trường hiện tại
      }
      // Cộng dồn các giá trị đã chọn
      if (field.selectedScore) {
        newTotalScore += field.selectedScore;
      }
      return field;
    });
  
    setTotalScore(newTotalScore);  // Cập nhật lại tổng điểm
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
      if(values.decidedScore_2 == 0 || values.decidedScore_3 == 0 || values.decidedScore_4 == 0) {
        setIsModalWarning(true)
      } else {
        next();
      }
    }
  };

  const handleCloseModalWarning = () => {
    setIsModalWarning(false); 
  }

  const handleConfirmModalWarning = () => {
    setIsModalWarning(false); 
    next(); 
  }

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
        setVisibleQuestions1(data.data.step1.slice(0, 3))
        setVisibleQuestions2(data.data.step2.slice(0, 4))
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
      alias: question.alias,
      answer: values[`question_${question?.id}`],
    }));

    setAnswersWithIds((prevState) => {
      // Tạo một bản sao của prevState
      const updatedAnswers = [...prevState];
  
      newAnswersWithIds1.forEach((newAnswer) => {
        // Tìm xem câu hỏi đã có trong mảng chưa
        const existingAnswerIndex = updatedAnswers.findIndex(
          (answer) => answer.alias === newAnswer.alias
        );
  
        if (existingAnswerIndex !== -1) {
          // Nếu tồn tại, cập nhật câu trả lời
          updatedAnswers[existingAnswerIndex].answer = newAnswer.answer;
        } else {
          // Nếu không tồn tại, thêm câu hỏi mới
          updatedAnswers.push(newAnswer);
        }
      });
  
      return updatedAnswers;
    });
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
          question_2: response?.data.job_responsibilities.replace(/-\s/g, '\n- '),
          question_3: response?.data.job_requirements.replace(/-\s/g, '\n- '),
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

  const handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCompanyName(e.target.value);
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputEmail(e.target.value)
  }

  const onFinishStep3 = (values: any) => {
    
    const newAnswersWithIds2 = questions2.map((question, index) => ({
      alias: question.alias,
      answer: question?.type === 'date' 
      ? dateString 
      : question?.type === 'range' 
        ? `${fromValue} - ${toValue} - ${period}` 
        : values[`question_${question?.id}`]
    }));

    setAnswersWithIds((prevState) => {
      // Tạo một bản sao của prevState
      const updatedAnswers = [...prevState];
  
      newAnswersWithIds2.forEach((newAnswer) => {
        // Tìm xem câu hỏi đã có trong mảng chưa
        const existingAnswerIndex = updatedAnswers.findIndex(
          (answer) => answer.alias === newAnswer.alias
        );
  
        if (existingAnswerIndex !== -1) {
          // Nếu tồn tại, cập nhật câu trả lời
          updatedAnswers[existingAnswerIndex].answer = newAnswer.answer;
        } else {
          // Nếu không tồn tại, thêm câu hỏi mới
          updatedAnswers.push(newAnswer);
        }
      });
      
      return updatedAnswers;
    });
    
    next();
  };

  const onFinishStep4 = async (values: any) => {
    const newAnswersWithIds3 = questions3.map((question, index) => ({
      alias: question.alias,
      answer: values[`question_${question?.id}`],
    }));
    
    setAnswersWithIds((prevState) => {
      // Tạo một bản sao của prevState
      const updatedAnswers = [...prevState];
  
      newAnswersWithIds3.forEach((newAnswer) => {
        // Tìm xem câu hỏi đã có trong mảng chưa
        const existingAnswerIndex = updatedAnswers.findIndex(
          (answer) => answer.alias === newAnswer.alias
        );
  
        if (existingAnswerIndex !== -1) {
          // Nếu tồn tại, cập nhật câu trả lời
          updatedAnswers[existingAnswerIndex].answer = newAnswer.answer;
        } else {
          // Nếu không tồn tại, thêm câu hỏi mới
          updatedAnswers.push(newAnswer);
        }
      });
      handleCreateLink(updatedAnswers);
      return updatedAnswers;
    });
  };

  const handleCreateLink = async (updatedAnswers: IQuestion[]) => {
    
    const body: IBodyCreateLink = {
      email: inputEmail,
      company_project_name: inputCompanyName,
      background_score: backgroundScore,
      expectation_score: expectationScore,
      value_score: valueScore,
      ability_score: abilityScore,
      personality_score: personalityScore,
      questions: updatedAnswers
    }

    try {
      setIsLoadingGenerate(true)
      const data = await postCreateLinkService(body)
      if (data.status_code === 200) {
        setExpireTime(dayjs(data.data?.exp).format('DD/MM/YYYY'))
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

  const onFinishInit = async (values: any) => {
    try{
      setLoading(true)

      const body : ICompanyProject = { company_or_project_name: values.project_company}

      const response = await postSaveCompanyOrProjectNameService(body)
      
      if(response?.status_code === 200){
        setIsRequireProject(false)
        localStorage.setItem('require_project_or_company_name',values.project_company)
      }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  const formRequireInit = () => {
   return (
      <Form
        form={form}
        name="project_company_form"
        onFinish={onFinishInit}
        layout= "vertical"
        // labelCol={{ span: 8 }}
        // wrapperCol={{ span: 16 }}
        // style={{ maxWidth: 600, margin: '0 auto' }}
      >

        <Form.Item
          label="Project or company"
          name="project_company"
          rules={[{ required: true, message: 'Please enter your company or project name!' }]}
        >
          <Input placeholder="Enter your company or project name" size="large"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            Submit
          </Button>
        </Form.Item>
      </Form>
    )
  }

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = localStorage.getItem('access_token');
      const requireProject = localStorage.getItem('require_project_or_company_name');
      if (!accessToken) {
        // navigate('/login');
        setLoadingInit(true);
      } else {
        setLoadingInit(false);
      }
      if (requireProject === 'true') {
        setIsRequireProject(true)
      } else {
        setIsRequireProject(false)
      }
    };

    checkAccessToken();
  }, []);

  const steps = [
    {
      title: '',
      content: (
        <div >
          <div className='mb-2'> 
            This is the Screening Matrix. It covers five main aspects for evaluating a CV’s potential
          </div>
          <Form form={form} onFinish={onFinishStep1} layout="vertical" >
            <table className="w-full border-collapse border border-gray-300 table-fixed">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2 w-1/2 md:w-1/4">Screening Standard</th>
                  <th className="border border-gray-300 p-2 w-1/4 md:w-1/4">Min Score</th>
                  <th className="border border-gray-300 p-2 hidden md:table-cell w-1/4">Recommended Score</th>
                  <th className="border border-gray-300 p-2 w-1/4 md:w-1/4">User's Score</th>
                </tr>
              </thead>
              <tbody>
                {scoreFields.map((field, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-4 w-1/2 md:w-1/4">
                      {field.label}
                      {field.tooltip && 
                        <Tooltip title={field.tooltip} placement="top">
                          <InfoCircleOutlined className="ml-1 text-gray-500 cursor-pointer" />
                        </Tooltip>
                      }
                    </td>
                    <td className="border border-gray-300 p-2 w-1/4 md:w-1/4">
                      <Form.Item className="my-4 text-center">
                        {field.minScore}
                      </Form.Item>
                    </td>
                    <td className="border border-gray-300 p-2 hidden md:table-cell w-1/4">
                      <Form.Item className="my-4 text-center">
                        {field.recommendScore}
                      </Form.Item>
                    </td>
                    {field.tooltip ?
                    <td className="border border-gray-300 p-2 w-1/4 md:w-1/4">
                      <Form.Item
                        className="m-0 text-center"
                        name={`decidedScore_${index}`}
                        rules={[{ required: true, message: 'Please select a decided score!' }]}
                      >
                        <Select placeholder="Select score"
                        onChange={(value) => handleScoreChange(value, index)}
                        >
                          {renderSelectOptions(field.minScore)}
                        </Select>
                      </Form.Item>
                    </td>
                    : 
                    <td className="border border-gray-300 p-2 text-center md:table-cell w-1/4">
                      {totalScore}
                    </td>
                    }
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
      title: '',
      content: (
        <div>
          <Form
            form={form}
            onFinish={onFinishStep2}
            layout="vertical"
            className="px-12 py-4 border border-solid border-blue-500 rounded flex-col w-full mx-auto"
          >
            <Form.Item
              label="You can choose to upload your current job description (JD) or answer the following questions about your job requirements."
              name="basicInfo"
            >
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

            {/* Hiển thị các câu hỏi */}
            {visibleQuestions1.map((qs, index) => (
              <React.Fragment key={index}>
                <Form.Item
                   label={
                    <span style={{ display: 'flex',  justifyContent: 'space-between', width: '100%' }}>
                      {qs?.content}
                      {index >= 3 && (
                        <Button
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteQuestions1(index)}
                          style={{ border: 'none', marginLeft: '8px' }} // Optional margin for spacing
                        />
                      )}
                    </span>
                  }
                  name={`question_${qs?.id}`}
                  rules={[
                    { required: true, message: 'Please answer this question!' },
                    {
                      validator(_, value) {
                        const maxLength =
                          qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined;
                        if (value && value.length === maxLength) {
                          return Promise.reject(
                            new Error(`You have reached the maximum length of ${maxLength} characters!`)
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
               
                >
                  <CustomTextArea
                    placeholder={qs?.place_holder || 'Your answer here'}
                    value={form.getFieldValue(`question_${qs?.id}`) || ''}
                    maxLength={qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined}
                  />
                </Form.Item>

                {qs.id === 2 || qs.id === 3 ? (
                  form.getFieldValue('question_1') &&
                  form.getFieldValue('question_1').trim() !== '' && (
                    <Form.Item>
                      <CustomButton
                        type="primary"
                        loading={loadingButtons[qs.id]}
                        onClick={() => handleGenerateAnswerAi(qs?.id, qs?.prompt)}
                      >
                        Generate Example by AI
                      </CustomButton>
                    </Form.Item>
                  )
                ) : null}
              </React.Fragment>
            ))}

            {/* Nút Show More */}
            {/* {!showMoreQuestions1 && questions.length > 3 && (
              <Form.Item
                label="If you need more questions, please click the box below"
                name="showMoreQuestion1"
              >
                <Button icon={<PlusOutlined />} onClick={handleShowMoreQuestions1}>Show More Questions</Button>
              </Form.Item>
            )} */}

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
      title: '',
      content: (
        <div>
        <Form
          form={form}
          onFinish={onFinishStep3}
          layout="vertical"
          className="px-12 py-4 border border-solid border-blue-500 rounded flex-col w-full mx-auto"
        >
          {visibleQuestions2?.map((qs, index) => {
            // Define the delete button
            const deleteButton = (
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteQuestions2(index)} // Call the delete function
                style={{ border: 'none', marginLeft: '8px' }} // Optional margin for spacing
              />
            );

            if (qs.type === 'range') {
              return (
                <Form.Item
                  key={index}
                  label={
                    <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {qs?.content}
                      {index > 3 && deleteButton} {/* Only show delete button if index > 3 */}
                    </span>
                  }
                  name={`question_${qs?.id}`}
                  rules={[
                    { required: true, message: 'Please enter a value!' },
                    {
                      validator: (_, value) => {
                        if (fromValue !== undefined && toValue !== undefined && toValue && fromValue && toValue < fromValue) {
                          return Promise.reject(new Error('The "To" value cannot be smaller than the "From" value!'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <div  className='flex flex-col gap-2 md:flex-row "'>
                    <span style={{ marginRight: '10px' }}>From</span>
                    <InputNumber
                      style={{ width: '100%', marginRight: '10px' }}
                      min={0}
                      max={10000000}
                      value={fromValue}
                      onChange={handleFromChange} 
                      placeholder="Select value"
                      addonAfter="USD"
                      onKeyPress={(event) => {
                        // Allow numbers and a single decimal point
                        const key = event.key;
                        const currentValue = event.currentTarget.value;

                        if (!/[0-9]/.test(key) && key !== '.') {
                          event.preventDefault();
                        }

                        if (key === '.' && currentValue.includes('.')) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <span style={{ marginRight: '10px' }}>to</span>
                    <InputNumber
                      style={{ width: '100%', marginRight: '10px' }}
                      min={0}
                      max={10000000}
                      value={toValue}
                      onChange={handleToChange}
                      placeholder="Select value"
                      addonAfter="USD"
                      onKeyPress={(event) => {
                        const key = event.key;
                        const currentValue = event.currentTarget.value;

                        if (!/[0-9]/.test(key) && key !== '.') {
                          event.preventDefault();
                        }

                        // Prevent entering more than one decimal point
                        if (key === '.' && currentValue.includes('.')) {
                          event.preventDefault();
                        }
                      }}
                    />
                    <Select
                      style={{ width: '150px' }}
                      placeholder="Select period"
                      value={period} 
                      onChange={handlePeriodChange}
                      options={[
                        { value: 'Monthly', label: 'Monthly' },
                        { value: 'Annually', label: 'Annually' },
                      ]}
                    />
                  </div>
                </Form.Item>
              );
            }
  
            // If the question type is 'number', render a Select input
            if (qs.type === 'number') {
              return (
                <Form.Item
                  key={index}
                  label={
                    <span style={{ display: 'flex',  justifyContent: 'space-between', width: '100%' }}>
                      {qs?.content}
                      {index > 3 && deleteButton} {/* Only show delete button if index > 4 */}
                    </span>
                  }
                  name={`question_${qs?.id}`}
                  rules={[{ required: true, message: 'Please select a value!' }]}
                >
                <Select
                  placeholder={qs?.place_holder || 'Select a number'}
                  options={Array.from({ length: 9 }, (_, i) => ({ value: `${i + 2}`, label: `${i + 2}` }))}
                />
                </Form.Item>
              );
            }
  
            // If the question type is 'date', render a DatePicker
            if (qs.type === 'date') {
              return (
                <Form.Item
                  key={index}
                  label={
                    <span style={{ display: 'flex',  justifyContent: 'space-between', width: '100%' }}>
                      {qs?.content}
                      {index > 3 && deleteButton} {/* Only show delete button if index > 4 */}
                    </span>
                  }
                  name={`question_${qs?.id}`}
                  rules={[{ required: true, message: 'Please answer this question!' }]}
                >
                  <DatePicker onChange={onChangeDatePicker} />
                </Form.Item>
              );
            }
  
            // For all other types (normal, large), render a TextArea input
            return (
              <Form.Item
                key={index}
                label={
                  <span style={{ display: 'flex',  justifyContent: 'space-between', width: '100%' }}>
                    {qs?.content}
                    {index > 3 && deleteButton} {/* Only show delete button if index > 4 */}
                  </span>
                }
                name={`question_${qs?.id}`}
                rules={[
                  { required: true, message: 'Please answer this question!' },
                  () => ({
                    validator(_, value) {
                      const maxLength =
                        qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined;
                      if (value && value.length === maxLength) {
                        return Promise.reject(
                          new Error(`You have reached the maximum length of ${maxLength} characters!`)
                        );
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
            );
          })}
  
          {/* Nút Show More */}
          {/* {!showMoreQuestions2 && questions2.length > 4 && (
            <Form.Item
              label="If you need more questions, please click the box below"
              name="showMoreQuestion2"
            >
              <Button icon={<PlusOutlined />} onClick={handleShowMoreQuestions2}>Show More Questions</Button>
            </Form.Item>
          )} */}
  
          <Form.Item>
            <div className='flex justify-around'>
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
      title: '',
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
                  label="What is your company or project name? "
                  name="company or project name"
                  rules={[{ required: true, message: 'Please input your company or project name!' }]}
                >
                  <Input
                    size="large"
                    placeholder={'company or project name'}
                    value={inputCompanyName}
                    onChange={handleChangeCompanyName}
                  />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  label="Please share your email so the smart email can send the results of CV screening to you."
                  name="Your email"
                  rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
                  // tooltip={{ title: 'Register your email to communicate with the smart email!', icon: <InfoCircleOutlined /> }}
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
                  <CustomButton type="primary" htmlType="submit" loading={isLoadingGenerate} >
                    <div className="block md:hidden">Generate ...</div>
                    <div className="hidden md:block">Generate a smart email address for me</div>
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

  const AvatarFirsText = () => {
    return (
      <div className="flex justify-start w-full">
        <div>
          <Avatar src={<img src={logoSoCool} alt="avatar" />} />
        </div>
        <div className="flex flex-col md:flex-row gap-4 ml-4 md:items-center">
          <div
            className={`bg-gray-200 rounded-3xl p-4 text-gray-800 max-w-screen-xl font-medium text-lg`}
          >
            <span className="inline md:block">{t('provideSmart')}</span>{' '}
            <span className="inline md:block">{t('screeningCV')}</span>
          </div>
        </div>
      </div>
    );
  };

  const wrapLogin = () => {
    return (
      <div className="flex gap-10 justify-center items-center">
        <CustomButton type="primary" onClick={OnClickNavigateLogin}>
                Sign in
              </CustomButton>
        <CustomButton type="primary" onClick={OnClickNavigateLogin}>
                Sign up
              </CustomButton>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
       <div className="flex-grow flex-col p-6 gap-6 flex m-auto w-full max-w-3xl">
    <AvatarFirsText />
    {loadingInit ? wrapLogin() :
    
      isRequireProject ? (
        formRequireInit()
      ) : (
        <>
          {/* Avatar and Start Button Section */}
          {
            isStartNow ? 
            <AvatarWithText text="We need to learn your recruitment preferences so the smart email can handle all the CV screening tasks for you." />
            : 
            <AvatarWithText text="Let’s set up your own smart email address to help you recruit great candidates!">
              <CustomButton type="primary" onClick={OnClickStartNow}>
                Start Now
              </CustomButton>
            </AvatarWithText>
          }

          {/* Steps Section */}
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
        </>
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
        titleSuccess={t('alertCheckMail', { time: expireTime })}
        textChildren={t('useEmail')}
        textButtonConfirm={t('confirm')}
        linkAi={tempMail}
        onCloseModalSuccess={handleCloseModalSuccess}
      />
      <CustomModalWarning
        isOpen={isModalWarning}
        onCloseModalWarning={handleCloseModalWarning}
        titleWarning={t('anyStandard')}
        textButtonConfirm={t('confirm')}
        content={t('youSure')}
        onConfirmModalWarning={handleConfirmModalWarning}  
      />
    </div>
  );  
};

export default NewHome;
