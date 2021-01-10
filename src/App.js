import { useEffect, useState } from "react";
import "./App.css";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const recognition = SpeechRecognition.getRecognition();

function App() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [emojis, setEmojis] = useState();
  const [status, setStatus] = useState("idle");

  const [displayedEmojis, setDisplayedEmojis] = useState([]);

  useEffect(() => {
    setStatus("loading");
    fetch(
      "https://emoji-api.com/emojis?access_key=226e27846617da4754700c6582e6217eccde149e"
    )
      .then((response) => response.json())
      .then((data) => {
        setEmojis(data);
        console.log("emoji data", data);
        setStatus("ready");
      });
  }, []);

  // Use for debuging purpose.
  recognition.onspeechend = () => {
    console.log("Speech end. Going to turn off your mic now.");
    setStatus("ready");
  };

  // Use for DEUBG when `message` is changed.
  useEffect(() => {
    console.log("Displayed emojis: ", displayedEmojis);
  }, [displayedEmojis]);

  useEffect(() => {
    console.log("Transcript: ", transcript);
    if (!transcript) {
      return;
    }

    const emojiUnicodeNames = (emojis || []).map((emoji) => emoji.unicodeName);

    if (transcript === "more") {
      console.log("Detect more!");
      const [lastItem] = displayedEmojis.slice().splice(-1);
      setDisplayedEmojis((state) => [...state, lastItem]);
      resetTranscript();
      return;
    }

    if (emojiUnicodeNames.includes(transcript)) {
      const matchedEmoji = emojis.find(
        (emoji) => emoji.unicodeName === transcript
      );
      console.log("Transcript matched! -->", matchedEmoji.character);

      setDisplayedEmojis((state) => [...state, matchedEmoji.character]);
      resetTranscript();
      return;
    }
  }, [transcript, displayedEmojis, emojis, resetTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (
    <div className="App">
      {status === "loading" || status === "idle" ? (
        <h1>Loading emojis ...</h1>
      ) : (
        <p
          onClick={() => {
            console.log("DEUBG - start listening ...");
            SpeechRecognition.startListening();
            setStatus("listening");
          }}
        >
          {displayedEmojis.length === 0
            ? "Tap to Say Something!"
            : displayedEmojis.join("")}
        </p>
      )}
      <div className="app-state">Status: {status}</div>
    </div>
  );
}

export default App;
