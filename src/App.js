import React, {useEffect, useState} from 'react';

const WIDTH_CANVAS = 360;
const HEIGHT_CANVAS = 300;
const TIMER = 2000;

let x;
let y;
let timer;
let timeInterval;
let context;
let isDrawing;
let arrPoints = [];

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

function App() {
    const [ isEnter, setEnter ] = useState(false);
    const [ isPrinted, setPrinted ] = useState(false);
    const [ userName, setUserName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ result, setResult ] = useState();

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        // localStorage.removeItem('token')
    }, [])

    const onMouseOver = (e) => {
        setEnter(true)
    }

    const onMouseOut = (e) => {
        setEnter(false)
    }

    const onMouseMove = (e) => {
        if (isEnter && timer && !isPrinted) {
            // console.log(e.nativeEvent.offsetX / WIDTH_CANVAS)
            // console.log(e.nativeEvent.offsetY / HEIGHT_CANVAS)
        }
    }

    const onMouseMovePage = (e) => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            x = e.nativeEvent.offsetX;
            y = e.nativeEvent.offsetY;
        }
    }

    const onMouseDown = (e) => {
        e.preventDefault()
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
        isDrawing = true;

        setTrackingData();
    }

    const onMouseUp = (e) => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
        }

        clearTrackingData();
    }

    const clearTrackingData = () => {
        arrPoints = [];
        clearTimeout(timer);
        clearInterval(timeInterval)
    }

    const setPoint = () => {
        arrPoints.push([x / WIDTH_CANVAS, y / HEIGHT_CANVAS])
    }

    const setTrackingData = () => {
        setPoint()

        timer = setTimeout(() => {
            fetch('https://floating-journey-29995.herokuapp.com/points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ points: arrPoints })
            }).then(res => res.json()).then(res => {
                console.log(res)
                setResult(res)
            })
            clearInterval(timeInterval);
            setPrinted(true)
        }, TIMER)

        timeInterval = setInterval(() => {
            setPoint()
        }, 50)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData();
        formData.append("UserName", userName);
        formData.append("Password", password);

        fetch('https://morning-tundra-59000.herokuapp.com/login', {
            method: 'POST',
            body: formData
        }).then(res => {
            return res.json()
        }).then((res) => {
            localStorage.setItem('token', `Bearer ${res.accessToken}`)
            location.href = '/app'
        })
    }

    return (
        <div className="login-page" onMouseMove={onMouseMovePage}>
            <div className="wrapper">
                <div className="form">
                    <form className="login-form" onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            className="button"
                            type="submit"
                            value="LOGIN"
                            /* disabled={!result} */
                        />
                    </form>
                </div>
                <div
                    style={{
                        width: WIDTH_CANVAS + 100,
                        height: HEIGHT_CANVAS + 100
                    }}
                    className={`wrapper-canvas ${isEnter ? 'wrapper-canvas_enter' : ''}`}
                >
                    <p className="canvas__text">{isPrinted ? result ? result : "STOP" : "PRINT"}</p>
                    <canvas
                        width={WIDTH_CANVAS}
                        height={HEIGHT_CANVAS}
                        onMouseMove={onMouseMove}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        onMouseOut={onMouseOut}
                        onMouseOver={onMouseOver}
                        id="canvas"
                        className="canvas"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
