import React, { useState, useEffect } from 'react';

const Main = () => {
    const [hisse, setHisse] = useState({ pair: '', loading: true, totalCash: '' });

    const fetchData = async (pair, setState) => {
        try {
            const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes?totalCash=US&symbols=AMD';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '40f1e38267msh9bfd6c758207d2ap1b4805jsnc396995c1f69',
                    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result)

            // Burada "totalCash" bilgisini alabilirsiniz
            const totalCash = result.quoteResponse.result[0].totalCash;

            setState({ pair, loading: false, totalCash });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData('AMD', setHisse);
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mt-4">
            <a href="#" className="flex-shrink-0 w-[calc(33.33%-16px)] h-[calc(30%-16px)] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">DOLAR</h5>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-800 dark:text-white">{hisse.totalCash}</h5>

            </a>
        </div>
    );
};

export default Main;
