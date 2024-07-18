import React from 'react'
import type { MenuProps } from 'antd'
import { Button, Dropdown, Space } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="contact@socool.ai">
        contact@socool.ai
      </a>
    )
  }
  // {
  //   key: '2',
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
  //       2nd menu item
  //     </a>
  //   )
  // },
  // {
  //   key: '3',
  //   label: (
  //     <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
  //       3rd menu item
  //     </a>
  //   )
  // }
]

interface IDropDownProps {
  placement?: 'topRight' | 'topLeft' | 'topCenter' | 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'top' | 'bottom'
}

const CustomDropDown: React.FC<IDropDownProps> = ({ placement = 'topRight' }) => (
  <Dropdown menu={{ items }} placement={placement} arrow>
    <Button shape="circle" icon={<QuestionCircleOutlined />} type="text" size="large"></Button>
  </Dropdown>
)

export default CustomDropDown
