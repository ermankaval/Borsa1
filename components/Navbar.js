// Navbar.js

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { BiMenu } from 'react-icons/bi';
import Logo from './Logo';
import { CurrencyProvider, useCurrencyContext } from './CurrencyContext';
import { useRouter } from 'next/router';
// import firebase from '../components/firebase';
import { auth } from '../components/firebase';





const Navbar = () => {
    const { selectedCurrenciesCount } = useCurrencyContext();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const [userName, setUserName] = useState(null);

    const getUserName = () => {
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName);
        }
    };

    useEffect(() => {
        getUserName();
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/login');
            console.log('User signed out');
        } catch (error) {
            console.error('Sign out error:', error.message);
        }
    };

    return (
        <CurrencyProvider>
            <nav className={`flex items-center justify-between p-4 ${scrolled ? 'bg-black' : ''} bg-black fixed w-full top-0 z-40`}>
                {/* Removed the container class */}
                <div className='flex justify-between items-center w-full'>
                    <Link href="/">
                        <div className="flex items-center">
                            <Logo
                                style={`h-12 w-[80px] ${scrolled ? 'text-white' : 'text-black'}`}
                            />
                            {userName && <span className="ml-2 text-white">{userName}</span>}
                        </div>
                    </Link>


                    <ul className='hidden space-x-4 md:flex'>
                        <li className='headerLink'>
                            <Link href="/Gallery">
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
                        <li onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>
                            <span className={`cursor-pointer text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>Logout</span>
                        </li>
                    </ul>
                    <div className="md:hidden" style={{ marginRight: '20px' }}>
                        <button
                            className="text-white focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <BiMenu className="h-6 w-6 cursor-pointer" />
                        </button>
                    </div>
                </div>

                <div
                    className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} fixed top-0 right-0 w-full h-full bg-black bg-opacity-70 overflow-y-auto`}
                    style={{ maxWidth: '200px', margin: '0 auto', padding: '20px' }}
                >
                    <ul className="flex flex-col space-y-3">
                        <li onClick={() => { setIsMobileMenuOpen(false); }}>
                            <Link href="/hakkında">
                                <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>Hakkında</span>
                            </Link>
                        </li>

                        <li onClick={() => { setIsMobileMenuOpen(false); }}>
                            <Link href="/trendingNow">
                                <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>İletişim</span>
                            </Link>
                        </li>
                        <li onClick={() => { setIsMobileMenuOpen(false); }}>
                            <Link href="/favorites">
                                <span className={`text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>
                                    Takip Listem ({selectedCurrenciesCount ? selectedCurrenciesCount : 0})
                                </span>
                            </Link>
                        </li>
                        <li onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>
                            <span className={`cursor-pointer text-white ${scrolled ? 'hover:text-gray-300' : 'hover:text-gray-800'}`}>Logout</span>
                        </li>
                    </ul>
                </div>
            </nav>
        </CurrencyProvider>
    );
};

export default Navbar;
