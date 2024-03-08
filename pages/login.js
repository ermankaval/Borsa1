// src/Login.js

import React, { useContext } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../components/firebase';
import { useRouter } from 'next/router';
import Logo from '../components/Logo';

const Login = () => {
    const router = useRouter();

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="login-container flex flex-col items-center justify-center h-screen bg-black">
            <div className="logo-container  bg-black">
                <Logo style="h-12 w-[80px] text-white" />
            </div>
            <p></p>
            <p></p>
            {/* <h2>TradERMAN</h2> */}
            {/* <p>Google hesabınızla giriş yapınız</p> */}
            <button className="google-login-btn" onClick={handleGoogle}>
                <span className="flex items-center">
                    <img
                        src="/google-icon.png"
                        alt="Google Icon"
                        className="mr-2"
                        style={{ width: '20px', height: '20px' }}
                    />
                    Google hesabınızla giriş yapınız
                </span>
            </button>
            <style jsx>{`
        .google-login-btn {
          background-color: #4285f4; /* Google blue color */
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .google-login-btn:hover {
          background-color: #357ae8; /* Darker shade on hover */
        }

        .google-login-btn img {
          filter: brightness(0) invert(1); /* Invert the Google icon color */
        }
      `}</style>
        </div>
    );
};

export default Login;
