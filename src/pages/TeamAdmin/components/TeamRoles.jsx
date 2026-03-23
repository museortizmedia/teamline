import { useState, useEffect } from "react";
import { teamService } from "../../Timeline/teamService";

export default function TeamRoles({ team }) {
    const [members, setMembers] = useState([]);

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

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold font-display">Role Management</h2>
            {members.map(m => (
                <div key={m.user_id} className="flex justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <span>{m.username}</span>
                    {m.role === "creator" ? (
                        <span className="text-white bg-primary rounded-lg py-1 px-2 text-sm ">Fundador</span>
                    ) : (
                        <select
                            value={m.role}
                            onChange={(e) => changeRole(m.user_id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm"
                        >
                            <option value="manager">Manager</option>
                            <option value="coach">Entrenador</option>
                            <option value="captain">Caitán</option>
                            <option value="member">Miembro</option>
                        </select>
                    )}
                </div>
            ))}
        </div>
    );
}