import React, { useEffect, useState } from 'react'
import { Avatar } from 'antd'
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
import { postGenerateLink } from '../service'
import { IBodyPostLink } from '../api/core/interface'
import CustomAlert from '../common/CustomAlert'

const OnBoarding = () => {
  const { t, i18n } = useTranslation()

  const dataChooseHere = [
    { key: KEY_CHOOSE_SOMETHING.SELL_SOMETHING, label: t('sellSomething') },
    { key: KEY_CHOOSE_SOMETHING.BUY_SOMETHING, label: t('buySomething') }
  ]
  const dataChooseDelivery = [
    { key: KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY, label: t('supportedDelivery') },
    { key: KEY_CHOOSE_DELIVERY.NOTSUPPORTEDDELIVERY, label: t('notSupportedDelivery') }
  ]
  const currencyOptions = Object.keys(PRICE_CURRENCY)

  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
  const [textValue, setTextValue] = useState<string>('')
  const [inputValuePrice, setInputValuePrice] = useState<string>('')
  const [inputValueCurrency, setInputValueCurrency] = useState<string>(
    i18n.language === 'en' ? currencyOptions[0] : currencyOptions[1]
  )
  const [textValueAddress, setTextValueAddress] = useState<string>('')
  const [selectedDelivery, setSelectedDelivery] = useState(dataChooseDelivery[0].key)
  const [inputEmail, setInputEmail] = useState<string>('')
  const [isRequiredStep2, setIsRequiredStep2] = useState<boolean>(false)
  const [isRequiredStep3, setIsRequiredStep3] = useState<boolean>(false)
  const [isRequiredStep4, setIsRequiredStep4] = useState<boolean>(false)
  const [isRequiredStep5, setIsRequiredStep5] = useState<boolean>(false)
  const [isRequiredStep6, setIsRequiredStep6] = useState<boolean>(false)

  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isModalSuccess, setIsModalSuccess] = useState(false)

  const [steps, setSteps] = useState([
    { id: 1, content: t('questionHelp'), isCompleted: false },
    {
      id: 2,
      content: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('questionSell') : t('questionBuy'),
      isCompleted: false
    },
    { id: 3, content: t('questionPrice'), isCompleted: false },
    {
      id: 4,
      content: t('questionYourAddress'),
      isCompleted: false
    },
    { id: 5, content: t('chooseShipping'), isCompleted: false },
    { id: 6, content: t('inputEmailAddress'), isCompleted: false }
  ])

  const changeLanguage = (lang: string) => {
    localStorage.setItem('language', lang)
    i18n.changeLanguage(lang)
  }

  // step 1
  const handleSelectChange = (value: string) => {
    setSelectedValue(value)
    updateStepStatus(1, true)
  }

  // step 2
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value != '') {
      setIsRequiredStep2(false)
    } else {
      setIsRequiredStep2(true)
    }
    setTextValue(e.target.value)
  }

  const handleConfirmText = () => {
    if (textValue) {
      updateStepStatus(2, true)
    } else {
      setIsRequiredStep2(true)
    }
  }

  // step 3
  const handleChangeNumber = (value: string) => {
    setInputValuePrice(value)
    if (value == '') {
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
    if (e.target.value != '') {
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
    } else {
      setIsRequiredStep6(true)
    }
    setInputEmail(e.target.value)
  }

  const handleCloseModal = () => {
    setIsOpenModal(false)
    setIsEdit(true)
  }

  const handleOKModal = async () => {
    const body: IBodyPostLink = {
      type: selectedValue,
      title: textValue,
      price: inputValuePrice,
      currency: inputValueCurrency,
      address: textValueAddress,
      can_ship: selectedDelivery === KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY ? true : false,
      email: inputEmail
    }
    try {
      const data = await postGenerateLink(body)
      if (data.status_code == 200) {
        setIsOpenModal(false)
        setIsModalSuccess(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCloseModalSuccess = () => {
    window.location.reload()
  }

  const handleFormSubmit = () => {
    if (inputValuePrice === '') {
      setIsRequiredStep3(true)
      return
    }
    if (isRequiredStep2 || isRequiredStep3 || isRequiredStep4 || isRequiredStep6) {
      return
    } else {
      setIsEdit(false)
      setIsOpenModal(true)
    }
  }

  const updateStepStatus = (stepId: number, isCompleted: boolean) => {
    setSteps(prevSteps => prevSteps.map(step => (step.id === stepId ? { ...step, isCompleted } : step)))
  }

  useEffect(() => {
    // Cập nhật lại nội dung của các bước khi thay đổi ngôn ngữ hoặc selectedValue
    setInputValuePrice('')
    setInputValueCurrency(i18n.language == 'en' ? currencyOptions[0] : currencyOptions[1])
    setSteps([
      { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
      {
        id: 2,
        content: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('questionSell') : t('questionBuy'),
        isCompleted: steps[1].isCompleted
      },
      { id: 3, content: t('questionPrice'), isCompleted: steps[2].isCompleted },
      {
        id: 4,
        content: t('questionYourAddress'),
        isCompleted: steps[3].isCompleted
      },
      { id: 5, content: t('chooseShipping'), isCompleted: false },
      { id: 6, content: t('inputEmailAddress'), isCompleted: steps[4].isCompleted }
    ])
  }, [i18n.language, selectedValue])

  const renderCallToAction = () => (
    <div className="flex justify-start">
      <div>
        <Avatar src={<img src={logoSoCool} alt="avatar" />} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-gray-200 ml-4 rounded-3xl p-4 text-gray-800 max-w-screen-xl">{t('callToAction')}</div>
        <div className="bg-gray-200 ml-4 rounded-xl p-[0.5rem] text-gray-800 flex space-x-2">
          <CustomButton onClick={() => changeLanguage('en')}>{t('EN')}</CustomButton>
          <CustomButton onClick={() => changeLanguage('vn')} classNameCustom="bg-violet-400 hover:bg-violet-500">
            {t('VN')}
          </CustomButton>
        </div>
      </div>
    </div>
  )

  const renderStepContent = (stepId: number) => {
    switch (stepId) {
      case 1:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomSelect
              value={selectedValue}
              onChange={handleSelectChange}
              options={dataChooseHere}
              isEdit={isEdit}
            />
            {isEdit && renderEditHere}
          </div>
        )
      case 2:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomTextArea
              value={textValue}
              placeholder={t('writeSomethingHere')}
              required={isRequiredStep2}
              onChange={handleTextAreaChange}
              isEdit={isEdit}
            />
            {!steps[1].isCompleted && (
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
            {!steps[2].isCompleted && (
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
            {!steps[3].isCompleted && (
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
            {!steps[4].isCompleted && (
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
            value: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('sellSomething') : t('buySomething')
          },
          { title: t('product'), value: textValue },
          { title: t('priceRange'), value: `${inputValuePrice} ${inputValueCurrency}` },
          { title: t('address'), value: textValueAddress },
          { title: t('delivery'), value: selectedDelivery === KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY ? t('supportedDelivery') : t('notSupportedDelivery') },
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

  return (
    <div className="flex flex-col">
      <div className="flex-grow p-6">
        <div className="flex flex-col space-y-4">
          {renderCallToAction()}
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start justify-start ${index > 0 && !steps[index - 1].isCompleted ? 'hidden' : ''}`}
            >
              <div className="flex flex-row">
                <Avatar src={<img src={logoSoCool} alt="avatar" />} />
              </div>
              <div
                className={` ${
                  step.id === 1 || step.id === 5 ? 'flex flex-row md:items-center' : 'flex-col'
                } flex-col md:flex-row ml-4 gap-4 `}
              >
                <div
                  className={`bg-gray-200 rounded-3xl p-4 text-gray-800 max-w-screen-xl inline-block  mr-4 ${
                    step.id === 1 || step.id === 5 ? '' : 'mb-4'
                  }`}
                >
                  {step.content}
                </div>
                <div>{renderStepContent(step.id)}</div>
              </div>
            </div>
          ))}
        </div>
        <CustomModalSuccess
          isOpen={isModalSuccess}
          titleSuccess={t('alertCheckMail')}
          textButtonConfirm={t('confirm')}
          onCloseModalSuccess={handleCloseModalSuccess}
        />
        <CustomModal
          open={isOpenModal}
          textButtonEdit={t('edit')}
          textButtonOK={t('submit')}
          onClose={handleCloseModal}
          onOK={handleOKModal}
          title={t('hereInformation')}
          children={renderInformation}
        />
      </div>
    </div>
  )
}

export default OnBoarding
