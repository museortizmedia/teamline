import { ImagePlus } from "lucide-react";

export default function MediaGallery() {

    return (

        <div className="flex-1 bg-[#101622] border-r border-slate-800 p-6 flex flex-col gap-4">

            <div className="flex justify-between">

                <h3 className="font-semibold">
                    Media Gallery
                </h3>

                <span className="text-xs text-slate-500">
                    JPG · PNG · MP4
                </span>

            </div>

            {/* DROP ZONE */}

            <div className="flex-1 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary cursor-pointer">

                <ImagePlus className="w-10 h-10 text-primary" />

                <p className="text-sm text-slate-400">
                    Drag photos or videos here
                </p>

            </div>

            {/* PREVIEW */}

            <div className="grid grid-cols-4 gap-3">

                <div className="aspect-square bg-slate-800 rounded-lg" />
                <div className="aspect-square bg-slate-800 rounded-lg" />

                <button className="aspect-square border border-dashed border-slate-700 rounded-lg flex items-center justify-center">

                    <ImagePlus size={20} />

                </button>

            </div>

        </div>

    );

}