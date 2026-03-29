import { Home, User, Bell, Users, PlusSquare, Settings } from "lucide-react";
import { useTeam } from "../pages/Timeline/TeamContext";
import { useAuth } from "../pages/Auth/AuthContext";

export default function BottomNav({ current, setPage }) {

    const { role, team } = useTeam();
    const { user } = useAuth();

    // ===============================
    // Definición estructurada de items
    // ===============================
    const navItems = [
        {
            icon: <Home size={22} />,
            label: "Teams",
            page: "dashboard"
        },
        {
            icon: <Users size={22} />,
            label: "Timeline",
            page: "timeline",
            action: () => window.location.href = `/t/${team?.team_id}`
        },
        user && {
            icon: <PlusSquare size={22} />,
            label: "Crear",
            page: "newpost"
        },
        role === "creator"
            ? {
                icon: <Settings size={22} />,
                label: "Ajustes",
                page: "teamAdmin"
            }
            : role === "captain"
                ? {
                    icon: <Bell size={22} />,
                    label: "Foro",
                    page: "forum"
                }
                : null,
        {
            icon: <User size={22} />,
            label: "Perfil",
            page: "profile"
        }
    ].filter(Boolean);

    // ===============================
    // Item reutilizable
    // ===============================
    const Item = ({ icon, label, page, action }) => (
        <button
            onClick={() => action ? action() : setPage(page)}
            className={`
                flex flex-col items-center justify-center
                w-full h-full gap-1 text-xs
                transition-colors
                ${current === page ? "text-primary" : "text-slate-500 hover:text-slate-300"}
            `}
        >
            {icon}
            <span className="truncate max-w-[70px]">{label}</span>
        </button>
    );

    // ===============================
    // Render
    // ===============================
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-slate-800 z-50">

            <div
                className="grid items-center h-16 text-center"
                style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
            >
                {navItems.map((item, i) => (
                    <Item key={i} {...item} />
                ))}
            </div>

        </nav>
    );
}