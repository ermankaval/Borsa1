import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, auth } from '../components/firebase';


const Forex5 = () => {
    const [forexData, setForexData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPageTop, setCurrentPageTop] = useState(1);
    const [perPage, setPerPage] = useState(10);



    useEffect(() => {
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
                        .filter((currency) => currency !== null && !isNaN(parseFloat(currency.change)));

                    setForexData(data || []);
                } else {
                    console.error('Invalid response format or missing data');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Load selected rows from localStorage on component mount
        const storedSelectedRows = JSON.parse(localStorage.getItem('selectedRows')) || [];
        setSelectedRows(storedSelectedRows);
    }, []);

    const handleRowClick = (index) => {
        const updatedSelectedRows = [...selectedRows];

        const selectedIndex = updatedSelectedRows.indexOf(index);

        if (selectedIndex === -1) {
            // If not already selected, add to the array
            updatedSelectedRows.push(index);
        } else {
            // If already selected, remove from the array
            updatedSelectedRows.splice(selectedIndex, 1);
        }

        setSelectedRows(updatedSelectedRows);

        // Save selected rows to localStorage
        localStorage.setItem('selectedRows', JSON.stringify(updatedSelectedRows));
        saveFavoritesToFirestore(); // Save favorites to Firestore
    };

    const handleRemoveClick = (index) => {
        const updatedSelectedRows = [...selectedRows];

        // Remove the selected index from the array
        const selectedIndex = updatedSelectedRows.indexOf(index);
        if (selectedIndex !== -1) {
            updatedSelectedRows.splice(selectedIndex, 1);
        }

        setSelectedRows(updatedSelectedRows);

        // Save selected rows to localStorage
        localStorage.setItem('selectedRows', JSON.stringify(updatedSelectedRows));
        saveFavoritesToFirestore(); // Save favorites to Firestore
    };

    const getTriangleColor = (change) => {
        const changeValue = parseFloat(change);

        if (changeValue > 0) {
            return 'text-green-500'; // Yeşil üçgen yukarı bakar
        } else if (changeValue < 0) {
            return 'text-red-500'; // Kırmızı üçgen aşağı bakar
        } else {
            return 'text-blue-500'; // Mavi eşittir işareti
        }
    };

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setCurrentPageTop(1);
    };

    useEffect(() => {
        const db = getFirestore();


        const loadFavoritesFromFirestore = async () => {
            const data = [];
            try {
                const querySnapshot = await getDocs(collection(db, 'forex'));

                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });
                return data;
            } catch (error) {
                console.error('Error getting Firestore data:', error);
                throw error;
            }
        };

    }, [auth.currentUser]); // Make sure to add any dependencies if needed

    const saveFavoritesToFirestore = async (data) => {
        try {
            console.log(auth.currentUser.uid)
            const querySnapshot = await getDocs(collection(db, 'forex'));
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            return data;

        } catch (error) {
            console.error('Error saving data to Firestore:', error);
        }
    };


    const indexOfLastRow = currentPageTop * perPage;
    const indexOfFirstRow = indexOfLastRow - perPage;
    const currentRows = forexData.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => {
        setCurrentPageTop(pageNumber);
    };

    return (
        <div>
            <div className="flex justify-start mb-4 mt-10">
                <label className="mr-2 text-sm">Rows per page:</label>
                <select
                    value={perPage}
                    onChange={handlePerPageChange}
                    className="border p-2 rounded text-sm h-8"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                </select>
            </div>

            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Add to Fav</th>
                        <th className="py-2 px-4 border-b text-left">Currency</th>
                        <th className="py-2 px-4 border-b text-left">Rate</th>
                        <th className="py-2 px-4 border-b text-left">Change (%)</th>
                        <th className="py-2 px-4 border-b text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((currency, index) => (
                        <tr
                            key={currency.currency}
                            className={`group hover:bg-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} ${selectedRows.includes(indexOfFirstRow + index) ? 'selected-row' : ''}`}
                            onClick={() => handleRowClick(indexOfFirstRow + index)}
                        >
                            <td className="py-2 px-4 border-b text-left">
                                {selectedRows.includes(indexOfFirstRow + index) ? <span className="full-star"></span> : <span className="empty-star"></span>}
                            </td>
                            <td className="py-2 px-4 border-b text-left text-sm">{currency.currency}</td>
                            <td className="py-2 px-4 border-b text-left text-sm">{currency.rate}</td>
                            <td className={`py-2 px-4 border-b text-left font-bold text-sm ${parseFloat(currency.change) === 0 ? 'text-blue-500' : getTriangleColor(currency.change)}`}>
                                {`% ${currency.change}`}
                            </td>
                            <td className={`py-2 px-4 border-b text-left ${getTriangleColor(currency.change)}`}>{parseFloat(currency.change) < 0 ? '▼' : parseFloat(currency.change) > 0 ? '▲' : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                perPage={perPage}
                totalRows={forexData.length}
                currentPage={currentPageTop}
                paginate={setCurrentPageTop}
            />

            {/* Selected Rows Table */}
            <h2 className="mt-4 mb-2 text-lg font-semibold">Takip Listem</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Favorites</th>
                        <th className="py-2 px-4 border-b text-left">Currency</th>
                        <th className="py-2 px-4 border-b text-left">Rate</th>
                        <th className="py-2 px-4 border-b text-left">Change (%)</th>
                        <th className="py-2 px-4 border-b text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {selectedRows.map((selectedIndex, selectedRowIndex) => {
                        const selectedCurrency = forexData[selectedIndex];

                        if (selectedCurrency) {
                            return (
                                <tr
                                    key={selectedCurrency.currency}
                                    className={`hover:bg-gray-300 ${selectedRowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                                    onClick={() => handleRemoveClick(selectedIndex)}
                                >
                                    <td className="py-2 px-4 border-b text-left">
                                        {selectedRows.includes(selectedIndex) ? <span className="full-star"></span> : <span className="empty-star"></span>}
                                    </td>
                                    <td className="py-2 px-4 border-b text-left text-sm">{selectedCurrency.currency}</td>
                                    <td className="py-2 px-4 border-b text-left text-sm">{selectedCurrency.rate}</td>
                                    <td className={`py-2 px-4 border-b text-left font-bold text-sm  ${parseFloat(selectedCurrency.change) === 0 ? 'text-blue-500' : getTriangleColor(selectedCurrency.change)}`}>
                                        {`% ${selectedCurrency.change}`}
                                    </td>
                                    <td className={`py-2 px-4 border-b text-left ${getTriangleColor(selectedCurrency.change)}`}>{parseFloat(selectedCurrency.change) < 0 ? '▼' : parseFloat(selectedCurrency.change) > 0 ? '▲' : '-'}</td>
                                </tr>
                            );
                        }

                        return null;
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Forex5;
