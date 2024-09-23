import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Dropdown, MenuProps, Typography } from 'antd';
import { logoSoCool } from '../assets';
import { CaretDownOutlined, DownOutlined } from '@ant-design/icons';
import { postLogoutService } from '../service';
import { avatar } from '../assets';

const { Title, Text } = Typography;

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentEmail = localStorage.getItem('current_emails_count');
  const maxEmail = localStorage.getItem('max_emails_count');
  const expiredDate = localStorage.getItem('expired_date_email');
  const admin = localStorage.getItem('is_admin');
  const email = localStorage.getItem('email');
  const isCompanyOrProductPage = location.pathname.includes('companyOrProduct');
  
  const handleLogout = async () => {
    try {
      await postLogoutService(); 
      localStorage.clear(); 
      navigate('/login'); 
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.clear(); 
      navigate('/login'); 
    }
  };

  // Define menu items
  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: `Expired date: ${expiredDate}`,
    },
    {
      key: '2',
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '3',
      label: 'Account Setting',
      onClick: () => navigate('/accountSetting'),
    },
    {
      key: '4',
      label: 'Sign out',
      onClick: handleLogout,
    },
  ];

  const menuItemsHasAdmin: MenuProps['items'] = [
    {
      key: '1',
      label: `Expired date: ${expiredDate}`,
    },
    {
      key: '2',
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '3',
      label: 'Account Setting',
      onClick: () => navigate('/accountSetting'),
    },
    {
      key: '4',
      label: 'Admin',
      onClick: () => navigate('/site-admin'),
    },
    {
      key: '5',
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
        currentEmail && !isCompanyOrProductPage && (
          <div className="absolute right-6">
            <Dropdown menu={{ items: admin == 'true' ? menuItemsHasAdmin : menuItems }} placement="bottomRight" arrow>
              <Button className='py-6 px-2'>
                <div className='text-left'>
                {/* <CaretDownOutlined className="ml-4" /> */}
                {/* <img src={avatar} alt="Dropdown icon" style={{ width: '50px', height: '50px' }} /> */}
                <Text strong>{email}</Text>
                <div className="flex items-left cursor-pointer">
                  <span>{`${currentEmail}/${maxEmail} smart emails`}</span>
                </div>
                </div>
              </Button>
            </Dropdown>
          </div>
        )
      } 
    </div>
  );
};

export default Header;
