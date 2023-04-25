

import { useState, useEffect } from 'react';
import { Button, Input, Select, MenuItem, InputLabel } from "@mui/material";
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
  } else if (time >= 5 && time < 12) {
    timeChoice = "Good morning!";
  } else if (time >= 12 && time < 17) {
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

  // 170 Grade Calculator
  const [activate, setActivate] = useState();
  const [selectGoal, setSelectGoal] = useState("A");
  const [m1, setM1] = useState();
  const [m2, setM2] = useState();
  const [curveChoice, setCurveChoice] = useState(1);
  const [needed, setNeeded] = useState();
  const curves1 = [0.2941, 0.2941, 0.4118];
  const curves2 = [0.2941, 0.2, 0.5059];

  function calculate(m1, m2, goal, curve) {
    const sdMap = {
      "A+": 1.87,
      "A": 0.7,
      "A-": 0.13,
      "B+": -0.3,
      "B": -0.61,
      "B-": -1.05,
      "C+": -1.20,
      "C": -1.36,
      "C-": -1.79,
    }

    let c = curves1;
    if (curve === 2) {
      c = curves2;
    }
    const f = (sdMap[goal] - m1 * c[0] - m2 * c[1]) / c[2];
    return f;
  }

  return (
    <>
      <div className='Page'>
        <ThemeProvider theme={theme}>
          <div style={{ display: 'block', margin: '5%', marginTop: '2%' }}>
            <img src={title} className="Header" style={{ width: '28%', marginBottom: "2rem" }} />
            <span className='Plexie'>
              {/* Change to 20% and 23% after disabling 170 */}
              <img src={plexie} style={{ width: '15%', height: '15%', marginRight: "5rem", }} />
              <Typography variant="h5" style={{ minHeight: '10%' }} className="Prompt" >{response}</Typography>
            </span>

            <div className="Interact">
              <Typography variant="h6" className="Prompt" id="Intro">{timeChoice} What's on your mind? Let me know!</Typography>
              <div className="Input">
                <span className="PromptAction">
                  <Input value={prompt} className="InputPrompt" placeholder="Please type here" onChange={(event) => setPrompt(event.target.value)}></Input>
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

            {/* CS170 Grade Calculator */}
            <div>
              <Button
                style={{ marginTop: "10px", marginBottom: "20px" }}
                variant="contained"
                color="neutral"
                fontWeight="Bold"
                onClick={() => {
                  window.scrollTo(0, 700);
                  setActivate(1);
                }
                }>CS170 Final Grade Calculator</Button>
              {activate === 1 ?
                <div>
                  <Typography variant="h6" className="Prompt" id="Intro">This is a calculator to estimate the SD you will need on the CS170 final to get your desired grade in the class. All statistics are based on Professor Raghavendra's grading history and tailored for Spring 2023. Please note that if your homework category is lower than 100%, you will need to additionally factor that in the projected result.</Typography>
                  <InputLabel id="desired">What is your desired grade in CS170?</InputLabel>
                  <Select
                    labelId="desired"
                    value={selectGoal}
                    style={{ display: "flex", width: "50%", marginBottom: "20px" }}
                    onChange={(event) => setSelectGoal(event.target.value)}
                  >
                    <MenuItem value={"A+"}>A+</MenuItem>
                    <MenuItem value={"A"}>A</MenuItem>
                    <MenuItem value={"A-"}>A-</MenuItem>
                    <MenuItem value={"B+"}>B+</MenuItem>
                    <MenuItem value={"B"}>B</MenuItem>
                    <MenuItem value={"B-"}>B-</MenuItem>
                    <MenuItem value={"C+"}>C+</MenuItem>
                    <MenuItem value={"C"}>C</MenuItem>
                    <MenuItem value={"C-"}>C-</MenuItem>
                  </Select>
                  <div style={{ display: "block" }}>
                    <div style={{ marginBottom: "25px" }}>
                      <label style={{ marginRight: "10px" }}>What is your midterm 1 SD?</label>
                      <Input value={m1} className="InputPrompt" placeholder="Please type here" onChange={(event) => { setM1(event.target.value) }}></Input>
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ marginRight: "10px" }}>What is your midterm 2 SD?</label>
                      <Input value={m2} className="InputPrompt" placeholder="Please type here" onChange={(event) => { setM2(event.target.value) }}></Input>
                    </div>
                    <div style={{ marginBottom: "15px" }}>
                      <label style={{ marginRight: "10px" }}>Which curving choice do you prefer?</label>
                      <Select
                        value={curveChoice}
                        onChange={(event) => setCurveChoice(event.target.value)}
                      >
                        <MenuItem value={1}>Standard Curve (Midterm 1: 25%, Midterm 2: 25%, Final: 35%)</MenuItem>
                        <MenuItem value={2}>Spring 2023 Optional Curve (Midterm 1: 25%, Midterm 2: 17%, Final: 43%)</MenuItem>
                      </Select>
                    </div>
                  </div>
                  <span>
                    <Button
                      variant="contained"
                      color="neutral"
                      fontWeight="Bold"
                      onClick={() => setNeeded(calculate(m1, m2, selectGoal, curveChoice))}
                      style={{ marginBottom: "20px" }}>Calculate</Button>
                    {needed ? <Typography variant="h6" className="Prompt" id="Intro" style={{paddingBottom: "20px"}}>You will need an SD of {needed.toFixed(2)} on your final to get {selectGoal} in CS170.</Typography>
                      : <></>}
                  </span>
                  <Typography variant="p" className="Prompt" id="Intro" style={{paddingBottom: "50px"}}>Sources: Berkeleytime (Prof. Raghavendra's SP22 distribution), z-score table from www.z-table.com</Typography>
                </div>
                : <></>
              }
            </div>

          </div>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
