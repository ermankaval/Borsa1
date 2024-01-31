import React, { useState, useEffect } from 'react';
import { useAppContext } from './context';
import isEqual from 'lodash/isEqual';

const BIST = () => {
    const { state, dispatch } = useAppContext();
    const [coin, setCoin] = useState({ quotes: [] });
    const [filterLetter, setFilterLetter] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        try {
            const url = 'https://api.collectapi.com/economy/hisseSenedi';
            const options = {
                method: 'GET',
                headers: {
                    'authorization': 'apikey 3HS07jD2MtstjfOkuxsw2A:6ZtSt2wk5HMIp5Bx5dAhAd', /* ermandilekbuse */
                    'content-type': 'application/json',
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();

            const quotes = result.result;
            const updatedQuotes = quotes.map((quote) => ({
                ...quote,
                isTracked: state.trackingList.includes(quote.code),
            }));

            // Calculate total pages based on itemsPerPage
            const newTotalPages = Math.ceil(updatedQuotes.length / itemsPerPage);

            // Update state with quotes and total pages
            setCoin({ quotes: updatedQuotes });
            setTotalPages(newTotalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filteredQuotes = coin.quotes.filter((quote) => {
            const matchesFilterLetter = !filterLetter || quote.code.toLowerCase().startsWith(filterLetter);
            const matchesSearchTerm = !searchTerm || quote.code.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilterLetter && matchesSearchTerm;
        });
        if (!isEqual(filteredQuotes, coin.quotes)) {
            setCoin({ quotes: filteredQuotes });
        }
    }, [filterLetter, searchTerm, coin.quotes]);

    const filterByLetter = (letter) => {
        setFilterLetter(letter);
    };

    const addToTrackingList = (quote) => {
        dispatch({
            type: 'ADD_TO_TRACKING_LIST',
            payload: quote
        });
    };

    const removeFromTrackingList = (quote) => {
        dispatch({
            type: 'REMOVE_FROM_TRACKING_LIST',
            payload: quote
        });
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1);
    };

    return (
        <div className="container mx-auto mt-4 overflow-x-auto">
            <h2 className="text-2xl font-bold mb-4">Canlı Borsa</h2>

            <div className="mb-4 flex items-center justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 focus:outline-none rounded-md"
                    placeholder='Hisse Ara...'
                />
            </div>

            <div className="flex flex-wrap mb-4">
                {[...Array(26)].map((_, index) => (
                    <button
                        key={index}
                        className={`flex-1 p-2 border-2 border-gray-300 ${filterLetter === String.fromCharCode('a'.charCodeAt(0) + index)
                            ? 'bg-gray-300'
                            : 'hover:bg-gray-100'
                            } transform hover:scale-105 transition-transform mb-2`}
                        style={{
                            backgroundColor: filterLetter === String.fromCharCode('a'.charCodeAt(0) + index) ? 'rgba(169, 169, 169, 0.3)' : '',
                            borderColor: 'rgba(169, 169, 169, 0.6)',
                            color: filterLetter === String.fromCharCode('a'.charCodeAt(0) + index) ? 'black' : '',
                        }}
                        onClick={() => filterByLetter(String.fromCharCode('a'.charCodeAt(0) + index))}
                    >
                        {String.fromCharCode('a'.charCodeAt(0) + index)}
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <label className="mr-4">Satır Sayısı:</label>
                <label className="mr-4">
                    <input type="radio" value="10" checked={itemsPerPage === 10} onChange={handleItemsPerPageChange} />
                    _10
                </label>
                <label className="mr-4">
                    <input type="radio" value="30" checked={itemsPerPage === 30} onChange={handleItemsPerPageChange} />
                    _30
                </label>
                <label>
                    <input type="radio" value="50" checked={itemsPerPage === 50} onChange={handleItemsPerPageChange} />
                    _50
                </label>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="bg-gray-200 p-2 text-center">+</th>
                            <th className="bg-gray-200 p-2 text-center">Code</th>
                            <th className="bg-gray-200 p-2 text-center">Last Price</th>
                            <th className="bg-gray-200 p-2 text-center">Max Price</th>
                            <th className="bg-gray-200 p-2 text-center">Min Price</th>
                            <th className="bg-gray-200 p-2 text-center">%</th>
                            <th className="bg-gray-200 p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coin.quotes
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((quote, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                    <td className="p-2 text-center text-sm">
                                        <button
                                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                            onClick={() => addToTrackingList(quote)}
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td className="p-2 text-center text-sm">
                                        {quote.rate < 0 ? (
                                            <>
                                                {quote.code || 'Unknown'}
                                                <span className="text-red-500 ml-1">&#9660;</span>
                                            </>
                                        ) : (
                                            <>
                                                {quote.code || 'Unknown'}
                                                <span className="text-green-500 ml-1">&#9650;</span>
                                            </>
                                        )}
                                    </td>
                                    <td className="p-2 text-right text-sm pr-10">{(quote.lastprice || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right text-sm pr-10">{(quote.max || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right text-sm pr-10">{(quote.min || 0).toFixed(2)}</td>
                                    <td className="p-2 text-right text-sm pr-10">{(quote.rate || 0).toFixed(2)}</td>
                                    <td className="p-2 text-center text-sm pr-10">
                                        <button
                                            className="p-1 bg-red-500 text-white rounded hover:bg-red-700"
                                            onClick={() => removeFromTrackingList(quote)}
                                        >
                                            -
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`px-3 py-1 mx-1 border rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                            }`}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BIST;
