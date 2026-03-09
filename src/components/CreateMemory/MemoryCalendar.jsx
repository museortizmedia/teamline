import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MemoryCalendar() {

    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    return (

        <div className="bg-[#101622] border border-slate-700 rounded-lg p-4">

            <div className="flex justify-between items-center mb-3">

                <ChevronLeft size={18} className="text-slate-400 cursor-pointer" />

                <p className="text-xs font-bold uppercase">
                    October 2023
                </p>

                <ChevronRight size={18} className="text-slate-400 cursor-pointer" />

            </div>

            <div className="grid grid-cols-7 text-xs text-slate-500 mb-1">

                {["S", "M", "T", "W", "T", "F", "S"].map(d => (
                    <span key={d} className="text-center">{d}</span>
                ))}

            </div>

            <div className="grid grid-cols-7 text-sm gap-y-1">

                {days.map(day => (

                    <button
                        key={day}
                        className="h-7 flex items-center justify-center rounded-full hover:bg-slate-700"
                    >
                        {day}
                    </button>

                ))}

            </div>

            <p className="text-[10px] text-primary/70 text-center mt-3">
                Date must be within the team season
            </p>

        </div>

    );

}