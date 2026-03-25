import { useState, useEffect } from "react";
import { Trophy, Share2, Heart, MessageCircle, Plus, Send, Flag, X } from "lucide-react";

import CreateMemoryPage from "../Memory/CreateMemoryPage";
import { useRouterApp } from "../../RouterApp";
import { useAuth } from "../Auth/AuthContext";
import { useTeam } from "./TeamContext";
import { teamService } from "./teamService";
import RoleBadge from "../../components/RoleBadge";
import ImageWithSkeleton from "../../components/ImageWithSkeleton";
import defaultAvatar from "../../assets/default-avatar.webp";
import { AnimatePresence } from "framer-motion";

export default function TimelinePage({ teamId }) {
    const { setPage } = useRouterApp();
    const { user, isAuthenticated } = useAuth();
    const { team } = useTeam();

    const [openEditor, setOpenEditor] = useState(false);
    const [teamline, setTeamline] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPageNum] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [openComments, setOpenComments] = useState({});

    // Modal de imagen
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [modalIndex, setModalIndex] = useState(0);

    // ===============================
    // Load posts paginados
    // ===============================
    const loadPosts = async (pageToLoad = 0) => {
        try {
            const newPosts = await teamService.getTimeline(teamId, {
                limit: 10,
                offset: pageToLoad * 10
            });

            if (newPosts.length < 10) setHasMore(false);
            setPosts(prev => pageToLoad === 0 ? newPosts : [...prev, ...newPosts]);

            newPosts.forEach(async (p) => {
                const likeData = await teamService.getPostLikes(p.id);
                const commentData = await teamService.getPostComments(p.id);
                setLikes(prev => ({ ...prev, [p.id]: likeData }));
                setComments(prev => ({ ...prev, [p.id]: commentData }));
            });
        } catch (err) {
            console.error("Error loading posts:", err);
        }
    };

    // ===============================
    // Likes / Comments
    // ===============================
    const handleLike = async (postId) => {
        if (!isAuthenticated) { setPage("login"); return; }
        await teamService.toggleLike({ postId, userId: user.id });
        const likeData = await teamService.getPostLikes(postId);
        setLikes(prev => ({ ...prev, [postId]: likeData }));
    };

    const handleAddComment = async (postId) => {
        const text = commentInput[postId];
        if (!text) return;

        await teamService.addComment({ postId, userId: user.id, content: text });
        const updated = await teamService.getPostComments(postId);
        setComments(prev => ({ ...prev, [postId]: updated }));
        setCommentInput(prev => ({ ...prev, [postId]: "" }));
    };

    const toggleComments = (postId) => {
        setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleShare = async (postId, postTitle) => {
        // Construimos la URL siguiendo tu lógica de rutas: /p/id
        const url = `${window.location.origin}/p/${postId}`;

        const shareData = {
            title: postTitle || "Mira este recuerdo en TeamLine",
            text: `Echa un vistazo a este momento: ${postTitle}`,
            url: url,
        };

        try {
            // Intentar usar el API nativo (móviles)
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback para escritorio: Copiar al portapapeles
                await navigator.clipboard.writeText(url);
                // Opcional: podrías usar un toast o notificación aquí
                alert("¡Enlace copiado al portapapeles!");
            }
        } catch (err) {
            console.error("Error al compartir:", err);
        }
    };

    // ===============================
    // Load initial data
    // ===============================
    useEffect(() => {
        if (!teamId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                const teamData = await teamService.getTeamById(teamId);
                setTeamline(teamData);
                await loadPosts(0);
            } catch (err) {
                console.error("Error loading timeline:", err);
                setTeamline(null);
            } finally { setLoading(false); }
        };

        loadData();
    }, [teamId]);

    // ===============================
    // Transform posts
    // ===============================
    const moments = posts.map(post => ({
        id: post.id,
        title: post.title,
        text: post.text,
        date: post.date,
        author: post.creator?.name || "Unknown",
        avatar: post.creator?.avatar,
        role: post.role,
        media: post.media || [],
        icon: Trophy,
        accent: "bg-primary"
    }));

    // ===============================
    // Modal functions
    // ===============================
    const openImageModal = (images, index = 0) => {
        setModalImages(images);
        setModalIndex(index);
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    // Navegacion modal con teclado
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // ===============================
    // Render
    // ===============================
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 font-display max-w-7xl mx-auto">

            <main>
                {loading && (
                    <div className="p-6 text-center text-slate-400">
                        <div className="animate-pulse space-y-2">
                            <div className="h-6 w-1/2 mx-auto bg-slate-700 rounded" />
                            <div className="h-4 w-1/3 mx-auto bg-slate-700 rounded" />
                        </div>
                    </div>
                )}

                {!loading && !teamline && (
                    <div className="p-6 text-center text-slate-400">Team no encontrado</div>
                )}

                {teamline && (
                    <section className="p-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-24 w-24 rounded-full border-4 border-primary p-1">
                                <div className="h-full w-full rounded-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${teamline.team_pic || defaultAvatar})` }} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-extrabold">{teamline.name}</h2>
                                <p className="text-sm mt-2 font-extrabold font-mono text-white bg-primary opacity-80 px-2 py-1 rounded-lg flex flex-col items-center w-full">
                                    <span className="text-xs">DESDE</span>
                                    <span className="text-sm">
                                        {new Date(teamline.foundation_date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* TIMELINE */}
                <div className="relative px-6 py-4">
                    <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary to-slate-700 opacity-40" />

                    {moments.map(moment => {
                        const Icon = moment.icon;
                        const postLikes = likes[moment.id]?.count || 0;
                        const userLiked = likes[moment.id]?.users?.includes(user?.id);
                        const postComments = comments[moment.id] || [];
                        const isOpen = openComments[moment.id];

                        return (
                            <div key={moment.id} className="relative mb-10 grid grid-cols-[40px_1fr] gap-4 cursor-pointer">

                                <div className="z-10 flex flex-col items-center pt-2">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${moment.accent}`}>
                                        <Icon size={18} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-extrabold font-mono text-slate-400">
                                            {new Date(moment.date).toLocaleDateString("es-ES", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()}
                                        </span>
                                        <div className="h-px flex-1 bg-slate-700" />
                                    </div>

                                    <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-4" >

                                        <h3 className="font-bold text-lg" onClick={() => window.open(`/p/${moment.id}`, "_blank")}>{moment.title}</h3>
                                        <p className="mt-1 text-sm text-slate-400">{moment.text}</p>

                                        {/* MEDIA HERO / GRID */}
                                        {moment.media?.length > 0 && (
                                            <div className="mt-3">
                                                {moment.media.length === 1 ? (
                                                    <ImageWithSkeleton
                                                        src={moment.media[0].low_quality_url || moment.media[0].url}
                                                        alt={moment.title || "Media"}
                                                        className="w-full h-64 rounded-2xl cursor-pointer"
                                                        onClick={(e) => { e.stopPropagation(); openImageModal(moment.media, 0); }}
                                                    />
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                        {moment.media.map((m, i) => (
                                                            <ImageWithSkeleton
                                                                key={i}
                                                                src={m.low_quality_url || m.url}
                                                                alt={moment.title || "Media"}
                                                                className="h-32 w-full rounded-lg cursor-pointer"
                                                                onClick={(e) => { e.stopPropagation(); openImageModal(moment.media, i); }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* BOTONES */}
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <img src={moment.avatar || defaultAvatar} className="h-8 w-8 rounded-full flex-shrink-0" />
                                                <div className="flex flex-col min-w-0 space-y-1">
                                                    <span className="text-xs font-bold truncate">{moment.author}</span>
                                                    <RoleBadge role={moment.role} />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 sm:gap-2">
                                                <button onClick={(e) => { e.stopPropagation(); handleLike(moment.id); }}
                                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 transition-colors ${userLiked ? "text-red-400" : "text-slate-400 hover:text-slate-200"}`}>
                                                    <Heart size={16} fill={userLiked ? "currentColor" : "none"} />
                                                    <span className="text-xs font-medium">{postLikes}</span>
                                                </button>

                                                <button onClick={(e) => { e.stopPropagation(); toggleComments(moment.id); }}
                                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-800 ${isOpen ? "text-primary" : "text-slate-400 hover:text-slate-200"} transition-colors`}>
                                                    <MessageCircle size={16} />
                                                    <span className="text-xs font-medium">{postComments.length}</span>
                                                </button>

                                                <button onClick={(e) => { e.stopPropagation(); handleShare(moment.id, moment.title); }}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
                                                    <Share2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {isOpen && (
                                            <div
                                                className="mt-2 border-t border-slate-800 p-4 flex flex-col gap-3 bg-slate-900/50 overflow-hidden"
                                                onClick={(e) => e.stopPropagation()}
                                            >

                                                {/* LISTA DE COMENTARIOS */}
                                                <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-w-0">
                                                    {postComments.map(c => (
                                                        <div
                                                            key={c.id}
                                                            className="text-sm text-slate-300 break-all leading-relaxed"
                                                        >
                                                            <b className="text-primary-light">{c.creator.name}:</b>{" "}
                                                            <span className="break-all">{c.text}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* INPUT + BOTÓN */}
                                                <div className="flex gap-2 items-center min-w-0">

                                                    <input
                                                        value={commentInput[moment.id] || ""}
                                                        onChange={(e) =>
                                                            setCommentInput(prev => ({
                                                                ...prev,
                                                                [moment.id]: e.target.value
                                                            }))
                                                        }
                                                        placeholder="Comentar..."
                                                        className="flex-1 w-0 min-w-0 bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary transition-all"
                                                    />

                                                    <button
                                                        onClick={() => handleAddComment(moment.id)}
                                                        disabled={!isAuthenticated || !commentInput[moment.id]}
                                                        className="bg-primary hover:bg-primary-dark disabled:opacity-50 p-2 rounded-lg text-sm transition-colors flex-shrink-0"
                                                    >
                                                        <Send size={18} />
                                                    </button>

                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* FAB */}
            {isAuthenticated && team?.team_id === teamline?.team_id && (
                <button className="fixed bottom-20 right-8 h-14 w-14 rounded-full bg-primary flex items-center justify-center z-50 shadow-lg"
                    onClick={() => setOpenEditor(true)}>
                    <Plus size={26} />
                </button>
            )}

            <CreateMemoryPage isOpen={openEditor} onClose={() => setOpenEditor(false)} />



            {/* MODAL DE IMAGEN */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeModal}
                >

                    {/* BOTÓN CERRAR */}
                    <button
                        className="absolute top-4 right-4 z-[60] p-2 text-white/70 hover:text-white bg-black/40 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            closeModal();
                        }}
                    >
                        <X size={32} />
                    </button>

                    {/* CONTENEDOR INTERNO */}
                    <div
                        className="w-screen h-screen flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex items-center justify-center">

                            {/* SKELETON */}
                            {!modalImages[modalIndex]?.loaded && (
                                <div className="absolute inset-0 bg-slate-700 animate-pulse rounded" />
                            )}

                            <img
                                src={modalImages[modalIndex]?.url}
                                alt="Imagen del post"
                                onClick={(e) => e.stopPropagation()}
                                onLoad={() => {
                                    setModalImages(prev =>
                                        prev.map((img, i) =>
                                            i === modalIndex ? { ...img, loaded: true } : img
                                        )
                                    );
                                }}
                                className="
                        object-contain 
                        rounded
                        transition-opacity duration-300
                        max-w-[calc(100vw-2rem)]
                        max-h-[calc(100vh-2rem)]
                    "
                                style={{
                                    opacity: modalImages[modalIndex]?.loaded ? 1 : 0
                                }}
                            />

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}