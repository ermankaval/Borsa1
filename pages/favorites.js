// favorites.js
import React from 'react';
import { useCurrencyContext } from '../components/CurrencyContext';
import Navbar from '@/components/Navbar';

const Favorites = () => {
    const { selectedCurrencies } = useCurrencyContext();

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-2 h-screen w-full lg:w-full">
                <h1 className="text-2xl font-semibold mb-4">Favorite Currencies</h1>
                {selectedCurrencies.length > 0 ? (
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b cursor-pointer" style={{ width: '80px' }}>Currency</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Rate</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCurrencies.map((currency, index) => (
                                <tr key={index}>
                                    <td className="py-0.5 px-4 border-b text-center text-sm">{currency.currency}</td>
                                    <td className="py-0.5 px-4 border-b text-center text-sm">{parseFloat(currency.rate).toFixed(2)}</td>
                                    <td className={`py-1 px-4 border-b text-center text-sm`}>{`${parseFloat(currency.change).toFixed(2)} % `}</td>
                                </tr>
                            ))}
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
