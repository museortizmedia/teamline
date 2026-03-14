import { useState, useRef, useEffect } from "react";
import {
    LogOut,
    Trophy,
    Settings,
    Users,
    User
} from "lucide-react";

import { useAuth } from "../auth/AuthContext";

export default function TopBar({ setPage }) {

    const { logout, user } = useAuth();

    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    const activeRole = user?.role || "admin"; // admin | capitan | manager | coach

    // Configuration for role-based styling
    const roleConfig = {
        capitan: { bg: "bg-yellow-500", text: "text-gray-800" },
        admin: { bg: "bg-blue-700/40", text: "text-blue-600" },
        manager: { bg: "bg-green-500/40", text: "text-green-600" },
        default: { bg: "bg-white/40", text: "text-white" },
    };

    useEffect(() => {

        const handleClick = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () =>
            document.removeEventListener("mousedown", handleClick);

    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 backdrop-blur-md bg-[#101622]/80 border-b border-slate-800 text-white">

            {/* Logo */}
            <div
                className="flex items-center cursor-pointer"
                onClick={() => setPage("rolePanel")}
                title={`Rol: ${activeRole}`}
            >
                <div
                    className={`flex items-center justify-center rounded-[10px] w-10 h-10 ${roleConfig[activeRole]?.bg || roleConfig.default.bg}`}
                >
                    <Trophy
                        className={`w-5 h-5 ${roleConfig[activeRole]?.text || roleConfig.default.text}`}
                    />
                </div>
            </div>

            {/* Title */}
            <div className="flex-1 flex items-center justify-center cursor-pointer" onClick={() => { setPage("teams"); setOpen(false); }}>
                <img src="/TeamLineLogoBlack.png" alt="TeamLine Logo" className="h-8 w-auto mr-2" />
                <span className="text-lg font-bold font-display">TeamLine</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative" ref={menuRef}>
                <button
                    onClick={() => setOpen(!open)}
                >
                    <img
                        src={user?.avatar || "https://i.pravatar.cc/100"}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
                    />
                </button>

                {open && (

                    <div className="absolute -right-2 top-16 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">

                        <button
                            onClick={() => {
                                setPage("profile");
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                        >
                            <User size={16} />
                            Profile
                        </button>

                        <button
                            onClick={() => {
                                setPage("teams");
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                        >
                            <Users size={16} />
                            My Teams
                        </button>

                        <button
                            onClick={() => {
                                setPage("teamAdmin");
                                setOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                        >
                            <Settings size={16} />
                            Manage Teams
                        </button>

                        <div className="border-t border-slate-800" />

                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-slate-800"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                    </div>

                )}

            </div>

        </header>
    );
}