import React, {useEffect, useState} from 'react';

const WIDTH_CANVAS = 360;
const HEIGHT_CANVAS = 300;
const TIMER = 2000;
const DELAY_TIME = 500;

let x;
let y;
let timer;
let delayTimer;
let timeInterval;
let context;
let canvas;
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
    const [ isPrinted, setPrinted ] = useState(false);
    const [ isDrawing, setDrawing ] = useState(false);
    const [ userName, setUserName ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ result, setResult ] = useState();

    useEffect(() => {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        return clearTimeout(delayTimer)
        // localStorage.removeItem('token')
    }, [])

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
        setDrawing(true);

        setTrackingData();
    }

    const clearTrackingData = () => {
        arrPoints = [];
        clearTimeout(timer);
        clearInterval(timeInterval)
    }

    const onMouseUp = (e) => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            x = 0;
            y = 0;
            setDrawing(false);
        }

        clearTrackingData();

        if (isPrinted) {
            delayTimer = setTimeout(() => {
                context.clearRect(0, 0, canvas.width, canvas.height)
                setPrinted(false)
            }, DELAY_TIME)
        }
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
                setResult(res.response)
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
            fetch('https://morning-tundra-59000.herokuapp.com/app', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${res.accessToken}`
                }
            }).then(res => res.text()).then(res => {
                document.write(res)
            })
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
                    className={`wrapper-canvas ${isDrawing ? 'wrapper-canvas_enter' : ''}`}
                >
                    <p className="canvas__text">
                        {isPrinted
                            ? result ? result : "STOP"
                            : "Рисуйте произвольную фигуру в течении 2-х секунд"
                        }
                    </p>
                    <canvas
                        width={WIDTH_CANVAS}
                        height={HEIGHT_CANVAS}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        id="canvas"
                        className="canvas"
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
