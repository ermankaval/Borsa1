import React, { useState, useEffect } from 'react';

const CoinList = () => {
    const [coin, setCoin] = useState({ pair: '', loading: true, quotes: [], currentPage: 1, itemsPerPage: 10 });

    const fetchData = async (setState) => {
        try {
            const url = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-trending-tickers?region=US';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '40f1e38267msh9bfd6c758207d2ap1b4805jsnc396995c1f69',
                    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
                },
            };

            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);

            const quotes = result.finance.result[0].quotes || [];

            setState({ pair: '', loading: false, quotes, currentPage: 1, itemsPerPage: 10 });
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(setCoin);
    }, []);

    const indexOfLastItem = coin.currentPage * coin.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - coin.itemsPerPage;
    const currentItems = coin.quotes.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCoin({ ...coin, currentPage: pageNumber });

    return (
        <div className="container mx-auto mt-4">
            <h2 className="text-2xl font-bold mb-4">Trending Tickers</h2>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((quote, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="py-2 px-4 border-b">{quote.shortName || 'Unknown'}</td>
                            <td className="py-2 px-4 border-b">{quote.regularMarketPrice || 'Unknown'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(coin.quotes.length / coin.itemsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`px-3 py-1 mx-1 border rounded-full ${coin.currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                            }`}
                        onClick={() => paginate(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CoinList;
