import React, { useState, useEffect } from 'react';
import Pagination from './Pagination';
import { getFirestore, doc, setDoc, addDoc, getDocs, collection, deleteDoc, where, query } from 'firebase/firestore';
import { db, auth } from '../components/firebase';

const Forex5 = () => {
    const [forexData, setForexData] = useState([]);
    const [selectedRows, setSelectedRows] = useState({});
    const [currentPageTop, setCurrentPageTop] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            // Forex verilerini al
            const url = 'https://finans.truncgil.com/v4/today.json';
            const options = { method: 'GET', headers: {} };
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
            return data;
        } catch (error) {
            console.error(error);
        }
    };

    const initializeData = async () => {
        try {
            // Forex verilerini al
            const data = await fetchData();

            const user = auth.currentUser;
            if (user) {
                // Firestore'dan favori verileri al
                const favoritesData = await loadFavoritesFromFirestore();

                // Favori sembolleri bir nesne olarak sakla
                const favoritesObj = {};
                favoritesData.forEach((favorite) => {
                    favoritesObj[favorite.symbol] = true;
                });

                // Favori sembolleri state'e ayarla
                setSelectedRows(favoritesObj);
            } else {
                console.error('User not logged in');
            }
        } catch (error) {
            console.error('Error initializing data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await initializeData();
            }
        });

        return unsubscribe;
    }, []);

    const loadFavoritesFromFirestore = async () => {
        const data = [];
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const db = getFirestore();
                const favoritesCollectionRef = collection(db, 'forex');
                const q = query(favoritesCollectionRef, where('userId', '==', userId));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });
            } else {
                console.error('User not logged in');
            }

            return data;
        } catch (error) {
            console.error('Error getting Firestore data:', error);
            throw error;
        }
    };

    const handleRowClick = async (currency) => {
        try {
            const updatedSelectedRows = { ...selectedRows };

            // Toggle favori durumunu güncelle
            if (selectedRows[currency]) {
                delete updatedSelectedRows[currency];
                await removeFavoriteFromFirestore(currency);
            } else {
                updatedSelectedRows[currency] = true;
                await saveFavoriteToFirestore(currency);
            }

            // State'i güncelle
            setSelectedRows(updatedSelectedRows);
        } catch (error) {
            console.error('Error handling row click:', error);
        }
    };

    const removeFavoriteFromFirestore = async (symbol) => {
        try {
            const db = getFirestore();
            const favoritesCollectionRef = collection(db, 'forex');
            const q = query(favoritesCollectionRef, where('userId', '==', auth.currentUser.uid), where('symbol', '==', symbol));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log('Document successfully deleted!');
            });
        } catch (error) {
            console.error('Error removing data from Firestore:', error);
        }
    };

    const saveFavoriteToFirestore = async (symbol) => {
        try {
            const db = getFirestore();
            const favoritesCollectionRef = collection(db, 'forex');
            await addDoc(favoritesCollectionRef, { userId: auth.currentUser.uid, symbol });
            console.log('Document successfully written!');
        } catch (error) {
            console.error('Error saving data to Firestore:', error);
        }
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredRows = forexData.filter((row) =>
        row.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastRow = currentPageTop * perPage;
    const indexOfFirstRow = indexOfLastRow - perPage;
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

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

            <div className="flex justify-start mb-4">
                <input
                    type="text"
                    placeholder="Forex Symbol..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border p-2 rounded text-sm h-8"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Add to Fav</th>
                        <th className="py-2 px-4 border-b text-left">Currency</th>
                        <th className="py-2 px-4 border-b text-left">Rate</th>
                        <th className="py-2 px-4 border-b text-left">Change (%)</th>
                        <th className="py-2 px-4 border-b text-left">Direction</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRows.map((currency, index) => (
                        <tr
                            key={currency.currency}
                            className={`group hover:bg-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                            onClick={() => handleRowClick(currency.currency)}
                        >
                            <td className="py-2 px-4 border-b text-left">
                                <span className={selectedRows[currency.currency] ? 'full-star' : 'empty-star'}></span>
                            </td>
                            <td className="py-2 px-4 border-b text-left text-sm">{currency.currency}</td>
                            <td className="py-2 px-4 border-b text-left text-sm">{currency.rate}</td>
                            <td className={`py-2 px-4 border-b text-left font-bold text-sm  ${parseFloat(currency.change) === 0 ? 'text-blue-500' : getTriangleColor(currency.change)}`}>
                                {`% ${currency.change}`}
                            </td>
                            <td className={`py-2 px-4 border-b text-left ${getTriangleColor(currency.change)}`}>{parseFloat(currency.change) < 0 ? '▼' : parseFloat(currency.change) > 0 ? '▲' : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <Pagination
                perPage={perPage}
                totalRows={filteredRows.length}
                currentPage={currentPageTop}
                paginate={paginate}
            />


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
                    {Object.entries(selectedRows).map(([currency, isSelected], index) => {
                        const selectedCurrency = forexData.find((data) => data.currency === currency);

                        if (selectedCurrency) {
                            return (
                                <tr
                                    key={selectedCurrency.currency}
                                    className={`hover:bg-gray-300 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                                    onClick={() => handleRowClick(selectedCurrency.currency)}
                                >
                                    <td className="py-2 px-4 border-b text-left">
                                        <span className={isSelected ? "full-star" : "empty-star"}></span>
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
