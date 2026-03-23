import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { teamService } from "./teamService";

const TeamContext = createContext();

export function TeamProvider({ children }) {
    const { user } = useAuth();

    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTeams = async () => {
        if (!user) {
            setTeams([]);
            setTeam(null);
            setRole(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const userTeams = await teamService.getTeamsByUser(user.id);

            setTeams(userTeams);

            const selectedTeam = team
                ? userTeams.find(t => t.team_id === team.team_id) || userTeams[0]
                : userTeams[0] || null;

            setTeam(selectedTeam);
            setRole(selectedTeam?.role || null);
        } catch (err) {
            console.error("Error loading teams:", err);
            setTeams([]);
            setTeam(null);
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    const addTeam = (newTeam) => {
        setTeams(prev => [...prev, newTeam]);
        setTeam(newTeam);
        setRole(newTeam.role);
    };

    const removeTeam = (teamId) => {
        setTeams(prev => prev.filter(t => t.team_id !== teamId));
        if (team?.team_id === teamId) {
            const nextTeam = teams.find(t => t.team_id !== teamId) || null;
            setTeam(nextTeam);
            setRole(nextTeam?.role || null);
        }
    };

    const selectTeam = (t) => {
        setTeam(t);
        setRole(t?.role || null);
    };

    useEffect(() => {
        loadTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <TeamContext.Provider value={{ teams, team, role, loading, selectTeam, addTeam, removeTeam, reloadTeams: loadTeams }}>
            {children}
        </TeamContext.Provider>
    );
}

export function useTeam() {
    return useContext(TeamContext);
}