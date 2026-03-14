import { useState, useEffect } from "react";
import { Camera, Trash2, Calendar, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useNotification } from "./Notification/NotificationContext";
import { supabaseService } from "../services/supabase/servides/supabaseService";
import { imageService } from "../services/imageService";
import defaultAvatar from "../assets/default-avatar.webp";

export default function ProfilePage() {
    const { profile, user, setProfile } = useAuth();
    const [name, setName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [saving, setSaving] = useState(false);

    const { addMessage } = useNotification();

    // Inicializar form con datos del perfil
    useEffect(() => {
        if (profile) {
            setName(profile.display_name || "");
            setBirthdate(profile.birthday || "");
            setAvatar(profile.profile_pic || null);
        }
    }, [profile]);

    // Validación de edad
    const handleBirthdate = (value) => {
        const birth = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 15) {
            addMessage("Debes tener al menos 15 años para usar TeamLine.", "error");
            return;
        }
        setBirthdate(value);
    };

    // Guardar perfil
    const handleSave = async () => {
        if (!user || !profile) return;

        if (profile.deleted_at) {
            addMessage("Este perfil ha sido eliminado y no puede editarse.", "error");
            return;
        }

        // Validar edad
        if (birthdate) {
            const birth = new Date(birthdate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
            if (age < 15) {
                addMessage("Debes tener al menos 15 años para usar TeamLine.", "error");
                return;
            }
        }

        setSaving(true);

        try {
            let avatarUrl = avatar;

            if (avatar && avatar.startsWith("blob:")) {
                const file = await fetch(avatar).then(r => r.blob());
                const compressedBlob = await imageService.compressToWebP(file, 0.7);
                const path = `avatars/${user.id}.webp`;

                // Eliminar avatar anterior si existe
                if (profile.profile_pic) {
                    try {
                        await supabaseService.storage.remove("avatars", path);
                    } catch {
                        // Ignorar error si no existe
                    }
                }

                // Subir nueva imagen
                avatarUrl = await supabaseService.storage.upload("avatars", path, compressedBlob, 3600, true);
            }

            // Actualizar perfil en DB
            const updatedProfile = await supabaseService.db.update(
                "profiles",
                profile.user_id,
                {
                    display_name: name,
                    birthday: birthdate,
                    profile_pic: avatarUrl,
                    updated_at: new Date(),
                },
                "user_id"
            );

            setProfile(updatedProfile);
            addMessage("Perfil actualizado correctamente", "success");
        } catch (error) {
            console.error(error);
            addMessage("Error al actualizar el perfil", "error");
        } finally {
            setSaving(false);
        }
    };

    // Soft delete de la cuenta
    const handleDeleteAccount = async () => {
        if (!user || !profile) return;
        if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta?")) return;

        try {
            await supabaseService.db.update(
                "profiles",
                profile.user_id,
                { deleted_at: new Date() },
                "user_id"
            );

            await supabaseService.auth.logout();
            window.location.reload();
        } catch (error) {
            console.error(error);
            addMessage("Error al eliminar la cuenta", "error");
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-7xl mx-auto">
            <main className="pb-24 flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <img
                            src={avatar || defaultAvatar}
                            alt="profile"
                            className="w-28 h-28 rounded-full object-cover border-4 border-primary"
                        />
                        <label className="absolute bottom-0 right-0 size-9 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg">
                            <Camera size={16} />
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-slate-400">Sube tu foto de perfil</p>
                </div>

                {/* Formulario */}
                <div className="flex flex-col gap-4">
                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400 px-1">Username</label>
                        <input
                            value={profile?.username || ""}
                            disabled
                            className="w-full bg-slate-800/40 border border-slate-700 rounded-xl p-3 text-sm opacity-60 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-slate-500 px-1">El username no se puede cambiar después del registro.</p>
                    </div>

                    {/* Nombre */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400 px-1">Nombre completo</label>
                        <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                            <User className="text-primary mr-3" />
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre completo"
                                className="bg-transparent outline-none text-sm flex-1"
                            />
                        </div>
                    </div>

                    {/* Cumpleaños */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-400 px-1">Fecha de nacimiento</label>
                        <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                            <Calendar className="text-primary mr-3" />
                            <input
                                type="date"
                                value={birthdate}
                                onChange={(e) => handleBirthdate(e.target.value)}
                                className="bg-transparent outline-none text-sm flex-1"
                            />
                        </div>
                    </div>

                </div>

                {/* Botón Guardar */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20"
                >
                    {saving ? "Guardando..." : "Guardar Perfil"}
                </button>

                {/* Zona de Peligro */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3">
                    <h3 className="text-red-400 font-semibold">Zona de Peligro</h3>
                    <p className="text-sm text-slate-400">Eliminar tu cuenta eliminará permanentemente:</p>
                    <ul className="text-sm text-slate-400 list-disc pl-4 space-y-1">
                        <li>Tus publicaciones y recuerdos</li>
                        <li>Tu participación en equipos</li>
                        <li>Mensajes en el foro</li>
                        <li>Tu perfil y estadísticas</li>
                    </ul>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/10"
                    >
                        <Trash2 size={16} />
                        Eliminar Cuenta
                    </button>
                </div>
            </main>
        </div>
    );
}