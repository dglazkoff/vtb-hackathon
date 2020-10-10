import React, { useEffect, useState } from 'react';

let status = '';

async function identify(data) {
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

    return (
        <div className="home">
            <p>{state}</p>
        </div>
    );
}

export default Home;