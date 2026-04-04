import { useMemo, useState, useRef } from "react";
import EmojiPicker from "../../components/EmojiPicker";
import { Smile } from "lucide-react";

export default function MemoryDetails({
    title,
    setTitle,
    content,
    setContent
}) {
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

    const placeholder = useMemo(() => {
        return suggestions[Math.floor(Math.random() * suggestions.length)];
    }, [suggestions]);

    // EMOJI PICKER
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeField, setActiveField] = useState(null);

    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const insertAtCursor = (emoji) => {
        if (activeField === "title") {
            const el = titleRef.current;
            const start = el.selectionStart;
            const end = el.selectionEnd;

            const newText =
                title.slice(0, start) + emoji + title.slice(end);

            setTitle(newText);

            setTimeout(() => {
                el.selectionStart = el.selectionEnd = start + emoji.length;
                el.focus();
            }, 0);
        }

        if (activeField === "content") {
            const el = contentRef.current;
            const start = el.selectionStart;
            const end = el.selectionEnd;

            const newText =
                content.slice(0, start) + emoji + content.slice(end);

            setContent(newText);

            setTimeout(() => {
                el.selectionStart = el.selectionEnd = start + emoji.length;
                el.focus();
            }, 0);
        }
    };

    return (
        <div className="flex flex-col gap-5">

            <label className="flex flex-col group">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-primary transition-colors">
                    Título del Recuerdo
                </span>

                <div className="relative">
                    <input
                        ref={titleRef}
                        className="w-full bg-[#101622] border border-slate-700 rounded-xl p-3.5 pr-10 text-sm text-slate-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                        placeholder={placeholder.title}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setActiveField("title")}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setActiveField("title");
                            setShowEmojiPicker(prev => !prev);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                        <Smile
                            size={18}
                            className={`transition-all ${showEmojiPicker && activeField === "title"
                                ? "text-primary scale-110"
                                : "text-slate-400 hover:text-white"
                                }`}
                        />
                    </button>

                    {showEmojiPicker && activeField === "title" && (
                        <div className="absolute right-0 top-[70%] mt-2 w-[500px]">
                            <EmojiPicker
                                onSelect={(emoji) => {
                                    insertAtCursor(emoji);
                                    //setShowEmojiPicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </label>

            <label className="flex flex-col group">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-primary transition-colors">
                    La Historia
                </span>

                <div className="relative">
                    <textarea
                        ref={contentRef}
                        className="w-full bg-[#101622] border border-slate-700 rounded-xl p-3.5 pr-10 text-sm text-slate-200 h-32 resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-600"
                        placeholder={placeholder.desc}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setActiveField("content")}
                    />

                    <button
                        type="button"
                        onClick={() => {
                            setActiveField("content");
                            setShowEmojiPicker(prev => !prev);
                        }}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white"
                    >
                        <Smile
                            size={18}
                            className={`transition-all ${showEmojiPicker && activeField === "content"
                                ? "text-primary scale-110"
                                : "text-slate-400 hover:text-white"
                                }`}
                        />
                    </button>

                    {showEmojiPicker && activeField === "content" && (
                        <div className="absolute right-0 top-[20%] mt-2 w-[500px]">
                            <EmojiPicker
                                onSelect={(emoji) => {
                                    insertAtCursor(emoji);
                                    //setShowEmojiPicker(false);
                                }}
                            />
                        </div>
                    )}
                </div>

                <p className="text-sm text-slate-500 mt-2 italic">
                    💡 Tip: Los mejores recuerdos incluyen cómo te sentías en ese momento.
                </p>
            </label>

        </div>
    );
}