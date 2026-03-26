import exifr from "exifr";
import { ImagePlus, LucideImageOff, X } from "lucide-react";

export default function MediaGallery({ files, setFiles, minDate, maxDate, setDate, setDateTouched }) {

    const isDateValid = (dateString) => {
        if (!dateString) return false;

        const d = new Date(dateString);
        const min = minDate ? new Date(minDate) : null;
        const max = maxDate ? new Date(maxDate) : null;

        if (min && d < min) return false;
        if (max && d > max) return false;

        return true;
    };

    const extractDateFromFile = async (file) => {
        try {
            const exif = await exifr.parse(file);

            if (exif?.DateTimeOriginal) {
                const d = new Date(exif.DateTimeOriginal);

                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                const dd = String(d.getDate()).padStart(2, "0");

                return `${yyyy}-${mm}-${dd}`;
            }

        } catch (e) {
            console.warn("EXIF error", e);
        }

        return null;
    };

    const handleFiles = async (newFiles) => {
        const currentFiles = [...files];
        const addedFiles = Array.from(newFiles);

        const processed = await Promise.all(
            addedFiles.map(async (file) => ({
                file,
                date: file.type.startsWith("image")
                    ? await extractDateFromFile(file)
                    : null
            }))
        );

        const totalFiles = [...currentFiles, ...processed].slice(0, 6);

        setFiles(totalFiles);
    };

    const removeFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSelectDateFromImage = (date) => {
        if (!date) return;
        if (!isDateValid(date)) return;

        setDate(date);
        setDateTouched(true);
    };

    const isFull = files.length >= 6;

    return (
        <div className="flex-1 bg-[#0B1220] border-r border-slate-800 p-6 flex flex-col gap-4">

            <input
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                id="fileInput"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={isFull}
            />

            <label
                htmlFor="fileInput"
                className={`flex-1 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-3 transition ${isFull
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary cursor-pointer"
                    }`}
            >
                {!isFull ? <ImagePlus className="w-10 h-10 text-primary" /> : <LucideImageOff className="w-10 h-10 text-primary" />}
                <p className="text-sm text-slate-400">
                    {isFull ? "Máximo 6 archivos alcanzado" : "Arrastra o selecciona fotos / videos"}
                </p>
                {isFull && (
                    <p className="text-xs text-amber-400">Elimina archivos para añadir nuevos</p>
                )}
            </label>

            {files.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {files.map(({ file, date }, i) => (
                        <div
                            key={i}
                            onClick={() => handleSelectDateFromImage(date)}
                            className={`
                                relative aspect-square rounded-xl overflow-hidden border border-slate-700 group
                                ${date && isDateValid(date) ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"}
                                transition
                            `}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile(i);
                                }}
                                className="absolute top-1.5 right-1.5 z-10 p-1.5 bg-black/60 rounded-full text-white shadow-lg transition-all 
                                opacity-100 
                                md:opacity-0 md:group-hover:opacity-100"
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {file.type.startsWith("video") ? (
                                <video
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                    alt={`Vista previa ${i + 1}`}
                                />
                            )}

                            {date && (
                                <div
                                    className={`
                                        absolute bottom-1.5 left-1.5 z-10
                                        px-2 py-0.5 text-[10px] font-medium
                                        rounded-full shadow-lg backdrop-blur-sm
                                        ${isDateValid(date)
                                            ? "bg-black/60 text-white"
                                            : "bg-red-600/80 text-white"}
                                    `}
                                >
                                    {new Date(date).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </div>
                            )}

                            {date && isDateValid(date) && (
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition pointer-events-none" />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent 
                                opacity-100 
                                md:opacity-0 md:group-hover:opacity-100 
                                transition-opacity pointer-events-none"
                            />
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}