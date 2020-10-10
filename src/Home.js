import React, { useEffect, useState } from 'react';

let status = '';

function identify(data) {
    return fetch('url', {
        method: 'POST', // or GET
        headers: {
            'Authorization': `${localStorage.getItem('token')}` // if need
        },
        body: JSON.stringify(data) // some data in json
    })
}

// here we take response from server in res and if we catch error set status to fail
identify(123).then(res => status = 'SUCCESS').catch(res => status = 'FAIL')

function Home() {
    const [ state, setState ] = useState();
    const [ transactionStatus, setTransactionStatus ] = useState('');

    useEffect(() => {
        setState(status)
    }, [status])

    const onSubmit = (e) => {
        e.preventDefault();
        setTransactionStatus('')

        let formData = new FormData();
        formData.append("AccountNumber", "0000 1111 2222 3333");
        formData.append("AccountHolder", "John Smith");
        formData.append("MoneySent", 10);

        fetch('https://morning-tundra-59000.herokuapp.com/transaction', {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            },
            body: formData
        }).then(res => {
            if (res.status === 202) {
                setTransactionStatus('SUCCESS')
            } else {
                setTransactionStatus('FAIL')
            }
        }).catch(res => {
            setTransactionStatus('FAIL')
        })
    }

    return (
        <div className="home">
            <div className="home__panel panel">
                <p className="status">auth status: <b>{state}</b></p>
                <p className="status">transaction status: <b>{transactionStatus}</b></p>
                <form className="form-home" onSubmit={onSubmit}>
                    <div className="form-home__button">
                        <input type="submit" value="SEND" className="button"/>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;