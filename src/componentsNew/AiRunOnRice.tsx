import React, { useEffect, useState } from 'react'
import ListItem from './ListItem'
import { useTranslation } from 'react-i18next'
import { Button, Form, Input, Pagination } from 'antd'
import { getConversationListService } from '../service'

export interface IItemConversation {
  id?: number;
  last_message_id?: string;
  link?: {
    address?: string;
    owner?: { email?: string };
    price?: string;
    title?: string;
  };
  ticket?: string;
  user?: { email?: string };
}

const AiRunOnRice: React.FC = () => {
  const { t } = useTranslation()
  const [keyInput, setKeyInput] = useState('')
  const [doneKey, setDoneKey] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItemConversation, setTotalItemConversation] = useState(1)
  const [dataList, setDataList] = useState<IItemConversation[]>([]);
  const itemsPerPage = 10
  const keyEmail = process.env.REACT_APP_KEY_INPUT

  const handleChangeKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyInput(e.target.value)
  }

  const handleSubmitKey = () => {
    if (keyInput === keyEmail) {
      setDoneKey(true)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const getListConversation = async () => {
      const body = {
        page: currentPage,
        page_size: 10
      }
      try {
        const response = await getConversationListService(body);
        console.log("response", response);
        setDataList(response.data.data)
        setTotalItemConversation(response.data.total)
      } catch (error) {
        console.error('Error fetching response:', error);
      }
    };

    getListConversation();
  }, [currentPage]);

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
        <>
        <div className="max-w-7xl mx-auto ">
          <div className='pb-10'>
            {dataList.map(item => (
              <ListItem key={item.id} item={item} />
            ))}
          </div>
        </div>
          <div className='fixed bottom-0 w-full bg-cyan-100 mx-auto '>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalItemConversation}
            onChange={handlePageChange}
            className="mt-4"
          />
          </div>
        </>
      )}
    </>
  )
}

export default AiRunOnRice
