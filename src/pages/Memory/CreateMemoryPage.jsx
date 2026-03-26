import { useEffect, useState } from "react";

import { teamService } from "../Timeline/teamService";
import { useAuth } from "../Auth/AuthContext";
import { useTeam } from "../Timeline/TeamContext";
import MemoryEditorHeader from "./MemoryEditorHeader";
import MediaGallery from "./MediaGallery";
import MemoryCalendar from "./MemoryCalendar";
import MemoryDetails from "./MemoryDetails";
//import VisibilitySelector from "./VisibilitySelector";


export default function CreateMemoryPage({ isOpen, onClose }) {

    if (!isOpen) return null;

    const { user } = useAuth();
    const { team, activeFrom, activeTo } = useTeam();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [files, setFiles] = useState([]);

    const [dateTouched, setDateTouched] = useState(false);

    const handlePost = async () => {
        if (!team || !user) return;

        try {
            await teamService.postMemory({
                teamId: team.team_id,
                userId: user.id,
                title,
                content,
                date,
                files
            });

            onClose();

        } catch (error) {
            console.error("Error posting memory:", error);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="w-full h-full md:h-[90vh] md:max-w-6xl bg-[#0F172A] border border-slate-800 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                <MemoryEditorHeader onClose={onClose} onPost={handlePost} />

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    {/* LEFT: MEDIA */}
                    <MediaGallery
                        files={files}
                        setFiles={setFiles}
                        minDate={team.foundation_date < activeFrom ? team.foundation_date : activeFrom}
                        maxDate={activeTo}
                        setDate={setDate}
                        setDateTouched={setDateTouched}
                    />

                    {/* RIGHT: DETAILS */}
                    <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col gap-6 p-6 overflow-y-auto bg-[#0B1220]">

                        <MemoryCalendar date={date} setDate={(newDate) => { setDate(newDate); setDateTouched(true); }} minDate={team.foundation_date < activeFrom ? team.foundation_date : activeFrom} maxDate={activeTo} />

                        <MemoryDetails
                            title={title}
                            setTitle={setTitle}
                            content={content}
                            setContent={setContent}
                        />

                    </div>

                </div>

            </div>
        </div>
    );
}