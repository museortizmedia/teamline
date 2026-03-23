import { useEffect, useState } from "react";
import { teamService } from "./teamService";
import { supabaseService } from "../../services/supabase/services/supabaseService";
import { Search } from "lucide-react";

export default function TeamJoinModal({ isOpen, onClose, userId, onJoined }) {
    const [search, setSearch] = useState("");
    const [availableTeams, setAvailableTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        async function fetchAvailableTeams() {
            setLoading(true);
            try {
                // Equipos del usuario
                const userTeams = await teamService.getTeamsByUser(userId);
                const userTeamIds = userTeams.map(t => t.team_id);

                // Buscar equipos por nombre
                const allTeams = search
                    ? await teamService.getTeamsByName(search)
                    : [];

                // Filtrar equipos donde ya es miembro
                const filtered = allTeams.filter(t => !userTeamIds.includes(t.team_id));

                // Agregar info del creador
                const enrichedTeams = await Promise.all(
                    filtered.map(async (t) => {
                        const creatorProfile = await supabaseService.db.getById("profiles", t.creator_id, "user_id");
                        return {
                            ...t,
                            creator_name: creatorProfile?.username || "Desconocido"
                        };
                    })
                );

                setAvailableTeams(enrichedTeams);
            } catch (err) {
                console.error("Error cargando equipos:", err);
                setAvailableTeams([]);
            } finally {
                setLoading(false);
            }
        }

        fetchAvailableTeams();
    }, [isOpen, userId, search]);

    const handleJoin = async (teamId) => {
        try {
            await teamService.joinTeam({ teamId, userId });
            onJoined?.();
            onClose();
        } catch (err) {
            console.error("Error unirse al equipo:", err);
        }
    };

    function parseDateYMD(dateString) {
        if (!dateString) return null;
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day); // mes empieza en 0
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Unirse a un Team</h2>

                {/* Buscador */}
                <div className="flex flex-col gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Nombre del team
                        </label>
                        <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                            <Search className="text-primary mr-3" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent outline-none text-sm flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Listado */}
                {loading ? (
                    <p className="text-slate-400 text-sm">Cargando...</p>
                ) : availableTeams.length === 0 ? (
                    <p className="text-slate-400 text-sm">No se encontraron teams.</p>
                ) : (
                    <ul className="space-y-2 max-h-80 overflow-y-auto">
                        {availableTeams.map(team => (
                            <li
                                key={team.team_id}
                                className="flex justify-between items-center bg-slate-800 p-2 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                                        style={{ backgroundImage: `url(${team.team_pic || "/default-team.png"})` }}
                                    />
                                    <div className="flex flex-col text-sm">
                                        <span className="font-bold">{team.name}</span>
                                        <span className="text-slate-400" title={team.foundation_date}>Fundado: {parseDateYMD(team.foundation_date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                                        <span className="text-slate-400" title={team.created_at}>Creado: {new Date(team.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                                        <span className="text-slate-400">Por: <span className="uppercase text-white">{team.creator_name}</span></span>
                                    </div>
                                </div>
                                <button
                                    className="bg-primary text-white px-3 py-1 rounded"
                                    onClick={() => handleJoin(team.team_id)}
                                >
                                    Unirse
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl w-full mt-5"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}