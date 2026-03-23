import { Home, History, MessageCircle, User, PlusCircle, Bell, Users, PlusSquare, Settings } from "lucide-react";
import { useTeam } from "../pages/Timeline/TeamContext";
import { useAuth } from "../pages/Auth/AuthContext";

export default function BottomNav({ current, setPage }) {

    const { role } = useTeam();
    const { user } = useAuth();

    const Item = ({ icon, label, page }) => (
        <button
            onClick={() => setPage(page)}
            className={`flex flex-col items-center text-xs gap-1 ${current === page ? "text-primary" : "text-slate-500"
                }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-slate-800">

            <div className="flex justify-around items-center h-16">

                <Item
                    icon={<Home size={22} />}
                    label="My Teams"
                    page="dashboard"
                />

                <Item
                    icon={<Users size={22} />}
                    label="TimeLine"
                    page="timeline"
                />

                {user && (
                    <Item
                        icon={<PlusSquare size={22} />}
                        label="Crear"
                        page="newpost"
                    />
                )}

                {role == "creator" && (
                    <Item
                        icon={<Settings size={22} />}
                        label="Ajustes"
                        page="teamAdmin"
                    />
                )}

                {role == "captain" && (
                    <Item
                        icon={<Bell size={22} />}
                        label={"Foro"}
                        page="forum"
                    />
                )}

                <Item
                    icon={<User size={22} />}
                    label="Perfil"
                    page="profile"
                />

            </div>

        </nav>
    );
}