import { useEffect, useState } from "react";
import { ChevronDown, Eye, MessageCircle, SquarePen } from "lucide-react";
import RoleBadge from "../../components/RoleBadge";
import { useTeam } from "../Timeline/TeamContext";
import { useAuth } from "../Auth/AuthContext";
import { roleConfig } from "../../config/roles";
import CreateForumPostModal from "./CreateForumPostModal";
import { teamService } from "../Timeline/teamService";

export default function ForumPage() {
    const { user } = useAuth();
    const { team } = useTeam();
    const [posts, setPosts] = useState([]);
    const [members, setMembers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function loadData() {
            // Cargar miembros del equipo
            const teamMembers = await teamService.getTeamMembers(team.team_id);
            setMembers(teamMembers);

            // Cargar posts del forum
            const forumPosts = await teamService.getForumPosts(team.team_id);
            // Mapear para incluir creator info desde members
            const postsWithCreator = forumPosts.map(p => {
                const creator = teamMembers.find(m => m.user_id === p.creator_id);
                return {
                    ...p,
                    creator: {
                        id: p.creator_id,
                        display_name: creator?.display_name || "Unknown",
                        role: creator?.role || "member"
                    }
                };
            });
            setPosts(postsWithCreator);
        }
        loadData();
    }, [team]);

    const filteredPosts = posts
        .filter(p => roleFilter === "all" || p.creator.role === roleFilter)
        .sort((a, b) => {
            const aMember = members.find(m => m.user_id === a.creator.id);
            const bMember = members.find(m => m.user_id === b.creator.id);
            return new Date(bMember?.active_from) - new Date(aMember?.active_from);
        });

    const canPost = () => {
        const sameRoleMembers = members.filter(m => m.role === user.role)
            .sort((a, b) => new Date(b.active_from) - new Date(a.active_from));
        return sameRoleMembers.length === 0 || sameRoleMembers[0].user_id === user.user_id;
    };

    const originRoleKeys = ["creator", "captain", "coach", "manager"];
    const roleKeys = originRoleKeys.includes(team.role) ? [team.role] : [];

    useEffect(() => {
        setRoleFilter(roleKeys[0]);
    }, [roleKeys]);

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 max-w-7xl mx-auto flex flex-col overflow-hidden">

            {/* Role filter */}
            <div className="flex gap-3 p-4 overflow-x-auto border-b border-slate-800">
                {user.role === "creator" && <button
                    className={`flex h-9 items-center gap-2 rounded-full px-4 ${roleFilter === "all" ? "bg-primary shadow-lg shadow-primary/20" : "bg-card-dark border border-slate-400/30"}`}
                    onClick={() => setRoleFilter("all")}
                >
                    <p className="text-white text-sm font-medium">All Roles</p>
                </button>}

                {roleKeys.map(role => {
                    const cfg = roleConfig[role];
                    const Icon = cfg.icon;
                    const selected = roleFilter === role;
                    return (
                        <button
                            key={role}
                            className={`flex h-9 items-center gap-2 rounded-full px-4 ${selected ? `${cfg.bg} shadow-lg ${cfg.text}` : `bg-card-dark border ${cfg.color}`}`}
                            onClick={() => setRoleFilter(role)}
                        >
                            <Icon size={16} />
                            <p className={`text-sm font-medium ${selected ? cfg.text : cfg.color}`}>{cfg.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Forum posts */}
            <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {filteredPosts.map(post => {
                    const cfg = roleConfig[post.creator.role] || roleConfig.member;
                    const Icon = cfg.icon;

                    return (
                        <div key={post.forum_post_id} className="grid grid-cols-[48px_1fr] gap-x-4">
                            <div className="flex flex-col items-center">
                                <div className={`flex items-center justify-center h-12 w-12 rounded-full ${cfg.bg} border-2 ${cfg.border} shadow-lg`}>
                                    <Icon className={cfg.text} />
                                </div>
                                <div className="w-[2px] bg-gradient-to-b from-slate-600/40 to-slate-800 flex-1 my-2" />
                            </div>

                            <div className="flex flex-col pb-6">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-base font-semibold">{post.title}</p>
                                    <span className="text-[11px] font-medium text-slate-500 uppercase">{new Date(post.post_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-xs text-slate-400">
                                    <span>{post.creator.display_name}</span>
                                    <RoleBadge role={post.creator.role} />
                                </div>
                                <div className="bg-card-dark/50 p-4 rounded-xl border border-slate-800">
                                    <p className="text-slate-400 text-sm">{post.content}</p>
                                    {post.media?.length > 0 && (
                                        <div className="mt-2 flex flex-col gap-2">
                                            {post.media.map((m, idx) => m.media_type === "image" ? (
                                                <img key={idx} src={m.media_url} alt="" className="rounded-md w-full max-h-60 object-cover" />
                                            ) : (
                                                <video key={idx} src={m.media_url} controls className="rounded-md w-full max-h-60" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>

            {/* Floating Add Post Button */}
            {canPost() && (
                <button
                    className="fixed bottom-20 right-8 h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40"
                    onClick={() => setShowModal(true)}
                >
                    <SquarePen size={24} />
                </button>
            )}

            {/* Modal de creación */}
            <CreateForumPostModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                addPostToTimeline={newPost => setPosts([newPost, ...posts])}
            />
        </div>
    );
}