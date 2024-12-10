import {useEffect, useRef, useState} from 'react';
import LanguageSelector from './components/LanguageSelector';
import Progress from './components/Progress';

function App() {
  const worker = useRef(null);
  useEffect(() => {
    if(!worker.current){
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    } 
    const onMessageReceived = (e) => {

    };
    worker.current.addEventListener('message', onMessageReceived); 
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });
  return (

  )
}

export default App;