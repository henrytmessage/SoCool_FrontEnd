import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { logoSoCool } from '../assets';
import { Button, CustomInputEmail, CustomModal, CustomNumberInput, CustomSelect, CustomTextArea } from '../common';
import { KEY_CHOOSE_SOMETHING, PRICE_CURRENCY } from '../constant';

const OnBoarding = () => {
  const { t, i18n } = useTranslation();
  const dataChooseHere = [
    { key: KEY_CHOOSE_SOMETHING.SELL_SOMETHING, label: t('sellSomething') },
    { key: KEY_CHOOSE_SOMETHING.BUY_SOMETHING, label: t('buySomething') }
  ];
  const currencyOptions = Object.keys(PRICE_CURRENCY); 

  const [selectedValue, setSelectedValue] = useState<number | undefined>(undefined);
  const [textValue, setTextValue] = useState<string>('');
  const [inputValuePrice, setInputValuePrice] = useState<string>('');
  const [inputValueCurrency, setInputValueCurrency] = useState<string>('');
  const [textValueCriteria, setTextValueCriteria] = useState<string>('');
  const [inputEmail, setInputEmail] = useState<string>('');
  const [isRequiredStep2, setIsRequiredStep2] = useState<boolean>(false)
  const [isRequiredStep3, setIsRequiredStep3] = useState<boolean>(false)
  const [isRequiredStep4, setIsRequiredStep4] = useState<boolean>(false)
  const [isRequiredStep5, setIsRequiredStep5] = useState<boolean>(false)
  const [isOpenModal, setIsOpenModal] = useState(false)


  const [steps, setSteps] = useState([
    { id: 1, content: t('questionHelp'), isCompleted: false },
    { id: 2, content: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('questionSell') : t('questionBuy'), isCompleted: false },
    { id: 3, content: t('questionPrice'), isCompleted: false },
    { id: 4, content: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('questionCriteriaSell') : t('questionCriteriaBuy'), isCompleted: false },
    { id: 5, content: t('inputEmailAddress'), isCompleted: false },
  ]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // step 1
  const handleSelectChange = (value: number) => {
    setSelectedValue(value);
    updateStepStatus(1, true);
  };

  // step 2
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(e.target.value != '') {
      setIsRequiredStep2(false)
    }
    else {
      setIsRequiredStep2(true)
    }
    setTextValue(e.target.value);
  };

  const handleConfirmText = () => {
    if(textValue) {
      updateStepStatus(2, true);
    }else {
      setIsRequiredStep2(true)
    }
  };

  // step 3
  const handleChangeNumber = (value: string) => {
    setInputValuePrice(value);
    if(value == '') {
      setIsRequiredStep3(true)
    }
    else {
      setIsRequiredStep3(false)
    }
  }

  const handleChangeCurrency = (value: string) => {
    setInputValueCurrency(value);
  };

  const handleConfirmPriceCurrency = () => {
    if(inputValuePrice) {
      updateStepStatus(3, true);
    } else {
      setIsRequiredStep3(true)
    }
  }

  // step 4
  const handleTextValueCriteria = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(e.target.value != '') {
      setIsRequiredStep4(false)
    }
    else {
      setIsRequiredStep4(true)
    }
    setTextValueCriteria(e.target.value);
  }

  const handleConfirmCriteria = () => {
    if(textValueCriteria) {
      updateStepStatus(4, true);
    } else {
      setIsRequiredStep4(true)
    }
  };

  // step 5
  const validateEmail = (email: string) => {
    // Regular expression for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleInputEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if( validateEmail(e.target.value) && e.target.value != '') {
      setIsRequiredStep5(false)
    }
    else {
      setIsRequiredStep5(true)
    }
    setInputEmail(e.target.value);
  }
  
  const handleCloseModal = () => {
    setIsOpenModal(false)
  };

  const handleOpenModal = () => {
    setIsOpenModal(false)
  }

  const handleFormSubmit = () => {
    if( isRequiredStep2 || isRequiredStep3 || isRequiredStep4 || isRequiredStep5) {
      return;
    } else {
      setIsOpenModal(true)
      console.log('Selected value:', selectedValue);
      console.log('Text value:', textValue);
      console.log('input Value Price:', inputValuePrice);
      console.log("input Value Currency", inputValueCurrency);
      console.log("text Value Criteria:", textValueCriteria);
      console.log("value Input Email", inputEmail);
    }
  };

  const updateStepStatus = (stepId: number, isCompleted: boolean) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, isCompleted } : step
      )
    );
  };

  useEffect(() => {
    // Cập nhật lại nội dung của các bước khi thay đổi ngôn ngữ hoặc selectedValue
    setSteps([
      { id: 1, content: t('questionHelp'), isCompleted: steps[0].isCompleted },
      { id: 2, content: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('questionSell') : t('questionBuy'), isCompleted: steps[1].isCompleted },
      { id: 3, content: t('questionPrice'), isCompleted: steps[2].isCompleted },
      { id: 4, content: selectedValue === KEY_CHOOSE_SOMETHING.SELL_SOMETHING ? t('questionCriteriaSell') : t('questionCriteriaBuy'), isCompleted: steps[3].isCompleted },
      { id: 5, content: t('inputEmailAddress'), isCompleted: steps[4].isCompleted },
    ]);
  }, [i18n.language, selectedValue]);

  const renderCallToAction = () => (
    <div className='flex items-center justify-start'>
      <Avatar src={<img src={logoSoCool} alt='avatar' />} />
      <div className='bg-gray-200 ml-4 rounded-3xl p-4 text-gray-800 max-w-screen-xl'>
        {t('callToAction')}
      </div>
      <div className='bg-gray-200 ml-4 rounded-xl p-[0.5rem] text-gray-800 flex space-x-2'>
        <Button onClick={() => changeLanguage('en')}>{t('EN')}</Button>
        <Button onClick={() => changeLanguage('vn')} classNameCustom='bg-violet-400 hover:bg-violet-500'>{t('VN')}</Button>
      </div>
    </div>
  );

  const renderStepContent = (stepId: number) => {
    switch (stepId) {
      case 1:
        return (
          <CustomSelect 
            value={selectedValue} 
            onChange={handleSelectChange} 
            options={dataChooseHere} 
          />
        );
      case 2:
        return (
          <div className='flex'>
            <CustomTextArea
              value={textValue}
              placeholder={t('writeSomethingHere')}
              required={isRequiredStep2}
              onChange={handleTextAreaChange}
            />
            { !steps[1].isCompleted && 
              <div>
                <Button onClick={handleConfirmText}>{t('confirm')}</Button>
              </div>
            }
          </div>
        );
      case 3:
        return (
          <div className='flex'>
            <CustomNumberInput
              onEnter={handleConfirmPriceCurrency}
              value={inputValuePrice}
              currencyOptions={currencyOptions}
              required={isRequiredStep3}
              onChange={handleChangeNumber}
              onChangeSelect={handleChangeCurrency}
              />
            { !steps[2].isCompleted && 
              <div>
                <Button onClick={handleConfirmPriceCurrency}>{t('confirm')}</Button>
              </div>
            }    
          </div>
        );
        case 4:
        return (
          <div className='flex'>
            <CustomTextArea
              value={textValueCriteria}
              placeholder={t('writeSomethingHere')}
              required={isRequiredStep4}
              onChange={handleTextValueCriteria}
            />
            { !steps[3].isCompleted && 
              <div>
                <Button onClick={handleConfirmCriteria}>{t('confirm')}</Button>
              </div>
            }    
          </div>
        );
        case 5:
        return (
          <div className='flex gap-12'>
            <CustomInputEmail
              value={inputEmail}
              onChange={handleInputEmailChange}
              required={isRequiredStep5}
            />
            <div><Button onClick={handleFormSubmit}>{t('generateLink')}</Button></div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderInformation = (
    <ul>
        <li>{selectedValue}</li>
        <li>{textValue}</li>
        <li>{`${inputValuePrice} ${inputValueCurrency}`}</li>
        <li>{textValueCriteria}</li>
        <li>{inputEmail}</li>
    </ul>
  );

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex-grow p-6'>
        <div className='flex flex-col space-y-4'>
          {renderCallToAction()}
          {steps.map((step, index) => (
            <div key={step.id} className={`flex items-start justify-start ${index > 0 && !steps[index - 1].isCompleted ? 'hidden' : ''}`}>
              <Avatar src={<img src={logoSoCool} alt='avatar' />} />
              <div className={` ${step.id === 1 ? 'flex flex-row items-center' : 'flex-col' } ml-4 gap-4 `}>
                <div className={`bg-gray-200 rounded-3xl p-4 text-gray-800 max-w-screen-xl inline-block  mr-4 ${step.id === 1 ? '' : 'mb-4'}`}>
                  {step.content}
                </div>
                <div>
                  {renderStepContent(step.id)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <CustomModal open={isOpenModal} textButtonEdit={t('edit')} textButtonOK={t('submit')} onClose={handleCloseModal} onOK={handleOpenModal} title={t('hereInformation')} children={renderInformation}/>
      </div>
    </div>
  );
};

export default OnBoarding;
