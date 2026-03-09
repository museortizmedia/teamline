import { useState } from "react";
import {
    Camera,
    Trash2,
    Calendar,
    User
} from "lucide-react";

export default function ProfilePage() {

    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [avatar, setAvatar] = useState(null);

    const username = "team_user";

    const handleBirthdate = (value) => {

        const birth = new Date(value);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 15) {
            alert("You must be at least 15 years old to use Team Hub.");
            return;
        }

        setBirthdate(value);
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-7xl mx-auto">

            <main className="pb-24 flex flex-col gap-6">

                {/* Profile Header */}

                <div className="flex flex-col items-center gap-3">

                    <div className="relative">

                        <img
                            src={avatar || "https://i.pravatar.cc/150"}
                            alt="profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-primary"
                        />

                        <label className="absolute bottom-0 right-0 size-9 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg">

                            <Camera size={16} />

                            <input
                                type="file"
                                hidden
                                onChange={(e) =>
                                    setAvatar(
                                        URL.createObjectURL(
                                            e.target.files[0]
                                        )
                                    )
                                }
                            />

                        </label>

                    </div>

                    <p className="text-xs text-slate-400">
                        Upload a profile picture
                    </p>

                </div>

                {/* Profile Form */}

                <div className="flex flex-col gap-4">

                    {/* Name */}

                    <div className="space-y-1">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Full Name
                        </label>

                        <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">

                            <User className="text-primary mr-3" />

                            <input
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Your full name"
                                className="bg-transparent outline-none text-sm flex-1"
                            />

                        </div>

                    </div>

                    {/* Birthdate */}

                    <div className="space-y-1">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Date of Birth
                        </label>

                        <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">

                            <Calendar className="text-primary mr-3" />

                            <input
                                type="date"
                                value={birthdate}
                                onChange={(e) =>
                                    handleBirthdate(e.target.value)
                                }
                                className="bg-transparent outline-none text-sm flex-1"
                            />

                        </div>

                    </div>

                    {/* Username */}

                    <div className="space-y-1">

                        <label className="text-xs font-bold uppercase text-slate-400 px-1">
                            Username
                        </label>

                        <input
                            value={username}
                            disabled
                            className="w-full bg-slate-800/40 border border-slate-700 rounded-xl p-3 text-sm opacity-60 cursor-not-allowed"
                        />

                        <p className="text-[10px] text-slate-500 px-1">
                            Username cannot be changed after registration.
                        </p>

                    </div>

                </div>

                {/* Save */}

                <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20">
                    Save Profile
                </button>

                {/* Danger Zone */}

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3">

                    <h3 className="text-red-400 font-semibold">
                        Danger Zone
                    </h3>

                    <p className="text-sm text-slate-400">
                        Deleting your account will permanently remove:
                    </p>

                    <ul className="text-sm text-slate-400 list-disc pl-4 space-y-1">

                        <li>Your memories and timeline posts</li>
                        <li>Your participation in teams</li>
                        <li>Your forum messages</li>
                        <li>Your profile and statistics</li>

                    </ul>

                    <button className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/10">

                        <Trash2 size={16} />

                        Delete Account

                    </button>

                </div>

            </main>

        </div>
    );
}