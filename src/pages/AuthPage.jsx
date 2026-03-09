import { useState } from "react";
import {
    UserPlus,
    LogIn,
    Mail,
    Lock,
    User
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function AuthPage() {

    const { login, register } = useAuth();

    const [mode, setMode] = useState("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === "login") {
            login(email, password);
        } else {
            register({ email, password, username });
        }
    };

    return (

        <div className="min-h-screen bg-background-dark text-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">

                {/* Title */}

                <div className="text-center mb-6">

                    <h1 className="text-3xl font-black font-display">
                        Team Hub
                    </h1>

                    <p className="text-sm text-slate-400 mt-2">
                        {mode === "login"
                            ? "Access your team timeline"
                            : "Create your account"}
                    </p>

                </div>

                {/* Toggle */}

                <div className="flex bg-slate-800 rounded-lg p-1 mb-6">

                    <button
                        onClick={() => setMode("login")}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${mode === "login"
                                ? "bg-primary text-white"
                                : "text-slate-400"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setMode("register")}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${mode === "register"
                                ? "bg-primary text-white"
                                : "text-slate-400"
                            }`}
                    >
                        Register
                    </button>

                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {mode === "register" && (

                        <div className="space-y-1">

                            <label className="text-xs font-bold uppercase text-slate-400 px-1">
                                Username
                            </label>

                            <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3">

                                <User className="text-primary mr-3" size={18} />

                                <input
                                    type="text"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-transparent outline-none text-sm flex-1"
                                    required
                                />

                            </div>

                        </div>

                    )}

                    {/* Email */}

                    <div className="space-y-1">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Email
                        </label>

                        <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3">

                            <Mail className="text-primary mr-3" size={18} />

                            <input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-transparent outline-none text-sm flex-1"
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}

                    <div className="space-y-1">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Password
                        </label>

                        <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3">

                            <Lock className="text-primary mr-3" size={18} />

                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-transparent outline-none text-sm flex-1"
                                required
                            />

                        </div>

                    </div>

                    {/* Submit */}

                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">

                        {mode === "login"
                            ? <LogIn size={18} />
                            : <UserPlus size={18} />
                        }

                        {mode === "login"
                            ? "Login"
                            : "Create Account"}

                    </button>

                </form>

                {/* Switch */}

                <div className="text-center pt-4">

                    <button
                        className="text-sm text-primary hover:underline"
                        onClick={() =>
                            setMode(mode === "login" ? "register" : "login")
                        }
                    >

                        {mode === "login"
                            ? "Don't have an account? Create one"
                            : "Already have an account? Login"}

                    </button>

                </div>

            </div>

        </div>
    );
}