// components/Counter.js
import React, { useState, useEffect } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Cookie'den değeri al ve setCount ile güncelle
        const savedCount = parseInt(getCookie('counter'), 10);
        setCount(isNaN(savedCount) ? 0 : savedCount);
    }, []); // Boş bağımlılık dizisi, sadece ilk render'da çalışmasını sağlar

    useEffect(() => {
        // count değiştiğinde cookie'yi güncelle
        document.cookie = `counter=${count}; path=/`;
    }, [count]);

    const increment = () => {
        setCount((prevCount) => prevCount + 1);
    };

    const decrement = () => {
        setCount((prevCount) => prevCount - 1);
    };

    return (
        <div className="flex items-center p-4 bg-gray-200">
            <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={increment}>
                +
            </button>
            <p className="text-xl">{count}</p>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                onClick={decrement}>
                -
            </button>
        </div>
    );
};

const getCookie = (name) => {
    if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(`${name}=`)) {
                return cookie.substring(name.length + 1);
            }
        }
    }
    return null;
};

export default Counter;
