import React, {useEffect, useState} from 'react';

const WIDTH_CANVAS = 360;
const HEIGHT_CANVAS = 300;
const INTERVAL_TIME = 50;
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
    const [ time, setTime ] = useState(0);
    const [ loading, setLoading ] = useState(false);

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
        if (result === 'SUCCESS') {
            e.stopPropagation()
            return;
        }
        x = e.nativeEvent.offsetX;
        y = e.nativeEvent.offsetY;
        setDrawing(true);

        setTrackingData();
    }

    const clearTrackingData = () => {
        arrPoints = [];
        clearTimeout(timer);
        clearInterval(timeInterval)
        setTime(0);
    }

    const onMouseUp = (e) => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            x = 0;
            y = 0;
            setDrawing(false);
        }

        clearTrackingData();

        if (isPrinted && result !== 'SUCCESS') {
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
        setTime((time) => time + INTERVAL_TIME);
        setResult('')
        timer = setTimeout(() => {
            fetch('https://floating-journey-29995.herokuapp.com/points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ points: arrPoints })
            }).then(res => res.json()).then(res => {
                setResult(res.response)
            })
            clearInterval(timeInterval);
            setPrinted(true)
        }, TIMER)

        timeInterval = setInterval(() => {
            setPoint()
            setTime((time) => time + INTERVAL_TIME);
        }, INTERVAL_TIME)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
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
            return fetch('https://morning-tundra-59000.herokuapp.com/app', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${res.accessToken}`
                }
            })
        }).then(res => res.text()).then(res => {
            document.write(res)
        }).finally(() => setLoading(false))
    }

    return (
        <div className="login-page" onMouseMove={onMouseMovePage}>
            <div className="panel login__panel">
                <form className="panel-login__column login-form" onSubmit={onSubmit}>
                    <h1 className="title">Вход в систему</h1>
                    <p className="login__subtitle subtitle">Авторизуйтесь, чтобы использовать все возможности сервиса</p>
                    <input
                        type="text"
                        placeholder="Логин"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="login__submit">
                        {loading ? <div className="loader">Loading...</div> : (
                            <input
                                className="button"
                                type="submit"
                                value="Войти"
                                disabled={result !== 'SUCCESS'}
                            />
                        )}
                    </div>
                </form>
                <div
                    style={{
                        width: WIDTH_CANVAS,
                    }}
                    className={`panel-login__column wrapper-canvas ${isDrawing ? 'wrapper-canvas_enter' : ''}`}
                >
                    <canvas
                        width={WIDTH_CANVAS}
                        height={HEIGHT_CANVAS}
                        onMouseDown={onMouseDown}
                        onMouseUp={onMouseUp}
                        id="canvas"
                        className="canvas"
                    />
                    {!isDrawing && !isPrinted && (
                        <p className="canvas__status">
                            <svg x="0px" y="0px" viewBox="0 0 512 512" className="canvas__svg">
                                <g>
                                    <g>
                                        <path d="M256,0C156.595,0,75.726,82.14,75.726,183.099v145.807C75.726,429.865,156.595,512,256,512
                                            c99.399,0,180.274-81.886,180.274-182.534V183.099C436.274,82.14,355.399,0,256,0z M402.366,329.466
                                            c0,81.954-65.656,148.627-146.366,148.627c-80.705,0-146.366-66.927-146.366-149.192V183.099
                                            c0-82.265,65.661-149.192,146.366-149.192c80.711,0,146.366,66.927,146.366,149.192V329.466z"/>
                                    </g>
                                </g>
                                <g>
                                    <g>
                                        <path d="M256,140.15c-9.364,0-16.954,7.59-16.954,16.954v59.338c0,9.364,7.59,16.954,16.954,16.954
                                            c9.364,0,16.954-7.59,16.954-16.954v-59.338C272.954,147.74,265.364,140.15,256,140.15z"/>
                                    </g>
                                </g>
                            </svg>
                            <span>Нажмите и проведите мышью в этом квадрате. Так мы подтвердим что вы не робот.</span>
                        </p>
                    )}
                    {isPrinted && (
                        <p className="canvas__status">
                            {result || "STOP"}
                        </p>
                    )}
                    <div className="progressbar">
                        <span style={{ width: `${time / TIMER * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
