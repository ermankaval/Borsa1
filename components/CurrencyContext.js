// CurrencyContext.js
import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {

    const [selectedCurrencies, setSelectedCurrencies] = useState([]);

    const addSelectedCurrency = (currency) => {
        setSelectedCurrencies((prevCurrencies) => [...prevCurrencies, currency]);
    };

    const removeSelectedCurrency = (currency) => {
        setSelectedCurrencies((prevCurrencies) =>
            prevCurrencies.filter((c) => c.currency !== currency.currency)
        );
    };

    const selectedCurrenciesCount = selectedCurrencies.length;

    return (
        <CurrencyContext.Provider
            value={{
                selectedCurrencies,
                addSelectedCurrency,
                removeSelectedCurrency,
                selectedCurrenciesCount,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );

};

const useCurrencyContext = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrencyContext must be used within a CurrencyProvider");
    }
    return context;
};

export { CurrencyProvider, useCurrencyContext };
