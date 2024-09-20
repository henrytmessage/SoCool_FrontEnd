import React from 'react';
import { Modal, Typography, List, Button } from 'antd';

const { Title, Paragraph, Text } = Typography;

// Define types for props
interface PlanModalProps {
  visible: boolean;
  onClose: () => void;
}

const ModalPlan: React.FC<PlanModalProps> = ({ visible, onClose }) => {
  const plans = [
    {
      title: 'S9 Plan',
      description: 'Create up to 9 email aliases corresponding to 9 job roles.',
    },
    {
      title: 'S19 Plan',
      description: 'Create up to 19 email aliases corresponding to 19 job roles.',
    },
    {
      title: 'S29 Plan',
      description: 'Create up to 29 email aliases corresponding to 29 job roles.',
    },
  ];

  return (
    <Modal
      title="Change Plan"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={onClose}>
          Ok
        </Button>,
      ]}
    >
      <Typography>
        <Title level={4}>Available Plans</Title>
        <Paragraph>
          Each plan provides a specific number of email aliases that correspond to different job roles.
          The duration of each plan is 1 year.
        </Paragraph>
        <List
          itemLayout="horizontal"
          dataSource={plans}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={<Text strong>{item.title}</Text>}
                description={item.description}
              />
            </List.Item>
          )}
        />
        <div>
          To upgrade your plan, please use the initial signed-up email <Text strong>abc@gmail.com</Text>
          to send a request to <Text strong>hello@socool.ai</Text> with the subject <Text strong>"Request to upgrade plan of SoCool email"</Text>.
          In the email, specify your desired plan. We will contact you soon to provide the pricing details that match your needs.
        </div>
      </Typography>
    </Modal>
  );
};

export default ModalPlan;
