import { useState } from "react";

import { teamService } from "../Timeline/teamService";
import { useAuth } from "../Auth/AuthContext";
import { useTeam } from "../Timeline/TeamContext";
import MemoryEditorHeader from "./MemoryEditorHeader";
import MediaGallery from "./MediaGallery";
import MemoryCalendar from "./MemoryCalendar";
import MemoryDetails from "./MemoryDetails";
import { parseLocalDate } from "../../utils/parseLocalDate";

export default function CreateMemoryPage({ isOpen, onClose, onCreated }) {

    if (!isOpen) return null;

    const { user } = useAuth();
    const { team, activeFrom, activeTo } = useTeam();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const getTodayLocal = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const [date, setDate] = useState(getTodayLocal());
    const [files, setFiles] = useState([]);

    const [dateTouched, setDateTouched] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const isValid =
        title.trim() !== "" &&
        content.trim() !== "" &&
        dateTouched;

    const handlePost = async () => {
        if (!team || !user || isPosting || !isValid) return;

        setIsPosting(true);

        try {
            await teamService.postMemory({
                teamId: team.team_id,
                userId: user.id,
                title,
                content,
                date,
                files
            });

            if (onCreated) onCreated();

        } catch (error) {
            console.error("Error posting memory:", error);
        } finally {
            setIsPosting(false);
        }
    };

    const minDate =
        parseLocalDate(team.foundation_date) < parseLocalDate(activeFrom)
            ? team.foundation_date
            : activeFrom;

    const maxDate = activeTo;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={onClose}
        >
            <div
                className="w-full h-full md:mb-16 md:h-[90vh] md:max-w-6xl bg-[#0F172A] border border-slate-800 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                <MemoryEditorHeader
                    onClose={onClose}
                    onPost={handlePost}
                    isPosting={isPosting}
                    isValid={isValid}
                />

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    <MediaGallery
                        files={files}
                        setFiles={setFiles}
                        minDate={minDate}
                        maxDate={maxDate}
                        setDate={setDate}
                        setDateTouched={setDateTouched}
                    />

                    <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col gap-6 p-6 overflow-y-auto bg-[#0B1220]">

                        <MemoryCalendar
                            date={date}
                            setDate={(newDate) => {
                                setDate(newDate);
                                setDateTouched(true);
                            }}
                            minDate={minDate}
                            maxDate={maxDate}
                        />

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