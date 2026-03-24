import { useState, useRef } from "react";
import { X, Video } from "lucide-react";
import { teamService } from "../Timeline/teamService";
import { useAuth } from "../Auth/AuthContext";
import { useTeam } from "../Timeline/TeamContext";


export default function CreateForumPostModal({ isOpen, onClose, onPost }) {
    const { user } = useAuth();
    const { team } = useTeam();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [files, setFiles] = useState([]);
    const [recording, setRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        setFiles([...files, ...Array.from(e.target.files)]);
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        recordedChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = e => recordedChunksRef.current.push(e.data);
        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
            setVideoBlob(blob);
            setFiles(prev => [...prev, blob]);
            stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const handlePost = async () => {
        if (!title.trim() || !content.trim()) return;

        try {
            const post = await teamService.postForum({
                teamId: team.team_id,
                userId: user.id,
                title,
                content,
                date,
                files
            });

            onPost(post);
            onClose();
            setTitle("");
            setContent("");
            setFiles([]);
            setVideoBlob(null);
        } catch (err) {
            console.error("Error creating forum post:", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="w-full max-w-3xl bg-[#0F172A] border border-slate-800 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-4 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Crear Post</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={20} /></button>
                </div>

                {/* BODY */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden p-6 gap-6">
                    {/* LEFT: MEDIA */}
                    <div className="flex-1 flex flex-col gap-4">
                        <label className="text-slate-400 text-sm">Subir imágenes o videos</label>
                        <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="text-sm text-slate-300" />

                        <div className="flex flex-col gap-2 mt-2">
                            {files.map((file, idx) => {
                                const url = typeof file === "string" ? file : URL.createObjectURL(file);
                                if (file.type?.startsWith("video") || file instanceof Blob) {
                                    return <video key={idx} src={url} controls className="rounded-md w-full max-h-60 object-cover" />;
                                }
                                return <img key={idx} src={url} alt="" className="rounded-md w-full max-h-60 object-cover" />;
                            })}
                        </div>

                        <div className="flex gap-2 mt-2">
                            {!recording ? (
                                <button
                                    className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-xl"
                                    onClick={startRecording}
                                >
                                    <Video size={16} /> Grabar video
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-xl"
                                    onClick={stopRecording}
                                >
                                    <Video size={16} /> Detener
                                </button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: DETAILS */}
                    <div className="w-full md:w-96 flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Título"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none"
                        />
                        <textarea
                            placeholder="Descripción del post"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none flex-1 resize-none"
                            rows={6}
                        />
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white outline-none"
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 p-4 border-t border-slate-800">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handlePost}
                        className="px-4 py-2 bg-primary text-white rounded-xl"
                    >
                        Publicar
                    </button>
                </div>
            </div>
        </div>
    );
}