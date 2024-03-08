
import firebase from '../components/firebase';
import { FcGoogle } from "react-icons/fc";
import Logo from "./Logo";


// Your component code
const handleGoogleLogin = async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const response = await firebase.auth().signInWithPopup(provider);
        console.log('User logged in with Google:', response.user);
    } catch (error) {
        console.error('Google login error:', error.message);
    }
};


useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log('User is logged in:', user);
            // Perform actions for logged-in user
        } else {
            console.log('User is logged out');
            // Perform actions for logged-out user
        }
    });

    return () => unsubscribe(); // Cleanup the subscription on component unmount
}, []);


const Login = () => {
    return (
        <div className="login_bg_gradient bg-cover h-screen flex items-center justify-center">
            <div className="relative">
                <div className="bg-black p-10 space-y-6 rounded-md">
                    <div className="flex items-center justify-center">
                        <Logo />
                    </div>
                    <h2 className="text-3xl font-medium text-white"></h2>
                    <button
                        className="bg-white text-black flex gap-2 items-center mt-50 p-4 text-xl rounded-md"
                        onClick={() => handleGoogleLogin("google")}
                    >
                        <FcGoogle className="text-3xl" />
                        Sign In with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

