import {
    Trophy,
    Dumbbell,
    PartyPopper,
    Share2,
    Heart,
    MessageCircle,
    Plus
} from "lucide-react";
import CreateMemoryPage from "./CreateMemory";
import { useState } from "react";

const moments = [
    {
        id: 1,
        type: "coach",
        icon: Trophy,
        title: "City League Champions!",
        text: "Hard work pays off. Unbelievable performance from the entire squad.",
        date: "Yesterday",
        role: "Head Coach",
        author: "Coach Miller",
        accent: "bg-amber-500",
        image:
            "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1200",
        avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
        id: 2,
        type: "captain",
        icon: Dumbbell,
        title: "Morning Drills",
        text: "Intensity was 100% today. We are ready for the weekend.",
        date: "Oct 24, 2023",
        role: "Team Captain",
        author: "Sarah Chen",
        accent: "bg-emerald-500",
        gallery: [
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800",
            "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800",
        ],
        avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
        id: 3,
        type: "admin",
        icon: PartyPopper,
        title: "Welcome Dinner 🍕",
        text: "Welcoming our newest strikers to the family.",
        date: "Oct 20, 2023",
        role: "Team Admin",
        author: "Elena Rodriguez",
        accent: "bg-primary",
        avatar: "https://i.pravatar.cc/40?img=20",
    },
];

export default function TimelinePage() {

    const [openEditor, setOpenEditor] = useState(false);

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-display max-w-7xl mx-auto">


            <main>

                {/* Team Header */}
                <section className="p-6">
                    <div className="flex flex-col items-center gap-4">

                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-primary p-1">
                                <div
                                    className="h-full w-full rounded-full bg-cover bg-center"
                                    style={{
                                        backgroundImage:
                                            "url(https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800)",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-extrabold">Season 2024</h2>
                            <p className="text-sm text-slate-400">
                                Founded 1995 • 12 Active Members
                            </p>
                        </div>

                    </div>
                </section>

                {/* Filters */}
                <div className="px-4 pb-3">
                    <div className="flex gap-2 overflow-x-auto">

                        <button className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                            All Moments
                        </button>

                        <button className="whitespace-nowrap rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-400">
                            Match Day
                        </button>

                        <button className="whitespace-nowrap rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-400">
                            Training
                        </button>

                        <button className="whitespace-nowrap rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-400">
                            Socials
                        </button>

                    </div>
                </div>

                {/* Timeline */}
                <div className="relative px-6 py-4">

                    <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-slate-700 opacity-40" />

                    {moments.map((moment) => {
                        const Icon = moment.icon;

                        return (
                            <div
                                key={moment.id}
                                className="relative mb-10 grid grid-cols-[40px_1fr] gap-4"
                            >

                                {/* Icon */}
                                <div className="z-10 flex flex-col items-center pt-2">
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${moment.accent} shadow-lg ring-4 ring-background-dark`}
                                    >
                                        <Icon size={18} className="text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3">

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            {moment.date}
                                        </span>
                                        <div className="h-px flex-1 bg-slate-700" />
                                    </div>

                                    <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">

                                        {/* Image */}
                                        {moment.image && (
                                            <div
                                                className="aspect-video bg-cover bg-center"
                                                style={{ backgroundImage: `url(${moment.image})` }}
                                            />
                                        )}

                                        {/* Gallery */}
                                        {moment.gallery && (
                                            <div className="grid grid-cols-2 gap-1 p-1">
                                                {moment.gallery.map((img, i) => (
                                                    <div
                                                        key={i}
                                                        className="aspect-square bg-cover bg-center rounded-lg"
                                                        style={{ backgroundImage: `url(${img})` }}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="p-4">

                                            <h3 className="font-bold text-lg">{moment.title}</h3>

                                            <p className="mt-1 text-sm text-slate-400">
                                                {moment.text}
                                            </p>

                                            {/* Author */}
                                            <div className="mt-4 flex items-center justify-between">

                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src={moment.avatar}
                                                        className="h-8 w-8 rounded-full"
                                                    />

                                                    <div>
                                                        <p className="text-xs font-bold">
                                                            {moment.author}
                                                        </p>
                                                        <span className="text-[10px] font-semibold uppercase text-primary">
                                                            {moment.role}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">

                                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                                                        <Share2 size={16} />
                                                    </button>

                                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                                                        <Heart size={16} />
                                                    </button>

                                                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                                                        <MessageCircle size={16} />
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        );
                    })}
                </div>

            </main>

            {/* Floating action */}
            <button className="fixed bottom-20 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl z-50" onClick={() => setOpenEditor(true)}>
                <Plus size={26} />
            </button>

            {/* modal */}
            <CreateMemoryPage
                isOpen={openEditor}
                onClose={() => setOpenEditor(false)}
            />

        </div>
    );
}