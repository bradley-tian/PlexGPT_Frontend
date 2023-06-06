
import { useState, useEffect } from 'react';
import { Button, Input, Select, MenuItem, InputLabel } from "@mui/material";


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

function Calculator() {
    return (
        <>
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
                            {needed ? <Typography variant="h6" className="Prompt" id="Intro" style={{ paddingBottom: "20px" }}>You will need an SD of {needed.toFixed(2)} on your final to get {selectGoal} in CS170.</Typography>
                                : <></>}
                        </span>
                        <Typography variant="p" className="Prompt" id="Intro" style={{ paddingBottom: "50px" }}>Sources: Berkeleytime (Prof. Raghavendra's SP22 distribution), z-score table from www.z-table.com</Typography>
                    </div>
                    : <></>
                }
            </div>
        </>
    )
}

export default Calculator;


