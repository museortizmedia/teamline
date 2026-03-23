import { useEffect, useState } from "react";
import { Trophy, Share2, Heart, MessageCircle, Send, ArrowLeft } from "lucide-react";

import { useAuth } from "./Auth/AuthContext";
import { teamService } from "./Timeline/teamService";
import RoleBadge from "../components/RoleBadge";

export default function PostPage({ setPage, postId }) {
    const { user, isAuthenticated } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para interacción (Likes y Comentarios)
    const [likes, setLikes] = useState({ count: 0, users: [] });
    const [postComments, setPostComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");

    useEffect(() => {
        if (!postId) return;

        const loadPostData = async () => {
            try {
                setLoading(true);
                // 1. Obtener el post individual (asumiendo que tienes este método en teamService)
                const data = await teamService.getPostById(postId);
                setPost(data);

                // 2. Cargar interacciones
                const likeData = await teamService.getPostLikes(postId);
                const commentData = await teamService.getPostComments(postId);

                setLikes(likeData);
                setPostComments(commentData);
            } catch (err) {
                console.error("Error al cargar el post:", err);
            } finally {
                setLoading(false);
            }
        };

        loadPostData();
    }, [postId]);

    const handleLike = async () => {
        if (!isAuthenticated) return setPage("login");
        await teamService.toggleLike({ postId, userId: user.id });
        const updatedLikes = await teamService.getPostLikes(postId);
        setLikes(updatedLikes);
    };

    const handleAddComment = async () => {
        if (!commentInput.trim()) return;
        await teamService.addComment({
            postId,
            userId: user.id,
            content: commentInput
        });
        const updated = await teamService.getPostComments(postId);
        setPostComments(updated);
        setCommentInput("");
    };

    if (loading) return <div className="p-10 text-center text-slate-400">Cargando momento...</div>;
    if (!post) return <div className="p-10 text-center text-slate-400">El post no existe.</div>;

    const userLiked = likes.users?.includes(user?.id);

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 max-w-2xl mx-auto pb-20">

            {/* Header de navegación */}
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-background-dark/80 backdrop-blur-md z-20">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="font-bold text-lg">Recuerdo de {post.creator?.name}</h2>
            </header>

            <main className="px-4">
                <div className="overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800 shadow-2xl">

                    {/* Media */}
                    {post.media?.length > 0 && (
                        <div className="w-full">
                            {post.media.map((m, i) => (
                                m.type === "image" ? (
                                    <img key={i} src={m.url} className="w-full object-cover" alt="Recuerdo" />
                                ) : (
                                    <video key={i} src={m.url} controls className="w-full" />
                                )
                            ))}
                        </div>
                    )}

                    {/* Contenido */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={post.creator?.avatar || "https://i.pravatar.cc/40"}
                                    className="h-10 w-10 rounded-full border-2 border-primary"
                                    alt="Avatar"
                                />
                                <div className="space-y-2">
                                    <p className="font-bold text-sm leading-none">{post.creator?.name}</p>
                                    <RoleBadge role={post.role} />
                                </div>
                            </div>
                            <span className="text-sm font-mono text-slate-500 uppercase">
                                {new Date(post.date).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                        <p className="text-slate-300 leading-relaxed mb-6">{post.text}</p>

                        {/* Acciones */}
                        <div className="flex items-center gap-4 border-y border-slate-800 py-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 ${userLiked ? 'text-red-400' : 'text-slate-400'}`}
                            >
                                <Heart size={20} fill={userLiked ? "currentColor" : "none"} />
                                <span className="font-bold">{likes.count}</span>
                            </button>

                            <div className="flex items-center gap-2 text-slate-400 px-4">
                                <MessageCircle size={20} />
                                <span className="font-bold">{postComments.length}</span>
                            </div>
                        </div>

                        {/* Sección de Comentarios */}
                        <div className="mt-6 space-y-4">
                            <h3 className="font-bold text-sm uppercase text-slate-500">Comentarios</h3>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {postComments.map(c => (
                                    <div key={c.id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-xs text-primary-light">{c.creator.name}</span>
                                        </div>
                                        <p className="text-sm text-slate-300">{c.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Input de comentario fijo o al final */}
                            {isAuthenticated && (
                                <div className="flex gap-2 mt-4">
                                    <input
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        placeholder="Escribe algo..."
                                        className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm outline-none focus:border-primary"
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className="bg-primary p-3 rounded-xl hover:scale-105 transition-transform"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}