import TopBar from "../components/layout/TopBar";
import {
    PlusCircle,
    UserPlus,
    ArrowRight,
    Home,
    History,
    Users,
    Settings
} from "lucide-react";

const teams = [
    {
        id: 1,
        name: "Varsity Football 2024",
        status: "In Season",
        started: "Sep 12, 2023",
        image:
            "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=800",
        members: [
            "https://i.pravatar.cc/40?img=1",
            "https://i.pravatar.cc/40?img=2",
            "https://i.pravatar.cc/40?img=3",
        ],
        extra: 24,
    },
    {
        id: 2,
        name: "Elite Basketball Club",
        status: "Off Season",
        started: "Jan 05, 2024",
        image:
            "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800",
        members: [
            "https://i.pravatar.cc/40?img=4",
            "https://i.pravatar.cc/40?img=5",
        ],
        extra: 12,
    },
];

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-7xl mx-auto">


            {/* Content */}
            <main className="flex-1 overflow-y-auto pb-24">

                {/* Hero */}
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
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"></div>

                        <div className="relative z-10 flex flex-col gap-3">
                            <span className="text-primary font-bold tracking-widest text-xs uppercase">
                                Premium Sports Tracking
                            </span>

                            <h1 className="text-white text-4xl font-black font-display">
                                Living History
                            </h1>

                            <p className="text-slate-300 text-sm max-w-[280px] mx-auto">
                                The elite platform for historical team tracking and
                                high-performance collaboration.
                            </p>
                        </div>

                        <div className="relative z-10 flex gap-3 w-full max-w-[300px]">
                            <button className="flex-1 rounded-lg h-12 bg-primary text-white font-bold">
                                Explore
                            </button>

                            <button className="flex-1 rounded-lg h-12 bg-white/10 border border-white/20 text-white font-bold">
                                Features
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="px-4 py-2 flex gap-3">

                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 p-4 border border-slate-700">
                        <PlusCircle className="text-primary" size={20} />
                        <span className="font-bold text-sm">Create Team</span>
                    </button>

                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-800 p-4 border border-slate-700">
                        <UserPlus className="text-primary" size={20} />
                        <span className="font-bold text-sm">Join Team</span>
                    </button>

                </div>

                {/* Active teams */}
                <div className="flex items-center justify-between px-4 pb-3 pt-6">
                    <h2 className="text-xl font-bold font-display">Active Teams</h2>
                    <button className="text-primary text-sm font-semibold">
                        See all
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-4">

                    {teams.map((team) => (
                        <div
                            key={team.id}
                            className="flex flex-col gap-4 rounded-xl bg-slate-800/50 border border-slate-700 p-4"
                        >
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wider">
                                        {team.status}
                                    </p>

                                    <p className="text-lg font-bold font-display">
                                        {team.name}
                                    </p>

                                    <p className="text-slate-400 text-xs">
                                        Started: {team.started}
                                    </p>
                                </div>

                                <div
                                    className="size-14 rounded-lg bg-cover bg-center"
                                    style={{ backgroundImage: `url(${team.image})` }}
                                ></div>

                            </div>

                            <div className="flex items-center justify-between">

                                <div className="flex -space-x-3 overflow-hidden">
                                    {team.members.map((m, i) => (
                                        <img
                                            key={i}
                                            src={m}
                                            className="size-8 rounded-full ring-2 ring-slate-800"
                                        />
                                    ))}

                                    <div className="flex items-center justify-center size-8 rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-slate-800">
                                        +{team.extra}
                                    </div>
                                </div>

                                <button className="flex items-center gap-1 rounded-lg px-4 py-2 bg-primary text-white text-xs font-bold">
                                    <span>Dashboard</span>
                                    <ArrowRight size={16} />
                                </button>

                            </div>
                        </div>
                    ))}

                </div>

            </main>

        </div>
    );
}