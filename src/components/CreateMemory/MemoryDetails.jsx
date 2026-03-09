export default function MemoryDetails() {

    return (

        <div className="flex flex-col gap-4">

            <label className="flex flex-col">

                <span className="text-sm font-semibold mb-1">
                    Memory Title
                </span>

                <input
                    className="bg-[#101622] border border-slate-700 rounded-lg p-3 text-sm"
                    placeholder="Final victory night"
                />

            </label>

            <label className="flex flex-col">

                <span className="text-sm font-semibold mb-1">
                    Description
                </span>

                <textarea
                    className="bg-[#101622] border border-slate-700 rounded-lg p-3 text-sm h-24 resize-none"
                    placeholder="Share the story behind this moment..."
                />

            </label>

        </div>

    );

}