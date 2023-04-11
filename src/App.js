

import { useState, useEffect } from 'react';
import { Button, Input } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './App.css';
import title from "./PlexGPT.png";
import PlexieRegular from "./PRegular.png";
import PlexieThinking from "./PThinking.png";
import PlexieResponding from "./PRespond.png";
import Typography from '@mui/material/Typography';

function App() {

  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#ff8a00",
      },
      neutral: {
        main: "#ffffff",
        contrastText: "#ff8a00",
      },
    },
  });

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [plexie, setPlexie] = useState(PlexieRegular);
  const current = new Date();
  const [processing, setProcessing] = useState(false);

  let time = current.getHours();
  let timeChoice = "";

  if (time < 5) {
    timeChoice = "It's late at night! Please remember to sleep well."
  } else if (time > 5 && time < 12) {
    timeChoice = "Good morning!";
  } else if (time > 12 && time < 17) {
    timeChoice = "Good afternoon!";
  } else {
    timeChoice = "Good evening!";
  }

  async function makeRequest() {
    if (processing) {
      return;
    }
    setProcessing(true);

    let URL = "";
    if (prompt === "") {
      URL = `${process.env.REACT_APP_BACKEND_URL}text_completion/Hello!`
    } else {
      URL = `${process.env.REACT_APP_BACKEND_URL}text_completion/${prompt}`
    }
    console.log(URL);
    setPlexie(PlexieThinking);
    await fetch(URL, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setPlexie(PlexieResponding)
        let trimmed = data.answer.content.charAt(0) === '?' ? data.answer.content.slice(3) : data.answer.content
        setResponse(trimmed)
        setProcessing(false);
      })
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <>
      <div className='Page'>
        <ThemeProvider theme={theme}>
          <div style={{ display: 'block', margin: '5%', marginTop: '2%' }}>
            <img src={title} className="Header" style={{ width: '28%', marginBottom: "2rem" }} />
            <span className='Plexie'>
              <img src={plexie} style={{ width: '20%', marginRight: "5rem", }} />
              <Typography variant="h5" style={{ minHeight: '10%' }} className="Prompt" >{response}</Typography>
            </span>

            <div className="Interact">
              <Typography variant="h6" className="Prompt" id="Intro">{timeChoice} What's on your mind? Let me know!</Typography>
              <div className="Input">
                <span className="PromptAction">
                  <Input value={prompt} className="InputPrompt" onChange={(event) => setPrompt(event.target.value)}></Input>
                  <Button
                    variant="contained"
                    color="neutral"
                    fontWeight="Bold"
                    onClick={makeRequest}
                  >Ask Plexie</Button>
                </span>
                <span className="Clear">
                  <Button
                    variant="contained"
                    color="neutral"
                    fontWeight="Bold"
                    onClick={() => {
                      setPrompt("");
                      setResponse("");
                      setPlexie(PlexieRegular);
                    }}
                  >Clear</Button>
                </span>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
