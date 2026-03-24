import { useState, useRef, useEffect } from "react";
import {
    LogOut,
    Settings,
    User,
    PlusCircle,
    ChevronDown,
    LogIn,
    UserPlus,
    Home,
    DownloadIcon,
    Contact,
    MessageCircle,
    HelpCircle
} from "lucide-react";

import { useAuth } from "../pages/Auth/AuthContext";
import { useTeam } from "../pages/Timeline/TeamContext";

import defaultAvatar from "../assets/default-avatar.webp";
import defaultTeam from "../assets/default-avatar.webp";
import { roleConfig } from "../config/roles";
import RoleBadge from "./RoleBadge";
import { usePWAInstall } from "../hooks/usePWAInstall";

export default function TopBar({ setPage }) {

    //PWA
    const { isInstallable, installApp } = usePWAInstall();

    const { logout, profile } = useAuth();
    const { team, teams, selectTeam } = useTeam();

    const [menuOpen, setMenuOpen] = useState(false);
    const [teamMenuOpen, setTeamMenuOpen] = useState(false);

    const menuRef = useRef();
    const teamMenuRef = useRef();

    const isAuth = !!profile;

    const activeRole = team?.role || null;

    useEffect(() => {
        const handleClick = (e) => {
            if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
            if (!teamMenuRef.current?.contains(e.target)) setTeamMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md bg-[#101622]/80 border-b border-slate-800 text-white">

            <div className="max-w-7xl mx-auto w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                {/* LEFT */}
                <div className="flex justify-start min-w-0">

                    {!isAuth && (
                        <div className="flex items-center gap-2">
                            {isInstallable && (
                                <button
                                    onClick={installApp}
                                    className="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white flex flex-row items-center gap-2"
                                >
                                    <DownloadIcon size={16} />
                                    <span className="hidden sm:block">Instalar</span>
                                </button>
                            )}

                            <button
                                onClick={() => setPage("auth", { defaultMode: "register" })}
                                className="px-3 py-1.5 text-sm rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white flex flex-row items-center gap-2"
                            >
                                <UserPlus size={16} />
                                <span className="hidden sm:block">Registrarse</span>
                            </button>

                        </div>
                    )}

                    {isAuth && (
                        <div className="relative w-auto max-w-[260px]" ref={teamMenuRef}>

                            {!team && (
                                <button
                                    onClick={() => setPage("createTeam")}
                                    className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-lg hover:bg-gray-500"
                                >
                                    <PlusCircle className="w-5 h-5 text-white" />
                                </button>
                            )}

                            {team && (
                                <button
                                    onClick={() => setTeamMenuOpen(!teamMenuOpen)}
                                    className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-xl hover:bg-slate-700 w-full sm:w-auto"
                                >
                                    <img
                                        src={team.team_pic || defaultTeam}
                                        className="w-8 h-8 rounded-md object-cover shrink-0"
                                    />

                                    <div className="hidden sm:flex flex-col flex-1 min-w-0 leading-tight">
                                        <span className="text-sm font-semibold self-start">
                                            {team.name}
                                        </span>

                                        {activeRole && roleConfig[activeRole] && (
                                            <RoleBadge role={activeRole} />
                                        )}
                                    </div>

                                    <ChevronDown size={16} className="opacity-70 shrink-0" />
                                </button>
                            )}

                            {teamMenuOpen && (
                                <div className="absolute top-12 left-0 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">

                                    {teams?.map(t => (
                                        <button
                                            key={t.team_id}
                                            onClick={() => {
                                                selectTeam(t);
                                                setTeamMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-slate-800"
                                        >
                                            <img
                                                src={t.team_pic || defaultTeam}
                                                className="w-7 h-7 rounded-md object-cover shrink-0"
                                            />

                                            <div className="flex flex-col items-start flex-1 min-w-0">
                                                <span className="text-sm truncate w-full">{t.name}</span>

                                                {t.role && (
                                                    <RoleBadge role={t.role} />
                                                )}
                                            </div>
                                        </button>
                                    ))}

                                    <div className="border-t border-slate-800" />

                                    <button
                                        onClick={() => {
                                            setPage("createTeam");
                                            setTeamMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-slate-800"
                                    >
                                        <PlusCircle size={16} />
                                        Crear equipo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* CENTER */}
                <div className="flex justify-center pointer-events-none">
                    <div
                        className="flex items-center cursor-pointer pointer-events-auto"
                        onClick={() => setPage(isAuth ? "dashboard" : "auth")}
                    >
                        {/* LOGO */}
                        {"/TeamLineLogoBlack.png" && (
                            <img
                                src="/TeamLineLogoBlack.png"
                                className="h-8 mr-2 pointer-events-auto"
                            />
                        )}

                        {/* TEXTO */}
                        <span className={`text-lg font-bold font-display ${"/TeamLineLogoBlack.png" ? "hidden sm:block" : "block"} `}>
                            TeamLine
                        </span>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex justify-end min-w-0">

                    {/* 🔓 MODO NO AUTENTICADO */}
                    {!isAuth && (
                        <div className="flex items-center gap-2">

                            <button
                                onClick={() => setPage("auth", { defaultMode: "login" })}
                                className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex flex-row items-center gap-2"
                            >
                                <LogIn size={16} />
                                <span className="hidden sm:block">Iniciar Sesión</span>
                            </button>

                            <button
                                onClick={() => window.open('https://wa.me/573197293775', '_blank')}
                                className="px-3 py-1.5 text-sm rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex flex-row items-center gap-2"
                            >
                                <MessageCircle size={16} />
                                <span className="hidden sm:block">Contacto</span>
                            </button>



                        </div>
                    )}

                    {/* 🔐 MODO AUTENTICADO */}
                    {isAuth && (
                        <div className="flex items-center gap-3 relative" ref={menuRef}>

                            {/* TEXTO → solo desktop */}
                            <span className="flex text-sm flex-col items-end">
                                <span className="text-white font-semibold">
                                    {profile?.display_name || ""}
                                </span>
                                <span className="text-slate-400">
                                    @{profile?.username || ""}
                                </span>
                            </span>

                            {/* AVATAR → siempre visible */}
                            <button onClick={() => setMenuOpen(!menuOpen)}>
                                <img
                                    src={profile?.profile_pic || defaultAvatar}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-primary)]"
                                />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-16 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">

                                    <button
                                        onClick={() => {
                                            setPage("profile");
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                                    >
                                        <User size={16} />
                                        Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPage("teams");
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                                    >
                                        <Home size={16} />
                                        My Teams
                                    </button>

                                    <button
                                        onClick={() => {
                                            setPage("teamAdmin");
                                            setMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                                    >
                                        <Settings size={16} />
                                        Manage Teams
                                    </button>

                                    <button
                                        onClick={() => window.open('https://wa.me/573197293775', '_blank')}
                                        className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                                    >
                                        <HelpCircle size={16} />
                                        Soporte
                                    </button>

                                    {isInstallable && (
                                        <button
                                            onClick={installApp}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-slate-800"
                                        >
                                            <DownloadIcon size={16} />
                                            Instalar
                                        </button>
                                    )}

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
                    )}

                </div>
            </div>
        </header>
    );
}