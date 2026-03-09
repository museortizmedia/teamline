import {
    ArrowLeft,
    ShieldCheck,
    Users,
    Crown,
    ChevronDown,
    Target,
    Filter,
    MessageCircle,
    Eye,
    Brain,
    History,
    Home,
    MessageSquare,
    Clock,
    User,
    SquarePen
} from "lucide-react";

export default function ForumPage() {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col overflow-hidden max-w-7xl mx-auto">

            {/* ROLE FILTER */}
            <div className="flex gap-3 p-4 overflow-x-auto border-b border-slate-800">
                <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-primary px-4 shadow-lg shadow-primary/20">
                    <Users className="text-white" size={16} />
                    <p className="text-white text-sm font-medium">
                        All Roles
                    </p>
                </button>

                <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-card-dark border border-yellow-500/30 px-4">
                    <Crown className="text-yellow-400" size={16} />
                    <p className="text-sm font-medium">
                        Captains
                    </p>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                <button className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-card-dark border border-slate-400/30 px-4">
                    <Target className="text-slate-300" size={16} />
                    <p className="text-sm font-medium">
                        Coaches
                    </p>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>
            </div>


            {/* TIMELINE */}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-2">

                <div className="flex items-center justify-between mb-6">

                    <h3 className="text-xl font-bold tracking-tight">
                        Legacy View
                        <span className="text-slate-500 font-normal text-sm ml-2">
                            1995 — 2024
                        </span>
                    </h3>

                    <Filter className="text-slate-500 cursor-pointer" />

                </div>

                {/* ITEM 1 */}

                <div className="grid grid-cols-[48px_1fr] gap-x-4">

                    <div className="flex flex-col items-center">

                        <div className="flex items-center justify-center size-10 rounded-full bg-card-dark border-2 border-yellow-400 shadow-lg shadow-yellow-500/10">

                            <Crown className="text-yellow-400" />

                        </div>

                        <div className="w-[2px] bg-gradient-to-b from-yellow-400/40 to-slate-800 h-full my-2" />

                    </div>

                    <div className="flex flex-col pb-10">

                        <div className="flex justify-between items-start mb-1">

                            <p className="text-base font-semibold">
                                2023 Captain's Strategy Report
                            </p>

                            <span className="text-[11px] font-medium text-slate-500 uppercase">
                                Oct 24
                            </span>

                        </div>

                        <p className="text-yellow-400 text-xs font-medium mb-3">
                            Marcus Aurelius • Captain
                        </p>

                        <div className="bg-card-dark/50 p-4 rounded-xl border border-slate-800">

                            <p className="text-slate-400 text-sm italic">
                                "Leadership is not a title; it is the responsibility of holding the standard when the team is tired."
                            </p>

                            <div className="flex gap-4 mt-4 text-slate-500">

                                <span className="flex items-center gap-1 text-xs">
                                    <MessageCircle size={14} />
                                    12
                                </span>

                                <span className="flex items-center gap-1 text-xs">
                                    <Eye size={14} />
                                    45
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ITEM 2 */}

                <div className="grid grid-cols-[48px_1fr] gap-x-4">

                    <div className="flex flex-col items-center">

                        <div className="flex items-center justify-center size-10 rounded-full bg-card-dark border-2 border-slate-400 shadow-lg shadow-slate-400/10">

                            <Brain className="text-slate-300" />

                        </div>

                        <div className="w-[2px] bg-slate-800 h-full my-2" />

                    </div>

                    <div className="flex flex-col pb-10">

                        <div className="flex justify-between items-start mb-1">

                            <p className="text-base font-semibold">
                                Vision & Mentorship Guide
                            </p>

                            <span className="text-[11px] font-medium text-slate-500 uppercase">
                                Aug 23
                            </span>

                        </div>

                        <p className="text-slate-400 text-xs font-medium mb-3">
                            Sarah Jenkins • Head Coach
                        </p>

                        <div className="bg-card-dark/50 p-4 rounded-xl border border-slate-800">

                            <p className="text-slate-400 text-sm">
                                Integrated a new rotation system focusing on transition speed.
                            </p>

                        </div>

                    </div>

                </div>

                {/* ITEM 3 */}

                <div className="grid grid-cols-[48px_1fr] gap-x-4 opacity-60">

                    <div className="flex flex-col items-center">

                        <div className="flex items-center justify-center size-10 rounded-full bg-card-dark border border-slate-700">

                            <History className="text-slate-400" />

                        </div>

                        <div className="w-[2px] bg-slate-800 h-full my-2" />

                    </div>

                    <div className="flex flex-col pb-10">

                        <div className="flex justify-between mb-1">

                            <p className="text-base font-semibold">
                                Post-Championship Insight 2022
                            </p>

                            <span className="text-[11px] text-slate-500 uppercase">
                                May 22
                            </span>

                        </div>

                        <p className="text-xs text-slate-500 mb-3">
                            Elena Rodriguez • Former Captain
                        </p>

                        <div className="bg-card-dark/30 p-4 rounded-xl border border-slate-800">

                            <p className="text-slate-500 text-sm">
                                The legacy continues. Listen to the bench, they see what the starters cannot.
                            </p>

                        </div>

                    </div>

                </div>

            </main>


            {/* FLOAT BUTTON */}
            <button className="fixed bottom-20 right-8 size-14 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40">
                <SquarePen size={24} />
            </button>

        </div>
    );
}