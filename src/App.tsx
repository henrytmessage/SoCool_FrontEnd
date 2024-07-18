
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouters from './routers';
import Header from './components/Header';

function App() {

  return (
    <div className="App">
      <div className=''>
        <div className='flex flex-col bg-grey-900 h-[100vh]'>
          <BrowserRouter>
            <Header/>
            <div className='mt-20 w-full h-[100%]' >
              <AppRouters/>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
