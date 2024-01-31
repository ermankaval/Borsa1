import React from "react";

const Logo = ({ style }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 30" width="150" height="50">
            <circle cx="25" cy="15" r="20" fill="blue" />
            <path d="M20 20 L75 0 L130 20 Z" fill="black" />
            <text x="60%" y="50%" fontSize="35" fill="white" textAnchor="middle" alignmentBaseline="middle">TradERMAN</text>
        </svg>

    );
};

export default Logo;
