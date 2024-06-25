import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Result
      status="404"
      title="404"
      subTitle={t('404NotFound')}
      extra={
        <Link to="/">
          <Button type="primary">{t('goBackHome')}</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
