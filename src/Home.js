import React, { useEffect, useState } from 'react';

let status = '';

function identify(data) {
    return new Promise((resolve, reject) => {
        if (data === 123) {
            // success identify
            resolve()
        } else {
            // fail identify
            reject()
        }
    })
}

identify(123).then(res => status = 'SUCCESS').catch(res => status = 'FAIL')

function Home() {
    const [ state, setState ] = useState();

    useEffect(() => {
        setState(status)
    }, [status])

    const onSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <div className="home">
            <div className="home__panel panel">
                <p className="status">status: <b>{state}</b></p>
                <form className="form-home" onSubmit={onSubmit}>
                    <input type="submit" value="SEND" className="button"/>
                </form>
            </div>
        </div>
    );
}

export default Home;