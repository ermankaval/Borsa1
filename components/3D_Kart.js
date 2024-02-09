import React, { useState, useEffect } from 'react';
import LineChart from './LineChart';

const Kart = () => {
    const [usdTry, setUsdTry] = useState({ rate: '', change: '', loading: true });
    const [eurTry, setEurTry] = useState({ rate: '', change: '', loading: true });
    const [gbpTry, setGbpTry] = useState({ rate: '', change: '', loading: true });
    const [goldTry, setGoldTry] = useState({ rate: '', change: '', loading: true });
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [isChartVisible, setIsChartVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const fetchData = async (currency, setState) => {
        try {
            const url = 'https://finans.truncgil.com/v4/today.json';

            const options = {
                method: 'GET',
                headers: {},
            };

            const response = await fetch(url, options);
            const result = await response.json();

            if (result && result[currency] && result[currency].Selling !== undefined) {
                setState({
                    rate: result[currency].Selling,
                    change: result[currency].Change,
                    loading: false,
                });
            } else {
                console.error(`Invalid response format or missing "${currency}" data`);
                setState({ rate: 'Error', change: 'Error', loading: false });
            }
        } catch (error) {
            console.error(error);
            setState({ rate: 'Error', change: 'Error', loading: false });
        }
    };

    useEffect(() => {
        fetchData('USD', setUsdTry);
        fetchData('EUR', setEurTry);
        fetchData('GBP', setGbpTry);
        fetchData('GRA', setGoldTry);
    }, []);

    const handleChartToggle = (currencyKey) => {
        setIsChartVisible((prevIsChartVisible) =>
            selectedCurrency === currencyKey ? !prevIsChartVisible : true
        );

        setSelectedCurrency((prevSelectedCurrency) =>
            selectedCurrency === currencyKey ? null : currencyKey
        );

        setSelectedCard(currencyKey);
    };

    return (
        <div className="flex flex-col ml-auto mr-auto max-w-screen-lg">
            <div className="flex justify-between">
                <CurrencyCard
                    currency="DOLAR"
                    rate={usdTry.rate}
                    change={usdTry.change}
                    loading={usdTry.loading}
                    onChartToggle={() => handleChartToggle('USD')}
                    isSelected={selectedCurrency === 'USD'}
                    isClicked={selectedCard === 'USD'}
                />
                <CurrencyCard
                    currency="EURO"
                    rate={eurTry.rate}
                    change={eurTry.change}
                    loading={eurTry.loading}
                    onChartToggle={() => handleChartToggle('EUR')}
                    isSelected={selectedCurrency === 'EUR'}
                    isClicked={selectedCard === 'EUR'}
                />
                <CurrencyCard
                    currency="STERLIN"
                    rate={gbpTry.rate}
                    change={gbpTry.change}
                    loading={gbpTry.loading}
                    onChartToggle={() => handleChartToggle('GBP')}
                    isSelected={selectedCurrency === 'GBP'}
                    isClicked={selectedCard === 'GBP'}
                />
                <CurrencyCard
                    currency="ALTIN GR"
                    rate={goldTry.rate}
                    change={goldTry.change}
                    loading={goldTry.loading}
                    onChartToggle={() => handleChartToggle('GLD')}
                    isSelected={selectedCurrency === 'GLD'}
                    isClicked={selectedCard === 'GLD'}
                />
            </div>
            {isChartVisible && selectedCurrency && (
                <div style={{ width: '100%', height: '100%' }}>
                    {selectedCurrency === 'USD' && <LineChart currencyKey="USD" rate={usdTry.rate} change={usdTry.change} />}
                    {selectedCurrency === 'EUR' && <LineChart currencyKey="EUR" rate={eurTry.rate} change={eurTry.change} />}
                    {selectedCurrency === 'GBP' && <LineChart currencyKey="GBP" rate={gbpTry.rate} change={gbpTry.change} />}
                    {selectedCurrency === 'GLD' && <LineChart currencyKey="GLD" rate={goldTry.rate} change={goldTry.change} />}
                </div>
            )}
        </div>
    );
};

const CurrencyCard = ({ currency, rate, change, loading, onChartToggle, isSelected, isClicked }) => {
    const arrowColor = change < 0 ? 'red' : 'green';
    const arrowSymbol = change < 0 ? '▼' : '▲';
    const percentageSymbol = change !== '' ? '%' : '';

    const formattedRate = loading ? 'Loading...' : parseFloat(rate).toFixed(2);
    const formattedChange = loading ? 'Loading...' : `${parseFloat(change).toFixed(2)}${percentageSymbol}`;

    const handleButtonClick = () => {
        onChartToggle();
    };

    const buttonClass = isSelected ? 'bg-green-500' : 'bg-blue-500';

    return (
        <div
            className={`mx-auto z-20 flex-shrink-0 w-[calc(25%-16px)] p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 text-center flex flex-col justify-between items-center ${isSelected ? 'border-blue-500' : ''}`}
            style={{
                transform: isClicked ? 'translateY(-10px) scale(1.02)' : 'translateY(0)',
                boxShadow: isSelected ? '0 12px 24px rgba(0, 0, 0, 0.2)' : '',
            }}
        >
            <div>
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">{currency}</h5>
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-800 dark:text-white">
                    {formattedRate}
                    <span style={{ color: arrowColor, marginLeft: '5px', fontSize: '20px' }}>{loading ? '' : arrowSymbol}</span>
                </h5>
            </div>
            <p className={`text-sm text-${arrowColor === 'red' ? 'red' : 'green'}-600 dark:text-gray-400`}>
                {formattedChange}
            </p>

            <button
                onClick={handleButtonClick}
                className={`mt-2 px-4 py-2 text-sm ${buttonClass} text-white rounded-md focus:outline-none focus:border-${isSelected ? 'green-300' : 'blue-300'}`}
            >
                Select
            </button>
        </div>
    );
};

export default Kart;
