import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDYqab497iIDxUA84uuFLPcUr-22XwaWrA",
    authDomain: "smart-shoreline-411006.firebaseapp.com",
    projectId: "smart-shoreline-411006",
    storageBucket: "smart-shoreline-411006.appspot.com",
    messagingSenderId: "494084813657",
    appId: "1:494084813657:web:ab5b470e0bcadc671d1248"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export default app


