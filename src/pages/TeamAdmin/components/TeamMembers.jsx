import { useState, useEffect } from "react";
import { Trash2, Check, X } from "lucide-react";
import { teamService } from "../../Timeline/teamService";

export default function TeamMembers({ team, userId }) {
    const [members, setMembers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [availableUsers, setAvailableUsers] = useState([]);
    const [confirmModal, setConfirmModal] = useState(null);

    useEffect(() => {
        async function loadMembers() {
            const teamMembers = await teamService.getTeamMembers(team.team_id);
            setMembers(teamMembers);

            const teamRequests = await teamService.getJoinRequests(team.team_id);
            setRequests(teamRequests);
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

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Members</h2>

            {/* Join Requests */}
            {requests.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm uppercase text-slate-400">Join Requests</h3>
                    {requests.map(r => (
                        <div key={r.user_id} className="flex justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                            <span>{r.username}</span>
                            <div className="flex gap-2">
                                <button onClick={() => approveRequest(r.user_id)} className="text-green-400">
                                    <Check size={18} />
                                </button>
                                <button onClick={() => rejectRequest(r.user_id)} className="text-red-400">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Member List */}
            <div className="space-y-3">
                {members.map(m => (
                    <div key={m.user_id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between">
                        <div>
                            <p className="font-semibold">@{m.username}</p>
                            <p className="text-xs text-slate-400">Rol: {m.role}</p>
                            <p className="text-xs text-slate-500">Activo desde {new Date(m.active_from).toLocaleDateString()}</p>
                        </div>
                        {m.role !== "creator" && (
                            <button
                                onClick={() =>
                                    setConfirmModal({
                                        title: `Remove Member ${m.username}?`,
                                        action: () => removeMember(m.user_id)
                                    })
                                }
                                className="text-red-400"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Invite Member */}
            <div className="space-y-2">
                <label className="text-xs uppercase text-slate-400">Invite Member</label>
                <div className="flex flex-col gap-2">
                    <input
                        value={searchUser}
                        onChange={(e) => {
                            setSearchUser(e.target.value);
                            searchAvailableUsers(e.target.value);
                        }}
                        placeholder="Search username"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm"
                    />
                    {availableUsers.length > 0 && (
                        <ul className="bg-slate-800/50 border border-slate-700 rounded-xl p-2 max-h-40 overflow-y-auto">
                            {availableUsers.map(u => (
                                <li key={u.user_id} className="flex justify-between items-center p-1">
                                    <span>{u.username}</span>
                                    <button className="bg-primary px-2 py-1 rounded" onClick={() => inviteUser(u.username)}>Invite</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-slate-900 p-6 rounded-xl space-y-4">
                        <p>{confirmModal.title}</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setConfirmModal(null)} className="bg-slate-700 px-4 py-2 rounded">Cancel</button>
                            <button onClick={() => { confirmModal.action(); setConfirmModal(null); }} className="bg-red-600 px-4 py-2 rounded">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}