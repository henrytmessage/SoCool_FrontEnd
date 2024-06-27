import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import CustomCountUp from '../common/CustomCountDown';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className='fixed w-full bg-[#F4F4F4] z-50 px-6 shadow-md'>
      <h3 className='bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-2xl sm:text-6xl'>
        {t('soCool')}
      </h3>
      {location.pathname === '/chat' && <CustomCountUp />}
    </div>
  );
};

export default Header;
