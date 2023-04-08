

import { useState, useEffect } from 'react';
import { Button, Input } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './App.css';
import title from "./PlexGPT.png";
import PlexieRegular from "./PRegular.png";
import PlexieThinking from "./PThinking.png";
import PlexieResponding from "./PRespond.png";

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

  async function makeRequest() {
    let URL = `${process.env.REACT_APP_BACKEND_URL}text_completion/${prompt}`
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
      })
  }

  return (
    <>
      <div className='Page'>
        <ThemeProvider theme={theme}>
          <div style={{ display: 'block', margin: '5%', }}>
            <img src={title} className="Header" style={{ width: '28%', marginBottom: "2rem" }} />
            <span className='Plexie'>
              <img src={plexie} style={{ width: '20%', marginRight: "5rem", }} />
              <p style={{ minHeight: '10%' }} className="Response" >{response}</p>
            </span>
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
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
