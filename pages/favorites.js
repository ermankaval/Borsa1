import React, { useState, useEffect } from 'react';
import { useCurrencyContext } from '../components/CurrencyContext';
import Navbar from '@/components/Navbar';
import LineChartDetay from '@/components/LineChartDetay';

const Favorites = () => {
    const { selectedCurrencies, addSelectedCurrency, removeSelectedCurrency } = useCurrencyContext();
    const [currencyData, setCurrencyData] = useState([]);
    const [displayedCurrencies, setDisplayedCurrencies] = useState([]);

    const handleActionClick = (clickedCurrency) => {
        setCurrencyData((prevCurrencyData) => {
            const updatedCurrencyData = prevCurrencyData.map((item) => {
                if (Array.isArray(item)) {
                    return item.map((currency) => handleCurrency(currency, clickedCurrency));
                } else if (typeof item === 'object' && item !== null) {
                    return handleCurrency(item, clickedCurrency);
                }
                return item;
            });

            const flattenedData = updatedCurrencyData.flat(Infinity).filter(currency => currency !== null);
            console.log('Updated Currency Data:', flattenedData);
            setDisplayedCurrencies(flattenedData);

            // Update context with the new selected currencies
            flattenedData.forEach((currency) => {
                if (currency && !isNaN(parseFloat(currency.change))) {
                    const isAlreadySelected = selectedCurrencies.some((c) => c.currency === currency.currency);
                    if (isAlreadySelected) {
                        addSelectedCurrency(currency);
                    } else {
                        removeSelectedCurrency(currency);
                    }
                }
            });

            localStorage.setItem('selectedCurrencies', JSON.stringify(flattenedData));

            // Directly return flattenedData to update the state
            return flattenedData;
        });
    };



    const handleCurrency = (currency, clickedCurrency) => {
        if (currency.currency === clickedCurrency.currency) {
            const updatedCurrency = {
                ...currency,
                isStarred: !currency.isStarred,
            };

            const isAlreadySelected = selectedCurrencies.some((c) => c.currency === updatedCurrency.currency);

            if (isAlreadySelected) {
                removeSelectedCurrency(updatedCurrency);
            } else {
                addSelectedCurrency(updatedCurrency);
            }

            return updatedCurrency;
        }
        return currency;
    };


    const rowsToRenderLowerTable = selectedCurrencies.map((currency, index) => {
        const parsedChange = parseFloat(currency.change);
        const numericChange = !isNaN(parsedChange) ? parsedChange : 0; // Parse başarısız olursa 0 olarak kabul et
        return (
            <tr
                key={index}
                className="cursor-pointer duration-300 hover:bg-gray-300"
            >
                <td className="py-0.5 px-4 border-b text-center text-sm">
                    <button
                        className={"text-lg font-semibold p-2 rounded-md ml-2"}
                        onClick={() => handleActionClick(currency)}
                    >
                        {currency.isStarred ? '★' : '☆'}
                    </button>
                </td>
                <td className="py-0.5 px-4 border-b text-center text-sm font-bold">{currency.currency}</td>
                <td className="py-0.5 px-4 border-b text-center text-sm">{parseFloat(currency.rate).toFixed(2)}</td>
                <td className={`py-1 px-4 border-b text-center text-sm ${numericChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {`${numericChange.toFixed(2)} % `}
                </td>
                <td className="hidden md:table-cell">
                    <div className="flex justify-center items-center">
                        <LineChartDetay currencyKey={currency.currency} rate={currency.rate} change={currency.change} />
                    </div>
                </td>
            </tr>
        );
    });


    useEffect(() => {
        console.log('Selected Currencies:', selectedCurrencies);
        const flattenedData = selectedCurrencies.filter(currency => currency !== null);
        // console.log('Displayed Currencies:', flattenedData);
        setDisplayedCurrencies(flattenedData);
    }, [selectedCurrencies]);

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-20 h-screen w-full lg:w-full">
                <h1 className="text-2xl font-semibold mb-4">Favorite Currencies</h1>
                {selectedCurrencies.length > 0 ? (
                    <table className="min-w-full border border-gray-200 rounded-lg mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b" style={{ width: '50px' }}></th>
                                <th className="py-2 px-4 border-b cursor-pointer" style={{ width: '80px' }}>Currency</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Rate</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Change</th>
                                <th className="py-2 px-4 border-b cursor-pointer hidden md:table-cell">Chart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsToRenderLowerTable}
                        </tbody>
                    </table>
                ) : (
                    <p>No favorite currencies selected.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;