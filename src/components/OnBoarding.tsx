import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import { logoSoCool } from '../assets';
import { Button, CustomInputEmail, CustomNumberInput, CustomSelect, CustomTextArea } from '../common';
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
    setTextValue(e.target.value);
  };

  const handleConfirmText = () => {
    updateStepStatus(2, true);
  };

  // step 3
  const handleChangeNumber = (value: string) => {
    setInputValuePrice(value);
  }

  const handleChangeCurrency = (value: string) => {
    setInputValueCurrency(value);
  };

  const handleConfirmPriceCurrency = () => {
    updateStepStatus(3, true);
  }

  // step 4
  const handleTextValueCriteria = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValueCriteria(e.target.value);
  }

  const handleConfirmCriteria = () => {
    updateStepStatus(4, true);
  };

  // step 5
  const handleInputEmailChange = (valueInputEmail: string) => {
    setInputEmail(valueInputEmail);
  }

  const handleFormSubmit = () => {
    console.log('Selected value:', selectedValue);
    console.log('Text value:', textValue);
    console.log('input Value Price:', inputValuePrice);
    console.log("input Value Currency", inputValueCurrency);
    console.log("text Value Criteria:", textValueCriteria);
    console.log("value Input Email", inputEmail);
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
            disabled={selectedValue !== undefined} 
          />
        );
      case 2:
        return (
          <div>
            <CustomTextArea
              value={textValue}
              placeholder={t('writeSomethingHere')}
              onChange={handleTextAreaChange}
              onEnterPress={handleConfirmText}
              disabled={steps[1].isCompleted}
            />
            { !steps[1].isCompleted && <Button onClick={handleConfirmText}>{t('confirm')}</Button> }
          </div>
        );
      case 3:
        return (
          <div>
            <CustomNumberInput
              onEnter={handleConfirmPriceCurrency}
              disabled={steps[2].isCompleted}
              value={inputValuePrice}
              currencyOptions={currencyOptions}
              onChange={handleChangeNumber}
              onChangeSelect={handleChangeCurrency}
              />
            { !steps[2].isCompleted && <Button onClick={handleConfirmPriceCurrency}>{t('confirm')}</Button> }    
          </div>
        );
        case 4:
        return (
          <div>
            <CustomTextArea
              value={textValueCriteria}
              placeholder={t('writeSomethingHere')}
              onChange={handleTextValueCriteria}
              onEnterPress={handleConfirmCriteria}
              disabled={steps[3].isCompleted}
            />
            { !steps[3].isCompleted && <Button onClick={handleConfirmCriteria}>{t('confirm')}</Button> }    
          </div>
        );
        case 5:
        return (
          <div className='flex gap-12'>
            <CustomInputEmail
              value={inputEmail}
              onChange={handleInputEmailChange}
            />
            <div><Button onClick={handleFormSubmit}>{t('generateLink')}</Button></div>
          </div>
        );
      default:
        return null;
    }
  };

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
      </div>
    </div>
  );
};

export default OnBoarding;
