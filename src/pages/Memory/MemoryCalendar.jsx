import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { parseLocalDate } from "../../utils/parseLocalDate";

export default function MemoryCalendar({
    date,
    setDate,
    locale = "es-ES",
    minDate,
    maxDate
}) {
    const [showPicker, setShowPicker] = useState(false);

    const createLocalDate = (year, month, day) =>
        new Date(year, month, day, 0, 0, 0, 0);

    const formatToLocalISO = (year, month, day) => {
        const yyyy = year;
        const mm = String(month + 1).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const isSameDay = (d1, d2) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();

    const getFirstDayOfWeek = (year, month) =>
        new Date(year, month, 1).getDay();

    const getDaysHeader = () => {
        const days = [];
        const baseDate = new Date(2024, 0, 7);
        for (let i = 0; i < 7; i++) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() + i);
            days.push(
                d.toLocaleDateString(locale, { weekday: "narrow" }).toUpperCase()
            );
        }
        return days;
    };

    const min = parseLocalDate(minDate);
    const max = parseLocalDate(maxDate);

    const isDateDisabled = (date) =>
        (min && date < min) || (max && date > max);

    const selectedDate = date ? parseLocalDate(date) : null;

    const [currentMonth, setCurrentMonth] = useState(
        selectedDate
            ? createLocalDate(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                1
            )
            : createLocalDate(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
            )
    );

    useEffect(() => {
        if (!selectedDate) return;

        const newMonth = createLocalDate(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        );

        if (
            currentMonth.getFullYear() !== newMonth.getFullYear() ||
            currentMonth.getMonth() !== newMonth.getMonth()
        ) {
            setCurrentMonth(newMonth);
        }
    }, [date]);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfWeek(year, month);

    const monthName = currentMonth.toLocaleDateString(locale, {
        month: "long",
        year: "numeric"
    });

    const canGoPrev =
        !min ||
        createLocalDate(year, month - 1, 1) >=
        createLocalDate(min.getFullYear(), min.getMonth(), 1);

    const canGoNext =
        !max ||
        createLocalDate(year, month + 1, 1) <=
        createLocalDate(max.getFullYear(), max.getMonth(), 1);

    return (
        <div className="bg-[#101622] border border-slate-700 rounded-xl p-3">
            <div className="flex justify-between items-center mb-3 relative">
                <button
                    disabled={!canGoPrev}
                    onClick={() =>
                        setCurrentMonth(createLocalDate(year, month - 1, 1))
                    }
                    className={`p-1 rounded-full transition ${!canGoPrev
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-slate-800"
                        }`}
                >
                    <ChevronLeft size={18} className="text-slate-400" />
                </button>

                <button
                    onClick={() => setShowPicker((prev) => !prev)}
                    className="text-xs font-bold uppercase tracking-wide hover:text-primary transition"
                >
                    {monthName}
                </button>

                <button
                    disabled={!canGoNext}
                    onClick={() =>
                        setCurrentMonth(createLocalDate(year, month + 1, 1))
                    }
                    className={`p-1 rounded-full transition ${!canGoNext
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-slate-800"
                        }`}
                >
                    <ChevronRight size={18} className="text-slate-400" />
                </button>

                {showPicker && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#020617] border border-slate-700 rounded-xl p-3 flex gap-2 z-50 shadow-xl">
                        <select
                            value={month}
                            onChange={(e) =>
                                setCurrentMonth(
                                    createLocalDate(
                                        year,
                                        parseInt(e.target.value),
                                        1
                                    )
                                )
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i}>
                                    {new Date(0, i).toLocaleString(locale, {
                                        month: "short"
                                    })}
                                </option>
                            ))}
                        </select>

                        <select
                            value={year}
                            onChange={(e) =>
                                setCurrentMonth(
                                    createLocalDate(
                                        parseInt(e.target.value),
                                        month,
                                        1
                                    )
                                )
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 outline-none"
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

            <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">
                {getDaysHeader().map((d, i) => (
                    <span key={i} className="text-center font-medium">
                        {d}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-sm justify-items-center">
                {Array.from({ length: 42 }).map((_, index) => {
                    const dayNumber = index - firstDay + 1;
                    const current = createLocalDate(year, month, dayNumber);

                    const isCurrentMonth =
                        dayNumber > 0 && dayNumber <= daysInMonth;
                    const isSelected =
                        isCurrentMonth &&
                        selectedDate &&
                        isSameDay(current, selectedDate);
                    const isDisabled =
                        !isCurrentMonth || isDateDisabled(current);

                    return (
                        <button
                            key={index}
                            disabled={isDisabled}
                            onClick={() => {
                                if (!isCurrentMonth || isDisabled) return;
                                setDate(
                                    formatToLocalISO(year, month, dayNumber)
                                );
                                setShowPicker(false);
                            }}
                            className={`
                                h-8 w-8 flex items-center justify-center rounded-full transition
                                ${!isCurrentMonth
                                    ? "opacity-0 pointer-events-none"
                                    : isDisabled
                                        ? "text-slate-600 opacity-40 cursor-not-allowed"
                                        : isSelected
                                            ? "bg-primary text-white font-bold"
                                            : "hover:bg-slate-700 text-slate-300"
                                }
                            `}
                        >
                            {isCurrentMonth ? dayNumber : ""}
                        </button>
                    );
                })}
            </div>

            <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-sm font-semibold text-white">
                    {selectedDate?.toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    })}
                </span>

                {(minDate || maxDate) && (
                    <div className="flex justify-between w-full px-4 text-[10px] text-slate-400">
                        {minDate && (
                            <span>
                                {locale.startsWith("es")
                                    ? "Fecha mínima:"
                                    : "Minimum date:"}{" "}
                                <span className="font-medium text-slate-300">
                                    {parseLocalDate(minDate).toLocaleDateString(
                                        locale,
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}
                                </span>
                            </span>
                        )}
                        {maxDate && (
                            <span>
                                {locale.startsWith("es")
                                    ? "Fecha máxima:"
                                    : "Maximum date:"}{" "}
                                <span className="font-medium text-slate-300">
                                    {parseLocalDate(maxDate).toLocaleDateString(
                                        locale,
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}
                                </span>
                            </span>
                        )}
                    </div>
                )}

                <span className="text-[10px] text-slate-500 text-center px-4">
                    {locale.startsWith("es")
                        ? "Sólo puedes publicar en tus fechas activas como miembro."
                        : "You can only add memories on your active member dates."}
                </span>
            </div>
        </div>
    );
}