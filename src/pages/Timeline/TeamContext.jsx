import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { teamService } from "./teamService";

const TeamContext = createContext();

export function TeamProvider({ children }) {
    const { user } = useAuth();

    const [teams, setTeams] = useState([]);
    const [team, setTeam] = useState(null);
    const [role, setRole] = useState(null);
    const [activeFrom, setActiveFrom] = useState(null);
    const [activeTo, setActiveTo] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadTeams = async () => {
        if (!user) {
            setTeams([]);
            setTeam(null);
            setRole(null);
            setActiveFrom(null);
            setActiveTo(null);
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
            setActiveFrom(selectedTeam?.active_from || null);
            setActiveTo(selectedTeam?.active_to || null);
        } catch (err) {
            console.error("Error loading teams:", err);
            setTeams([]);
            setTeam(null);
            setRole(null);
            setActiveFrom(null);
            setActiveTo(null);
        } finally {
            setLoading(false);
        }
    };

    const addTeam = (newTeam) => {
        setTeams(prev => [...prev, newTeam]);
        setTeam(newTeam);
        setRole(newTeam.role);
        setActiveFrom(newTeam.active_from || null);
        setActiveTo(newTeam.active_to || null);
    };

    const removeTeam = (teamId) => {
        setTeams(prev => prev.filter(t => t.team_id !== teamId));
        if (team?.team_id === teamId) {
            const nextTeam = teams.find(t => t.team_id !== teamId) || null;
            setTeam(nextTeam);
            setRole(nextTeam?.role || null);
            setActiveFrom(nextTeam?.active_from || null);
            setActiveTo(nextTeam?.active_to || null);
        }
    };

    const selectTeam = (t) => {
        setTeam(t);
        setRole(t?.role || null);
        setActiveFrom(t?.active_from || null);
        setActiveTo(t?.active_to || null);
    };

    useEffect(() => {
        loadTeams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <TeamContext.Provider value={{ teams, team, role, activeFrom, activeTo, loading, selectTeam, addTeam, removeTeam, reloadTeams: loadTeams }}>
            {children}
        </TeamContext.Provider>
    );
}

export function useTeam() {
    return useContext(TeamContext);
}