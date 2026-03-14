import { useState, useEffect } from "react";
import {
    UserPlus,
    LogIn,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../auth/AuthContext";

export default function AuthPage() {

    const { loading, login, register } = useAuth();

    const [mode, setMode] = useState("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(""), 4000);
        return () => clearTimeout(timer);
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "register" && password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden");
            setMessageType("error");
            return;
        }

        try {

            if (mode === "login") {
                await login(email, password);
            } else {
                await register({ email, password, username });
            }

        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        }
    };

    return (

        <div className="min-h-screen bg-background-dark text-slate-100 flex items-center justify-center px-4">

            {!loading ? (
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">

                    {/* TITLE */}

                    <div className="text-center mb-6">

                        <h1 className="text-3xl font-black font-display">
                            TeamLine
                        </h1>

                        <p className="text-sm text-slate-400 mt-2">
                            {mode === "login"
                                ? "Ingresa para conectar con tu equipo"
                                : "Crea tu cuenta"}
                        </p>

                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`p-3 mb-4 rounded-md text-sm font-medium ${messageType === "error"
                                    ? "bg-red-600 text-white"
                                    : "bg-green-600 text-white"
                                    }`}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* TOGGLE */}

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

                    <motion.form
                        layout
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* USERNAME */}

                        <AnimatePresence>

                            {mode === "register" && (

                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-1 overflow-hidden"
                                >

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

                                </motion.div>

                            )}

                        </AnimatePresence>


                        {/* EMAIL */}

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

                        {/* PASSWORD */}

                        <div className="space-y-1">

                            <label className="text-xs font-bold uppercase text-slate-400 px-1">
                                Password
                            </label>

                            <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3">

                                <Lock className="text-primary mr-3" size={18} />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={showPassword ? "" : "••••••••"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-transparent outline-none text-sm flex-1"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    {showPassword
                                        ? <EyeOff size={18} />
                                        : <Eye size={18} />}
                                </button>

                            </div>

                        </div>

                        {/* CONFIRM PASSWORD */}

                        <AnimatePresence>

                            {mode === "register" && (

                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-1 overflow-hidden"
                                >

                                    <label className="text-xs font-bold uppercase text-slate-400 px-1">
                                        Confirm Password
                                    </label>

                                    <div className="flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3">

                                        <Lock className="text-primary mr-3" size={18} />

                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={showConfirmPassword ? "" : "••••••••"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="bg-transparent outline-none text-sm flex-1"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-slate-400 hover:text-white"
                                        >
                                            {showConfirmPassword
                                                ? <EyeOff size={18} />
                                                : <Eye size={18} />}
                                        </button>

                                    </div>

                                </motion.div>

                            )}

                        </AnimatePresence>

                        {/* SUBMIT */}

                        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">

                            {mode === "login"
                                ? <LogIn size={18} />
                                : <UserPlus size={18} />}

                            {mode === "login"
                                ? "Login"
                                : "Create Account"}

                        </button>

                    </motion.form>

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
            ) : (
                <p>Cargando...</p>
            )}
        </div>

    );
}