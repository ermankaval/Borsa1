import React, { useState, useEffect } from 'react';

const Main = () => {
    const [currencies, setCurrencies] = useState([
        { name: 'DOLAR', rate: '', loading: true, isStarred: false },
        { name: 'EURO', rate: '', loading: true, isStarred: false },
        { name: 'STERLIN', rate: '', loading: true, isStarred: false },
    ]);

    const fetchData = async () => {
        try {
            const url = 'https://api.collectapi.com/economy/allCurrency';
            const options = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `apikey ${process.env.NEXT_PUBLIC_COLLECTAPI_KEY}`,
                },
            };

            const response = await fetch(url, options);
            const data = await response.json();

            if (data.success && Array.isArray(data.result)) {
                setCurrencies((prevCurrencies) => {
                    return prevCurrencies.map((currency, index) => {
                        const updatedCurrency = data.result.find((resultItem) => resultItem.code === currency.name);

                        if (updatedCurrency && updatedCurrency.buying !== undefined) {
                            return {
                                name: currency.name,
                                rate: updatedCurrency.buying,
                                loading: false,
                                isStarred: currency.isStarred,
                            };
                        } else {
                            console.error(`API'den beklenen veri alınamadı - ${currency.name}`);
                            return currency;
                        }
                    });
                });
            } else {
                console.error("API'den beklenen veri alınamadı");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex flex-wrap gap-4 mt-4">
            {currencies.map((currency, index) => (
                <a key={index} href="#" className="flex-shrink-0 w-[calc(33.33%-16px)] h-[calc(30%-16px)] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center relative">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{currency.name}</h5>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-800 dark:text-white">
                        {currency.loading ? 'Loading...' : parseFloat(currency.rate).toFixed(2)}
                    </h5>
                </a>
            ))}
        </div>
    );
};

export default Main;
