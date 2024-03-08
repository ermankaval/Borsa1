// src/Login.js

import React, { useContext } from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../components/firebase";
import { useRouter } from 'next/router';



const Login = () => {
    const router = useRouter();

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="logo-container">
            </div>
            <p></p>
            <p></p>
            <h2>Admin Paneli</h2>
            {/* <p>Google hesabınızla giriş yapınız</p> */}
            <button className="google-login-btn" onClick={handleGoogle}>
                Google hesabınızla giriş yapınız
            </button>
        </div>
    );
};

export default Login;
