import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useAppContext } from './context';

const BIST = () => {
    const { state, dispatch } = useAppContext();
    const [coin, setCoin] = useState({ quotes: [] });
    const [filterLetter, setFilterLetter] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [trackedCount, setTrackedCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const url = 'https://api.collectapi.com/economy/hisseSenedi';
            const options = {
                method: 'GET',
                headers: {
                    'authorization': 'apikey 3HS07jD2MtstjfOkuxsw2A:6ZtSt2wk5HMIp5Bx5dAhAd',
                    'content-type': 'application/json',
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);

            const quotes = result.result;

            // Coin'leri tracking list'e göre işle
            const updatedQuotes = quotes.map((quote) => ({
                ...quote,
                isTracked: state.trackingList.includes(quote.code),
            }));

            setCoin({ quotes: updatedQuotes });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Arama terimine göre filtreleme yap
        const filteredQuotes = coin.quotes.filter((quote) => {
            const matchesFilterLetter = !filterLetter || quote.code.toLowerCase().startsWith(filterLetter);
            const matchesSearchTerm = !searchTerm || quote.code.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilterLetter && matchesSearchTerm;
        });

        // Sayfa numarasını sıfırla
        setCurrentPage(0);

        // Filtrelenmiş hisseleri ayarla
        setCoin({ quotes: filteredQuotes });
    }, [filterLetter, searchTerm]);

    const filterByLetter = (letter) => {
        setFilterLetter(letter);
    };

    const addToTrackingList = (code) => {
        dispatch({ type: 'ADD_TO_TRACKING_LIST', payload: code });
        setTrackedCount((prevCount) => prevCount + 1);
    };

    const removeFromTrackingList = (code) => {
        dispatch({ type: 'REMOVE_FROM_TRACKING_LIST', payload: code });
        setTrackedCount((prevCount) => prevCount - 1);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const offset = currentPage * itemsPerPage;
    const paginatedQuotes = coin.quotes.slice(offset, offset + itemsPerPage);

    return (
        <div className="container mx-auto mt-4">
            <h2 className="text-2xl font-bold mb-4">Canlı Borsa</h2>

            {/* Arama kutusu */}
            <div className="mb-4 flex items-center justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="p-2 border border-gray-300 focus:outline-none rounded-md"
                    placeholder='Hisse Ara...'
                />
            </div>

            {/* Filter buttons */}
            <div className="flex mb-4">
                {[...Array(26)].map((_, index) => (
                    <button
                        key={index}
                        className={`flex-1 p-2 border-2 border-gray-300 ${filterLetter === String.fromCharCode('a'.charCodeAt(0) + index)
                            ? 'bg-gray-300'
                            : 'hover:bg-gray-100'
                            } transform hover:scale-105 transition-transform`}
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

            {/* Items per page radio buttons */}
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

            {/* Table */}
            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border bg-gray-200 p-2 text-center">+</th>
                        <th className="border bg-gray-200 p-2 text-center">Code</th>
                        <th className="border bg-gray-200 p-2 text-center">Last Price</th>
                        <th className="border bg-gray-200 p-2 text-center">Max Price</th>
                        <th className="border bg-gray-200 p-2 text-center">Min Price</th>
                        <th className="border bg-gray-200 p-2 text-center">%</th>
                        <th className="border bg-gray-200 p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedQuotes.map((quote, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="border p-2 text-center text-sm">
                                <button
                                    className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    onClick={() => addToTrackingList(quote.code)}
                                >
                                    +
                                </button>
                            </td>
                            <td className="border p-2 text-center text-sm">
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
                            <td className="border p-2 text-right text-sm pr-10">{(quote.lastprice || 0).toFixed(2)}</td>
                            <td className="border p-2 text-right text-sm pr-10">{(quote.max || 0).toFixed(2)}</td>
                            <td className="border p-2 text-right text-sm pr-10">{(quote.min || 0).toFixed(2)}</td>
                            <td className="border p-2 text-right text-sm pr-10">{(quote.rate || 0).toFixed(2)}</td>
                            <td className="border p-2 text-center text-sm pr-10">
                                <button
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-700"
                                    onClick={() => removeFromTrackingList(quote.code)}
                                >
                                    -
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex justify-end">
                <ReactPaginate
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(coin.quotes.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                    pageClassName={'mr-2'}
                    style={{ display: 'flex', flexDirection: 'row' }}
                    previousClassName={'mr-2'} // Önceki buton için boşluk ekledik
                    nextClassName={'ml-2'} // Sonraki buton için boşluk ekledik
                />

            </div>
        </div>
    );
};

export default BIST;
