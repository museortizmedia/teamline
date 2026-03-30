export const imageService = {
    async compressToWebP(file, options = {}) {

        const {
            maxSizeMB = 5,
            maxDimension = 1080, // 🔥 lado más largo
            initialQuality = 0.8,
            minQuality = 0.5,
            step = 0.05
        } = options;

        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        if (file.type === "image/webp" && file.size <= maxSizeBytes) {
            return file;
        }

        return new Promise((resolve, reject) => {

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);

            img.onload = async () => {

                try {
                    let width = img.width;
                    let height = img.height;

                    // 🔥 Escalado basado en el lado mayor
                    const maxSide = Math.max(width, height);

                    if (maxSide > maxDimension) {
                        const scale = maxDimension / maxSide;
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    let quality = initialQuality;
                    let blob;

                    // 🔁 Control por tamaño
                    while (quality >= minQuality) {

                        blob = await new Promise(res =>
                            canvas.toBlob(res, "image/webp", quality)
                        );

                        if (!blob) {
                            reject(new Error("Error al generar blob"));
                            return;
                        }

                        if (blob.size <= maxSizeBytes) break;

                        quality -= step;
                    }

                    const webpFile = new File(
                        [blob],
                        file.name.replace(/\.\w+$/, ".webp"),
                        { type: "image/webp" }
                    );

                    resolve(webpFile);

                } catch (err) {
                    reject(err);
                } finally {
                    URL.revokeObjectURL(objectUrl);
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