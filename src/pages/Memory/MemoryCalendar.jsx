import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function MemoryCalendar({ date, setDate, locale = "es-ES" }) {
    const [showPicker, setShowPicker] = useState(false);

    const initialDate = date ? new Date(date) : new Date();

    const [currentMonth, setCurrentMonth] = useState(
        new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
    );

    const selectedDate = new Date(date);

    // ===============================
    // 📅 HELPERS
    // ===============================
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfWeek = (year, month) => {
        return new Date(year, month, 1).getDay(); // 0 = Domingo
    };

    const formatToISO = (year, month, day) => {
        const d = new Date(year, month, day);
        return d.toISOString().split("T")[0];
    };

    const isSameDay = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    // Generar cabecera de días (L, M, X...) según el locale
    const getDaysHeader = () => {
        const days = [];
        const baseDate = new Date(2024, 0, 7); // Un domingo
        for (let i = 0; i < 7; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            days.push(d.toLocaleDateString(locale, { weekday: "narrow" }).toUpperCase());
        }
        return days;
    };

    // ===============================
    // 📅 DATA
    // ===============================
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);

    const monthName = currentMonth.toLocaleDateString(locale, {
        month: "long",
        year: "numeric"
    });

    // ===============================
    // 🎯 UI
    // ===============================
    return (
        <div className="bg-[#101622] border border-slate-700 rounded-xl p-4">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3 relative">

                <button
                    onClick={() =>
                        setCurrentMonth(new Date(year, month - 1, 1))
                    }
                    className="hover:bg-slate-800 p-1 rounded-full transition"
                >
                    <ChevronLeft size={18} className="text-slate-400" />
                </button>

                {/* CLICKABLE */}
                <button
                    onClick={() => setShowPicker(prev => !prev)}
                    className="text-xs font-bold uppercase tracking-wide hover:text-primary transition"
                >
                    {monthName}
                </button>

                <button
                    onClick={() =>
                        setCurrentMonth(new Date(year, month + 1, 1))
                    }
                    className="hover:bg-slate-800 p-1 rounded-full transition"
                >
                    <ChevronRight size={18} className="text-slate-400" />
                </button>

                {/* PICKER */}
                {showPicker && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#020617] border border-slate-700 rounded-xl p-3 flex gap-2 z-50 shadow-xl">

                        {/* MONTH */}
                        <select
                            value={month}
                            onChange={(e) => {
                                const newMonth = parseInt(e.target.value);
                                setCurrentMonth(new Date(year, newMonth, 1));
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-primary"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i}>
                                    {new Date(0, i).toLocaleString(locale, { month: "short" })}
                                </option>
                            ))}
                        </select>

                        {/* YEAR */}
                        <select
                            value={year}
                            onChange={(e) => {
                                const newYear = parseInt(e.target.value);
                                setCurrentMonth(new Date(newYear, month, 1));
                            }}
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none focus:border-primary"
                        >
                            {Array.from({ length: 50 }).map((_, i) => {
                                const y = new Date().getFullYear() - 25 + i;
                                return (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                );
                            })}
                        </select>

                    </div>
                )}

            </div>

            {/* DAYS HEADER */}
            <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
                {getDaysHeader().map((d, i) => (
                    <span key={i} className="text-center font-medium">
                        {d}
                    </span>
                ))}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-7 gap-y-1 text-sm justify-items-center">

                {/* EMPTY SPACES */}
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={"empty-" + i} className="h-8 w-8" />
                ))}

                {/* DAYS */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const current = new Date(year, month, day);
                    const isSelected = isSameDay(current, selectedDate);

                    return (
                        <button
                            key={day}
                            onClick={() => {
                                setDate(formatToISO(year, month, day));
                                setShowPicker(false);
                            }}
                            className={`
                                h-8 w-8 flex items-center justify-center rounded-full transition
                                ${isSelected
                                    ? "bg-primary text-white font-bold"
                                    : "hover:bg-slate-700 text-slate-300"}
                            `}
                        >
                            {day}
                        </button>
                    );
                })}

            </div>

            {/* FEEDBACK */}
            <p className="text-[10px] text-primary/70 text-center mt-3">
                {locale.startsWith("es") ? "Fecha seleccionada:" : "Selected date:"}{" "}
                <span className="font-medium text-slate-300">
                    {selectedDate.toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    })}
                </span>
            </p>

        </div>
    );
}