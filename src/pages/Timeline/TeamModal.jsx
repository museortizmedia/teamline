import { useState, useEffect } from "react";
import { Camera, Trash2, Calendar, Users, X } from "lucide-react";

import { supabaseService } from "../../services/supabase/services/supabaseService";
import { imageService } from "../../services/imageService";

import { useAuth } from "../Auth/AuthContext";
import { useNotification } from "../Notification/NotificationContext";
import { useTeam } from "../Timeline/TeamContext";

import defaultTeam from "../../assets/default-avatar.webp";
import { teamService } from "./teamService";

export default function TeamModal({ team, isOpen, onClose }) {

    const { user } = useAuth();
    const { addTeam, removeTeam } = useTeam();
    const { addMessage } = useNotification();

    const [name, setName] = useState("");
    const [foundationDate, setFoundationDate] = useState("");
    const [logo, setLogo] = useState(null);
    const [saving, setSaving] = useState(false);

    const editing = !!team;

    /* ------------------------------------------------------ */
    /* VALIDATION */
    /* ------------------------------------------------------ */

    const forbiddenWords = ["puta", "mierda", "fuck", "shit"];

    const validateTeamName = (name) => {
        const clean = name.trim().toLowerCase();

        if (clean.length < 3) return "El nombre es demasiado corto";
        if (clean.length > 30) return "Máximo 30 caracteres";

        const validRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s-_]+$/;
        if (!validRegex.test(name)) {
            return "Solo se permiten letras, números y - _";
        }

        if (forbiddenWords.some(word => clean.includes(word))) {
            return "Nombre no permitido";
        }

        if (/<script|<\/script>|javascript:/i.test(name)) {
            return "Contenido inválido";
        }

        return null;
    };

    /* ------------------------------------------------------ */

    useEffect(() => {
        if (team) {
            setName(team.name || "");
            setFoundationDate(team.foundation_date || "");
            setLogo(team.team_pic || null);
        } else {
            setName("");
            setFoundationDate("");
            setLogo(null);
        }
    }, [team]);

    if (!isOpen) return null;

    /* ------------------------------------------------------ */
    /* SAVE TEAM */
    /* ------------------------------------------------------ */

    const handleSave = async () => {

        if (!user) return;

        const validationError = validateTeamName(name);

        if (validationError) {
            addMessage(validationError, "warning");
            return;
        }

        setSaving(true);

        try {

            let teamId = team?.team_id;
            let logoUrl = logo;

            if (!editing) {

                const file = logo?.startsWith("blob:")
                    ? await fetch(logo).then(r => r.blob())
                    : null;

                const compressed = file
                    ? await imageService.compressToWebP(file, 0.7)
                    : null;

                const createdTeam = await teamService.createTeam({
                    name,
                    creatorId: user.id,
                    foundation_date: foundationDate,
                    logoFile: compressed
                });

                teamId = createdTeam.team_id;
                logoUrl = createdTeam.team_pic;
            }

            if (!editing) {
                addTeam({
                    team_id: teamId,
                    name,
                    foundation_date: foundationDate,
                    team_pic: logoUrl,
                    role: "creator"
                });
            }

            addMessage(
                editing ? "Equipo actualizado" : "Equipo creado correctamente",
                "success"
            );

            onClose();

        } catch (error) {

            console.error(error);
            addMessage("Error al guardar el equipo", "error");

        } finally {
            setSaving(false);
        }
    };

    /* ------------------------------------------------------ */
    /* DELETE TEAM */
    /* ------------------------------------------------------ */

    const handleDeleteTeam = async () => {

        if (!team) return;

        if (!confirm("¿Seguro que deseas eliminar este equipo?")) return;

        try {

            await supabaseService.db.remove(
                "teams",
                team.team_id,
                "team_id"
            );

            const path = `${team.team_id}/logo.webp`;

            try {
                await supabaseService.storage.remove("team-pics", path);
            } catch { }

            removeTeam(team.team_id);

            addMessage("Equipo eliminado correctamente", "success");

            onClose();

        } catch (error) {

            console.error(error);
            addMessage("Error eliminando el equipo", "error");

        }
    };

    /* ------------------------------------------------------ */
    /* CLOSE ON BACKDROP */
    /* ------------------------------------------------------ */

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleBackdrop}
        >
            <div className="w-full max-w-md bg-background border border-slate-800 rounded-2xl shadow-xl relative">

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X size={18} />
                </button>

                <main className="p-6 flex flex-col gap-6">

                    {/* HEADER */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <img
                                src={logo || defaultTeam}
                                className="w-28 h-28 rounded-full object-cover border-4 border-primary"
                            />

                            <label className="absolute bottom-0 right-0 size-9 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg">
                                <Camera size={16} />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) =>
                                        setLogo(URL.createObjectURL(e.target.files[0]))
                                    }
                                />
                            </label>
                        </div>

                        <p className="text-xs text-slate-400">
                            Imagen del Team
                        </p>
                    </div>

                    {/* FORM */}
                    <div className="flex flex-col gap-4">

                        {/* NAME */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400 px-1">
                                Nombre del team
                            </label>

                            <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                <Users className="text-primary mr-3" />
                                <input
                                    value={name}
                                    disabled={editing}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`bg-transparent outline-none text-sm flex-1 ${editing ? "opacity-60 cursor-not-allowed" : ""}`}
                                />
                            </div>
                        </div>

                        {/* FOUNDATION */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-400 px-1">
                                Fundación
                            </label>

                            <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-700">
                                <Calendar className="text-primary mr-3" />
                                <input
                                    type="date"
                                    value={foundationDate}
                                    disabled={editing}
                                    onChange={(e) => setFoundationDate(e.target.value)}
                                    className={`bg-transparent outline-none text-sm flex-1 ${editing ? "opacity-60 cursor-not-allowed" : ""}`}
                                />
                            </div>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-slate-800 text-slate-300 py-3 rounded-xl"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={saving || !name}
                            className={`flex-1 bg-primary text-white font-bold py-3 rounded-xl ${(saving || !name) ? "opacity-40" : ""}`}
                        >
                            {saving ? "Guardando..." : editing ? "Guardar" : "Crear"}
                        </button>
                    </div>

                    {/* DANGER */}
                    {editing && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3">
                            <h3 className="text-red-400 font-semibold">
                                Zona de Peligro
                            </h3>

                            <p className="text-sm text-slate-400">
                                Eliminar este equipo eliminará permanentemente:
                            </p>

                            <ul className="text-sm text-slate-400 list-disc pl-4 space-y-1">
                                <li>Miembros del equipo</li>
                                <li>Publicaciones del timeline</li>
                                <li>Likes y comentarios</li>
                                <li>Posts del foro</li>
                            </ul>

                            <button
                                onClick={handleDeleteTeam}
                                className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/10"
                            >
                                <Trash2 size={16} />
                                Eliminar Equipo
                            </button>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}