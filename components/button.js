// components/Button.js

import React, { useEffect, useState } from 'react';

const Button = () => {
    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (buttonNumber) => {
        // Tıklanan düğmenin numarasını localStorage'da sakla
        localStorage.setItem('selectedButton', buttonNumber);
        // Seçili düğmeyi güncelle
        setSelectedButton(buttonNumber);
    };

    useEffect(() => {
        // Sayfa yenilendiğinde localStorage'dan seçili düğmeyi al
        const storedSelectedButton = localStorage.getItem('selectedButton');
        if (storedSelectedButton) {
            setSelectedButton(Number(storedSelectedButton));
        }
    }, []);

    return (
        <div className="flex p-4 border border-gray-300 rounded">
            <button
                className={`p-2 border border-gray-400 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-500 active:bg-gray-500 active:text-white ${selectedButton === 1 ? 'bg-green-500' : ''}`}
                onClick={() => handleButtonClick(1)}
            >
                Button 1
            </button>
            <button
                className={`p-2 border border-gray-400 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-500 active:bg-gray-500 active:text-white ${selectedButton === 2 ? 'bg-green-500' : ''}`}
                onClick={() => handleButtonClick(2)}
            >
                Button 2
            </button>
            <button
                className={`p-2 border border-gray-400 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-500 active:bg-gray-500 active:text-white ${selectedButton === 3 ? 'bg-green-500' : ''}`}
                onClick={() => handleButtonClick(3)}
            >
                Button 3
            </button>
            <button
                className={`p-2 border border-gray-400 rounded hover:bg-gray-200 focus:outline-none focus:ring focus:border-gray-500 active:bg-gray-500 active:text-white ${selectedButton === 4 ? 'bg-green-500' : ''}`}
                onClick={() => handleButtonClick(4)}
            >
                Button 4
            </button>
        </div>
    );
};

export default Button;
