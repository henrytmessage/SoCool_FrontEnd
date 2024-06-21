
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouters from './routers';
import Header from './components/Header';

function App() {

  return (
    <div className="App">
      <div className='container mx-auto max-w-[1200px]'>
        <div className='flex flex-col h-screen bg-grey-900'>
          <Header/>
          <BrowserRouter>
            <AppRouters/>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
