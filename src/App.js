import { useEffect, useState } from 'react';
import './App.css';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


function App() {

  const { transcript, resetTranscript } = useSpeechRecognition();
  const [emojis, setEmojis] = useState();
  const [message, setMessage] = useState('Tap to Say Something!');

  useEffect(() => {
    fetch('https://emoji-api.com/emojis?access_key=226e27846617da4754700c6582e6217eccde149e')
      .then(response => response.json())
      .then(data => {
        setEmojis(data);
        console.log(emojis);
      });
  }, []);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  const getEmoji = () => {
    // console.log('RES1: ', message);

    SpeechRecognition.startListening();

    if (transcript !== '' && emojis) {
      const resEmoji = emojis.filter(res => res.unicodeName == transcript);
      // console.log('res emoji', resEmoji);

      if (resEmoji.length !== 0) {
        setMessage(resEmoji[0].character);
      } else if (transcript === 'more') {
        setMessage(message + message);
      } else {
        setMessage(transcript);
      }
    }
  }

  return (
    <div className="App">
      <p onClick={getEmoji}>{message}</p>
    </div >
  );
}

export default App;