import React, { useState, useEffect } from 'react';

const Forex5 = () => {
    const [forexData, setForexData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

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
                        .filter(currency => currency !== null && !isNaN(parseFloat(currency.change)));

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
    };

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Currency</th>
                        <th className="py-2 px-4 border-b">Rate</th>
                        <th className="py-2 px-4 border-b">Change</th>
                    </tr>
                </thead>
                <tbody>
                    {forexData.map((currency, index) => (
                        <tr
                            key={currency.currency}
                            className={`group ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} ${selectedRows.includes(index) ? 'bg-green-500' : ''
                                }`}
                            onClick={() => handleRowClick(index)}
                        >
                            <td className="py-2 px-4 border-b group-hover:bg-gray-300">
                                {currency.currency}
                            </td>
                            <td className="py-2 px-4 border-b group-hover:bg-gray-300">{currency.rate}</td>
                            <td className="py-2 px-4 border-b group-hover:bg-gray-300">{currency.change}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Selected Rows Table */}
            <h2 className="mt-4 mb-2 text-lg font-semibold">Selected Rows</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Currency</th>
                        <th className="py-2 px-4 border-b">Rate</th>
                        <th className="py-2 px-4 border-b">Change</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedRows.map((selectedIndex) => {
                        const selectedCurrency = forexData[selectedIndex];

                        if (selectedCurrency) {
                            return (
                                <tr
                                    key={selectedCurrency.currency}
                                    className="bg-green-500"
                                >
                                    <td className="py-2 px-4 border-b">{selectedCurrency.currency}</td>
                                    <td className="py-2 px-4 border-b">{selectedCurrency.rate}</td>
                                    <td className="py-2 px-4 border-b">{selectedCurrency.change}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleRemoveClick(selectedIndex)}>Remove</button>
                                    </td>
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
