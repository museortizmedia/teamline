import { useState, useRef, useEffect } from "react";
import {
    Bell,
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

            <div className="flex items-center" onClick={() => {
                setPage("teams");
                setOpen(false);
            }}>
                <div className="bg-[#256af4]/20 flex items-center justify-center rounded-full w-10 h-10 border border-[#256af4]/30">
                    <Trophy className="text-[var(--color-primary)] w-5 h-5" />
                </div>
            </div>

            {/* Title */}

            <h1 className="text-lg font-bold text-center flex-1 font-display" onClick={() => {
                setPage("teams");
                setOpen(false);
            }}>
                Team Hub
            </h1>

            {/* Actions */}

            <div className="flex items-center gap-3 relative" ref={menuRef}>

                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800">
                    <Bell className="w-5 h-5" />
                </button>

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