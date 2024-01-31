import React, { useState, useEffect } from 'react';

const Main = () => {
    const [goldTry, setGoldTry] = useState({ rate: '', loading: true });

    const fetchData = async (setState) => {
        try {
            const url = 'https://api.collectapi.com/economy/goldPrice';
            const options = {
                method: 'GET',
                headers: {
                    "content-type": "application/json",
                    "authorization": `apikey ${process.env.NEXT_PUBLIC_COLLECTAPI_KEY}`
                },
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (data.success && Array.isArray(data.result) && data.result.length > 0) {
                const { buying = 'N/A' } = data.result[0];
                setState({ rate: buying, loading: false });
            } else {
                console.error("API'den beklenen veri alınamadı");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(setGoldTry);
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mt-4">
            <a href="#" className="flex-shrink-0 w-[calc(33.33%-16px)] h-[calc(30%-16px)] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center">
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">ALTIN(gr)</h5>
                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-800 dark:text-white">{goldTry.loading ? 'Loading...' : parseFloat(goldTry.rate).toFixed(2)}</h5>
            </a>
        </div>
    );
};

export default Main;
