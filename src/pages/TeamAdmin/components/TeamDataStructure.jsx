import { useState } from "react";
import { AlertTriangle, Link as LinkIcon, Camera } from "lucide-react";
import { teamService } from "../../Timeline/teamService";
import { useTeam } from "../../Timeline/TeamContext";
import { supabaseService } from "../../../services/supabase/services/supabaseService";

import defaultAvatar from "../../../assets/default-avatar.webp";
import { useAuth } from "../../Auth/AuthContext";

export default function TeamDataStructure({ team }) {
    const { reloadTeams } = useTeam();

    const [fields, setFields] = useState([
        { name: "Position", type: "text" },
        { name: "Number", type: "number" }
    ]);

    const { user } = useAuth();
    const [deleteText, setDeleteText] = useState("");
    const [teamPic, setTeamPic] = useState(team.team_pic || null);
    const [uploading, setUploading] = useState(false);

    /* ---------- FIELD HANDLERS ---------- */
    const addField = () => {
        setFields([...fields, { name: "", type: "text" }]);
    };

    const updateField = (index, key, value) => {
        const updated = [...fields];
        updated[index][key] = value;
        setFields(updated);
    };

    /* ---------- EXPORT ---------- */
    const exportStruct = () => {
        const struct = `struct MemberData {\n${fields
            .map(f => `  ${f.type} ${f.name};`)
            .join("\n")}\n}`;
        return struct;
    };

    const exportJSON = () => JSON.stringify(fields, null, 2);

    /* ---------- TEAM HANDLERS ---------- */
    const handleDeleteTeam = async () => {
        try {
            await teamService.deleteTeam({ teamId: team.team_id });
            reloadTeams();
        } catch (err) {
            console.error("Error deleting team:", err);
        }
    };

    const handleLeaveTeam = async () => {
        try {
            await teamService.leaveTeam({ teamId: team.team_id, userId: user.id });
            reloadTeams();
        } catch (err) {
            console.error("Error leaving team:", err);
        }
    };

    const handleUploadTeamPic = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);

        try {
            // Comprimir imagen si quieres (opcional, similar a imageService)
            // const compressedFile = await imageService.compressToWebP(file, 0.7);

            const filePath = `team-pics/${team.team_id}.webp`;

            // Eliminar foto anterior si existe
            if (teamPic) {
                try {
                    await supabaseService.storage.remove("team-pics", `${team.team_id}.webp`);
                } catch { }
            }

            // Subir nueva imagen
            const { data: publicUrlData, error: uploadError } = supabaseService.supabase
                .storage
                .from("team-pics")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const publicUrl = supabaseService.supabase
                .storage
                .from("team-pics")
                .getPublicUrl(filePath).data.publicUrl;

            // Actualizar solo el team_pic en la DB
            const updatedTeam = await supabaseService.db.update(
                "teams",
                team.team_id,
                { team_pic: publicUrl, updated_at: new Date() },
                "team_id"
            );

            setTeamPic(publicUrl); // actualizar estado local
            //reloadTeams(); // refrescar contexto
        } catch (err) {
            console.error("Error updating team pic:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* ---------- TEAM INFO ---------- */}
            <div className="flex items-center gap-4 bg-slate-800 p-4 rounded">
                {/* Foto del equipo */}
                <div className="relative h-24 w-24 rounded-full border-4 border-primary p-1 group">
                    <div
                        className="h-full w-full rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${teamPic || defaultAvatar})` }}
                    />

                    {/* Overlay con icono */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition">
                        <Camera size={22} className="text-white" />
                    </div>

                    {/* Input invisible */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadTeamPic}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                        title="Cambiar foto del equipo"
                    />
                </div>

                {/* Info del equipo */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold">{team.name}</h2>
                    <p className="text-sm text-slate-400">
                        Por seguridad, no se puede cambiar el nombre del equipo
                    </p>
                    <a
                        href={`/t/${team.team_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary flex items-center gap-1 mt-1 text-sm"
                    >
                        <LinkIcon size={16} /> Ver timeline
                    </a>
                </div>
            </div>

            {/* ---------- MEMBER FIELDS ---------- */}
            <div className="opacity-10" title="Estamos trabajando en esta característica">
                <h2 className="text-xl font-bold font-display">Campos de datos de miembros</h2>
                <p className="text-sm text-slate-400">Aquí podrás agregar campos personalizados para los miembros de tu equipo.</p>
                <div className="mt-6 space-y-6">
                    {fields.map((f, i) => (
                        <div key={i} className="flex gap-2">
                            <input
                                value={f.name}
                                onChange={(e) => updateField(i, "name", e.target.value)}
                                placeholder="Field name"
                                className="flex-1 bg-slate-800 p-2 rounded text-sm"
                            />
                            <select
                                value={f.type}
                                onChange={(e) => updateField(i, "type", e.target.value)}
                                className="bg-slate-800 p-2 rounded text-sm"
                            >
                                <option value="text">text</option>
                                <option value="number">number</option>
                                <option value="date">date</option>
                            </select>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addField}
                    className="mt-2 bg-primary px-4 py-2 rounded-lg"
                >
                    Crear campo
                </button>

                <div className="space-y-2 mt-4">
                    <h3 className="font-bold">Export</h3>
                    <textarea
                        readOnly
                        value={exportStruct()}
                        className="w-full bg-slate-900 p-3 rounded h-28 text-xs font-mono"
                    />
                    <textarea
                        readOnly
                        value={exportJSON()}
                        className="w-full bg-slate-900 p-3 rounded h-28 text-xs font-mono"
                    />
                </div>
            </div>

            {/* ================= DELETE TEAM (CRITICAL) ================= */}
            {team.role === "creator" && (
                <div className="border-t border-slate-800 pt-6">
                    <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-5 space-y-4">

                        <h3 className="text-red-400 font-bold flex items-center gap-2 text-lg">
                            <AlertTriangle size={20} />
                            Eliminar equipo permanentemente
                        </h3>

                        <p className="text-sm text-slate-300">
                            Esta acción eliminará <b>definitivamente</b> el equipo para todos los miembros.
                        </p>

                        <ul className="text-xs text-red-300 list-disc pl-4 space-y-1">
                            <li>Se eliminarán todos los miembros</li>
                            <li>Se borrará el timeline completo</li>
                            <li>Se eliminarán posts, comentarios y media</li>
                            <li>No se podrá recuperar la información</li>
                        </ul>

                        <div className="space-y-2">
                            <p className="text-xs text-slate-400">
                                Escribe <b>{team.name}</b> para confirmar:
                            </p>

                            <input
                                value={deleteText}
                                onChange={(e) => setDeleteText(e.target.value)}
                                className="w-full bg-slate-900 border border-red-500/30 p-3 rounded-lg text-sm"
                                placeholder="Confirmar nombre del equipo"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleDeleteTeam}
                                disabled={deleteText !== team.name}
                                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold disabled:opacity-40"
                            >
                                Eliminar equipo
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ================= LEAVE TEAM (SOFT DANGER) ================= */}
            {team.role !== "creator" && (
                <div className="border-t border-slate-800 pt-6">
                    <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 space-y-4">

                        <h3 className="text-amber-400 font-bold flex items-center gap-2 text-lg">
                            <AlertTriangle size={20} />
                            Salir del equipo
                        </h3>

                        <p className="text-sm text-slate-300">
                            Dejarás de pertenecer a este equipo. Podrás volver a unirte si eres invitado nuevamente.
                        </p>

                        <div className="space-y-2">
                            <p className="text-xs text-slate-400">
                                Escribe <b>{team.name}</b> para confirmar:
                            </p>

                            <input
                                value={deleteText}
                                onChange={(e) => setDeleteText(e.target.value)}
                                className="w-full bg-slate-900 border border-amber-500/30 p-3 rounded-lg text-sm"
                                placeholder="Confirmar salida"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleLeaveTeam}
                                disabled={deleteText !== team.name}
                                className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-lg font-semibold disabled:opacity-40"
                            >
                                Salir del equipo
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}