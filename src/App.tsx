
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouters from './routers';
import Header from './components/Header';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IBodyConversation } from './api/core/interface';
import { getConversationService } from './service';
import { Helmet } from 'react-helmet';

function App() {
  const { t } = useTranslation()
  const currentUrl = window.location.href
  const [metaDescription, setMetaDescription] = useState(t('metaDescription'));

  useEffect(() => {
    const fetchDataConversation = async () => {

      const bodyConversation: IBodyConversation = {
        url: currentUrl
      }
      try {
        const response = await getConversationService(bodyConversation)
        if (response.status_code === 200) {
          setMetaDescription(response.data)
        }
      } catch (error) {
        console.error('Error metaDescription:', error)
      }
    }

    fetchDataConversation()
  }, [])

  return (
    <div className="App">
      <Helmet>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className=''>
        <div className='flex flex-col bg-grey-900'>
          <BrowserRouter>
            <Header/>
            <div className='mt-20 w-full h-[calc(100vh-84px)]' >
              <AppRouters/>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
