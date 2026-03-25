import { useState, useEffect } from "react";
import { teamService } from "../../Timeline/teamService";
import { roleConfig } from "../../../config/roles";
import RoleBadge from "../../../components/RoleBadge";
import { Check, Pen, Search, X } from "lucide-react";
import defaultAvatar from "../../../assets/default-avatar.webp";

export default function TeamRoles({ team }) {

    const rolesCanEdit = ["creator", "captain", "coach", "manager"];

    const [members, setMembers] = useState([]);
    const [filterQuery, setFilterQuery] = useState("");

    // 🔥 estado de edición por usuario
    const [editingDates, setEditingDates] = useState({});
    const [tempDates, setTempDates] = useState({});

    useEffect(() => {
        async function loadMembers() {
            const data = await teamService.getTeamMembers(team.team_id);
            setMembers(data);
        }
        loadMembers();
    }, [team]);

    const changeRole = async (userId, role) => {
        await teamService.changeMemberRole({
            teamId: team.team_id,
            userId,
            role
        });

        setMembers(prev =>
            prev.map(m =>
                m.user_id === userId ? { ...m, role } : m
            )
        );
    };

    // 🔹 iniciar edición
    const startEditDates = (m) => {
        setEditingDates(prev => ({ ...prev, [m.user_id]: true }));
        setTempDates(prev => ({
            ...prev,
            [m.user_id]: {
                active_from: m.active_from,
                active_to: m.active_to
            }
        }));
    };

    // 🔹 cancelar edición
    const cancelEditDates = (userId) => {
        setEditingDates(prev => ({ ...prev, [userId]: false }));
    };

    // 🔹 guardar cambios
    const saveDates = async (userId) => {
        const values = tempDates[userId];

        // validación
        if (!values.active_from) {
            console.warn("active_from es obligatorio");
            return;
        }

        if (
            values.active_to &&
            new Date(values.active_to) < new Date(values.active_from)
        ) {
            console.warn("Fecha inválida");
            return;
        }

        await teamService.updateMemberDates({
            teamId: team.team_id,
            userId,
            ...values
        });

        setMembers(prev =>
            prev.map(m =>
                m.user_id === userId ? { ...m, ...values } : m
            )
        );

        setEditingDates(prev => ({ ...prev, [userId]: false }));
    };

    const filteredMembers = members.filter(m =>
        (m.display_name?.toLowerCase() || "").includes(filterQuery.toLowerCase()) ||
        m.username.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <section className="fixed top-[4.9rem] left-[33.3333%] md:left-[16.6667%] right-0 z-[100] px-6 bg-[#101622]/80 backdrop-blur-md border-b border-slate-800 ">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-xl font-bold font-display">Gestión de roles</h2>

                    {/* Búsqueda */}
                    <div className="mt-2 relative w-full sm:w-64 mb-3">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar miembros..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-xs"
                        />
                    </div>
                </div>
            </section>

            {/* Lista */}
            <div className="pt-5 space-y-3">
                {filteredMembers.map((m) => {
                    const role = roleConfig[m.role] || roleConfig.member;
                    const isEditing = editingDates[m.user_id];
                    const temp = tempDates[m.user_id] || {};

                    return (
                        <div
                            key={m.user_id}
                            className={`flex items-center gap-4 bg-slate-800/40 border-2 ${role.border} rounded-xl p-4`}
                        >

                            <img
                                src={m.profile_pic || defaultAvatar}
                                alt={m.username}
                                className={`h-20 w-20 rounded-full object-cover border-2 ${role.border}`}
                            />

                            <div className="flex-1 flex flex-col gap-1">
                                <div>
                                    <span className="text-base font-bold text-slate-50">
                                        {m.display_name || `@${m.username}`}
                                    </span>
                                    {m.display_name && (
                                        <div className="text-xs text-slate-400">@{m.username}</div>
                                    )}
                                </div>

                                {/* Rol */}
                                {isEditing ? (
                                    <select
                                        value={m.role}
                                        onChange={(e) =>
                                            changeRole(m.user_id, e.target.value)
                                        }
                                        className="mt-1 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs"
                                    >
                                        <option value="manager">Manager</option>
                                        <option value="coach">Entrenador</option>
                                        <option value="captain">Capitán</option>
                                        <option value="member">Miembro</option>
                                    </select>
                                ) : (
                                    <RoleBadge role={m.role} />
                                )}

                                {/* Fechas */}
                                <div className="mt-2 text-[10px] uppercase font-semibold text-slate-500 flex flex-wrap items-center gap-3">

                                    {!isEditing ? (
                                        <>
                                            <span>
                                                Desde: <span className="text-slate-300">{m.active_from}</span>
                                            </span>

                                            <span>
                                                Hasta:{" "}
                                                <span className={m.active_to ? "text-slate-300" : "text-emerald-400"}>
                                                    {m.active_to || "Actualidad"}
                                                </span>
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="date"
                                                value={temp.active_from || ""}
                                                onChange={(e) =>
                                                    setTempDates(prev => ({
                                                        ...prev,
                                                        [m.user_id]: {
                                                            ...prev[m.user_id],
                                                            active_from: e.target.value
                                                        }
                                                    }))
                                                }
                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-300"
                                            />

                                            <input
                                                type="date"
                                                value={temp.active_to || ""}
                                                onChange={(e) =>
                                                    setTempDates(prev => ({
                                                        ...prev,
                                                        [m.user_id]: {
                                                            ...prev[m.user_id],
                                                            active_to: e.target.value || null
                                                        }
                                                    }))
                                                }
                                                className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-300"
                                            />

                                            <button
                                                onClick={() => saveDates(m.user_id)}
                                                className="text-emerald-400 hover:underline ml-2 p-1 rounded-full hover:bg-emerald-500/10 transition-colors"
                                                title="Guardar"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => cancelEditDates(m.user_id)}
                                                className="text-red-400 hover:underline ml-2 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                                                title="Cancelar"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {(!isEditing && rolesCanEdit.includes(team.role) && m.role !== "creator") && (
                                <button
                                    onClick={() => startEditDates(m)}
                                    className="text-blue-400 hover:underline ml-2 p-1 rounded-full hover:bg-blue-500/10 transition-colors"
                                    title="Editar"
                                >
                                    <Pen className="h-4 w-4" />
                                </button>
                            )}

                        </div>
                    );
                })}

                {filteredMembers.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 text-sm">
                            No se encontraron miembros para tu búsqueda.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}