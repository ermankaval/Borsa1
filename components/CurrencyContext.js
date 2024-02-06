// CurrencyContext.js

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CurrencyContext = createContext();

const initialState = {
    selectedCurrencies: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_SELECTED_CURRENCY':
            return {
                ...state,
                selectedCurrencies: [...state.selectedCurrencies, action.payload],
            };
        case 'REMOVE_SELECTED_CURRENCY':
            return {
                ...state,
                selectedCurrencies: state.selectedCurrencies.filter(
                    (currency) => currency.currency !== action.payload.currency
                ),
            };
        default:
            return state;
    }
};

const CurrencyProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // localStorage'den seçili para birimleri yükleniyor
    useEffect(() => {
        const savedCurrencies = JSON.parse(localStorage.getItem('selectedCurrencies'));

        if (savedCurrencies) {
            // Nan değerlere sahip olanları filtrele
            const filteredCurrencies = savedCurrencies.filter(currency => !isNaN(parseFloat(currency.change)));

            dispatch({ type: 'SET_SELECTED_CURRENCIES', payload: filteredCurrencies });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedCurrencies', JSON.stringify(state.selectedCurrencies));
    }, [state.selectedCurrencies]);

    const addSelectedCurrency = (currency) => {
        dispatch({ type: 'ADD_SELECTED_CURRENCY', payload: currency });
    };

    const removeSelectedCurrency = (currency) => {
        dispatch({ type: 'REMOVE_SELECTED_CURRENCY', payload: currency });
    };

    const value = {
        selectedCurrencies: state.selectedCurrencies,
        addSelectedCurrency,
        removeSelectedCurrency,
        selectedCurrenciesCount: state.selectedCurrencies.length,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};


const useCurrencyContext = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrencyContext must be used within a CurrencyProvider');
    }
    return context;
};

export { CurrencyProvider, useCurrencyContext };
