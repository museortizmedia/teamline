import { useState, useEffect } from "react";
import { Trash2, Check, X, Search } from "lucide-react";
import { teamService } from "../../Timeline/teamService";
import RoleBadge from "../../../components/RoleBadge";
import { roleConfig } from "../../../config/roles";
import defaultAvatar from "../../../assets/default-avatar.webp";

export default function TeamMembers({ team }) {

    const rolesCanDelete = ["creator", "captain", "coach", "manager"];

    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([{
        user_id: 1,
        username: "juanperez"
    },
    {
        user_id: 2,
        username: "maria_dev"
    }]);
    const [searchUser, setSearchUser] = useState("");
    const [filterQuery, setFilterQuery] = useState(""); // Nuevo estado para buscar en la lista local
    const [availableUsers, setAvailableUsers] = useState([]);
    const [confirmModal, setConfirmModal] = useState(null);

    useEffect(() => {
        async function loadMembers() {
            const teamMembers = await teamService.getTeamMembers(team.team_id);
            setMembers(teamMembers);

            //const teamRequests = await teamService.getJoinRequests(team.team_id);
            //setRequests(teamRequests);
        }
        loadMembers();
    }, [team]);

    async function inviteUser(username) {
        try {
            await teamService.inviteUser({ teamId: team.team_id, username });
            alert(`Invitation sent to ${username}`);
            setSearchUser("");
            setAvailableUsers([]);
        } catch (err) {
            console.error(err);
        }
    }

    async function searchAvailableUsers(query) {
        if (!query) return setAvailableUsers([]);
        const users = await teamService.searchUsersNotInTeam(team.team_id, query);
        setAvailableUsers(users);
    }

    async function removeMember(id) {
        try {
            await teamService.removeMember({ teamId: team.team_id, userId: id });
            setMembers(prev => prev.filter(m => m.user_id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    async function approveRequest(id) {
        await teamService.approveRequest({ teamId: team.team_id, userId: id });
        setRequests(prev => prev.filter(r => r.user_id !== id));
        const newMember = await teamService.getUserById(id);
        setMembers(prev => [...prev, newMember]);
    }

    async function rejectRequest(id) {
        await teamService.rejectRequest({ teamId: team.team_id, userId: id });
        setRequests(prev => prev.filter(r => r.user_id !== id));
    }

    // Lógica de filtrado de miembros actuales
    const filteredMembers = members.filter(m =>
        (m.display_name?.toLowerCase() || "").includes(filterQuery.toLowerCase()) ||
        m.username.toLowerCase().includes(filterQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* Head */}
            <section className="fixed top-[4.9rem] left-[33.3333%] md:left-[16.6667%] right-0 z-10 px-6 py-2 bg-[#101622]/80 backdrop-blur-md border-b border-slate-800 ">
                <h2 className="text-xl font-bold font-display">Miembros</h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-sm uppercase text-slate-400 font-semibold tracking-wider">Listado de miembros</h3>

                    {/* BUSCADOR DE MIEMBROS */}
                    <div className="relative group">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar miembros..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none w-full sm:w-64 transition-all"
                        />
                    </div>
                </div>
            </section>

            <div className="space-y-3 pt-10">
                {filteredMembers.map((m) => {
                    const role = roleConfig[m.role] || roleConfig.member; // fallback por si el rol no existe

                    return (
                        <div
                            key={m.user_id}
                            className={`bg-slate-800/40 border ${role.border} hover:border-slate-600 transition-all rounded-xl p-4 flex items-center gap-4`}
                        >
                            {/* Foto con anillo de color según rol */}
                            <div className="flex-shrink-0">
                                <img
                                    src={m.profile_pic || defaultAvatar}
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

                                {/* Rol con badge */}
                                <RoleBadge role={m.role} />

                                {/* Fechas activas */}
                                <div className="mt-2 flex gap-3 text-[10px] uppercase tracking-wider font-semibold">
                                    <div className="text-slate-500">
                                        Desde: <span className="text-slate-300">{m.active_from}</span>
                                    </div>
                                    <div className="text-slate-500">
                                        Hasta:{" "}
                                        <span className={m.active_to ? "text-slate-300" : "text-emerald-400"}>
                                            {m.active_to ? m.active_to : "Actualidad"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="self-start">
                                {/* Solo roles que pueden eliminar y que la tarjeta no sea del creador */}
                                {(m.role !== "creator" && rolesCanDelete.includes(team.role)) && (
                                    <button
                                        onClick={() =>
                                            setConfirmModal({
                                                title: `Remove Member ${m.username}?`,
                                                action: () => removeMember(m.user_id),
                                            })
                                        }
                                        className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredMembers.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                        <p className="text-slate-500 text-sm">No members found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Invite Member 
            <div className="space-y-2 pt-4 border-t border-slate-800">
                <label className="text-xs uppercase text-slate-400 font-semibold tracking-wider">Invitar miembros</label>
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <input
                            value={searchUser}
                            onChange={(e) => {
                                setSearchUser(e.target.value);
                                searchAvailableUsers(e.target.value);
                            }}
                            placeholder="Search new users to invite..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm focus:border-blue-500/50 outline-none transition-all"
                        />
                    </div>
                    {availableUsers.length > 0 && (
                        <ul className="bg-slate-800 border border-slate-700 rounded-xl p-2 max-h-40 overflow-y-auto shadow-xl">
                            {availableUsers.map(u => (
                                <li key={u.user_id} className="flex justify-between items-center p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                                    <span className="text-sm text-slate-200">{u.username}</span>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                                        onClick={() => inviteUser(u.username)}
                                    >
                                        Invite
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div> */}

            {/* SOLICITUDES 
                {requests.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm uppercase text-slate-400 font-semibold tracking-wider">Solicitudes</h3>
                        {requests.map(r => (
                            <div key={r.user_id} className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                                <span className="text-slate-200 font-medium">{r.username}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => approveRequest(r.user_id)} className="text-green-400 hover:bg-green-400/10 p-2 rounded-lg transition-colors">
                                        <Check size={18} />
                                    </button>
                                    <button onClick={() => rejectRequest(r.user_id)} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )} */}

            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
                        <p className="text-slate-200 text-center font-medium">{confirmModal.title}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => { confirmModal.action(); setConfirmModal(null); }}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}