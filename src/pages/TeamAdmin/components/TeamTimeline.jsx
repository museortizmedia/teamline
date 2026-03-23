import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { teamService } from "../../Timeline/teamService";

export default function TeamTimeline({ team }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);

    /* ---------- Load posts ---------- */
    useEffect(() => {
        async function fetchTimeline() {
            setLoading(true);
            try {
                const posts = await teamService.getTimeline(team.team_id);
                // Ordenar por fecha descendente
                posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTimeline(posts);
            } catch (err) {
                console.error("Error cargando timeline:", err);
                setTimeline([]);
            } finally {
                setLoading(false);
            }
        }

        fetchTimeline();
    }, [team]);

    const handleDelete = async (postId) => {
        try {
            await teamService.deleteTimelinePost(postId);
            setTimeline(timeline.filter(p => p.id !== postId));
            setConfirmDelete(null);
        } catch (err) {
            console.error("Error eliminando post:", err);
        }
    };

    if (loading) {
        return <p className="text-slate-400 text-sm">Cargando timeline...</p>;
    }

    if (!timeline.length) {
        return <p className="text-slate-400 text-sm">No hay publicaciones en el timeline.</p>;
    }

    return (
        <div className="space-y-4">
            {timeline.map(post => (
                <div
                    key={post.id}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between items-center"
                >
                    <div>
                        <p className="font-semibold">{post.text}</p>
                        <p className="text-xs text-slate-400">
                            {new Date(post.date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                    </div>
                    {team.foundation_date !== post.date && (
                        <button
                            onClick={() =>
                                setConfirmDelete({
                                    postId: post.id,
                                    text: post.text
                                })
                            }
                            className="text-red-400"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            ))}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-slate-900 p-6 rounded-xl space-y-4 max-w-md">
                        <p>
                            ¿Eliminar esta publicación?
                            <br />
                            <b>{confirmDelete.text}</b>
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="bg-slate-700 px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(confirmDelete.postId)}
                                className="bg-red-600 px-4 py-2 rounded"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}