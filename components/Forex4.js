// Forex4 component
import React, { useState, useEffect } from 'react';
import { CurrencyProvider, useCurrencyContext } from './CurrencyContext';
import Cookies from 'js-cookie'; // Import js-cookie
import LineChart from './LineChart';

const Forex4 = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [filterOption, setFilterOption] = useState('all'); // 'all', 'rising', 'falling'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const [currencyData, setCurrencyData] = useState([]);
    const { selectedCurrencies, addSelectedCurrency, removeSelectedCurrency } = useCurrencyContext();

    const fetchData = async () => {
        try {
            const url = 'https://finans.truncgil.com/v4/today.json';

            const options = {
                method: 'GET',
                headers: {},
            };

            const response = await fetch(url, options);
            const result = await response.json();

            let data;

            if (result && result['Update_Date']) {
                data = Object.keys(result)
                    .filter((currencyKey) => currencyKey.toLowerCase() !== 'update_date')
                    .map((currencyKey) => {
                        const selling = parseFloat(result[currencyKey].Selling);
                        const change = parseFloat(result[currencyKey].Change);

                        if (isNaN(selling) || isNaN(change)) {
                            // Handle the case where the values are not valid numbers
                            console.error(`Invalid numeric values for ${currencyKey}: Selling=${result[currencyKey].Selling}, Change=${result[currencyKey].Change}`);
                            return null;  // or handle it according to your use case
                        }

                        return {
                            currency: currencyKey,
                            rate: selling.toFixed(2),
                            change: change.toFixed(2),
                            loading: false,
                            isStarred: false,
                        };
                    })
                    .filter(currency => currency !== null);

                setCurrencyData(data || []);
            } else {
                console.error('Invalid response format or missing data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();

        // Retrieve selected currencies from cookies on component mount
        const storedSelectedCurrencies = Cookies.get('selectedCurrencies');
        if (storedSelectedCurrencies) {
            const parsedSelectedCurrencies = JSON.parse(storedSelectedCurrencies);
            addSelectedCurrency(parsedSelectedCurrencies);
        }
    }, []);



    const handleActionClick = (clickedCurrency) => {
        setCurrencyData((prevCurrencyData) => {
            const updatedCurrencyData = prevCurrencyData.map((currency) => {
                if (currency.currency === clickedCurrency.currency) {
                    const updatedCurrency = {
                        ...currency,
                        isStarred: !currency.isStarred,
                    };

                    // Check if the currency is already selected
                    const isAlreadySelected = selectedCurrencies.some((c) => c.currency === updatedCurrency.currency);

                    // Use the addSelectedCurrency and removeSelectedCurrency functions directly
                    if (isAlreadySelected) {
                        // If already selected, remove it from the list
                        removeSelectedCurrency(updatedCurrency);
                    } else {
                        // If not selected, add it to the list
                        addSelectedCurrency(updatedCurrency);
                    }

                    // Save the selected currencies in the cookie with Path option
                    Cookies.set('selectedCurrencies', JSON.stringify(selectedCurrencies), { expires: 7, path: '/' }); // Set expiry and Path as needed

                    return updatedCurrency;
                }
                return currency;
            });

            return updatedCurrencyData;
        });
    };


    const filteredData = currencyData.filter((currency) => currency.currency.toLowerCase() !== 'update_date');

    const filteredAndSortedData = filteredData.filter((currency) => {
        const changeValue = currency.change;
        if (filterOption === 'rising') {
            return !changeValue.includes('-');
        } else if (filterOption === 'falling') {
            return changeValue.includes('-');
        }
        return true;
    });

    const sortedData = filteredAndSortedData.sort((a, b) => {
        const changeA = parseFloat(a.change);
        const changeB = parseFloat(b.change);

        if (sortOrder === 'asc') {
            return changeA - changeB;
        } else {
            return changeB - changeA;
        }
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedData.length > 0 ? Math.ceil(sortedData.length / itemsPerPage) : 0;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowHover = (index) => {
        setHoveredRow(index);
    };

    const handleItemsPerPageChange = (e) => {
        const selectedItemsPerPage = parseInt(e.target.value, 10);
        setItemsPerPage(selectedItemsPerPage);
        setCurrentPage(1);
    };

    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };


    const rowsToRender = currentItems.map((currency, index) => {
        const numericChange = parseFloat(currency.change);

        return (
            <tr
                key={`${currency.currency}-${index}`}
                className={`cursor-pointer duration-300 hover:bg-gray-300 ${index % 2 === 0 ? 'even:bg-white even:text-gray-800' : 'odd:bg-yellow-100 odd:text-gray-800'
                    }`}
                onMouseEnter={() => handleRowHover(index)}
                onMouseLeave={() => handleRowHover(null)}
            >
                <td className="py-0.5 px-4 border-b text-center text-sm" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="flex items-center justify-center">
                        <button
                            className="text-lg font-semibold p-2 rounded-md ml-2"
                            style={{ width: '30px', height: '30px', lineHeight: '1' }}
                            onClick={() => handleActionClick(currency)}
                        >
                            {currency.isStarred ? '★' : '☆'}
                        </button>
                    </div>
                </td>
                <td className="py-0.5 px-4 border-b text-center text-sm">{currency.currency}</td>
                <td className="py-0.5 px-4 border-b text-center text-sm">{parseFloat(currency.rate).toFixed(2)}</td>
                <td className="py-1 px-4 border-b text-center text-sm">
                    <span className={`font-semibold ${numericChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {numericChange.toFixed(2)} %
                    </span>
                </td>
                <td className="py-0.5 px-4 border-b text-center text-sm">
                    <span className={`font-bold ${numericChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {numericChange < 0 ? '▼' : '▲'}
                    </span>
                </td>
            </tr>
        );
    });

    return (
        <CurrencyProvider>
            <div className="container mx-auto mt-2 h-screen w-full lg:w-full">
                <div className="overflow-x-auto">
                    <div className="items-center mt-4" style={{ paddingLeft: '10px' }}>
                        <span className="text-base font-semibold">Sayfa sayısı: </span>
                        <select
                            className="border p-0.5 rounded-md text-sm"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                        </select>

                        <span className="text-base font-semibold ml-2">Filtrele: </span>

                        <select
                            className="border p-0.5 rounded-md text-sm"
                            value={filterOption}
                            onChange={handleFilterChange}
                            style={{ maxWidth: '130px', marginRight: '20px', marginLeft: '5px' }}
                        >
                            <option value="all">Hepsi</option>
                            <option value="rising">Yükselenler</option>
                            <option value="falling">Düşenler</option>
                        </select>
                    </div>

                    <div className="mb-4"></div>
                    <div className="max-w-full overflow-x-auto">
                        <table className="min-w-full border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="py-2 px-4 border-b" style={{ width: '50px' }}></th>
                                    <th className="py-2 px-4 border-b cursor-pointer" style={{ width: '80px' }}>Currency</th>
                                    <th className="py-2 px-4 border-b cursor-pointer">Rate</th>
                                    <th className="py-2 px-4 border-b cursor-pointer">Change</th>
                                    <th className="py-2 px-4 border-b">
                                        <button
                                            className="text-lg font-bold p-2 rounded-md ml-2 transform rotate-180"
                                            onClick={handleSortChange}
                                        >
                                            {sortOrder === 'asc' ? '↑' : '↓'}
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{rowsToRender}</tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index}
                                className={`px-3 py-1 mx-1 border rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4 mt-4">
                    <h1 className="font-bold text-lg">Takip Listem</h1>
                    <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-300">
                            <tr>
                                <th className="py-2 px-4 border-b" style={{ width: '50px' }}></th>
                                <th className="py-2 px-4 border-b cursor-pointer" style={{ width: '80px' }}>Currency</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Rate</th>
                                <th className="py-2 px-4 border-b cursor-pointer">Change</th>
                                <th className="py-2 px-4 border-b">Chart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCurrencies.map((currency, index) => (
                                <tr
                                    key={index}
                                    className={`cursor-pointer duration-300 hover:bg-gray-300 ${index % 2 === 0 ? 'even:bg-white even:text-gray-800' : 'odd:bg-yellow-100 odd:text-gray-800'}`}
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
                                    <td className={`py-1 px-4 border-b text-center text-sm ${parseFloat(currency.change) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {`${parseFloat(currency.change).toFixed(2)} % `}
                                    </td>
                                    <td style={{ width: '100px' }}>
                                        <LineChart currencyKey={currency.currency} rate={currency.rate} change={currency.change} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>


            </div>
        </CurrencyProvider>
    );
};

export default Forex4;
