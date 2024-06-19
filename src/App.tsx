
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import AppRouters from './routers';
import Header from './components/Header';

function App() {

  return (
    <div className="App">
      <Header/>
      <BrowserRouter>
        <AppRouters/>
      </BrowserRouter>
    </div>
  );
}

export default App;
