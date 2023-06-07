
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, MenuItem, InputLabel } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import '../App.css';
import title from "../assets/PlexGPT.png";
import PlexieRegular from "../assets/PRegular.png";
import PlexieThinking from "../assets/PThinking.png";
import PlexieResponding from "../assets/PRespond.png";
import PlexieError from "../assets/PError.png";

function PlexGPT() {

    const theme = createTheme({
        status: {
            danger: "#e53e3e",
        },
        palette: {
            primary: {
                main: "#ff8a00",
                contrastText: "#ffffff",
            },
            neutral: {
                main: "#ffffff",
                contrastText: "#ff8a00",
            },
        },
    });

    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [plexie, setPlexie] = useState(PlexieRegular);
    const current = new Date();
    const [processing, setProcessing] = useState(false);
    const errorMsg = "I'm sorry - I am not able to respond to your message at this time. My sincere apologies for the inconvenience."

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
                if (data.answer.content.includes("sorry") || data.answer.content.includes("cannot")) {
                    setPlexie(PlexieError);
                } else {
                    setPlexie(PlexieResponding);
                }
                let trimmed = data.answer.content.charAt(0) in [" ", ",", "?"] ? data.answer.content.slice(2) : data.answer.content
                setResponse(trimmed)
                setProcessing(false);
            })
            .catch((error) => {
                setPlexie(PlexieError);
                setResponse(errorMsg);
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
                        <img src={title} className="Header" />
                        <span className='Plexie'>
                            <img src={plexie} id="PlexieImg" />
                            <div>
                                <Typography variant="h5" style={{ minHeight: '10%' }} className="Prompt" id={response ? "Response" : ""}>{response}</Typography>
                            </div>
                        </span>
                        <Button
                            variant="contained"
                            color="primary"
                            fontWeight="Bold"
                            onClick={() => {
                                navigate('/sourcing-tool');
                            }}
                        >Sourcing Tool (PC Only)</Button>

                        <div className="Interact">
                            <Typography variant="h6" className="Prompt" id="Intro">{timeChoice} What's on your mind? Let me know!</Typography>
                            <div className="Input">
                                <span id="PromptAction">
                                    <Input value={prompt} className="InputPrompt" placeholder="Please type here" onChange={(event) => setPrompt(event.target.value)}></Input>
                                </span>
                                <span id="Ask">
                                    <Button
                                        variant="contained"
                                        color="neutral"
                                        fontWeight="Bold"
                                        onClick={makeRequest}
                                    >Ask Plexie</Button>
                                </span>
                                <span id="Clear">
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
            <span id="Footer">
                <Typography variant="p" color="orange">Copyright @ 2023 Bradley (Yihan) Tian & PlexTech @ Berkeley. All Rights Reserved.</Typography>
            </span>
        </>
    );
}

export default PlexGPT;
