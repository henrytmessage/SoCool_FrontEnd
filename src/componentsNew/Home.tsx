import React, { useState, ReactNode } from 'react'
import { Avatar, Form, Input } from 'antd'
import { logoSoCool } from '../assets'
import { useTranslation } from 'react-i18next'
import { CustomButton, CustomModalSuccess, CustomSelect, CustomTextArea } from '../common'
import { KEY_SELECT_PAYMENT, KEY_SELECT_SELL_OR_BUY } from '../constant'
import { InfoCircleOutlined } from '@ant-design/icons'
import CustomDropDown from '../common/CustomDropDown'
import { IBodyPostLink } from '../api/core/interface'
import { postGenerateLink } from '../service'
import CustomModalWarning from '../common/CustomModalWarning'

interface AvatarWithTextProps {
  text: string
  children?: ReactNode
}

const AvatarWithText = ({ text, children }: AvatarWithTextProps) => (
  <>
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
  </>
)

const Home = () => {
  const { t } = useTranslation()
  const dataSelectSellOrBuy = [
    { key: KEY_SELECT_SELL_OR_BUY.SELL, label: t('sellSomething') },
    { key: KEY_SELECT_SELL_OR_BUY.BUY, label: t('buySomething') }
  ]
  const dataPreferredPayment = [
    { key: KEY_SELECT_PAYMENT.CASH, label: 'Cash' },
    { key: KEY_SELECT_PAYMENT.DIGITAL_WALLETS, label: 'Digital Wallets' },
    { key: KEY_SELECT_PAYMENT.OTHERS, label: 'Others' }
  ]
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
  const [productDescription, setProductDescription] = useState('')
  const [productArea, setProductArea] = useState('')
  const [inputProductPrice, setInputProductPrice] = useState('')
  const [selectedValuePayment, setSelectedValuePayment] = useState<string>(dataPreferredPayment[0].key)
  const [inputProductEmail, setInputProductEmail] = useState('')
  const [tempMail, setTempMail] = useState('')
  const [titleWarning, setTitleWarning] = useState('')
  const [isModalSuccess, setIsModalSuccess] = useState(false)
  const [isModalWarning, setIsModalWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setInputProductPrice(newValue)
    }
  }

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const value = input.value
    const newValue = value + (e.nativeEvent as InputEvent).data
    if (!/^\d*\.?\d{0,2}$/.test(newValue)) {
      e.preventDefault()
    }
  }

  const handleSelectChange = (value: string) => {
    setSelectedValue(value)
  }

  const handleSelectChangePayment = (value: string) => {
    setSelectedValuePayment(value)
  }

  const handleChangeProductName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductArea(e.target.value)
  }

  const handleChangeProductDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProductDescription(e.target.value)
  }

  const handleChangeProductEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputProductEmail(e.target.value)
  }

  const handleCloseModalSuccess = () => {
    window.location.reload()
  }

  const handleCloseModalWarning = () => {
    setIsModalWarning(false)
  }

  const handleGenerateEmail = async () => {
    const body: IBodyPostLink = {
      type: selectedValue,
      title: productDescription,
      price: inputProductPrice,
      email: inputProductEmail,
      address: productArea,
      payment_method: selectedValuePayment
    }
    try {
    setIsLoading(true)

      const data = await postGenerateLink(body)
      if (data.status_code === 200) {
        window.dataLayer.push({
          event: 'link_generated',
          email: inputProductEmail
        })
        setIsModalSuccess(true)
        setTempMail(data.data.alias.alias)
      } else if (data.status_code === 406) {
        setTitleWarning(data.errors.message)
        setIsModalWarning(true)
      } else {
        setTitleWarning(t('tryAgain'))
        setIsModalWarning(true)
      }
    setIsLoading(false)

    } catch (error) {
    setIsLoading(false)

      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-108px)]">
      <div className="flex-grow flex-col p-6 gap-6 flex m-auto max-w-3xl">
        <AvatarWithText text={t('provideSmart')} />
        <AvatarWithText text={t('questionHelp')}>
          <CustomSelect value={selectedValue} onChange={handleSelectChange} options={dataSelectSellOrBuy} />
        </AvatarWithText>

        {selectedValue && (
          <>
            <AvatarWithText text={t('necessary')}>
              <></>
            </AvatarWithText>
            <div className="flex items-center justify-center">
              <Form
                name="wrap"
                // labelCol={{ flex: '110px' }}
                labelAlign="left"
                labelWrap
                wrapperCol={{ flex: 1 }}
                colon={false}
                style={{ maxWidth: 800 }}
                className="px-[32px] py-4 border border-solid border-blue-500 rounded flex flex-col w-[100%] mx-auto"
              >
                <Form.Item
                  layout="vertical"
                  label="Product description"
                  name="Product description"
                  rules={[{ required: true, message: 'Please enter your product description!' }]}
                >
                  <CustomTextArea
                    value={productDescription}
                    placeholder={t('exampleCondition')}
                    onChange={handleChangeProductDescription}
                  />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  label="Safe exchange location"
                  name="Safe exchange location"
                  rules={[{ required: true, message: 'Please enter the name of your safe exchange location!' }]}
                >
                  <Input
                    size="large"
                    placeholder={t('placeholderArea')}
                    value={productArea}
                    onChange={handleChangeProductName}
                  />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  label="Product price"
                  name="Product price"
                  rules={[{ required: true, message: 'Please enter your product price!' }]}
                >
                  <Input
                    size="large"
                    suffix="USD"
                    placeholder="Product price"
                    value={inputProductPrice}
                    onChange={handleChangePrice}
                    onBeforeInput={handleBeforeInput}
                  />
                </Form.Item>
                <Form.Item
                  layout="vertical"
                  label=" Your preferred payment method"
                  name=" Your preferred payment method"
                  rules={[{ required: true, message: 'Please enter your preferred payment method!' }]}
                >
                  <CustomSelect value={selectedValuePayment} onChange={handleSelectChangePayment} options={dataPreferredPayment} />
                </Form.Item>
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
                    value={inputProductEmail}
                    onChange={handleChangeProductEmail}
                  />
                </Form.Item>

                <Form.Item className="m-auto flex justify-center">
                  <CustomButton type="primary" htmlType="submit" onClick={handleGenerateEmail} loading={isLoading}>
                    {t('generateEmail')}
                  </CustomButton>
                </Form.Item>
              </Form>
            </div>
          </>
        )}
      </div>
      <CustomModalSuccess
        isOpen={isModalSuccess}
        titleSuccess={t('alertCheckMail')}
        textButtonConfirm={t('confirm')}
        linkAi={tempMail}
        onCloseModalSuccess={handleCloseModalSuccess}
      />
       <CustomModalWarning
          isOpen={isModalWarning}
          titleWarning={titleWarning}
          textButtonConfirm={t('confirm')}
          onCloseModalWarning={handleCloseModalWarning}
        />
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
    </div>
  )
}

export default Home
