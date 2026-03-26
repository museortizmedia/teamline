import { Send, X, Loader2 } from "lucide-react";
import { useTeam } from "../../pages/Timeline/TeamContext";

export default function MemoryEditorHeader({ onClose, onPost, isPosting, isValid }) {
    const { team } = useTeam();

    return (
        <div className="flex items-center justify-between p-4 border-b border-slate-800">

            {/* BOTÓN CERRAR */}
            <button
                onClick={() => {
                    if (!isPosting) onClose();
                }}
                disabled={isPosting}
                className={`w-10 h-10 flex items-center justify-center transition
                    ${isPosting
                        ? "text-slate-600 cursor-not-allowed"
                        : "text-slate-400 hover:text-white"}
                `}
            >
                <X />
            </button>

            {/* TÍTULO */}
            <h2 className="font-bold text-lg text-center">
                Nueva memoria para {team?.name}
            </h2>

            {/* BOTÓN PUBLICAR */}
            <button
                onClick={onPost}
                disabled={isPosting || !isValid}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition
        ${(isPosting || !isValid)
                        ? "bg-slate-600 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"}
    `}
            >
                {isPosting ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Publicando...
                    </>
                ) : (
                    <>
                        <Send size={16} />
                        Publicar
                    </>
                )}
            </button>

        </div>
    );
}