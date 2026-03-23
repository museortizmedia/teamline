import { ImagePlus, LucideImageOff, X } from "lucide-react"; // Importamos el icono X

export default function MediaGallery({ files, setFiles }) {

    const handleFiles = (newFiles) => {
        // Obtenemos los archivos actuales y los nuevos
        const currentFiles = [...files];
        const addedFiles = Array.from(newFiles);

        // Combinamos y limitamos a un máximo de 6
        const totalFiles = [...currentFiles, ...addedFiles].slice(0, 6);

        setFiles(totalFiles);
    };

    // Función para eliminar un archivo por su índice
    const removeFile = (indexToRemove) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
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
                // Deshabilitar el input si ya hay 6 archivos
                disabled={isFull}
            />

            {/* DROPZONE */}
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

            {/* PREVIEW */}
            {files.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {files.map((file, i) => (
                        <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group"
                        >
                            {/* Botón para eliminar */}
                            <button
                                onClick={() => removeFile(i)}
                                className="absolute top-1.5 right-1.5 z-10 p-1.5 bg-black/60 rounded-full text-white shadow-lg transition-all 
                               opacity-100 
                               md:opacity-0 md:group-hover:opacity-100"
                                title="Eliminar archivo"
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

                            {/* Overlay: Siempre visible en móvil, hover en desktop */}
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