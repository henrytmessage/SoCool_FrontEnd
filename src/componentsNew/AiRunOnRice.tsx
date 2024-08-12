import React, { useState } from 'react'
import ListItem from './ListItem'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input } from 'antd'

const AiRunOnRice: React.FC = () => {
  const data = [
    { id: 1, title: 'Item 1', description: 'This is the detail of Item 1' },
    { id: 2, title: 'Item 2', description: 'This is the detail of Item 2' },
    { id: 3, title: 'Item 3', description: 'This is the detail of Item 3' }
  ]
  const { t } = useTranslation()
  const [keyInput, setKeyInput] = useState('')
  const [doneKey, setDoneKey] = useState(false)
  const keyEmail = process.env.REACT_APP_KEY_INPUT

  const handleChangeKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyInput(e.target.value)
  }

  const handleSubmitKey = () => {
    if (keyInput === keyEmail) {
      setDoneKey(true)
    }
  }

  return (
    <>
      {!doneKey ? (
        <Form className="flex flex-col gap-12 p-6 font-semibold max-w-3xl">
          <Form.Item
            layout="vertical"
            label="Key for me"
            name="Key for me"
            rules={[{ required: true, message: 'Please enter the name of your product!' }]}
          >
            <Input
              className="px-4 py-2"
              type="text"
              placeholder={'Enter Key'}
              value={keyInput}
              onChange={handleChangeKeyInput}
            />
          </Form.Item>
          <Form.Item className="m-auto flex justify-center">
            <Button type="primary" htmlType="submit" size="large" onClick={handleSubmitKey}>
              {t('send')}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="max-w-3xl mx-auto mt-10">
          {data.map(item => (
            <ListItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  )
}

export default AiRunOnRice
