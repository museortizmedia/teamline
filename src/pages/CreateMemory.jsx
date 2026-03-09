import {
    X,
    ImagePlus,
    Calendar,
    ChevronDown,
    Bold,
    Italic,
    Link,
    AtSign,
    Trophy,
    Users,
    Lock,
    Send
} from "lucide-react";
import TopBar from "../components/layout/TopBar";

export default function CreateMemory() {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col overflow-hidden max-w-7xl mx-auto">

            <main className="flex flex-col flex-1 pb-10">

                {/* Upload progress */}

                <div className="flex flex-col gap-3 p-4 bg-primary/10 mb-2">

                    <div className="flex justify-between">
                        <p className="text-sm font-medium">
                            Uploading 3 Media Files...
                        </p>

                        <p className="text-primary text-xs font-bold">
                            45%
                        </p>
                    </div>

                    <div className="rounded-full bg-slate-700 h-1.5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: "45%" }}
                        />
                    </div>

                </div>

                {/* Media Gallery */}

                <section className="p-4">

                    <div className="flex justify-between mb-3">
                        <h3 className="text-sm font-bold uppercase">
                            Media Gallery
                        </h3>

                        <span className="text-xs text-slate-400">
                            3 of 10
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">

                        <button className="aspect-square rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-800 transition">

                            <ImagePlus className="text-slate-400" />

                            <span className="text-[10px] text-slate-400">
                                Add More
                            </span>

                        </button>

                    </div>

                </section>

                {/* Date */}

                <section className="px-4 py-2 space-y-4">

                    <div className="space-y-1.5">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Memory Date
                        </label>

                        <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">

                            <Calendar className="text-primary mr-3" />

                            <div className="flex-1">
                                <p className="text-sm">
                                    October 24, 2023
                                </p>
                                <p className="text-[10px] text-slate-500 italic">
                                    Within team lifespan
                                </p>
                            </div>

                            <ChevronDown className="text-slate-400" />

                        </div>

                    </div>

                    {/* Description */}

                    <div className="space-y-1.5">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Description
                        </label>

                        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">

                            <div className="flex gap-2 p-2 border-b border-slate-700 bg-slate-900/50">

                                <button>
                                    <Bold size={18} />
                                </button>

                                <button>
                                    <Italic size={18} />
                                </button>

                                <button>
                                    <Link size={18} />
                                </button>

                                <button className="ml-auto">
                                    <AtSign size={18} />
                                </button>

                            </div>

                            <textarea
                                className="w-full bg-transparent text-sm placeholder-slate-500 p-3 outline-none"
                                placeholder="Describe the moment..."
                                rows="4"
                            />

                        </div>

                    </div>

                    {/* Milestone */}

                    <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-3 border border-slate-700">

                        <div className="flex items-center gap-3">

                            <div className="size-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                <Trophy className="text-yellow-500" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Tag as Milestone
                                </p>

                                <p className="text-[10px] text-slate-500">
                                    Pinned to timeline
                                </p>

                            </div>

                        </div>

                        <div className="w-12 h-6 bg-primary rounded-full relative">

                            <div className="absolute right-1 top-1 size-4 bg-white rounded-full" />

                        </div>

                    </div>

                    {/* Visibility */}

                    <div className="space-y-1.5">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Role Visibility
                        </label>

                        <div className="grid grid-cols-2 gap-2">

                            <button className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-primary bg-primary/5 text-primary">

                                <Users size={18} />

                                <span className="text-xs font-bold">
                                    Everyone
                                </span>

                            </button>

                            <button className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-700 bg-slate-800/50 text-slate-400">

                                <Lock size={18} />

                                <span className="text-xs font-bold">
                                    Staff Only
                                </span>

                            </button>

                        </div>

                    </div>

                </section>

            </main>

            {/* Footer */}
            <footer className="p-4 border-t border-slate-800">

                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">

                    <Send size={18} />

                    Share to Timeline

                </button>

            </footer>

        </div>
    );
}