import { Send, X } from "lucide-react";
import { useTeam } from "../../pages/Timeline/TeamContext";

export default function MemoryEditorHeader({ onClose, onPost }) {
    const { team } = useTeam();

    return (

        <div className="flex items-center justify-between p-4 border-b border-slate-800">

            <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white"
            >
                <X />
            </button>

            <h2 className="font-bold text-lg">
                Nueva memoria para {team?.name}
            </h2>

            <button
                onClick={onPost}
                className="bg-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 flex flex-row items-center gap-2"
            >
                <Send size={16} />
                Publicar
            </button>

        </div>

    );

}