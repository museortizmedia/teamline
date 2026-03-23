import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { teamService } from "../../Timeline/teamService";
import { useTeam } from "../../Timeline/TeamContext";

export default function TeamDataStructure({ team, deleteTeamModal, setDeleteTeamModal }) {
    const { reloadTeams } = useTeam();

    const [fields, setFields] = useState([
        { name: "Position", type: "text" },
        { name: "Number", type: "number" }
    ]);

    const [deleteText, setDeleteText] = useState("");

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
        // Como struct tipo C#
        const struct = `struct MemberData {\n${fields
            .map(f => `  ${f.type} ${f.name};`)
            .join("\n")}\n}`;
        return struct;
    };

    const exportJSON = () => {
        return JSON.stringify(fields, null, 2);
    };

    const handleDeleteTeam = async () => {
        try {
            await teamService.deleteTeam({ teamId: team.team_id });
            reloadTeams(); // actualizar contexto
            setDeleteTeamModal(false);
        } catch (err) {
            console.error("Error deleting team:", err);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Member Data Fields</h2>

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

            <button
                onClick={addField}
                className="bg-primary px-4 py-2 rounded-lg"
            >
                Add Field
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

            {/* DANGER ZONE */}
            <div className="border-t border-slate-800 pt-6">
                <h3 className="text-red-400 font-bold flex items-center gap-2">
                    <AlertTriangle size={18} /> Danger Zone
                </h3>

                <p className="text-sm text-slate-400 mt-2">
                    Type <b>{team.name}</b> to confirm deletion
                </p>

                <input
                    value={deleteText}
                    onChange={(e) => setDeleteText(e.target.value)}
                    className="w-full bg-slate-800 p-3 rounded mt-2"
                    placeholder="Type team name to confirm"
                />

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={() => setDeleteTeamModal(false)}
                        className="bg-slate-700 px-4 py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleDeleteTeam}
                        disabled={deleteText !== team.name}
                        className="bg-red-600 px-4 py-2 rounded disabled:opacity-40"
                    >
                        Delete Team
                    </button>
                </div>
            </div>
        </div>
    );
}