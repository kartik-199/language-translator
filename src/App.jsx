import {useEffect, useRef, useState} from 'react';
import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';

function App() {
  const [ready, setReady] = useState(null);
  const [language, setLanguage] = useState(null);
  const [progressItems, setProgressItems] = useState([]);

  const [input, setInput] = useState('Hello world!');
  const [sourceLanguage, setSourceLanguage] = useState('en_Latn');
  const [targetLanguage, setTargetLanguage] = useState('es_Latn');
  const [output, setOutput] = useState('');
  const worker = useRef(null);
  useEffect(() => {
    if(!worker.current){
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    } 
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;
    
        case 'progress':
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;
    
        case 'done':
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;
    
        case 'ready':
          setReady(true);
          break;
    
        case 'update':
          setOutput(e.data.output);
          break;
    
        case 'complete':
          setDisabled(false);
          break;
      }
    };
    worker.current.addEventListener('message', onMessageReceived); 
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });
  const translate = () => {
    setDisabled(true); 
    worker.current.postMessage({
      text: input, 
      src_lang: sourceLanguage,
      tgt_lang: targetLanguage
    });
  }
  return (
    <>
      <h1>Transformers.js</h1>
      <h2>ML-powered multilingual translation in React!</h2>
  
      <div className='container'>
        <div className='language-container'>
          <LanguageSelector type={"Source"} defaultLanguage={"eng_Latn"} onChange={x => setSourceLanguage(x.target.value)} />
          <LanguageSelector type={"Target"} defaultLanguage={"fra_Latn"} onChange={x => setTargetLanguage(x.target.value)} />
        </div>
  
        <div className='textbox-container'>
          <textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>
          <textarea value={output} rows={3} readOnly></textarea>
        </div>
      </div>
  
      <button disabled={disabled} onClick={translate}>Translate</button>
  
      <div className='progress-bars-container'>
        {ready === false && (
          <label>Loading models... (only run once)</label>
        )}
        {progressItems.map(data => (
          <div key={data.file}>
            <Progress text={data.file} percentage={data.progress} />
          </div>
        ))}
      </div>
    </>
  )
}

export default App;