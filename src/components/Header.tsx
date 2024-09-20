import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';
import { logoSoCool } from '../assets';
import { DownOutlined } from '@ant-design/icons';
import { postLogoutService } from '../service';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentEmail = localStorage.getItem('current_emails_count');
  const maxEmail = localStorage.getItem('max_emails_count');
  const expiredDate = localStorage.getItem('expired_date_email');
  
  const handleLogout = async () => {
    try {
      await postLogoutService(); 
      localStorage.clear(); 
      navigate('/login'); 
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Define menu items
  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Go to Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '2',
      label: 'Go to Account Setting',
      onClick: () => navigate('/accountSetting'),
    },
    {
      key: '3',
      label: 'Sign out',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="fixed w-full bg-[#F4F4F4] z-50 px-6 shadow-md flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center justify-center flex-grow">
        <a href="/">
          <Avatar src={<img src={logoSoCool} alt="avatar" />} className="sm:size-14 size-10" />
        </a>
        <a href="/">
          <h3 className="bg-[#03A3B3] text-transparent bg-clip-text text-center py-3 font-bold text-2xl sm:text-6xl">
            {t('soCool')}
          </h3>
        </a>
      </div>
      
      {/* Dropdown Menu in the top right corner */}
      {
        expiredDate && (
          <div className="relative">
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
              <Button className='py-6 px-2'>
                <>
                <DownOutlined className="ml-2" />

                </>
                <>
                <div className="flex items-center cursor-pointer">
                  <span>{`${currentEmail}/${maxEmail} emails`}</span>
                </div>
                <div>Exp: {expiredDate}</div>
                </>
              </Button>
            </Dropdown>
          </div>
        )
      } 
    </div>
  );
};

export default Header;
