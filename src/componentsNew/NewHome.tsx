import React, { ReactNode, useEffect, useRef, useState } from 'react';
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
import CustomButtonBorder from '../common/CustomButtonBorder';
import { isNotEmpty } from '../function';
import { url } from 'inspector';
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
  const [landingPage, setLandingPage] = useState('')
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [requireSalary, setRequireSalary] = useState(true)
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false)
  const [loadingButtons, setLoadingButtons] = useState<{ [key: number]: boolean }>({});

  const [visibleQuestions1, setVisibleQuestions1] = useState(questions.slice(0, 3));

  const [visibleQuestions2, setVisibleQuestions2] = useState(questions2);

  const [fromValue, setFromValue] = useState<number | null>(null);
  const [toValue, setToValue] = useState<number | null>(null);
  const [period, setPeriod] = useState('Monthly'); 
  const [negotiable, setNegotiable] = useState(false)
  const [loadingInit, setLoadingInit] = useState(true);
  const [jobCloseDate, setJobCloseDate] = useState('')

  const currentEmail = parseInt(localStorage.getItem('current_emails_count') ?? '0', 0);
  const maxEmail = parseInt(localStorage.getItem('max_emails_count') ?? '0', 9);  
  const [statesStep1, setStatesStep1] = useState<any[]>([]);
  const [finishStep1, setFinishStep1] = useState(false)

  const [statesStep2, setStatesStep2] = useState<any[]>([]);
  const [finishStep2, setFinishStep2] = useState(false)

  const [statesStep3, setStatesStep3] = useState<any[]>([]);
  const [finishStep3, setFinishStep3] = useState(false)

  const [showEmailBox, setShowEmailBox] = useState(false)
  const [uploadJd, setUploadJd] = useState(false)
  const isFirstRender = useRef(true);
  const [isClickUpload, setClickUpload] = useState(false)

  const addValueStep1 = (value: any) => {
    setStatesStep1((prevStates) => [...prevStates, value]);
  };

  const updateValueAtIndexStep1 = (index: number, newValue: any, isFinish:boolean = false) => {
    if (statesStep1[index] == '' && isClickUpload !== true && finishStep1 !== true){
      scrollToBottom()
    }
    setStatesStep1((prevStates) =>
      prevStates.map((item, i) => (i === index ? newValue : item))
    );

    if(isFinish === true){
      setFinishStep1(true)
    }
    console.log(`statesStep1: ${index}, ${statesStep1[index]}`)

  };

  const addValueStep2 = (value: any) => {
    setStatesStep2((prevStates) => [...prevStates, value]);
  };

  const updateValueAtIndexStep2 = (index: number, newValue: any, isFinish:boolean = false, type = undefined) => {
    if (statesStep2[index] == '' && finishStep2 !== true){
      scrollToBottom()
    }
    setStatesStep2((prevStates) =>
      prevStates.map((item, i) => (i === index ? newValue : item))
    );

    if(isFinish === true){
      setFinishStep2(true)
    }
    if(type === 'range'){
      if (newValue === 'Negotiable'){
        setToValue(0)
        setFromValue(0)
        setRequireSalary(false)
        setNegotiable(true)
      }else{
        setRequireSalary(true)
        setNegotiable(false)
      }
      
    }
    console.log(`updateValueAtIndexStep2: ${statesStep2[index]}`)
  };


  const addValueStep3 = (value: any) => {
    setStatesStep3((prevStates) => [...prevStates, value]);
  };

  const updateValueAtIndexStep3 = (index: number, newValue: any, isFinish:boolean = false) => {
    if (statesStep3[index] == '' && showEmailBox !== true){
      scrollToBottom()
    }
    setStatesStep3((prevStates) =>
      prevStates.map((item, i) => (i === index ? (index == 3 ? dayjs(newValue).format('YYYY-MM-DD') : newValue) : item))
    );

    if(isFinish === true){
      setShowEmailBox(true)
      setFinishStep3(true)
    }
  };



  const handleFromChange = (value: number | null) => {
    setFromValue(value);
    console.log(`fromValue: ${value}`)
  };

  const handleToChange = (value: number | null) => {
    setToValue(value);
    console.log(`toValue: ${value}`)
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  const OnClickStartNow = () => {
    setIsStartNow(true)
    let values:any = {
      decidedScore_0: 20,
      decidedScore_1: 20,
      decidedScore_2: 30,
      decidedScore_3: 20,
      decidedScore_4: 10
    }
    onFinishStep1(values)
  }

  const OnClickNavigateLogin = () => {
    navigate('/login')
  }

  const OnClickNavigateSignUp = () => {
    navigate('/signUp')
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
      // if(values.decidedScore_2 == 0 || values.decidedScore_3 == 0 || values.decidedScore_4 == 0) {
      //   setIsModalWarning(true)
      // } else {
      //   next();
      // }
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
        setVisibleQuestions1(data.data.step1)
        setVisibleQuestions2(data.data.step2)
        for(const item of data.data.step1){
          addValueStep1('')
        }

        for(const item of data.data.step2){
          addValueStep2('')
        }

        for(const item of data.data.step3){
          addValueStep3('')
        }

      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Error fetching data:', error)
    }
  }

  const handleGenerateAnswerAi = async (id: number, index:number, prompt: string, isFinish:boolean = false, step: number) => {
    const body: IBodyGenerateAnswerByAi = {
      prompt: prompt + answer0Value
    }
    setLoadingButtons((prevState) => ({
      ...prevState,
      [id]: true,
    }));
    try {
      const data = await postLinkGenerateAnswerByAiService(body)
      if (data.status_code === 200) {
        form?.setFieldsValue({
          [`question_${id}`]: data?.data,
        });

        if (step === 1){
          updateValueAtIndexStep1(index, data?.data, isFinish)
        }else if (step === 2){
          updateValueAtIndexStep2(index, data?.data, isFinish)
          console.log(`updateValueAtIndexStep2: ${index}, ${data?.data}`)
        }else if (step === 3){
          updateValueAtIndexStep3(index, data?.data, isFinish)
        }
        
      }
      setLoadingButtons((prevState) => ({
        ...prevState,
        [id]: false,
      }));
    } catch (error) {
      setLoadingButtons((prevState) => ({
        ...prevState,
        [id]: false,
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
        setClickUpload(true)
        onSuccess(response); 
        const jobPosition = response?.data.job_position
        const jobOverview = response?.data.job_overview.replace(/-\s/g, '\n- ')
        const jobResponsibilities = response?.data.job_responsibilities.replace(/-\s/g, '\n- ')
        const jobRequirements = response?.data.job_requirements.replace(/-\s/g, '\n- ')
        form?.setFieldsValue({
          question_1: jobPosition,
          question_8: jobOverview,
          question_9: jobResponsibilities,
          question_10: jobRequirements,
        });
        updateValueAtIndexStep1(0,jobPosition)
        updateValueAtIndexStep1(7,jobOverview)
        updateValueAtIndexStep1(8,jobResponsibilities)
        updateValueAtIndexStep1(9,jobRequirements, true)

        setUploadJd(true)

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
    const value = e.target.value;
    const regex = /^[a-zA-Z0-9]*$/; // Chỉ cho phép chữ cái và số

    // Kiểm tra nếu giá trị nhập vào phù hợp với regex và độ dài hợp lệ (8-30 ký tự)
    if (regex.test(value) && value.length <= 30) {
      setInputEmail(value);
    }
  }

  const disabledDate: DatePickerProps['disabledDate'] = (current) => {
    const today = dayjs().startOf('day');
    const ninetyDaysFromToday = dayjs().add(90, 'days').endOf('day');
    return (
      (current && current < today) || // Disable các ngày trước hôm nay
      (current && current > ninetyDaysFromToday) // Disable các ngày sau 90 ngày từ hôm nay
    );
  };

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
    
    console.log(`statesStep1 : ${statesStep1}`)
    console.log(`statesStep2 : ${statesStep2}`)
    console.log(`statesStep3 : ${statesStep3}`)

    let answers = []
    let aliasIndex = 1

    for(const item of statesStep1){
      answers.push({
        "alias": `q${aliasIndex}`,
        "answer": (aliasIndex == 4 || aliasIndex == 6 )? (isNotEmpty(item) ? item : 'N/A'): item
      })
      aliasIndex ++
    }

    for(const item of statesStep2){
      answers.push({
        "alias": `q${aliasIndex}`,
        "answer": aliasIndex === 11 ? `${fromValue ? fromValue : 0}-${toValue ? toValue : 0}-${item}` : item
      })
      aliasIndex ++
    }

    for(const item of statesStep3){
      answers.push({
        "alias": `q${aliasIndex}`,
        "answer": item
      })
      aliasIndex ++
    }

    handleCreateLink(answers);
  };

  const handleCreateLink = async (updatedAnswers: IQuestion[]) => {
    
    const body: IBodyCreateLink = {
      custom_alias: inputEmail,
      company_project_name: inputCompanyName,
      background_score: backgroundScore,
      expectation_score: expectationScore,
      value_score: valueScore,
      ability_score: abilityScore,
      personality_score: personalityScore,
      job_close_date: jobCloseDate,
      questions: updatedAnswers
    }

    try {
      setIsLoadingGenerate(true)
      const data = await postCreateLinkService(body)
      console.log(data)
      if (data.status_code === 200) {

        if(data.data.alias){
          setExpireTime(dayjs(data.data?.exp).format('DD/MM/YYYY'))
          setLandingPage(data.data?.url)
          setTempMail(data.data.alias.alias)
          setIsModalSuccess(true)
          localStorage.setItem('current_emails_count', (currentEmail + 1).toString());
        }else{
          message.error(data?.data?.message);
        }
        
      }else{
        console.log(data.errors?.message)
        message.error(data.errors?.message);
      }
      setIsLoadingGenerate(false)
    } catch (error) {
      console.log(error)
      setIsLoadingGenerate(false)
      message.error('Fail to create new smart email');
    }
  }

  const handleCloseModalSuccess = () => {
    window.location.reload()
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth', 
    });
  }

  useEffect(() => {
    const checkAccessToken = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setLoadingInit(true);
      } else {
        setLoadingInit(false);
      } 
    };

    checkAccessToken();

  }, []);

  const steps = [
    // {
    //   title: '',
    //   content: (
    //     <div >
    //       <div className='mb-2'> 
    //         This is the Screening Matrix. It covers five main aspects for evaluating a CV’s potential
    //       </div>
    //       <Form form={form} onFinish={onFinishStep1} layout="vertical" >
    //         <table className="w-full border-collapse border border-gray-300 table-fixed">
    //           <thead>
    //             <tr>
    //               <th className="border border-gray-300 p-2 w-1/2 md:w-1/4">Screening Standard</th>
    //               <th className="border border-gray-300 p-2 w-1/4 md:w-1/4">Min Score</th>
    //               <th className="border border-gray-300 p-2 hidden md:table-cell w-1/4">Recommended Score</th>
    //               <th className="border border-gray-300 p-2 w-1/4 md:w-1/4">User's Score</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {scoreFields.map((field, index) => (
    //               <tr key={index}>
    //                 <td className="border border-gray-300 p-4 w-1/2 md:w-1/4">
    //                   {field.label}
    //                   {field.tooltip && 
    //                     <Tooltip title={field.tooltip} placement="top">
    //                       <InfoCircleOutlined className="ml-1 text-gray-500 cursor-pointer" />
    //                     </Tooltip>
    //                   }
    //                 </td>
    //                 <td className="border border-gray-300 p-2 w-1/4 md:w-1/4">
    //                   <Form.Item className="my-4 text-center">
    //                     {field.minScore}
    //                   </Form.Item>
    //                 </td>
    //                 <td className="border border-gray-300 p-2 hidden md:table-cell w-1/4">
    //                   <Form.Item className="my-4 text-center">
    //                     {field.recommendScore}
    //                   </Form.Item>
    //                 </td>
    //                 {field.tooltip ?
    //                 <td className="border border-gray-300 p-2 w-1/4 md:w-1/4">
    //                   <Form.Item
    //                     className="m-0 text-center"
    //                     name={`decidedScore_${index}`}
    //                     rules={[{ required: true, message: 'Please select a decided score!' }]}
    //                   >
    //                     <Select placeholder="Select score"
    //                     onChange={(value) => handleScoreChange(value, index)}
    //                     >
    //                       {renderSelectOptions(field.minScore)}
    //                     </Select>
    //                   </Form.Item>
    //                 </td>
    //                 : 
    //                 <td className="border border-gray-300 p-2 text-center md:table-cell w-1/4">
    //                   {totalScore}
    //                 </td>
    //                 }
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //         {
    //           higher100 && <div className='text-red-500'>{`The total score is ${totalScore} which is higher than 100. Please reduce it to match exactly 100.`}</div>
    //         }
    //         {
    //           below100 && <div className='text-red-500'>{`The total score is ${totalScore} which is below 100. Please increase it to match exactly 100.`}</div>
    //         }
    //         <Form.Item className="mt-4">
    //           <CustomButton type="primary" htmlType="submit">
    //             Next
    //           </CustomButton>
    //         </Form.Item>
    //       </Form>
    //   </div>
    //   ),
    // },
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
            {visibleQuestions1.map((qs, index) => {
            
            let previousQuestionAnswered: boolean | undefined =
            uploadJd == true || index === 0 || 
            (qs?.question_after && (form.getFieldValue(`question_${visibleQuestions1[index - 2]?.id}`) || '').trim() !== '') ||
             ((form.getFieldValue(`question_${visibleQuestions1[index - 1]?.id}`) || '').trim() !== '')
             || (qs?.is_optional && (form.getFieldValue(`question_${visibleQuestions1[index - 2]?.id}`) || '').trim() !== '');

            if (qs?.require_previous_question === true && (statesStep1[index - 1] === 'Remote' || statesStep1[index - 1] === '')){
              previousQuestionAnswered = undefined
            }

            if (qs?.question_after === true && statesStep1[index - 2] === 'Remote'){
              previousQuestionAnswered = true
            }

            if (finishStep1 === true && qs?.alias !== 'q4'){
              previousQuestionAnswered = true
            }
            
            return previousQuestionAnswered ? (
              
              qs?.type == 'dropdown' ? <React.Fragment key={index}>
                <Form.Item name={`question_${qs?.id}`}
                label={
                  <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {qs?.content}
                  </span>
                }
                rules={[
                  { required: true, message: 'Please select a value!' },
                  {
                    validator: (_, value) => {
                      
                      return Promise.resolve();
                    },
                  },
                ]}
                >
                  
                  
                <Select
                      style={{ width: '150px' }}
                      value={statesStep1[index]} 
                      onChange={(value) => updateValueAtIndexStep1(index, value, qs?.is_finish)}
                      options={qs?.dropdown_obj}
                    />
                </Form.Item>
              </React.Fragment> :
              (<React.Fragment key={index}>
                <Form.Item
                  label={
                    qs?.is_optional ? null : <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    {qs?.content}
                    
                  </span>
                  }
                  style={{ width: qs?.is_optional ? '50%' : '100%'}}
                  name={`question_${qs?.id}`}
                  rules={[
                    { required: index == 3 ? (statesStep1[2] === 'Remote' ? false : true) : !qs?.is_optional, message: 'Please answer this question!' },
                    {
                      validator(_, value) {
                        const maxLength = qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : (qs.type == 'medium' ? 1000 : undefined);
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
                    height={qs?.is_optional ? '50px' : undefined}
                    placeholder={qs?.place_holder || 'Your answer here'}
                    value={form.getFieldValue(`question_${qs?.id}`) || ''}
                    maxLength={qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : (qs.type == 'medium' ? 1000 : undefined)}
                    onChange = {(event) => updateValueAtIndexStep1(index, event.target.value, qs?.is_finish)}
                  />
                </Form.Item>

                {qs?.prompt && (form.getFieldValue('question_1') &&
                  form.getFieldValue('question_1').trim() !== '' && (
                    <Form.Item>
                      <CustomButton
                        type="primary"
                        loading={loadingButtons[qs.id]}
                        onClick={() => handleGenerateAnswerAi(qs?.id, index, qs?.prompt, qs?.is_finish, 1)}
                      >
                        Generate Example by AI
                      </CustomButton>
                    </Form.Item>
                  ))}
              </React.Fragment>)
            ) : null;
            })}

            {finishStep1 == true ? (<Form.Item>
              <div className="flex justify-around">
                {/* <CustomButton onClick={prev}>
                  Back
                </CustomButton> */}
                <CustomButton type="primary" htmlType="submit">
                  Next
                </CustomButton>
              </div>
            </Form.Item>) : null}
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

            let previousQuestionAnswered: boolean | undefined =
            index === 0 || (form.getFieldValue(`question_${visibleQuestions2[index - 1]?.id}`) || '').trim() !== '';

            if (statesStep2[index - 1] === 'Negotiable'){
              previousQuestionAnswered = true
            }
            if(finishStep2 == true){
              previousQuestionAnswered = true
            }

            if (qs.type === 'range') {
              if (isFirstRender.current) {
                isFirstRender.current = false;
                updateValueAtIndexStep2(index, qs?.dropdown?.[0])
              } 
              
              return (
                <Form.Item
                  key={index}
                  label={
                    <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {qs?.content}
                    </span>
                  }
                  name={`question_${qs?.id}`}
                  rules={[
                    { required: requireSalary, message: 'Please enter a value!' },
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
                      disabled = {negotiable}
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
                      disabled = {negotiable}
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
                      value={statesStep2[index]} 
                      onChange={(value) => updateValueAtIndexStep2(index, value, qs?.is_finish, qs?.type)}
                      options={qs?.dropdown_obj}
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
    
            // For all other types (normal, large), render a TextArea input
            return previousQuestionAnswered && (
              <React.Fragment key={index}>
              <Form.Item
                key={index}
                label={
                  <span style={{ display: 'flex',  justifyContent: 'space-between', width: '100%' }}>
                    {qs?.content}
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
                  onChange = {(event) => updateValueAtIndexStep2(index, event.target.value, qs?.is_finish)}
                  maxLength={qs.type === 'normal' ? 500 : qs.type === 'large' ? 3000 : undefined}
                />
                
              </Form.Item>
              {!(statesStep1[2] === 'Remote' && qs?.alias === 'q13') && qs?.prompt && (<Form.Item>
                      <CustomButton 
                        type="primary"
                        loading={loadingButtons[qs.id]}
                        onClick={() => handleGenerateAnswerAi(qs?.id, index, qs?.prompt, qs?.is_finish, 2)}
                      >
                        Generate Example by AI
                      </CustomButton>
                    </Form.Item>)}
              </React.Fragment>
            );
          })}
  
          <Form.Item>
            <div className='flex justify-around'>
              <CustomButton onClick={prev}>
                Back
              </CustomButton>
              {
                finishStep2 == true && (<CustomButton type="primary" htmlType="submit">
                  Next
                </CustomButton>)
              }
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
            {questions3?.map((qs, index) => {
              let previousQuestionAnswered: boolean | undefined =
              index === 0 || (form.getFieldValue(`question_${questions3[index - 1]?.id}`) || '').trim() !== '';

              if (showEmailBox == true){
                previousQuestionAnswered = true
              }
              if (qs?.type !== 'date'){
                return previousQuestionAnswered && (<React.Fragment key={index}>
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
                    <CustomTextArea  placeholder={qs?.place_holder || 'Your answer here'}  value={form.getFieldValue(`question_${qs?.id}`) || ''}
                    onChange={(event) => updateValueAtIndexStep3(index, event.target.value, qs?.is_finish)}/>
                  </Form.Item>
                  {qs?.prompt && (<Form.Item>
                      <CustomButton 
                        type="primary"
                        loading={loadingButtons[qs.id]}
                        onClick={() => handleGenerateAnswerAi(qs?.id, index, qs?.prompt, qs?.is_finish, 3)}
                      >
                        Generate Example by AI
                      </CustomButton>
                    </Form.Item>)}
                </React.Fragment>)
              }  

              if (qs?.type === 'date'){
                return previousQuestionAnswered && <Form.Item
                  key={index}
                  layout="vertical"
                  label = {qs?.content}
                  name="choose job posting close"
                  rules={[{ required: true, message: 'Please input this job posting close!'}]}
                >
                  <DatePicker onChange={(value) => updateValueAtIndexStep3(index, value, qs?.is_finish)} disabledDate={disabledDate}/>
                </Form.Item>
              }
              
            })}
                {showEmailBox && (<Form.Item
                  layout="vertical"
                  label="Please create your own smart email address"
                  name="Your email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    // Tự thêm validate về độ dài
                    {
                      validator: (_, value) => {
                        if (value && (value.length < 8 || value.length > 30)) {
                          return Promise.reject('Email must be between 8 and 30 characters');
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Enter your email here"
                    value={inputEmail}
                    suffix="@hiringfast.net"
                    onChange={handleChangeEmail}
                  />
                </Form.Item>)}
                
              <Form.Item>
                <div className='flex justify-around'>
                  <CustomButton  onClick={prev} >
                    Back
                  </CustomButton>
                  {showEmailBox && <CustomButton type="primary" htmlType="submit" loading={isLoadingGenerate} >
                    <div className="block md:hidden">Generate ...</div>
                    <div className="hidden md:block">Generate a smart email address for me</div>
                  </CustomButton>}
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
      <div className="flex gap-5 justify-center items-center">
        <CustomButtonBorder type="primary" onClick={OnClickNavigateSignUp}>
                Create new account
              </CustomButtonBorder>
        <CustomButton classNameCustom='px-8' type="primary" onClick={OnClickNavigateLogin}>
                Sign in
              </CustomButton>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
       <div className="flex-grow flex-col p-6 gap-6 flex m-auto w-full max-w-3xl">
    <AvatarFirsText />
    {loadingInit ? wrapLogin() :
    
      // isRequireProject ? (
      //   formRequireInit()
      // ) : (
        <>
          {/* Avatar and Start Button Section */}
          {
            isStartNow ? 
            <AvatarWithText text="We need to know your recruitment details, so we can filter, screen, and rank the Resumes (CVs) for you." />
            : 
            <AvatarWithText text="Let’s set up your smart email address to help you recruit top candidates!">
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
      // )
    
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
        textBottom={landingPage}
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
