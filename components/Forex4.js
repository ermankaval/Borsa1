import React, { useState, useEffect } from 'react';
import { CurrencyProvider, useCurrencyContext } from './CurrencyContext';
import LineChartDetay from './LineChartDetay';
import Cookies from 'js-cookie';

const Forex4 = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [filterOption, setFilterOption] = useState('all'); // 'all', 'rising', 'falling'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
    const [currencyData, setCurrencyData] = useState([]);
    const { selectedCurrencies = [], addSelectedCurrency, removeSelectedCurrency } = useCurrencyContext();
    const currencySymbolsSet = new Set(currencyData.map(currency => currency.currency));
    const [initialLoad, setInitialLoad] = useState(true);

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
                        try {
                            const selling = parseFloat(result[currencyKey].Selling);
                            const change = parseFloat(result[currencyKey].Change);

                            if (isNaN(selling) || isNaN(change)) {
                                return null;
                            }

                            return {
                                currency: currencyKey,
                                rate: selling.toFixed(2),
                                change: change.toFixed(2),
                                isStarred: false,
                            };
                        } catch (error) {
                            console.error(`Error processing ${currencyKey}:`, error);
                            return null;
                        }
                    })
                    .filter(currency => currency !== null && !isNaN(parseFloat(currency.change)));

                return data || [];
            } else {
                console.error('Invalid response format or missing data');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData().then((data) => {
            setCurrencyData(data);
            loadSelectedCurrenciesFromCookie();
        });
    }, []);

    useEffect(() => {
        if (!initialLoad) {
            saveSelectedCurrenciesToCookie();
        }
    }, [selectedCurrencies, initialLoad]);


    const updateCurrencyDataAndState = async (clickedCurrency) => {
        if (!currencyData) {
            console.error('currencyData is undefined.');
            return;
        }

        const updatedCurrencyData = currencyData.map((currency) => {
            if (currency.currency === clickedCurrency.currency) {
                const updatedCurrency = {
                    ...currency,
                    isStarred: !currency.isStarred,
                };

                if (updatedCurrency.isStarred) {
                    addSelectedCurrency(updatedCurrency);
                } else {
                    removeSelectedCurrency(updatedCurrency);
                }

                return updatedCurrency;
            }
            return currency;
        });

        await setCurrencyData(updatedCurrencyData);
        saveSelectedCurrenciesToCookie(updatedCurrencyData); // Buradaki hatayı düzelttim
    };

    const handleActionClick = async (clickedCurrency) => {
        await updateCurrencyDataAndState(clickedCurrency);
    };


    const saveSelectedCurrenciesToCookie = async (updatedCurrencyData) => {
        if (!updatedCurrencyData) {
            console.error('updatedCurrencyData is undefined.');
            return;
        }

        const starredCurrenciesData = updatedCurrencyData.filter(currency => currency.isStarred);
        Cookies.set('selectedCurrencies', JSON.stringify(starredCurrenciesData));
        console.log('Cookie updated:', starredCurrenciesData);
    };



    const filteredData = currencyData
        .filter((currency) => currency.currency.toLowerCase() !== 'update_date')
        .filter((currency) => {
            const changeValue = currency.change;
            if (filterOption === 'rising') {
                return !changeValue.includes('-');
            } else if (filterOption === 'falling') {
                return changeValue.includes('-');
            }
            return true;
        });

    const sortedData = filteredData
        .sort((a, b) => {
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

    const rowsToRenderUpperTable = currentItems.map((currency, index) => {
        const numericChange = parseFloat(currency.change);
        const isCurrencyStarred = selectedCurrencies.some(selectedCurrency => selectedCurrency.currency === currency.currency && selectedCurrency.isStarred);

        return (
            <tr
                key={`${currency.currency}-${index}`}
                className={`cursor-pointer duration-300 ${hoveredRow === index ? 'bg-gray-300' : ''}`}
                onMouseEnter={() => handleRowHover(index)}
                onMouseLeave={() => handleRowHover(null)}
            >
                <td className="py-0.5 px-4 border-b text-center text-sm" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="flex items-center justify-center">
                        <button
                            className={`text-lg font-semibold p-2 rounded-md ml-2 ${isCurrencyStarred ? 'text-black' : ''}`}
                            style={{ width: '30px', height: '30px', lineHeight: '1' }}
                            onClick={() => handleActionClick(currency)}
                        >
                            {isCurrencyStarred ? '★' : '☆'}
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

    const rowsToRenderLowerTable = selectedCurrencies.length > 0 ? selectedCurrencies

        .map((currency, index) => {
            const numericChange = parseFloat(currency.change);
            // const isCurrencyStarred = selectedCurrencies.some(selectedCurrency => selectedCurrency.currency === currency.currency && selectedCurrency.isStarred);
            return (
                <tr
                    key={index}
                    className="cursor-pointer duration-300 hover:bg-gray-300"
                >
                    <td className="py-0.5 px-4 border-b text-center text-sm">
                        <button
                            className={`text-lg font-semibold p-2 rounded-md ml-2 text-black`}
                            style={{ width: '30px', height: '30px', lineHeight: '1' }}
                            onClick={() => handleActionClick(currency)}
                        >
                            ★
                        </button>
                    </td>
                    <td className="py-0.5 px-4 border-b text-center text-sm font-bold">{currency.currency}</td>
                    <td className="py-0.5 px-4 border-b text-center text-sm">{parseFloat(currency.rate).toFixed(2)}</td>
                    <td className={`py-1 px-4 border-b text-center text-sm ${numericChange < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {`${numericChange.toFixed(2)} % `}
                    </td>
                    <td className="hidden sm:table-cell">
                        <div className="flex justify-center items-center">
                            <LineChartDetay currencyKey={currency.currency} rate={currency.rate} change={currency.change} />
                        </div>
                    </td>
                </tr>
            );
        }) : [];


    const loadSelectedCurrenciesFromCookie = () => {
        if (initialLoad) {
            const storedSelectedCurrencies = Cookies.get('selectedCurrencies');

            if (storedSelectedCurrencies) {
                const parsedSelectedCurrencies = JSON.parse(storedSelectedCurrencies);

                parsedSelectedCurrencies.forEach((currency) => {
                    const currencySymbol = currency.currency;
                    const isStarred = currency.isStarred;

                    // console.log(`Currency: ${currencySymbol}, isStarred: ${isStarred}`);

                    // Check if the currency is already in selectedCurrencies
                    const isCurrencyAlreadySelected = selectedCurrencies.some((selectedCurrency) =>
                        selectedCurrency.currency === currencySymbol
                    );

                    // console.log(`Is currency already selected? ${isCurrencyAlreadySelected}`);

                    if (currencySymbolsSet.has(currencySymbol) && !isCurrencyAlreadySelected) {
                        const updatedCurrencyData = currencyData.map((dataCurrency) => {
                            if (dataCurrency.currency === currencySymbol) {
                                return {
                                    ...dataCurrency,
                                    isStarred: isStarred,
                                };
                            }
                            return dataCurrency;
                        });

                        setCurrencyData(updatedCurrencyData);
                    }

                    if (!isCurrencyAlreadySelected) {
                        if (isStarred) {
                            addSelectedCurrency(currency);
                        } else {
                            removeSelectedCurrency(currency);
                        }
                    }
                });

                setCurrencyData((prevData) => [...prevData]);
            }

            // setInitialLoad(false);
        }
    };

    return (
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
                    <table className="min-w-full border-gray-200 rounded-lg overflow-hidden text-center text-sm font-semibold">
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
                        <tbody>{rowsToRenderUpperTable}</tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    {Array.from({ length: Math.ceil(sortedData.length / itemsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 mx-1 border text-sm rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
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
                <table className="text-center text-sm font-semibold bg-white min-w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="py-2 px-4 border-b" style={{ width: '50px' }}></th>
                            <th className="py-2 px-4 border-b cursor-pointer" style={{ width: '80px' }}>Currency</th>
                            <th className="py-2 px-4 border-b cursor-pointer">Rate</th>
                            <th className="py-2 px-4 border-b cursor-pointer">Change</th>
                            <th className="py-2 px-4 border-b hidden sm:table-cell">Chart</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rowsToRenderLowerTable}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Forex4;
