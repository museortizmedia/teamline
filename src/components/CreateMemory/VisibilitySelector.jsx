export default function VisibilitySelector() {

    return (

        <div className="flex flex-col gap-3">

            <p className="text-sm font-semibold">
                Visibility
            </p>

            <label className="flex items-center gap-3 p-3 bg-[#101622] border border-slate-700 rounded-lg cursor-pointer">

                <input type="radio" name="visibility" defaultChecked />

                <div className="flex flex-col">

                    <span className="text-xs font-bold">
                        Everyone
                    </span>

                    <span className="text-[10px] text-slate-500">
                        All team members
                    </span>

                </div>

            </label>

            <label className="flex items-center gap-3 p-3 bg-[#101622] border border-slate-700 rounded-lg cursor-pointer">

                <input type="radio" name="visibility" />

                <div className="flex flex-col">

                    <span className="text-xs font-bold">
                        Staff Only
                    </span>

                    <span className="text-[10px] text-slate-500">
                        Coaches and managers
                    </span>

                </div>

            </label>

            <label className="flex items-center gap-3 p-3 bg-[#101622] border border-slate-700 rounded-lg cursor-pointer">

                <input type="radio" name="visibility" />

                <div className="flex flex-col">

                    <span className="text-xs font-bold">
                        Draft
                    </span>

                    <span className="text-[10px] text-slate-500">
                        Only visible to you
                    </span>

                </div>

            </label>

        </div>

    );

}