import { Home, History, MessageCircle, User, PlusCircle, Bell, Users, PlusSquare } from "lucide-react";

export default function BottomNav({ current, setPage }) {

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
                    label="Home"
                    page="dashboard"
                />

                <Item
                    icon={<Users size={22} />}
                    label="Teams"
                    page="timeline"
                />

                <Item
                    icon={<PlusSquare size={22} />}
                    label="Crear"
                    page="forum"
                />

                <Item
                    icon={<Bell size={22} />}
                    label="Actividad"
                    page="forum"
                />

                <Item
                    icon={<User size={22} />}
                    label="Perfil"
                    page="profile"
                />

            </div>

        </nav>
    );
}