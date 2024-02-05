// favorites.js
import React, { useState, useEffect } from 'react';
import { CurrencyProvider, useCurrencyContext } from '../components/CurrencyContext';
import Cookies from 'js-cookie'; // Import js-cookie
import Navbar from '@/components/Navbar';
import LineChartDetay from '@/components/LineChartDetay';

// const { selectedCurrencies, addSelectedCurrency, removeSelectedCurrency } = useCurrencyContext();

const Favorites = () => {
    const { selectedCurrencies } = useCurrencyContext();
    const [currencyData, setCurrencyData] = useState([]);

    // const handleActionClick = (clickedCurrency) => {
    //     setCurrencyData((prevCurrencyData) => {
    //         const updatedCurrencyData = prevCurrencyData.map((currency) => {
    //             if (currency.currency === clickedCurrency.currency) {
    //                 const updatedCurrency = {
    //                     ...currency,
    //                     isStarred: !currency.isStarred,
    //                 };

    //                 const isAlreadySelected = selectedCurrencies.some((c) => c.currency === updatedCurrency.currency);

    //                 if (isAlreadySelected) {
    //                     removeSelectedCurrency(updatedCurrency);
    //                 } else {
    //                     addSelectedCurrency(updatedCurrency);
    //                 }

    //                 Cookies.set('selectedCurrencies', JSON.stringify(selectedCurrencies), { expires: 7, path: '/' });

    //                 return updatedCurrency;
    //             }
    //             return currency;
    //         });

    //         return updatedCurrencyData;
    //     });
    // };

    // useEffect(() => {

    //     const storedSelectedCurrencies = Cookies.get('selectedCurrencies');
    //     if (storedSelectedCurrencies) {
    //         const parsedSelectedCurrencies = JSON.parse(storedSelectedCurrencies);
    //         addSelectedCurrency(parsedSelectedCurrencies);
    //     }
    // }, []);


    const rowsToRenderLowerTable = selectedCurrencies
        .filter((currency) => !isNaN(parseFloat(currency.change))) // Filter out currencies with NaN change values
        .map((currency, index) => {
            const numericChange = parseFloat(currency.change);

            return (
                <tr
                    key={index}
                    className="cursor-pointer duration-300 hover:bg-gray-300"
                    style={{
                        // backgroundColor: 'white',
                        // color: 'gray.800',
                    }}
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

                    <td >
                        <div className="flex justify-center items-center">
                            <LineChartDetay currencyKey={currency.currency} rate={currency.rate} change={currency.change} />
                        </div>
                    </td>

                </tr>
            );
        });


    return (

        <div>
            <Navbar />
            <div className="container mx-auto mt-20 h-screen w-full lg:w-full">
                <h1 className="text-2xl font-semibold mb-4">Favorite Currencies</h1>
                {selectedCurrencies.length > 0 ? (
                    <table className="min-w-full  border border-gray-200 rounded-lg mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b" style={{ width: '50px' }}></th>
                                <th className="py-2 px-4 border-b cursor-pointer" style={{ width: '80px' }}>Currency</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Rate</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Change</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Chart</th>
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
