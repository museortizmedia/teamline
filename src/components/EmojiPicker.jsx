import { useState, useMemo, useRef } from "react";

const EMOJI_CATEGORIES = [
    {
        label: "🏅 Deporte",
        emojis: [
            "⚽", "🏀", "🏉", "🏈", "⚾", "🎾", "🏐", "🥊", "🥋",
            "⛳", "🏓", "🏸", "🥅", "🎯"
        ]
    },
    {
        label: "💬 Emociones",
        emojis: [
            "😄", "😎", "🥹", "😢", "😡", "😤",
            "🤩", "😬", "😴", "🤯"
        ]
    },
    {
        label: "🤝 Equipo",
        emojis: [
            "💪", "🤝", "🧠", "🗣️", "📣",
            "👊", "✊", "🙏", "💥", "🛡️",
            "⚔️", "🤜", "🤛", "💢", "🏆",
            "🥇", "🥈", "🥉", "🎖️", "🏅",
            "👏", "🙌", "🎉", "🔥", "🚀",
            "🏃‍♂️", "🏃‍♀️", "🧱"
        ]
    },
    {
        label: "❤️",
        emojis: [
            "❤️", "🧡", "💛", "💚", "💙", "💜",
            "🖤", "🤍", "🤎", "💖", "💘", "💝"
        ]
    }
];

export default function EmojiPicker({ onSelect }) {
    const [activeCategory, setActiveCategory] = useState("all");

    const tabsRef = useRef(null);
    const tabRefs = useRef([]);

    const allEmojis = useMemo(() => {
        return EMOJI_CATEGORIES.flatMap(cat => cat.emojis);
    }, []);

    const currentEmojis =
        activeCategory === "all"
            ? allEmojis
            : EMOJI_CATEGORIES[activeCategory].emojis;

    const handleSelectCategory = (index) => {
        setActiveCategory(index);

        const el = tabRefs.current[index];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    };

    const handleSelectAll = () => {
        setActiveCategory("all");

        const el = tabRefs.current[0];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    };

    return (
        <div className="absolute bottom-12 right-0 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">

            {/* Tabs */}
            <div
                ref={tabsRef}
                className="flex overflow-x-auto border-b border-slate-700 scrollbar-thin"
            >
                <button
                    ref={(el) => (tabRefs.current[0] = el)}
                    onClick={handleSelectAll}
                    className={`px-3 py-2 text-xs whitespace-nowrap transition ${activeCategory === "all"
                        ? "text-white bg-slate-800"
                        : "text-slate-400 hover:text-white"
                        }`}
                >
                    ✨ Todos
                </button>

                {EMOJI_CATEGORIES.map((cat, i) => (
                    <button
                        key={i}
                        ref={(el) => (tabRefs.current[i + 1] = el)}
                        onClick={() => handleSelectCategory(i)}
                        className={`px-3 py-2 text-xs whitespace-nowrap transition ${activeCategory === i
                            ? "text-white bg-slate-800"
                            : "text-slate-400 hover:text-white"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="p-3 grid grid-cols-6 gap-2 max-h-52 overflow-y-auto scrollbar-thin">
                {currentEmojis.map((emoji, i) => (
                    <button
                        key={i}
                        onClick={() => onSelect(emoji)}
                        className="text-lg hover:scale-125 transition-transform"
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
}