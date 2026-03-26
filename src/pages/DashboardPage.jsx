import {
    PlusCircle,
    UserPlus,
    ArrowRight,
    PlusSquare,
    Eye,
} from "lucide-react";

import { useTeam } from "./Timeline/TeamContext";
import TeamModal from "./Timeline/TeamModal";
import TeamJoinModal from "./Timeline/TeamJoinModal";
import { useState } from "react";
import { useAuth } from "./Auth/AuthContext";

export default function Dashboard({ setPage }) {

    const { teams, selectTeam, role, reloadTeams } = useTeam();
    const { profile, user } = useAuth();

    const [openCreate, setOpenCreate] = useState(false);
    const [openJoin, setOpenJoin] = useState(false);
    const [openPost, setOpenPost] = useState(false);

    /* ---------- safe states ---------- */

    const isLoading = teams === null;
    const safeTeams = Array.isArray(teams) ? teams : [];

    const hasTeams = safeTeams.length > 0;
    const showViewAll = safeTeams.length > 3;

    const visibleTeams = safeTeams.slice(0, 3);

    // Agrupados
    function transformTeams(data, currentUserId) {
        const map = new Map();

        data.forEach((item) => {
            const team = item.teams;
            const profile = item.profiles;

            if (!map.has(team.team_id)) {
                map.set(team.team_id, {
                    team_id: team.team_id,
                    name: team.name,
                    team_pic: team.team_pic,
                    foundation_date: team.foundation_date,
                    members: [],
                    totalMembers: 0,
                    role: item.role // luego lo ajustamos
                });
            }

            const teamEntry = map.get(team.team_id);

            // contar miembros
            teamEntry.totalMembers += 1;

            // guardar fotos
            if (profile?.profile_pic) {
                teamEntry.members.push(profile.profile_pic);
            }

            // guardar el rol del usuario actual
            if (profile.user_id === currentUserId) {
                teamEntry.role = item.role;
            }
        });

        // post-procesar
        return Array.from(map.values()).map((team) => ({
            ...team,
            members: team.members.slice(0, 4),
            extra: Math.max(0, team.totalMembers - 4)
        }));
    }




    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-7xl mx-auto">

            <main className="flex-1 overflow-y-auto pb-24">

                {/* HERO */}

                <div className="p-4">

                    <div
                        className="relative flex min-h-[320px] flex-col gap-6 overflow-hidden rounded-xl items-center justify-center p-6 text-center shadow-2xl"
                        style={{
                            backgroundImage:
                                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuDiPw8BqoSw8QdswgwWUsCmys_QgwJA0470Na09EcO1Qe4m6zfPSocPSbovUcJheKSZA2ArccUKjNgzlXnYVdqSzYMmuK8AwCt1OWj2WrHjrlWo9Jj6EaSjv2zGCmUyZqOOjPEOhv0ZN8q_ckgfNBGn5jmc8tbgLXVN1JdljJ7QeOmwazqeZkgYyQISsWBkOmkGNouCdPzrCTuHyyreM8VB17ZwLma5Om1l7Y05kdoFMluR0VoWxNBvClFNRYFthxUyh77F7c3mdUxV)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >

                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black"></div>

                        <div className="relative z-10 flex flex-col gap-3">

                            <span className="text-white font-bold tracking-widest text-xs uppercase">
                                Conéctate con tu equipo
                            </span>

                            <h1 className="text-primary text-4xl font-black font-display">
                                Vive la experiencia Teamline
                            </h1>

                            <p className="text-slate-300 text-sm max-w-xl mx-auto">
                                Descubre equipos, comparte momentos y colabora para crear un timeline que todos recordarán.
                            </p>

                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full max-w-2xl">

                            {!hasTeams ? (
                                <>
                                    <button
                                        onClick={() => setOpenCreate(true)}
                                        className="flex-1 rounded-lg h-12 bg-primary text-white font-bold flex items-center justify-center gap-2 p-2"
                                    >
                                        <PlusCircle size={20} />
                                        Crear Team
                                    </button>
                                    <button
                                        onClick={() => setOpenJoin(true)}
                                        className="flex-1 rounded-lg h-12 bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-2 p-2"
                                    >
                                        <UserPlus size={20} />
                                        Unirse
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setPage("timeline")}
                                        className="flex-1 rounded-lg h-12 bg-primary text-white font-bold flex items-center justify-center gap-2 p-2"
                                    >
                                        <Eye size={20} />
                                        Ver Timeline
                                    </button>
                                    <button
                                        onClick={() => setPage("newpost")}
                                        className="flex-1 rounded-lg h-12 bg-white/10 border border-white/20 text-white font-bold flex items-center justify-center gap-2 p-2"
                                    >
                                        <PlusSquare size={20} />
                                        Crear Publicación
                                    </button>
                                </>
                            )}




                        </div>

                    </div>

                </div>

                {/* QUICK ACTIONS */}

                <div className="px-4 py-2 flex gap-3">

                    <button
                        onClick={() => setOpenCreate(true)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 p-4 border border-slate-700"
                    >
                        <PlusCircle className="text-primary" size={20} />
                        <span className="font-bold text-sm">Crear Team</span>
                    </button>

                    <button
                        onClick={() => setOpenJoin(true)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 p-4 border border-slate-700"
                    >
                        <UserPlus className="text-primary" size={20} />
                        <span className="font-bold text-sm">Unirse a un Team</span>
                    </button>

                </div>

                {/* HEADER */}

                <div className="flex items-center justify-between px-4 pb-3 pt-6">

                    <h2 className="text-xl font-bold font-display">
                        Tus Teams
                    </h2>

                    {showViewAll && (
                        <button className="text-primary text-sm font-semibold">
                            Ver todos
                        </button>
                    )}

                </div>

                {/* LOADING */}

                {isLoading && (

                    <div className="px-4 text-slate-400 text-sm">
                        Cargando equipos...
                    </div>

                )}

                {/* EMPTY */}

                {!isLoading && !hasTeams && (

                    <div className="flex flex-col gap-4 px-4">
                        <p className="text-center text-slate-400">
                            Únete o crea un equipo.
                        </p>
                    </div>

                )}

                {/* TEAMS */}

                {hasTeams && (

                    <div className="flex flex-col gap-4 px-4">

                        {visibleTeams.map((team) => (

                            <div
                                key={team.team_id || team.id}
                                className="flex flex-col gap-4 rounded-xl bg-slate-800/50 border border-slate-700 p-4"
                            >

                                <div className="flex justify-between items-start">

                                    <div>

                                        {team.status && (
                                            <p className="text-slate-400 text-xs uppercase tracking-wider">
                                                {team.status}
                                            </p>
                                        )}

                                        <p className="text-lg font-bold font-display">
                                            {team.name}
                                        </p>

                                        {team.foundation_date && (
                                            <p className="text-slate-400 text-xs">
                                                Fundado: {team.foundation_date}
                                            </p>
                                        )}

                                    </div>

                                    <div
                                        className="size-14 rounded-lg bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${team.team_pic || "/default-team.png"})`
                                        }}
                                    />

                                </div>

                                <div className="flex items-center justify-between">

                                    <div className="flex -space-x-3 overflow-hidden">

                                        {(team.members || []).slice(0, 4).map((m, i) => (
                                            <img
                                                key={i}
                                                src={m}
                                                className="size-8 rounded-full ring-2 ring-slate-800"
                                            />
                                        ))}

                                        {team.extra > 0 && (
                                            <div className="flex items-center justify-center size-8 rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-slate-800">
                                                +{team.extra}
                                            </div>
                                        )}

                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { selectTeam(team); setPage("teamAdmin"); }}
                                            className="flex items-center gap-1 rounded-lg px-4 py-2 bg-primary text-white text-xs font-bold">
                                            <span>Ajustes</span>
                                            <ArrowRight size={16} />
                                        </button>

                                        <button
                                            onClick={() => { selectTeam(team); setPage("timeline", { teamId: team.team_id }); }}
                                            className="flex items-center gap-1 rounded-lg px-4 py-2 bg-primary text-white text-xs font-bold">
                                            <span>Timeline</span>
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

            <TeamModal
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
            />

            <TeamJoinModal
                isOpen={openJoin}
                onClose={() => setOpenJoin(false)}
                userId={user.id}
                onJoined={() => { reloadTeams(); }}
            />

        </div>
    );

}