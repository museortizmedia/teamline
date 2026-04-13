import { useEffect, useState, useRef } from "react";
import { Trophy, Share2, Heart, MessageCircle, Send, ArrowLeft, Smile } from "lucide-react";

import { useAuth } from "./Auth/AuthContext";
import { teamService } from "./Timeline/teamService";
import RoleBadge from "../components/RoleBadge";
import EmojiPicker from "../components/EmojiPicker";

import defaultAvatar from "../assets/default-avatar.webp";

export default function PostPage({ setPage, postId }) {
    const { user, isAuthenticated } = useAuth();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const [likes, setLikes] = useState({ count: 0, users: [] });
    const [postComments, setPostComments] = useState([]);
    const [commentInput, setCommentInput] = useState("");

    // emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!postId) return;

        const loadPostData = async () => {
            try {
                setLoading(true);

                const data = await teamService.getPostById(postId);
                setPost(data);

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

    // insertar emoji en cursor
    const insertEmoji = (emoji) => {
        const el = inputRef.current;
        if (!el) return;

        const start = el.selectionStart;
        const end = el.selectionEnd;

        const newText =
            commentInput.slice(0, start) +
            emoji +
            commentInput.slice(end);

        setCommentInput(newText);

        setTimeout(() => {
            el.selectionStart = el.selectionEnd = start + emoji.length;
            el.focus();
        }, 0);

        //setShowEmojiPicker(false);
    };

    // cerrar al click fuera
    useEffect(() => {
        const close = () => setShowEmojiPicker(false);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-400">Cargando momento...</div>;
    if (!post) return <div className="p-10 text-center text-slate-400">El post no existe.</div>;

    const userLiked = likes.users?.includes(user?.id);

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 max-w-2xl mx-auto pb-20">

            <header className="p-4 flex items-center gap-4 sticky top-0 bg-background-dark/80 backdrop-blur-md z-20">
                <button
                    onClick={() => window.history.back()}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="font-bold text-lg">
                    Recuerdo de {post.creator?.name}
                </h2>
            </header>

            <main className="px-4">
                <div className="overflow-visible rounded-2xl bg-slate-900 ring-1 ring-slate-800 shadow-2xl">

                    {post.media?.length > 0 && (
                        <div className="w-full">
                            {post.media.map((m, i) => (
                                m.type === "image" ? (
                                    <img key={i} src={m.url} className="w-full object-cover" />
                                ) : (
                                    <video key={i} src={m.url} controls className="w-full" />
                                )
                            ))}
                        </div>
                    )}

                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={post.creator?.avatar || defaultAvatar}
                                    className="h-10 w-10 rounded-full border-2 border-primary"
                                />
                                <div className="space-y-2">
                                    <p className="font-bold text-sm">{post.creator?.name}</p>
                                    <RoleBadge role={post.role} />
                                </div>
                            </div>

                            <span className="text-sm font-mono text-slate-500 uppercase">
                                {new Date(post.date).toLocaleDateString()}
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">
                            {post.title}
                        </h1>

                        <p className="text-slate-300 leading-relaxed mb-6">
                            {post.text}
                        </p>

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

                        <div className="mt-6 space-y-4">
                            <h3 className="font-bold text-sm uppercase text-slate-500">
                                Comentarios
                            </h3>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {postComments.map(c => (
                                    <div key={c.id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                                        <span className="font-bold text-xs text-primary-light">
                                            {c.creator.name}
                                        </span>
                                        <p className="text-sm text-slate-300">
                                            {c.text}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {isAuthenticated && (
                                <div
                                    className="relative flex gap-2 mt-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <input
                                        ref={inputRef}
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        placeholder="Escribe algo..."
                                        className="flex-1 bg-slate-800 border border-slate-700 p-3 pr-20 rounded-xl text-sm outline-none focus:border-primary"
                                    />

                                    <Smile
                                        size={18}
                                        className="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    />

                                    {showEmojiPicker && (
                                        <div
                                            className="absolute right-0 bottom-14 z-[999]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <EmojiPicker onSelect={insertEmoji} />
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddComment}
                                        className="bg-primary p-3 rounded-xl hover:scale-105 transition-transform flex-shrink-0"
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