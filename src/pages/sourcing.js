import '../Sourcing.css';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Select, MenuItem, InputLabel } from "@mui/material";
import PlexieRegular from "../assets/PRegular.png";
import PlexieThinking from "../assets/PThinking.png";
import PlexieResponding from "../assets/PRespond.png";
import PlexieError from "../assets/PError.png";

function SourcingTool() {

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

    const [plexie, setPlexie] = useState(PlexieRegular);
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [domain, setDomain] = useState("");
    const [processing, setProcessing] = useState(false);
    const [response, setResponse] = useState([]);
    const errorMsg = "I'm sorry,  I wasn't able to find any contact information about this person.";
    const navigate = useNavigate();
    let searched = false;

    async function submitInfo() {
        if (processing) {
            return;
        }

        setProcessing(true);
        setResponse([]);

        let URL = `${process.env.REACT_APP_BACKEND_URL}/sourcing`
        setPlexie(PlexieThinking);
        await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                first: first,
                last: last,
                domain: domain,
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.length === 0) {
                    setPlexie(PlexieError);
                    setResponse([errorMsg]);
                    setProcessing(false);
                    searched = true;
                }
                else {
                    setResponse(data);
                    setProcessing(false);
                    setPlexie(PlexieResponding)
                    searched = true;
                }

            })
            .catch((error) => {
                console.log("Error");
                setPlexie(PlexieError);
                setResponse([errorMsg]);
                setProcessing(false);
                searched = true;
            })
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="Page-2">
                    <div id="Container">
                        <Typography variant="h2" className="Prompt" id="Intro" style={{padding: "0", margin:"0", marginBottom:"2rem"}}>Welcome to Plexie's sourcing tool!</Typography>
                        <span id="ToolPrompt">
                            <img src={plexie} id="PlexieImg-2" />
                            <div className="TextSpace" id="EmailPrompt">
                                <Typography variant="h5">Let's help you find the right contact.</Typography>
                                <div style={{ marginTop: "2rem" }}>
                                    <Input value={first} className="InputPrompt" placeholder="First Name" onChange={(event) => setFirst(event.target.value)}></Input>
                                    <Input value={last} className="InputPrompt" placeholder="Last Name" onChange={(event) => setLast(event.target.value)}></Input>
                                    <Input value={domain} className="InputPrompt" placeholder="Domain (Ex: for @zendesk.com, just put zendesk)" onChange={(event) => setDomain(event.target.value)}></Input>
                                </div>

                                <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
                                    <Button
                                        variant="contained"
                                        color="neutral"
                                        fontWeight="Bold"
                                        style={{ marginRight: '1rem' }}
                                        onClick={submitInfo}>
                                        Inquire Email Address
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="neutral"
                                        fontWeight="Bold"
                                        style={{ marginRight: '1rem' }}
                                        onClick={() => { navigate('/') }}>
                                        Go Back
                                    </Button>
                                    {processing ? <Typography variant="p">Please wait...</Typography> : <></>}
                                </div>
                                {response[0] === errorMsg || response.length === 0 ? <></> : <Typography variant="h6">Here are some possibly valid email addresses:<br /></Typography>}
                                {Array.isArray(response) && response.length !== 0 ? response.map((email) => <Typography variant="p">{email}<br /></Typography>) : <></>}
                            </div>
                        </span>
                    </div>
                    <span id="Footer">
                        <Typography variant="p" color="orange">Copyright @ 2023 Bradley (Yihan) Tian & PlexTech @ Berkeley. All Rights Reserved.</Typography>
                    </span>
                </div>
            </ThemeProvider>
        </>
    )
}

export default SourcingTool;