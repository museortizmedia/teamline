import { X } from "lucide-react";

export default function MemoryEditorHeader({ onClose }) {

    return (

        <div className="flex items-center justify-between p-4 border-b border-slate-800">

            <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white"
            >
                <X />
            </button>

            <h2 className="font-bold text-lg">
                New Team Memory
            </h2>

            <button className="bg-primary px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90">
                Post
            </button>

        </div>

    );

}