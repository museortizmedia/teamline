import { useState, useEffect } from "react";
import { teamService } from "../../Timeline/teamService";
import { roleConfig } from "../../../config/roles";
import RoleBadge from "../../../components/RoleBadge";
import { Search } from "lucide-react";

export default function TeamRoles({ team }) {
    const [members, setMembers] = useState([]);
    const [filterQuery, setFilterQuery] = useState("");

    useEffect(() => {
        async function loadMembers() {
            const data = await teamService.getTeamMembers(team.team_id);
            setMembers(data);
        }
        loadMembers();
    }, [team]);

    const changeRole = async (userId, role) => {
        await teamService.changeMemberRole({ teamId: team.team_id, userId, role });
        setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role } : m));
    };

    const filteredMembers = members.filter(m =>
        (m.display_name?.toLowerCase() || "").includes(filterQuery.toLowerCase()) ||
        m.username.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Gestión de roles</h2>

            {/* Búsqueda */}
            <div className="relative w-full sm:w-64 mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar miembros..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                />
            </div>

            {/* Lista de miembros */}
            <div className="space-y-3">
                {filteredMembers.map((m) => {
                    const role = roleConfig[m.role] || roleConfig.member;

                    return (
                        <div
                            key={m.user_id}
                            className={`flex items-center gap-4 bg-slate-800/40 border-2 ${role.border} rounded-xl p-4 transition-all hover:border-slate-600`}
                        >
                            {/* Foto con borde según rol */}
                            <div className="flex-shrink-0">
                                <img
                                    src={m.profile_pic}
                                    alt={m.username}
                                    className={`h-20 w-20 rounded-full object-cover border-2 ${role.border}`}
                                />
                            </div>

                            {/* Info principal */}
                            <div className="flex-1 flex flex-col gap-1">
                                {/* Nombre y username */}
                                <div className="flex flex-col">
                                    <span className="text-base font-bold text-slate-50">
                                        {m.display_name || `@${m.username}`}
                                    </span>
                                    {m.display_name && (
                                        <span className="text-xs text-slate-400">@{m.username}</span>
                                    )}
                                </div>

                                {/* Badge de rol o select */}
                                {m.role === "creator" ? (
                                    <RoleBadge role={m.role} />
                                ) : (
                                    <select
                                        value={m.role}
                                        onChange={(e) => changeRole(m.user_id, e.target.value)}
                                        className="mt-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-50 transition-all hover:border-blue-400"
                                    >
                                        <option value="manager">Manager</option>
                                        <option value="coach">Entrenador</option>
                                        <option value="captain">Capitán</option>
                                        <option value="member">Miembro</option>
                                    </select>
                                )}

                                {/* Fechas activas */}
                                <div className="mt-2 flex gap-3 text-[10px] uppercase tracking-wider font-semibold">
                                    <div className="text-slate-500">
                                        Desde: <span className="text-slate-300">{m.active_from}</span>
                                    </div>
                                    <div className="text-slate-500">
                                        Hasta: <span className={m.active_to ? "text-slate-300" : "text-emerald-400"}>
                                            {m.active_to ? m.active_to : "Actualidad"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredMembers.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 text-sm">No se encontraron miembros para tu búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}