export const imageService = {
    // Comprime cualquier imagen a webp y devuelve un Blob
    async compressToWebP(file, quality = 0.7, maxWidth = 512) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // Calcular tamaño proporcional
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = (height / width) * maxWidth;
                    width = maxWidth;
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Error al convertir la imagen a WebP"));
                    },
                    "image/webp",
                    quality
                );
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    },
};