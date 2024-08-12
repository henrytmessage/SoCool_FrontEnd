import React, { useState } from 'react'
import { Button, Modal, Input } from 'antd'
import { MailOutlined, InfoCircleOutlined } from '@ant-design/icons'

interface ListItemProps {
  item: {
    id: number
    title: string
    description: string
  }
}

const ListItem: React.FC<ListItemProps> = ({ item }) => {
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const showDetails = () => {
    setIsDetailVisible(true)
  }

  const showEmailModal = () => {
    setIsEmailModalVisible(true)
  }

  const handleEmailSend = () => {
    // Logic gửi email tại đây
    console.log('Email:', email)
    console.log('Subject:', subject)
    console.log('Body:', body)
    setIsEmailModalVisible(false)
  }

  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="text-lg font-medium">{item.title}</div>
      <div className="space-x-2">
        <Button type="primary" icon={<InfoCircleOutlined />} onClick={showDetails}>
          Show Details
        </Button>
        <Button type="default" icon={<MailOutlined />} onClick={showEmailModal}>
          Send Email
        </Button>
      </div>

      <Modal title="Details" visible={isDetailVisible} onCancel={() => setIsDetailVisible(false)} footer={null}>
        <p>{item.description}</p>
      </Modal>

      <Modal
        title="Send Email"
        visible={isEmailModalVisible}
        onCancel={() => setIsEmailModalVisible(false)}
        onOk={handleEmailSend}
      >
        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-4" />
        <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="mb-4" />
        <Input.TextArea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} rows={4} />
      </Modal>
    </div>
  )
}

export default ListItem
