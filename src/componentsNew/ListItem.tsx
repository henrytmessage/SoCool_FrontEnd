import React, { useState } from 'react'
import { Button, Modal, Input, AutoComplete } from 'antd'
import { MailOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { IItemConversation } from './AiRunOnRice';
import { getConversationDetailService, postSendEmailRunOnRiceService } from '../service';

interface ListItemProps {
  item: IItemConversation;
}

const options = [
  { value: 'Burns Bay Road' },
  { value: 'Downing Street' },
  { value: 'Wall Street' },
];

const ListItem: React.FC<ListItemProps> = ({ item }) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState(item.user?.email)
  const [subject, setSubject] = useState(item.ticket)
  const [bodyContent, setBodyContent] = useState('')
  const [listChatDetail, setListChatDetail] = useState([])

  const showDetails = async () => {
    const body = {
      id: Number(item.id)
    }
    try {
      const response = await getConversationDetailService(body);
        if(response.status_code == 200) {
          setIsDetailVisible(true)
          setListChatDetail(response.data.map((email: any, index: number) => (
            <div key={index} className="mb-4">
              <p><strong>From:</strong> {email.from}</p>
              <p><strong>To:</strong> {email.to}</p>
              <p><strong>Subject:</strong> {email.subject}</p>
              <p><strong>Content:</strong> {email.content}</p>
              <hr />
            </div>
          )));
        } else{
          alert("Error, check log")
        }
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  }

  const showEmailModal = () => {
    setIsEmailModalVisible(true)
  }

  const handleEmailSend = async () => {
    const body = {
      recipient: recipientEmail || '',
      subject: subject || '',
      content: bodyContent,
      ...(item.last_message_id && { lastMessageId: item.last_message_id }),
    }
      try {
        const response = await postSendEmailRunOnRiceService(body);
        if(response.status_code == 200) {
          setIsEmailModalVisible(false)
        } else{
          alert("Error, check log")
        }
      } catch (error) {
        console.error('Error fetching response:', error);
      }
  }

  const handleSelect = (value: string) => {
    setBodyContent(value);
  };

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200 gap-10">
      <div className="flex-1 font-medium">{item.link?.owner?.email}</div>
      <div className="flex-1">{item.link?.title}</div>
      <div className="flex-1">{item.link?.address}</div>
      <div className="flex-1">{item.link?.price} USD</div>
      <div className="space-x-2 flex-1 flex">
        <Button type="primary" icon={<InfoCircleOutlined />} onClick={showDetails}>
          Show Details
        </Button>
        <Button type="default" icon={<MailOutlined />} onClick={showEmailModal}>
          Send Email
        </Button>
      </div>

      <Modal title="Details" visible={isDetailVisible} onCancel={() => setIsDetailVisible(false)} footer={null}>
        <p>{listChatDetail}</p>
      </Modal>

      <Modal
        title="Send Email"
        open={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        onOk={handleEmailSend}
      >
        <Input placeholder="Recipient Email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} className="mb-4" />
        <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="mb-4" />
        {
          item.last_message_id && <Input value={item.last_message_id} disabled className="mb-4" />
        }
        <AutoComplete
          options={options}
          className='w-full'
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={handleSelect}
        >
          <Input.TextArea placeholder="Body content" value={bodyContent} onChange={e => setBodyContent(e.target.value)} rows={4} />
        </AutoComplete>
      </Modal>
    </div>
  )
}

export default ListItem
