import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Logo from "./Logo";

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
                        onClick={() => signIn("google")}
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
