import React, { useState, useEffect } from 'react';

const Main = () => {
    const [usdTry, setUsdTry] = useState({ pair: 'USD_TRY', rate: '', loading: true });
    const [eurTry, setEurTry] = useState({ pair: 'EUR_TRY', rate: '', loading: true });
    const [gbpTry, setGbpTry] = useState({ pair: 'GBP_TRY', rate: '', loading: true });

    const fetchData = async (pair, setState) => {
        try {
            // const url = `https://exchange-rate-by-api-ninjas.p.rapidapi.com/v1/exchangerate?pair=${pair}`;
            const url = `https://finans.truncgil.com/today.json`;

            const options = {
                method: 'GET',
                headers: {
                    // 'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
                    // 'X-RapidAPI-Key': '40f1e38267msh9bfd6c758207d2ap1b4805jsnc396995c1f69',
                    // 'X-RapidAPI-Host': 'exchange-rate-by-api-ninjas.p.rapidapi.com',
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result)


            setState({ pair, rate: result.exchange_rate, loading: false });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData('USD_TRY', setUsdTry);
    }, []);

    useEffect(() => {
        fetchData('EUR_TRY', setEurTry);
    }, []);

    useEffect(() => {
        fetchData('GBP_TRY', setGbpTry);
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mt-4">

            <a href="#" className="flex-shrink-0 w-[calc(33.33%-16px)] h-[calc(30%-16px)] p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">DOLAR</h5>
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-800 dark:text-white">{usdTry.loading ? 'Loading...' : parseFloat(usdTry.rate).toFixed(2)}</h5>
            </a>
            <a href="#" className="flex-shrink-0 w-[calc(33.33%-16px)] h-[calc(30%-16px)] p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">EURO</h5>
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-800 dark:text-white">{eurTry.loading ? 'Loading...' : parseFloat(eurTry.rate).toFixed(2)}</h5>
            </a>
            <a href="#" className="flex-shrink-0 w-[calc(33.33%-16px)] h-[calc(30%-16px)] p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">STERLIN</h5>
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-800 dark:text-white">{gbpTry.loading ? 'Loading...' : parseFloat(gbpTry.rate).toFixed(2)}</h5>
            </a>
        </div>
    );
};

export default Main;
