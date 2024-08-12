
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouters from './routers';
import Header from './components/Header';
import './i18n'

function App() {

  return (
    <div className="App">
      <div className=''>
        <div className='flex flex-col bg-grey-900'>
          <BrowserRouter>
            <Header/>
            <div className='mt-28 md:mt-[108px] w-full h-[calc(100vh-108px)]' >
              <AppRouters/>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
