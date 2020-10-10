import React, {useEffect, useState} from 'react';

const WIDTH_CANVAS = 360;
const HEIGHT_CANVAS = 300;

function drawLine(context, x1, y1, x2, y2) {
    console.log(x1, y1, x2, y2);
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
    const [ isDrawing, setDrawing ] = useState(false);
    const [ context, setContext ] = useState();
    const [ x, setX ] = useState(false);
    const [ y, setY ] = useState(false);
    const [ timeout, setStateTimeout ] = useState(false);

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        setContext(canvas.getContext('2d'));
    }, [])

    const onMouseOver = (e) => {
        setEnter(true)
    }

    const onMouseOut = (e) => {
        setEnter(false)
    }

    const onMouseMove = (e) => {
        if (isEnter) {
            console.log(e.nativeEvent.offsetX / WIDTH_CANVAS)
            console.log(e.nativeEvent.offsetY / HEIGHT_CANVAS)
        }
    }

    const onMouseMovePage = (e) => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setX(e.nativeEvent.offsetX);
            setY(e.nativeEvent.offsetY);
        }
    }

    const onMouseDown = (e) => {
        setX(e.nativeEvent.offsetX);
        setY(e.nativeEvent.offsetY);
        setDrawing(true);
    }

    const onMouseUp = (e) => {
        if (isDrawing === true) {
            drawLine(context, x, y, e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setX(0);
            setY(0);
            setDrawing(false);
        }
    }

    return (
        <div className="login-page" onMouseMove={onMouseMovePage}>
            <div className="wrapper">
                <div className="form">
                    <form className="login-form">
                        <input type="text" placeholder="username"/>
                        <input type="password" placeholder="password"/>
                        <a href="/home" className="button">login</a>
                    </form>
                </div>
                <div
                    style={{
                        width: WIDTH_CANVAS + 100,
                        height: HEIGHT_CANVAS + 100
                    }}
                    className={`wrapper-canvas ${isEnter ? 'wrapper-canvas_enter' : ''}`}
                >
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
