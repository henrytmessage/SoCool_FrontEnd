import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { logoSoCool } from '../assets'
import {
  CustomButton,
  CustomInputEmail,
  CustomModal,
  CustomModalSuccess,
  CustomNumberInput,
  CustomSelect,
  CustomTextArea
} from '../common'
import { KEY_CHOOSE_DELIVERY, KEY_CHOOSE_SOMETHING, PRICE_CURRENCY } from '../constant'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { postCreateSearchPrice, postCreateTitleSample, postGenerateLink, postGenerateQuestionService } from '../service'
import {
  IBodyCreateSearchPrice,
  IBodyCreateTitle,
  IBodyGenerateNextQuestion,
  IBodyPostLink
} from '../api/core/interface'
import TextAnimation from './TextAnimation'
import TypingAnimation from './TypingAnimation'
import { removeSpaces } from '../function'
import CustomModalWarning from '../common/CustomModalWarning'
import CustomDropDown from '../common/CustomDropDown'

type TypeStep = {
  id: number
  content: string | JSX.Element
  isCompleted: boolean
}

const OnBoarding = () => {
  const { t, i18n } = useTranslation()
  const textareaStep2Ref = useRef<HTMLTextAreaElement>(null)

  const dataChooseHere = [
    { key: KEY_CHOOSE_SOMETHING.PRODUCT, label: t('aProduct') },
    { key: KEY_CHOOSE_SOMETHING.SERVICE, label: t('aService') },
    { key: KEY_CHOOSE_SOMETHING.JOBS, label: t('aJob') },
    { key: KEY_CHOOSE_SOMETHING.CV, label: t('aCV') },
    { key: KEY_CHOOSE_SOMETHING.IDEA, label: t('aIdea') }
  ]

  const currencyOptions = Object.keys(PRICE_CURRENCY)

  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
  const dataChooseDelivery = useMemo(
    () => [
      {
        key: KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY,
        label: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('supportedDelivery') : t('supportedDeliveryBuy')
      },
      {
        key: KEY_CHOOSE_DELIVERY.NOTSUPPORTEDDELIVERY,
        label: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('notSupportedDelivery') : t('notSupportedDeliveryBuy')
      }
    ],
    [selectedValue, t]
  )
  const [textFirstInfo, setTextFirstInfo] = useState('')
  const [textValue, setTextValue] = useState<string>('')
  const [informationProduct, setInformationProduct] = useState('')
  const [inputValuePrice, setInputValuePrice] = useState<string>('')
  const [inputValueCurrency, setInputValueCurrency] = useState<string>(
    i18n.language === 'en' ? currencyOptions[0] : currencyOptions[1]
  )
  const [textValueAddress, setTextValueAddress] = useState<string>('')
  const [selectedDelivery, setSelectedDelivery] = useState(dataChooseDelivery[0].key)
  const [inputEmail, setInputEmail] = useState<string>('')
  const [isRequiredStepFirst, setIsRequiredStepFirst] = useState<boolean>(false)
  const [isRequiredStep2, setIsRequiredStep2] = useState<boolean>(false)
  const [isRequiredStep3, setIsRequiredStep3] = useState<boolean>(false)
  const [isRequiredStep4, setIsRequiredStep4] = useState<boolean>(false)
  const [isRequiredStep5, setIsRequiredStep5] = useState<boolean>(false)
  const [isRequiredStep6, setIsRequiredStep6] = useState<boolean>(false)
  const [isSuggestProduct, setIsSuggestProduct] = useState(false)
  const [contentSuggestProduct, setContentSuggestProduct] = useState('')
  const [isSuggestPrice, setIsSuggestPrice] = useState(false)
  const [contentSuggestPrice, setContentSuggestPrice] = useState('')
  const [linkAi, setLinkAi] = useState('')

  // selectedValue === KEY_CHOOSE_SOMETHING.IDEA
  const [inputStepIdea2, setInputStepIdea2] = useState('')
  const [isRequiredStepIdea2, setIsRequiredStepIdea2] = useState<boolean>(false)
  const [inputStepIdea3, setInputStepIdea3] = useState('')
  const [isRequiredStepIdea3, setIsRequiredStepIdea3] = useState<boolean>(false)
  const [inputStepIdea4, setInputStepIdea4] = useState('')
  const [isRequiredStepIdea4, setIsRequiredStepIdea4] = useState<boolean>(false)
  const [inputStepIdea5, setInputStepIdea5] = useState('')
  const [isRequiredStepIdea5, setIsRequiredStepIdea5] = useState<boolean>(false)
  const [inputStepIdea6, setInputStepIdea6] = useState('')
  const [isRequiredStepIdea6, setIsRequiredStepIdea6] = useState<boolean>(false)
  const [isRequiredStepIdea7, setIsRequiredStepIdea7] = useState<boolean>(false)
  const textareaStepIdea3Ref = useRef<HTMLTextAreaElement>(null)
  const [generateQuestionAi, setGenerateQuestionAi] = useState('')
  const [selectStepIdea4, setSelectStepIdea4] = useState(false)
  const [selectStepIdea5, setSelectStepIdea5] = useState(false)
  const [selectStepIdea6, setSelectStepIdea6] = useState(false)
  const [noUpdateStepIdea4, setNoUpdateStepIdea4] = useState(false)
  const [noUpdateStepIdea5, setNoUpdateStepIdea5] = useState(false)
  const [noUpdateStepIdea6, setNoUpdateStepIdea6] = useState(false)

  const [isChooseSuggestProduct, setIsChooseSuggestProduct] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isModalSuccess, setIsModalSuccess] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const stepProduct: TypeStep[] = [
    { id: 1.5, content: t('questionSell'), isCompleted: false },
    { id: 2, content: t('questionCondition'), isCompleted: false },
    { id: 3, content: t('questionPrice'), isCompleted: false },
    {
      id: 4,
      content:
        selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('questionYourAddressSell') : t('questionYourAddressBuy'),
      isCompleted: false
    },
    {
      id: 5,
      content: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('chooseShippingSell') : t('chooseShippingBuy'),
      isCompleted: false
    },
    {
      id: 6,
      content: (
        <>
          {t('inputEmailAddress')}
          <span className="text-gray-800 font-medium">
            {selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('inputEmailAddressSell') : t('inputEmailAddressBuy')}
          </span>
        </>
      ),
      isCompleted: false
    }
  ]

  const stepIdea: TypeStep[] = [
    { id: 2, content: t('placeholderArgument'), isCompleted: false },
    { id: 3, content: t('presentEvidence'), isCompleted: false },
    { id: 4, content: '', isCompleted: false },
    { id: 5, content: '', isCompleted: false },
    { id: 6, content: '', isCompleted: false },
    {
      id: 7,
      content: (
        <>
          {t('inputEmailAddress')}
          <span className="text-gray-800 font-medium">{t('inputEmailAddressSellIdea')}</span>
        </>
      ),
      isCompleted: false
    }
  ]

  const stepIdeaComingSoon: TypeStep[] = [
    { id: 2, content: t('comingSoon'), isCompleted: false },
    { id: 3, content: '', isCompleted: false }
  ]

  const [steps, setSteps] = useState(() => {
    switch (selectedValue) {
      case KEY_CHOOSE_SOMETHING.PRODUCT:
        return [{ id: 1, content: t('questionHelp'), isCompleted: false }, ...stepProduct]
      case KEY_CHOOSE_SOMETHING.IDEA:
        return [{ id: 1, content: t('questionHelp'), isCompleted: false }, ...stepIdea]
      case KEY_CHOOSE_SOMETHING.SERVICE:
        return [{ id: 1, content: t('questionHelp'), isCompleted: false }, ...stepIdeaComingSoon]
      case KEY_CHOOSE_SOMETHING.JOBS:
        return [{ id: 1, content: t('questionHelp'), isCompleted: false }, ...stepIdeaComingSoon]
      case KEY_CHOOSE_SOMETHING.CV:
        return [{ id: 1, content: t('questionHelp'), isCompleted: false }, ...stepIdeaComingSoon]
      default:
        return [{ id: 1, content: t('questionHelp'), isCompleted: false }, ...stepProduct]
    }
  })

  const changeLanguage = (lang: string) => {
    localStorage.setItem('language', lang)
    i18n.changeLanguage(lang)
    // window.location.reload()
  }

  // step 1
  const handleSelectChange = (value: string) => {
    setSelectedValue(value)
    updateStepStatus(1, true)
    setSelectedDelivery(dataChooseDelivery[0].key)
  }

  // step 1.5
  const handleTextStepFirstChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStepFirst(false)
    } else {
      setIsRequiredStepFirst(true)
    }
    setTextFirstInfo(e.target.value)
  }
  const handleConfirmTextFirst = () => {
    if (textFirstInfo) {
      updateStepStatus(1.5, true)
    } else {
      setIsRequiredStepFirst(true)
    }
  }

  // step 2
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStep2(false)
    } else {
      setIsRequiredStep2(true)
    }
    setTextValue(e.target.value)
  }

  const handleConfirmText = () => {
    if (textValue) {
      // updateStepStatus(2, true)
      setIsSuggestProduct(true)
      setInformationProduct(textFirstInfo + textValue)
      CreateAiProductTitle()
    } else {
      setIsRequiredStep2(true)
    }
  }

  // get ai create title sample
  const CreateAiProductTitle = async () => {
    setIsLoading(true)
    const body: IBodyCreateTitle = {
      title: textFirstInfo + ' ' + textValue,
      type: selectedValue || KEY_CHOOSE_SOMETHING.PRODUCT
    }
    try {
      const data = await postCreateTitleSample(body)
      if (data.status_code === 200) {
        setContentSuggestProduct(data.data?.title)
        const productNameAfterGenAI = data.data.product_name
        // const resDataProductName = t('currentProductPrice', { productName: productNameAfterGenAI })
        CreateAiSearchPriceProduct(productNameAfterGenAI)
        setIsLoading(false)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleClickYesSuggestProduct = () => {
    setTextValue(contentSuggestProduct)
    setIsSuggestProduct(false)
    updateStepStatus(2, true)
    setIsRequiredStep2(false)
    setIsChooseSuggestProduct(true)
    // đợi ai trả về content price
    setIsSuggestPrice(true)
  }

  const handleClickChangeSuggestProduct = () => {
    updateStepStatus(1, true)
    // updateStepStatus(2, false)
    setIsSuggestProduct(false)
    if (textareaStep2Ref.current) {
      textareaStep2Ref.current.focus()
    }
  }

  const handleClickNoSuggestProduct = () => {
    setIsSuggestProduct(false)
    updateStepStatus(2, true)
    // đợi ai trả về content price
    setIsSuggestPrice(true)
  }

  // get ai create search engine price
  const CreateAiSearchPriceProduct = async (productName: string) => {
    setIsLoading(true)
    const body: IBodyCreateSearchPrice = {
      title: productName
    }
    try {
      const data = await postCreateSearchPrice(body)
      if (data.status_code === 200) {
        setIsLoading(false)
        setContentSuggestPrice(data.data)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error fetching data:', error)
    }
  }

  // step 3
  const handleChangeNumber = (value: string) => {
    setInputValuePrice(value)
    if (value === '') {
      setIsRequiredStep3(true)
    } else {
      setIsRequiredStep3(false)
    }
  }

  const handleChangeCurrency = (value: string) => {
    setInputValuePrice('')
    setInputValueCurrency(value)
  }

  const handleConfirmPriceCurrency = () => {
    if (inputValuePrice) {
      updateStepStatus(3, true)
    } else {
      setIsRequiredStep3(true)
    }
  }

  // step 4
  const handleTextValueAddress = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStep4(false)
    } else {
      setIsRequiredStep4(true)
    }
    setTextValueAddress(e.target.value)
  }

  const handleConfirmCriteria = () => {
    if (textValueAddress) {
      updateStepStatus(4, true)
    } else {
      setIsRequiredStep4(true)
    }
  }

  // step 5
  const handleSelectChangeDelivery = (value: string) => {
    setSelectedDelivery(value)
  }
  const handleConfirmDelivery = () => {
    updateStepStatus(5, true)
  }
  // step 6
  const validateEmail = (email: string) => {
    // Regular expression for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const handleInputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateEmail(e.target.value) && e.target.value !== '') {
      setIsRequiredStep6(false)
      setIsRequiredStepIdea7(false)
    } else {
      setIsRequiredStep6(true)
      setIsRequiredStepIdea7(true)
    }
    setInputEmail(e.target.value)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    setIsEdit(true)
  }

  const handleOKModal = async () => {
    const bodyProduct: IBodyPostLink = {
      type: selectedValue,
      title: textValue,
      price: removeSpaces(inputValuePrice),
      currency: inputValueCurrency,
      address: textValueAddress,
      can_ship: selectedDelivery === KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY ? true : false,
      email: inputEmail
    }
    const bodyIdea: IBodyPostLink = {
      type: selectedValue,
      title: inputStepIdea2,
      evidence: inputStepIdea3,
      question1: inputStepIdea4,
      question2: inputStepIdea5,
      question3: inputStepIdea6,
      email: inputEmail
    }

    let requestBody

    switch (selectedValue) {
      case KEY_CHOOSE_SOMETHING.PRODUCT:
        requestBody = bodyProduct
        break
      case KEY_CHOOSE_SOMETHING.IDEA:
        requestBody = bodyIdea
        break
      default:
        console.error('Unsupported selectedValue:', selectedValue)
        return
    }
    try {
      const data = await postGenerateLink(requestBody)
      if (data.status_code === 200) {
        window.dataLayer.push({
          event: 'link_generated',
          email: inputEmail
        })
        setLinkAi(data.data.url)
        setIsOpenModal(false)
        setIsModalSuccess(true)
      } else if (data.status_code === 406) {
        setIsOpenModal(false)
        setIsModalWarning(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCloseModalSuccess = () => {
    window.location.reload()
  }

  const handleCloseModalWarning = () => {
    setIsModalWarning(false)
  }

  const handleFormSubmit = () => {
    if (inputValuePrice === '') {
      setIsRequiredStep3(true)
      return
    }
    if (isRequiredStepFirst || isRequiredStep2 || isRequiredStep3 || isRequiredStep4 || isRequiredStep6) {
      return
    } else {
      setIsEdit(false)
      setIsOpenModal(true)
    }
  }

  // When selectedValue === KEY_CHOOSE_SOMETHING.IDEA
  // When selectedValue === KEY_CHOOSE_SOMETHING.IDEA && step 2
  const handleInputStepIdea2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStepIdea2(false)
    } else {
      setIsRequiredStepIdea2(true)
    }
    setInputStepIdea2(e.target.value)
  }

  const handleConfirmInputStepIdea2 = () => {
    if (inputStepIdea2) {
      setIsRequiredStepIdea2(false)
      updateStepStatus(2, true)
    } else {
      setIsRequiredStepIdea2(true)
    }
  }
  // When selectedValue === KEY_CHOOSE_SOMETHING.IDEA && step 3
  const handleInputStepIdea3Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStepIdea3(false)
    } else {
      setIsRequiredStepIdea3(true)
    }
    setInputStepIdea3(e.target.value)
  }

  const handleConfirmInputStepIdea3 = () => {
    if (inputStepIdea3) {
      setIsRequiredStepIdea3(false)
      CreateAiGenerateQuestion()
      updateStepStatus(3, true)
    } else {
      setIsRequiredStepIdea3(true)
    }
  }
  // When selectedValue === KEY_CHOOSE_SOMETHING.IDEA && step 4
  const handleClickYesStepIdea4 = () => {
    setIsRequiredStepIdea4(false)
    setSelectStepIdea4(true)
    setInputStepIdea4(generateQuestionAi)
    setNoUpdateStepIdea4(true)
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === 4 ? { ...step, content: t('firstSupportArgument') } : step))
    )

    updateStepStatus(4, true)
    CreateAiGenerateQuestion()
  }
  const handleClickChangeStepIdea4 = () => {
    CreateAiGenerateQuestion()
  }
  const handleClickNoStepIdea4 = () => {
    setIsRequiredStepIdea4(false)
    setSelectStepIdea4(true)
    setInputStepIdea4('')
    setNoUpdateStepIdea4(true)
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === 4 ? { ...step, content: t('firstSupportArgument') } : step))
    )
  }

  const handleInputStepIdea4Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStepIdea4(false)
    } else {
      setIsRequiredStepIdea4(true)
    }
    setInputStepIdea4(e.target.value)
  }

  const handleConfirmInputStepIdea4 = () => {
    if (inputStepIdea4) {
      setIsRequiredStepIdea4(false)
      CreateAiGenerateQuestion()
      updateStepStatus(4, true)
    } else {
      setIsRequiredStepIdea4(true)
    }
  }

  // When selectedValue === KEY_CHOOSE_SOMETHING.IDEA && step 5
  const handleClickYesStepIdea5 = () => {
    setIsRequiredStepIdea5(false)
    setSelectStepIdea5(true)
    setInputStepIdea5(generateQuestionAi)
    setNoUpdateStepIdea5(true)
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === 5 ? { ...step, content: t('secondSupportArgument') } : step))
    )

    updateStepStatus(5, true)
    CreateAiGenerateQuestion()
  }
  const handleClickChangeStepIdea5 = () => {
    CreateAiGenerateQuestion()
  }
  const handleClickNoStepIdea5 = () => {
    setIsRequiredStepIdea5(false)
    setSelectStepIdea5(true)
    setInputStepIdea5('')
    setNoUpdateStepIdea5(true)
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === 5 ? { ...step, content: t('secondSupportArgument') } : step))
    )
  }

  const handleInputStepIdea5Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStepIdea5(false)
    } else {
      setIsRequiredStepIdea5(true)
    }
    setInputStepIdea5(e.target.value)
  }

  const handleConfirmInputStepIdea5 = () => {
    if (inputStepIdea5) {
      setIsRequiredStepIdea5(false)
      CreateAiGenerateQuestion()
      updateStepStatus(5, true)
    } else {
      setIsRequiredStepIdea5(true)
    }
  }

  // When selectedValue === KEY_CHOOSE_SOMETHING.IDEA && step 6
  const handleClickYesStepIdea6 = () => {
    setIsRequiredStepIdea6(false)
    setSelectStepIdea6(true)
    setInputStepIdea6(generateQuestionAi)
    setNoUpdateStepIdea6(true)
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === 6 ? { ...step, content: t('lastSupportArgument') } : step))
    )

    updateStepStatus(6, true)
  }
  const handleClickChangeStepIdea6 = () => {
    CreateAiGenerateQuestion()
  }
  const handleClickNoStepIdea6 = () => {
    setIsRequiredStepIdea6(false)
    setSelectStepIdea6(true)
    setInputStepIdea6('')
    setNoUpdateStepIdea6(true)
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === 6 ? { ...step, content: t('lastSupportArgument') } : step))
    )
  }

  const handleInputStepIdea6Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value !== '') {
      setIsRequiredStepIdea6(false)
    } else {
      setIsRequiredStepIdea6(true)
    }
    setInputStepIdea6(e.target.value)
  }

  const handleConfirmInputStepIdea6 = () => {
    if (inputStepIdea6) {
      setIsRequiredStepIdea6(false)
      updateStepStatus(6, true)
    } else {
      setIsRequiredStepIdea6(true)
    }
  }

  const handleFormSubmitStepIdea6 = () => {
    if (
      isRequiredStepIdea2 ||
      isRequiredStepIdea3 ||
      isRequiredStepIdea4 ||
      isRequiredStepIdea5 ||
      isRequiredStepIdea6 ||
      isRequiredStepIdea7
    ) {
      return
    } else {
      setIsEdit(false)
      setIsOpenModal(true)
    }
  }

  const CreateAiGenerateQuestion = async () => {
    setIsLoading(true)
    try {
      const body: IBodyGenerateNextQuestion = {
        argument: inputStepIdea2
      }
      const data = await postGenerateQuestionService(body)
      if (data.status_code === 200) {
        setIsLoading(false)
        setGenerateQuestionAi(data.data)
      } else {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const updateStepStatus = (stepId: number, isCompleted: boolean) => {
    setSteps(prevSteps => prevSteps.map(step => (step.id === stepId ? { ...step, isCompleted } : step)))
  }

  useEffect(() => {
    // Cập nhật lại nội dung của các bước khi thay đổi ngôn ngữ hoặc selectedValue
    if (selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT) {
      setInputValuePrice('')
      setInputValueCurrency(i18n.language === 'en' ? currencyOptions[0] : currencyOptions[1])
      setSteps([
        { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
        {
          id: 1.5,
          content: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('questionSell') : t('comingSoon'),
          isCompleted: steps[1].isCompleted
        },
        {
          id: 2,
          content: t('questionCondition'),
          isCompleted: steps[2].isCompleted
        },
        { id: 3, content: t('questionPrice'), isCompleted: steps[3].isCompleted },
        {
          id: 4,
          content:
            selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('questionYourAddressSell') : t('questionYourAddressBuy'),
          isCompleted: steps[4].isCompleted
        },
        {
          id: 5,
          content: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('chooseShippingSell') : t('chooseShippingBuy'),
          isCompleted: steps[5].isCompleted
        },
        {
          id: 6,
          content: (
            <>
              {t('inputEmailAddress')}
              <span className="text-gray-800 font-medium">
                {selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT
                  ? t('inputEmailAddressSell')
                  : t('inputEmailAddressBuy')}
              </span>
            </>
          ),
          isCompleted: steps[6].isCompleted
        }
      ])
    } else if (selectedValue === KEY_CHOOSE_SOMETHING.IDEA) {
      setSteps([
        { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
        { id: 2, content: t('placeholderArgument'), isCompleted: steps[1].isCompleted },
        { id: 3, content: t('presentEvidence'), isCompleted: steps[2].isCompleted },
        {
          id: 4,
          content: !noUpdateStepIdea4
            ? renderAiGenerateQuestion(
                generateQuestionAi,
                handleClickYesStepIdea4,
                handleClickChangeStepIdea4,
                handleClickNoStepIdea4
              )
            : steps[3].content,
          isCompleted: steps[3].isCompleted
        },
        {
          id: 5,
          content: !noUpdateStepIdea5
            ? renderAiGenerateQuestion(
                generateQuestionAi,
                handleClickYesStepIdea5,
                handleClickChangeStepIdea5,
                handleClickNoStepIdea5
              )
            : steps[4].content,
          isCompleted: steps[4].isCompleted
        },
        {
          id: 6,
          content: !noUpdateStepIdea6
            ? renderAiGenerateQuestion(
                generateQuestionAi,
                handleClickYesStepIdea6,
                handleClickChangeStepIdea6,
                handleClickNoStepIdea6
              )
            : steps[5].content,
          isCompleted: steps[5].isCompleted
        },
        {
          id: 7,
          content: (
            <>
              {t('inputEmailAddress')}
              <span className="text-gray-800 font-medium">{t('inputEmailAddressSellIdea')}</span>
            </>
          ),
          isCompleted: steps[6].isCompleted
        }
      ])
    } else if (selectedValue === KEY_CHOOSE_SOMETHING.SERVICE) {
      setSteps([
        { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
        { id: 2, content: t('comingSoon'), isCompleted: steps[1].isCompleted },
        { id: 3, content: '', isCompleted: steps[2].isCompleted }
      ])
    } else if (selectedValue === KEY_CHOOSE_SOMETHING.JOBS) {
      setSteps([
        { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
        { id: 2, content: t('comingSoon'), isCompleted: steps[1].isCompleted },
        { id: 3, content: '', isCompleted: steps[2].isCompleted }
      ])
    } else if (selectedValue === KEY_CHOOSE_SOMETHING.CV) {
      setSteps([
        { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
        { id: 2, content: t('comingSoon'), isCompleted: steps[1].isCompleted },
        { id: 3, content: '', isCompleted: steps[2].isCompleted }
      ])
    }
  }, [i18n.language, selectedValue, generateQuestionAi, isLoading])

  const renderCallToAction = () => (
    <div className="flex justify-start">
      <div>
        <Avatar src={<img src={logoSoCool} alt="avatar" />} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-gray-200 ml-4 rounded-3xl p-4 text-gray-800 max-w-screen-xl font-medium text-lg">
          {t('callToAction')}
        </div>
        <div className="flex">
          <div className="bg-gray-200 ml-4 rounded-xl p-[0.5rem] text-gray-800 flex space-x-2 items-center">
            <CustomButton onClick={() => changeLanguage('en')} type={i18n.language === 'en' ? 'primary' : 'default'}>
              {t('EN')}
            </CustomButton>
            <CustomButton onClick={() => changeLanguage('vn')} type={i18n.language === 'vn' ? 'primary' : 'default'}>
              {t('VN')}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStepContentProduct = (stepId: number) => {
    switch (stepId) {
      case 1:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomSelect
              value={selectedValue}
              onChange={handleSelectChange}
              options={dataChooseHere}
              disabled={selectedValue ? true : false}
            />
          </div>
        )
      case 1.5:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomTextArea
              value={textFirstInfo}
              placeholder={t('writeSomethingHere')}
              required={isRequiredStepFirst}
              onChange={handleTextStepFirstChange}
              isEdit={isEdit}
            />
            {!steps[1].isCompleted && (
              <div>
                <CustomButton onClick={handleConfirmTextFirst}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 2:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomTextArea
              ref={textareaStep2Ref}
              value={textValue}
              placeholder={t('exampleCondition')}
              required={isRequiredStep2}
              onChange={handleTextAreaChange}
              isEdit={isEdit}
            />
            {!steps[2].isCompleted && !isSuggestProduct && (
              <div>
                <CustomButton onClick={handleConfirmText}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 3:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomNumberInput
              onEnter={handleConfirmPriceCurrency}
              value={inputValuePrice}
              valueCurrency={inputValueCurrency}
              currencyOptions={currencyOptions}
              required={isRequiredStep3}
              onChange={handleChangeNumber}
              onChangeSelect={handleChangeCurrency}
              isEdit={isEdit}
            />
            {!steps[3].isCompleted && (
              <div>
                <CustomButton onClick={handleConfirmPriceCurrency}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 4:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomTextArea
              value={textValueAddress}
              placeholder={t('placeholderAddress')}
              required={isRequiredStep4}
              onChange={handleTextValueAddress}
              isEdit={isEdit}
            />
            {!steps[4].isCompleted && (
              <div>
                <CustomButton onClick={handleConfirmCriteria}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 5:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomSelect
              value={selectedDelivery}
              onChange={handleSelectChangeDelivery}
              options={dataChooseDelivery}
              isEdit={isEdit}
            />
            {!steps[5].isCompleted && (
              <div>
                <CustomButton onClick={handleConfirmDelivery}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 6:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomInputEmail
              value={inputEmail}
              onChange={handleInputEmailChange}
              required={isRequiredStep6}
              isEdit={isEdit}
            />
            {isEdit && renderEditHere}
            <div>
              <CustomButton onClick={handleFormSubmit}>{t('generateLink')}</CustomButton>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderStepContentIdea = (stepId: number) => {
    switch (stepId) {
      case 1:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomSelect
              value={selectedValue}
              onChange={handleSelectChange}
              options={dataChooseHere}
              disabled={selectedValue ? true : false}
            />
          </div>
        )
      case 2:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomTextArea
              value={inputStepIdea2}
              placeholder={t('exampleCondition')}
              required={isRequiredStepIdea2}
              onChange={handleInputStepIdea2Change}
              isEdit={isEdit}
            />
            {!steps[1].isCompleted && (
              <div>
                <CustomButton onClick={handleConfirmInputStepIdea2}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 3:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomTextArea
              value={inputStepIdea3}
              placeholder={t('exampleCondition')}
              required={isRequiredStepIdea3}
              onChange={handleInputStepIdea3Change}
              isEdit={isEdit}
            />
            {!steps[2].isCompleted && (
              <div>
                <CustomButton onClick={handleConfirmInputStepIdea3}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 4:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            {selectStepIdea4 && (
              <CustomTextArea
                value={inputStepIdea4}
                placeholder={t('exampleCondition')}
                required={isRequiredStepIdea4}
                onChange={handleInputStepIdea4Change}
                isEdit={isEdit}
              />
            )}
            {!steps[3].isCompleted && selectStepIdea4 && (
              <div>
                <CustomButton onClick={handleConfirmInputStepIdea4}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 5:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            {selectStepIdea5 && (
              <CustomTextArea
                value={inputStepIdea5}
                placeholder={t('exampleCondition')}
                required={isRequiredStepIdea5}
                onChange={handleInputStepIdea5Change}
                isEdit={isEdit}
              />
            )}
            {!steps[4].isCompleted && selectStepIdea5 && (
              <div>
                <CustomButton onClick={handleConfirmInputStepIdea5}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 6:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            {selectStepIdea6 && (
              <CustomTextArea
                value={inputStepIdea6}
                placeholder={t('exampleCondition')}
                required={isRequiredStepIdea6}
                onChange={handleInputStepIdea6Change}
                isEdit={isEdit}
              />
            )}
            {!steps[5].isCompleted && selectStepIdea6 && (
              <div>
                <CustomButton onClick={handleConfirmInputStepIdea6}>{t('confirm')}</CustomButton>
              </div>
            )}
            {isEdit && renderEditHere}
          </div>
        )
      case 7:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomInputEmail
              value={inputEmail}
              onChange={handleInputEmailChange}
              required={isRequiredStepIdea7}
              isEdit={isEdit}
            />
            {isEdit && renderEditHere}
            <div>
              <CustomButton onClick={handleFormSubmitStepIdea6}>{t('generateLink')}</CustomButton>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderStepComingSoon = (stepId: number) => {
    switch (stepId) {
      case 1:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomSelect
              value={selectedValue}
              onChange={handleSelectChange}
              options={dataChooseHere}
              disabled={selectedValue ? true : false}
            />
          </div>
        )
      case 2:
        return null
      default:
        return null
    }
  }

  const renderStepContent = (stepId: number) => {
    switch (selectedValue) {
      case KEY_CHOOSE_SOMETHING.PRODUCT:
        return renderStepContentProduct(stepId)
      case KEY_CHOOSE_SOMETHING.IDEA:
        return renderStepContentIdea(stepId)
      case KEY_CHOOSE_SOMETHING.SERVICE:
        return renderStepComingSoon(stepId)
      case KEY_CHOOSE_SOMETHING.JOBS:
        return renderStepComingSoon(stepId)
      case KEY_CHOOSE_SOMETHING.CV:
        return renderStepComingSoon(stepId)
      default:
        return renderStepContentProduct(stepId)
    }
  }

  const renderAiGenerateQuestion = (
    textAnimation: string,
    handleClickGenerateYes: () => void,
    handleClickGenerateChange: () => void,
    handleClickGenerateNo: () => void
  ) => (
    <div>
      {isLoading ? (
        <TypingAnimation />
      ) : (
        <>
          <TextAnimation text={textAnimation} />
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
            <Button
              key="Select this template"
              onClick={handleClickGenerateYes}
              className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
            >
              {t('selectTemplate')}
            </Button>
            <Button
              key="Change the template"
              onClick={handleClickGenerateChange}
              className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
            >
              {t('changeTemplate')}
            </Button>
            <Button
              key="Not selected"
              onClick={handleClickGenerateNo}
              className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
            >
              {t('notSelected')}
            </Button>
          </div>
        </>
      )}
    </div>
  )

  const renderAiSuggestProduct = (
    textAnimation: string,
    handleClickYes: () => void,
    handleClickChange: () => void,
    handleClickNo: () => void
  ) => (
    <div className="flex justify-start">
      <div>
        <Avatar src={<img src={logoSoCool} alt="avatar" />} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-gray-200 ml-4 rounded-3xl p-4 text-gray-800 max-w-screen-xl">
          {isLoading ? (
            <TypingAnimation />
          ) : (
            <>
              <TextAnimation text={textAnimation} />
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <Button
                  key="Select this template"
                  onClick={handleClickYes}
                  className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                >
                  {t('selectTemplate')}
                </Button>
                <Button
                  key="Change the template"
                  onClick={handleClickChange}
                  className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                >
                  {t('changeTemplate')}
                </Button>
                <Button
                  key="Not selected"
                  onClick={handleClickNo}
                  className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                >
                  {t('notSelected')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderAiSuggestPrice = () => (
    <div className="flex justify-start">
      <div>
        <Avatar src={<img src={logoSoCool} alt="avatar" />} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-gray-200 ml-4 rounded-3xl p-4 text-gray-800 max-w-screen-xl">
          {isLoading ? <TypingAnimation /> : <TextAnimation text={contentSuggestPrice} />}
        </div>
      </div>
    </div>
  )

  const renderEditHere = (
    <div className="flex items-center text-[#faad14]">
      <div className="hidden md:block">
        <ArrowLeftOutlined />
      </div>
      <div className="pl-1">{t('editHere')}</div>
    </div>
  )

  const renderInformation = (
    <table className="border-collapse border border-gray-300 shadow-md rounded-lg w-full my-8">
      <tbody>
        {[
          {
            title: t('youWant'),
            value: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('aProduct') : t('buySomething')
          },
          { title: t('product'), value: isChooseSuggestProduct ? textValue : informationProduct },
          { title: t('priceRange'), value: `${inputValuePrice} ${inputValueCurrency}` },
          { title: t('address'), value: textValueAddress },
          {
            title: t('delivery'),
            value:
              selectedDelivery === KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY
                ? selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT
                  ? t('supportedDelivery')
                  : t('supportedDeliveryBuy')
                : selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT
                ? t('notSupportedDelivery')
                : t('notSupportedDeliveryBuy')
          },
          { title: t('yourEmail'), value: inputEmail }
        ].map((item, index) => (
          <tr key={index} className="border-b border-gray-300">
            <th className="p-3 bg-gray-100 border-r border-gray-300">{item.title}</th>
            <td className="p-3">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const renderInformationSelectIdea = (
    <table className="border-collapse border border-gray-300 shadow-md rounded-lg w-full my-8">
      <tbody>
        {[
          { title: t('yourArgument'), value: inputStepIdea2 },
          { title: t('yourEvidence'), value: inputStepIdea3 },
          { title: t('yourFirstQuestion'), value: inputStepIdea4 },
          { title: t('yourSecondQuestion'), value: inputStepIdea5 },
          { title: t('yourFinalQuestion'), value: inputStepIdea6 },
          { title: t('yourEmail'), value: inputEmail }
        ].map((item, index) => (
          <tr key={index} className="border-b border-gray-300">
            <th className="p-3 bg-gray-100 border-r border-gray-300">{item.title}</th>
            <td className="p-3">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  const renderContentBasedOnSelectedValue = () => {
    switch (selectedValue) {
      case KEY_CHOOSE_SOMETHING.PRODUCT:
        return renderInformation
      case KEY_CHOOSE_SOMETHING.IDEA:
        return renderInformationSelectIdea
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-108px)]">
      <div className="flex-grow p-6">
        <div className="flex flex-col space-y-4">
          {renderCallToAction()}
          {steps.map((step, index) => (
            <div key={step.id || index} className="flex flex-col space-y-4">
              <div
                className={`flex items-start justify-start ${
                  index > 0 && !steps[index - 1].isCompleted ? 'hidden' : ''
                }`}
              >
                <div className="flex flex-row">
                  <Avatar src={<img src={logoSoCool} alt="avatar" />} />
                </div>
                <div
                  className={` ${
                    step.id === 1 || (step.id === 5 && selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT)
                      ? 'flex flex-row md:items-center'
                      : 'flex-col'
                  } flex-col md:flex-row ml-4 gap-4 `}
                >
                  <div
                    className={`bg-gray-200 rounded-3xl p-4 text-gray-800 max-w-screen-xl inline-block  mr-4 ${
                      step.id === 1 || (step.id === 5 && selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT) ? '' : 'mb-4'
                    }`}
                  >
                    {step.content}
                  </div>
                  <div>{renderStepContent(step.id)}</div>
                </div>
              </div>
              {!steps[2].isCompleted &&
                step.id === 2 &&
                isSuggestProduct &&
                renderAiSuggestProduct(
                  `${t('sampleSuggestProduct')}\n${contentSuggestProduct}`,
                  handleClickYesSuggestProduct,
                  handleClickChangeSuggestProduct,
                  handleClickNoSuggestProduct
                )}
              {step.id === 2 && isSuggestPrice && contentSuggestPrice && renderAiSuggestPrice()}
            </div>
          ))}
        </div>
        <CustomModalSuccess
          isOpen={isModalSuccess}
          titleSuccess={t('alertCheckMail')}
          textButtonConfirm={t('confirm')}
          linkAi={linkAi}
          onCloseModalSuccess={handleCloseModalSuccess}
        />
        <CustomModalWarning
          isOpen={isModalWarning}
          titleWarning={t('warningMaximumLink')}
          textButtonConfirm={t('confirm')}
          onCloseModalWarning={handleCloseModalWarning}
        />
        <CustomModal
          open={isOpenModal}
          textButtonEdit={t('edit')}
          textButtonOK={t('submit')}
          onClose={handleCloseModal}
          onOK={handleOKModal}
          title={t('hereInformation')}
        >
          {renderContentBasedOnSelectedValue()}
        </CustomModal>
      </div>

      <div className="text-center pb-2">
        By using Socool, you agree to our{' '}
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
    </div>
  )
}

export default OnBoarding
