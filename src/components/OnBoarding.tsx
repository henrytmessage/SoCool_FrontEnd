import React, { useEffect, useRef, useState } from 'react'
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
import { postCreateSearchPrice, postCreateTitleSample, postGenerateLink } from '../service'
import { IBodyCreateSearchPrice, IBodyCreateTitle, IBodyPostLink } from '../api/core/interface'
import CustomAlert from '../common/CustomAlert'
import TextAnimation from './TextAnimation'
import TypingAnimation from './TypingAnimation'
import { removeSpaces } from '../function'
import CustomModalWarning from '../common/CustomModalWarning'
import CustomDropDown from '../common/CustomDropDown'

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
  let dataChooseDelivery = [
    {
      key: KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY,
      label: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('supportedDelivery') : t('supportedDeliveryBuy')
    },

    {
      key: KEY_CHOOSE_DELIVERY.NOTSUPPORTEDDELIVERY,
      label: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('notSupportedDelivery') : t('notSupportedDeliveryBuy')
    }
  ]
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

  const [isChooseSuggestProduct, setIsChooseSuggestProduct] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isModalSuccess, setIsModalSuccess] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   dataChooseDelivery = [
  //     {
  //       key: KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY,
  //       label:
  //         selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('supportedDelivery') : t('supportedDeliveryBuy')
  //     },
  //     {
  //       key: KEY_CHOOSE_DELIVERY.NOTSUPPORTEDDELIVERY,
  //       label:
  //         selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT
  //           ? t('notSupportedDelivery')
  //           : t('notSupportedDeliveryBuy')
  //     }
  //   ]
  // }, [selectedValue])

  const [steps, setSteps] = useState([
    { id: 1, content: t('questionHelp'), isCompleted: false },
    {
      id: 1.5,
      content: selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('questionSell') : t('comingSoon'),
      isCompleted: false
    },
    {
      id: 2,
      content: t('questionCondition'),
      isCompleted: false
    },
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
  ])

  const changeLanguage = (lang: string) => {
    localStorage.setItem('language', lang)
    i18n.changeLanguage(lang)
    window.location.reload()
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
      price: removeSpaces(inputValuePrice),
      currency: inputValueCurrency,
      address: textValueAddress,
      can_ship: selectedDelivery === KEY_CHOOSE_DELIVERY.SUPPORTEDDELIVERY ? true : false,
      email: inputEmail
    }
    try {
      const data = await postGenerateLink(body)
      if (data.status_code === 200) {
        window.dataLayer.push({
          event: 'link_generated',
          email: inputEmail
        })

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

  const updateStepStatus = (stepId: number, isCompleted: boolean) => {
    setSteps(prevSteps => prevSteps.map(step => (step.id === stepId ? { ...step, isCompleted } : step)))
  }

  useEffect(() => {
    // Cập nhật lại nội dung của các bước khi thay đổi ngôn ngữ hoặc selectedValue
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
              {selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT ? t('inputEmailAddressSell') : t('inputEmailAddressBuy')}
            </span>
          </>
        ),
        isCompleted: steps[6].isCompleted
      }
    ])
  }, [i18n.language, selectedValue])

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

  const renderStepContent = (stepId: number) => {
    switch (stepId) {
      case 1:
        return (
          <div className="flex gap-4 flex-col md:flex-row">
            <CustomSelect
              value={selectedValue}
              onChange={handleSelectChange}
              options={dataChooseHere}
              disabled={isEdit}
            />
          </div>
        )
      case 1.5:
        return (
          selectedValue === KEY_CHOOSE_SOMETHING.PRODUCT && (
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

  const renderAiSuggestProduct = () => (
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
              <TextAnimation text={`${t('sampleSuggestProduct')}\n${contentSuggestProduct}`} />
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <Button
                  key="Select this template"
                  onClick={handleClickYesSuggestProduct}
                  className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                >
                  {t('selectTemplate')}
                </Button>
                <Button
                  key="Change the template"
                  onClick={handleClickChangeSuggestProduct}
                  className="outline outline-0 bg-[#F4F4F4] text-gray-800 hover:bg-gray-300"
                >
                  {t('changeTemplate')}
                </Button>
                <Button
                  key="Not selected"
                  onClick={handleClickNoSuggestProduct}
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

  return (
    <div className="flex flex-col h-[calc(100vh-84px)]">
      <div className="flex-grow p-6">
        <div className="flex flex-col space-y-4">
          {renderCallToAction()}
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col space-y-4">
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
              {!steps[2].isCompleted && step.id === 2 && isSuggestProduct && renderAiSuggestProduct()}
              {step.id === 2 && isSuggestPrice && contentSuggestPrice && renderAiSuggestPrice()}
            </div>
          ))}
        </div>
        <CustomModalSuccess
          isOpen={isModalSuccess}
          titleSuccess={t('alertCheckMail')}
          textButtonConfirm={t('confirm')}
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
          children={renderInformation}
        />
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
