// Navbar.js

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BiMenu } from 'react-icons/bi';
import Logo from './Logo';
import { useCurrencyContext } from './CurrencyContext';


const Navbar = () => {
    const { selectedCurrenciesCount } = useCurrencyContext();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleScroll = () => {
        const isScrolled = window.scrollY > 0;
        if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
        }
    };

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenuOutsideClick = useRef(null);

    const handleClickOutside = (event) => {
        if (closeMobileMenuOutsideClick.current && !closeMobileMenuOutsideClick.current.contains(event.target)) {
            setIsMobileMenuOpen(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [scrolled]);



    return (

        <nav className={`flex items-center justify-between p-4 ${scrolled ? 'bg-black' : ''} bg-black fixed w-full top-0 z-50`}>
            <div className='container flex justify-between items-center'>
                <Link href="/">
                    <Logo style={`h-12 w-[80px] ${scrolled ? 'text-white' : 'text-black'}`} />
                </Link>
                <ul className='hidden space-x-4 md:flex'>
                    <li className='headerLink'>
                        <Link href="/hakkında">
                            <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>Hakkında</span>
                        </Link>
                    </li>

                    <li className='headerLink'>
                        <Link href="/trendingNow">
                            <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>İletişim</span>
                        </Link>
                    </li>
                    <li className='headerLink'>
                        <Link href="/favorites">
                            <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>
                                Takip Listem ({selectedCurrenciesCount ? selectedCurrenciesCount : 0})
                            </span>
                        </Link>
                    </li>
                </ul>
                <div className="md:hidden" style={{ marginRight: '20px' }}>
                    <button
                        className="text-white focus:outline-none"
                        onClick={handleMobileMenuToggle}
                    >
                        <BiMenu className="h-6 w-6 cursor-pointer" />
                    </button>
                </div>
            </div>

            <div
                ref={closeMobileMenuOutsideClick}
                className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} fixed top-0 right-0 w-full h-full bg-black bg-opacity-70 overflow-y-auto`}
                style={{ maxWidth: '200px', margin: '0 auto', padding: '20px' }}
            >
                <ul className="flex flex-col space-y-3">
                    <li onClick={() => { handleMobileMenuToggle(); }}>
                        <Link href="/hakkında">
                            <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>Hakkında</span>
                        </Link>
                    </li>

                    <li onClick={() => { handleMobileMenuToggle(); }}>
                        <Link href="/trendingNow">
                            <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>İletişim</span>
                        </Link>
                    </li>
                    <li onClick={() => { handleMobileMenuToggle(); }}>
                        <Link href="/favorites">
                            <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>
                                Takip Listem ({selectedCurrenciesCount ? selectedCurrenciesCount : 0})
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>

    );
};

export default Navbar;
