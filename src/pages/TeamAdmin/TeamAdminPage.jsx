// pages/TeamAdminPage.jsx
import { useState } from "react";
import { Shield, Users, Clock, AlertTriangle, Database, Settings } from "lucide-react";
import { useTeam } from "../Timeline/TeamContext";
import TeamMembers from "./components/TeamMembers";
import TeamRoles from "./components/TeamRoles";
import TeamDataStructure from "./components/TeamDataStructure";
import TeamTimeline from "./components/TeamTimeline";



export default function TeamAdminPage() {
    const { team, role, loading } = useTeam();
    const [tab, setTab] = useState("members");
    const [deleteTeamModal, setDeleteTeamModal] = useState(false);

    if (loading) {
        return <div className="flex justify-center p-10">Cargando equipo...</div>;
    }

    if (!team) {
        return <div className="flex justify-center p-10 text-slate-400">No se seleccionó ningún equipo</div>;
    }

    if (role !== "creator") {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-slate-400">
                <h2 className="text-xl font-bold">Acceso restringido</h2>
                <p>Solo el creador del equipo puede acceder a este panel.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-7xl mx-auto">
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-2/6 md:w-1/6 border-r border-slate-800 p-4 space-y-2">
                    <h2 className="text-sm uppercase text-slate-400 font-bold mb-3 overflow-auto"> Ajustes de {team.name}</h2>

                    <button
                        onClick={() => setTab("timeline")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "timeline" ? "bg-primary/20 text-primary" : "hover:bg-slate-800"
                            }`}
                    >
                        <Clock size={18} />
                        <span className="hidden sm:block">Timeline</span>
                    </button>

                    <button
                        onClick={() => setTab("members")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "members" ? "bg-primary/20 text-primary" : "hover:bg-slate-800"
                            }`}
                    >
                        <Users size={18} />
                        <span className="hidden sm:block">Miembros</span>
                    </button>

                    <button
                        onClick={() => setTab("roles")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "roles" ? "bg-primary/20 text-primary" : "hover:bg-slate-800"
                            }`}
                    >
                        <Shield size={18} />
                        <span className="hidden sm:block">Roles</span>
                    </button>

                    <button
                        onClick={() => setTab("structure")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "structure" ? "bg-primary/20 text-primary" : "hover:bg-slate-800"
                            }`}
                    >
                        <Settings size={18} />
                        <span className="hidden sm:block">Ajustes</span>
                    </button>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6 overflow-y-auto space-y-6">
                    {tab === "timeline" && <TeamTimeline team={team} />}
                    {tab === "members" && <TeamMembers team={team} />}
                    {tab === "roles" && <TeamRoles team={team} />}
                    {tab === "structure" && <TeamDataStructure team={team} deleteTeamModal={deleteTeamModal} setDeleteTeamModal={setDeleteTeamModal} />}
                </main>
            </div>
        </div>
    );
}