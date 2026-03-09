import { useState } from "react";
import TopBar from "../components/layout/TopBar";

import {
    Shield,
    Users,
    Clock,
    Trash2,
    Search,
    UserPlus,
    Check,
    X
} from "lucide-react";

export default function TeamAdminPage() {

    const [tab, setTab] = useState("timeline");

    const timeline = [
        { id: 1, text: "Won regional championship", date: "Oct 24 2023" },
        { id: 2, text: "First match of the season", date: "Sep 12 2023" }
    ];

    const members = [
        { id: 1, username: "alex", role: "captain", activeFrom: "2023" },
        { id: 2, username: "maria", role: "coach", activeFrom: "2022" }
    ];

    const requests = [
        { id: 1, username: "newplayer" }
    ];

    const [searchUser, setSearchUser] = useState("");

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-7xl mx-auto">

            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}

                <aside className="w-64 border-r border-slate-800 p-4 space-y-2">

                    <h2 className="text-sm uppercase text-slate-400 font-bold mb-3">
                        Team Admin
                    </h2>

                    <button
                        onClick={() => setTab("timeline")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "timeline"
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-slate-800"
                            }`}
                    >
                        <Clock size={18} />
                        Timeline
                    </button>

                    <button
                        onClick={() => setTab("members")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "members"
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-slate-800"
                            }`}
                    >
                        <Users size={18} />
                        Members
                    </button>

                    <button
                        onClick={() => setTab("roles")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "roles"
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-slate-800"
                            }`}
                    >
                        <Shield size={18} />
                        Roles
                    </button>

                    <button
                        onClick={() => setTab("structure")}
                        className={`w-full text-left p-3 rounded-lg flex gap-2 items-center ${tab === "structure"
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-slate-800"
                            }`}
                    >
                        <Shield size={18} />
                        Data Structure
                    </button>

                </aside>

                {/* Content */}

                <main className="flex-1 p-6 overflow-y-auto">

                    {/* Timeline Manager */}

                    {tab === "timeline" && (

                        <div className="space-y-4">

                            <h2 className="text-xl font-bold font-display">
                                Timeline Moderation
                            </h2>

                            {timeline.map((item) => (

                                <div
                                    key={item.id}
                                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between items-center"
                                >

                                    <div>
                                        <p className="font-semibold">
                                            {item.text}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {item.date}
                                        </p>
                                    </div>

                                    <button className="text-red-400 hover:text-red-300">
                                        <Trash2 size={18} />
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                    {/* Members */}

                    {tab === "members" && (

                        <div className="space-y-6">

                            <h2 className="text-xl font-bold font-display">
                                Members
                            </h2>

                            {/* Requests */}

                            <div className="space-y-3">

                                <h3 className="text-sm uppercase text-slate-400">
                                    Join Requests
                                </h3>

                                {requests.map((r) => (

                                    <div
                                        key={r.id}
                                        className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-3"
                                    >

                                        <span>{r.username}</span>

                                        <div className="flex gap-2">

                                            <button className="text-green-400">
                                                <Check size={18} />
                                            </button>

                                            <button className="text-red-400">
                                                <X size={18} />
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                            {/* Member list */}

                            <div className="space-y-3">

                                {members.map((m) => (

                                    <div
                                        key={m.id}
                                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between"
                                    >

                                        <div>

                                            <p className="font-semibold">
                                                {m.username}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Role: {m.role}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Active since {m.activeFrom}
                                            </p>

                                        </div>

                                        <button className="text-red-400">
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                ))}

                            </div>

                            {/* Invite */}

                            <div className="space-y-2">

                                <label className="text-xs uppercase text-slate-400">
                                    Invite Member
                                </label>

                                <div className="flex gap-2">

                                    <input
                                        value={searchUser}
                                        onChange={(e) =>
                                            setSearchUser(e.target.value)
                                        }
                                        placeholder="Search username"
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm"
                                    />

                                    <button className="bg-primary px-4 rounded-lg flex items-center gap-1">

                                        <UserPlus size={16} />

                                        Invite

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

                    {/* Roles */}

                    {tab === "roles" && (

                        <div className="space-y-4">

                            <h2 className="text-xl font-bold font-display">
                                Role Management
                            </h2>

                            <p className="text-sm text-slate-400">
                                Assign leadership roles inside the team.
                            </p>

                            {members.map((m) => (

                                <div
                                    key={m.id}
                                    className="flex justify-between items-center bg-slate-800/50 border border-slate-700 rounded-xl p-4"
                                >

                                    <span>{m.username}</span>

                                    <select className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm">

                                        <option>Player</option>
                                        <option>Captain</option>
                                        <option>Coach</option>
                                        <option>Manager</option>

                                    </select>

                                </div>

                            ))}

                        </div>

                    )}

                    {/* Data Structure */}

                    {tab === "structure" && (

                        <div className="space-y-4">

                            <h2 className="text-xl font-bold font-display">
                                Member Data Fields
                            </h2>

                            <p className="text-sm text-slate-400">
                                Define structured data fields for team members.
                            </p>

                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-2">

                                <p className="text-sm font-semibold">
                                    Example Fields
                                </p>

                                <ul className="text-sm text-slate-400 space-y-1">

                                    <li>Position</li>
                                    <li>Number</li>
                                    <li>Height</li>
                                    <li>Weight</li>
                                    <li>Debut Year</li>

                                </ul>

                            </div>

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
}