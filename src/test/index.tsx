import  { useEffect, useState } from 'react';
import '../App.css';
import '../i18n'
import { useTranslation } from 'react-i18next';
import { getExample } from '../service';
import { useRecoilState, useRecoilValue } from 'recoil';
import { textState } from '../recoil/atom';
import { charCountState } from '../recoil/selector';

interface ITestData {
  id: number
  name: string
}

const Test = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [text, setText] = useRecoilState(textState);
  const count = useRecoilValue(charCountState);
  const [testApi, setTestAPi] = useState<ITestData[]>([])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  }

  // vi du goi api va set ket qua
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExample("12");
        setTestAPi(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <div>
        {t('English')}
      </div>
      <div>
        {t('VietNam')}
      </div>
      <div>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('vn')}>VietNam</button>
      </div>
      <div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}/>
        <p>count: {count}</p>
      </div>
      <div>
        {testApi.map((item: any) => {
          return (
            <div key={item.id}>
              <p>{item.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
}
  
export default Test
