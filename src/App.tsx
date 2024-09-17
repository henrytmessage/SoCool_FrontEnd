
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouters from './routers';
import Header from './components/Header';
import './i18n'
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {

  return (
    <GoogleOAuthProvider clientId="877396818815-69mejbiofcr09trrqjph6ttp156o6kpb.apps.googleusercontent.com">
      <div className="App">
        <div className=''>
          <div className='flex flex-col bg-grey-900'>
            <BrowserRouter>
              <Header/>
              <div className='mt-28 md:mt-[80px] w-full h-[calc(100vh-80px)]' >
                <AppRouters/>
              </div>
            </BrowserRouter>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
