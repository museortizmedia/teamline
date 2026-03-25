import { useState, useEffect } from "react";
import { Trash2, Search } from "lucide-react";
import { teamService } from "../../Timeline/teamService";

const ALLOWED_DELETE_ROLES = ["creator", "captain", "coach", "manager"];

export default function TeamTimeline({ team }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const [search, setSearch] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    /* ---------- Load posts ---------- */
    useEffect(() => {
        async function fetchTimeline() {
            setLoading(true);
            try {
                const posts = await teamService.getTimeline(team.team_id);

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

    /* ---------- Delete ---------- */
    const handleDelete = async (postId) => {
        try {
            await teamService.deleteTimelinePost(postId);
            setTimeline(prev => prev.filter(p => p.id !== postId));
            setConfirmDelete(null);
        } catch (err) {
            console.error("Error eliminando post:", err);
        }
    };

    /* ---------- Filters ---------- */
    const filteredTimeline = timeline.filter(post => {
        const textMatch =
            (post.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (post.text?.toLowerCase() || "").includes(search.toLowerCase());

        const postDate = new Date(post.date);

        const fromMatch = fromDate ? postDate >= new Date(fromDate) : true;
        const toMatch = toDate ? postDate <= new Date(toDate) : true;

        return textMatch && fromMatch && toMatch;
    });

    /* ---------- UI ---------- */
    if (loading) {
        return <p className="text-slate-400 text-sm">Cargando timeline...</p>;
    }

    if (!timeline.length) {
        return <p className="text-slate-400 text-sm">No hay publicaciones en el timeline.</p>;
    }

    return (
        <div className="space-y-4">

            {/* ---------- FILTERS ---------- */}
            <div className="flex flex-col sm:flex-row gap-2">

                {/* Search */}
                <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por título o contenido..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-xs"
                    />
                </div>

                {/* From */}
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                />

                {/* To */}
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
                />

            </div>

            {/* ---------- LIST ---------- */}
            {filteredTimeline.map(post => {
                const canDelete = ALLOWED_DELETE_ROLES.includes(team.role);
                const isFoundationPost = team.foundation_date === post.date;

                return (
                    <div
                        key={post.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{post.title || post.text}</p>
                            {post.title && (
                                <p className="text-sm text-slate-400">{post.text}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">
                                {new Date(post.date).toLocaleDateString("es-ES", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric"
                                })}
                            </p>
                        </div>

                        {/* DELETE BUTTON */}
                        {canDelete && !isFoundationPost && (
                            <button
                                onClick={() =>
                                    setConfirmDelete({
                                        postId: post.id,
                                        text: post.title || post.text
                                    })
                                }
                                className="text-red-400 hover:text-red-300"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                );
            })}

            {filteredTimeline.length === 0 && (
                <div className="text-center py-8 border border-dashed border-slate-700 rounded-xl">
                    <p className="text-slate-500 text-sm">
                        No hay resultados con los filtros aplicados.
                    </p>
                </div>
            )}

            {/* ---------- MODAL DELETE ---------- */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
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