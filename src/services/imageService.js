export const imageService = {
    async compressToWebP(file, quality = 0.7, maxWidth = 512) {

        // 🔥 Evitar recomprimir WebP
        if (file.type === "image/webp") {
            return file;
        }

        return new Promise((resolve, reject) => {

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = () => {
                try {
                    let width = img.width;
                    let height = img.height;

                    // Escalado proporcional
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
                            if (!blob) {
                                reject(new Error("Error al convertir la imagen a WebP"));
                                return;
                            }

                            // 🔥 Convertir a File (clave)
                            const webpFile = new File(
                                [blob],
                                file.name.replace(/\.\w+$/, ".webp"),
                                { type: "image/webp" }
                            );

                            resolve(webpFile);
                        },
                        "image/webp",
                        quality
                    );

                } catch (err) {
                    reject(err);
                } finally {
                    URL.revokeObjectURL(objectUrl); // 🔥 limpiar memoria
                }
            };

            img.onerror = (err) => {
                URL.revokeObjectURL(objectUrl);
                reject(err);
            };

            img.src = objectUrl;
        });
    }
};