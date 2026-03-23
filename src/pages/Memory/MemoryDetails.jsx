import { useMemo } from "react";

export default function MemoryDetails({
    title,
    setTitle,
    content,
    setContent
}) {

    // Lista de opciones para inspirar al usuario
    const suggestions = useMemo(() => [
        {
            title: "Aquella final bajo la lluvia",
            desc: "El marcador iba en contra, pero en el último minuto..."
        },
        {
            title: "Mi primer entrenamiento con el equipo",
            desc: "Estaba nervioso, pero desde el primer pase supe que este era mi lugar."
        },
        {
            title: "El viaje en autobús hacia el campeonato",
            desc: "Cantando canciones del equipo y soñando con la copa..."
        },
        {
            title: "Despedida del capitán",
            desc: "No hubo trofeo ese año, pero la lección de vida fue mayor."
        },
        {
            title: "El punto que lo cambió todo",
            desc: "Todavía puedo escuchar el grito de la grada cuando la pelota..."
        }
    ], []);

    // Elegimos una opción aleatoria al cargar el componente
    const placeholder = useMemo(() => {
        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }, [suggestions]);

    return (
        <div className="flex flex-col gap-5">

            <label className="flex flex-col group">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-primary transition-colors">
                    Título del Recuerdo
                </span>
                <input
                    className="bg-[#101622] border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    placeholder={placeholder.title}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>

            <label className="flex flex-col group">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-primary transition-colors">
                    La Historia
                </span>
                <textarea
                    className="bg-[#101622] border border-slate-700 rounded-xl p-3.5 text-sm text-slate-200 h-32 resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                    placeholder={placeholder.desc}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-2 italic">
                    💡 Tip: Los mejores recuerdos incluyen cómo te sentías en ese momento.
                </p>
            </label>

        </div>
    );
}