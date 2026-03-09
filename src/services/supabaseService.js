import { supabase } from '../supabase/supabaseClient.js'

const BUCKET_NAME = 'productos';
const MAX_SIZE_BYTES = 1000000; // 1MB

const supabaseService = {

    // normal functions
    getPublicUrlOf(data) {
        const projectUrl = supabase.supabaseUrl; // viene desde tu cliente
        const publicUrl = `${projectUrl}/storage/v1/object/public/${BUCKET_NAME}/${data.path}`;
        return publicUrl;
    },

    // async functions
    async uploadProductImage(file, restaurantId, productId, cacheDuration = 3600, maxSize = 416, quality = 0.8) {
        if (!file) return null;

        try {
            const processedFile = await this.processImage(file, maxSize, quality);

            const fileName = `${productId}-${Date.now()}.webp`;
            const filePath = `${restaurantId}/${fileName}`;

            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(filePath, processedFile, {
                    cacheControl: `${cacheDuration}`,
                    upsert: false,
                });

            if (error) {
                console.error("Error al subir imagen:", error.message);
                return null;
            }

            return this.getPublicUrlOf({ path: filePath });
        } catch (err) {
            console.error("Error procesando imagen:", err);
            return null;
        }
    },
    async uploadMediaImage(file, restaurantId, cacheDuration = 3600) {
        if (!file) {
            console.warn('Archivo no válido');
            return null;
        }

        try {
            const processedFile = await this.processImage(file, 1920, 0.85);

            if (!processedFile || processedFile.size > MAX_SIZE_BYTES) {
                console.warn('Archivo procesado no válido o excede tamaño máximo');
                return null;
            }

            // 🔹 Generar ID único real
            const mediaId = (typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const fileName = `media-${mediaId}.webp`;
            const filePath = `${restaurantId}/media/${fileName}`;

            const { data, error } = await supabase
                .storage
                .from(BUCKET_NAME)
                .upload(filePath, processedFile, {
                    cacheControl: `${cacheDuration}`,
                    upsert: false,
                    contentType: 'image/webp'
                });

            if (error) {
                console.error('Error al subir imagen a media:', error.message);
                return null;
            }

            return {
                id: mediaId,
                name: fileName,
                path: filePath,
                url: this.getPublicUrlOf({ path: filePath })
            };

        } catch (err) {
            console.error('Error procesando imagen:', err);
            return null;
        }
    },
    // Obtener todas las imágenes de la carpeta media
    async listMediaImages(restaurantId, limit = 100, offset = 0) {
        const folderPath = `${restaurantId}/media`;

        const { data, error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list(folderPath, {
                limit,
                offset,
                sortBy: { column: 'name', order: 'asc' },
            });

        if (error) {
            console.error('Error al listar imágenes media:', error.message);
            return [];
        }

        return (data || [])
            .filter(file =>
                file?.name &&                       // existe nombre
                !file.name.startsWith('.') &&       // no ocultos
                file.metadata &&                    // no carpetas
                file.name.toLowerCase().endsWith('.webp') // solo webp
            )
            .map(file => {
                const fullPath = `${folderPath}/${file.name}`;

                return {
                    id: file.id ?? file.name, // fallback estable
                    name: file.name,
                    path: fullPath,
                    url: this.getPublicUrlOf({ path: fullPath }),
                    size: file.metadata?.size
                        ? (file.metadata.size / (1024 * 1024)).toFixed(1) + 'MB'
                        : null
                };
            });
    },
    // Eliminar imagen por ruta completa
    async deleteMediaImage(filePath) {
        const { error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) {
            console.error('Error al eliminar imagen media:', error.message);
            return false;
        }

        return true;
    },

    async processImage(file, maxSize = 1920, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = () => {
                img.src = reader.result;
            };

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ratio = img.width / img.height;

                let newWidth = img.width;
                let newHeight = img.height;

                if (img.width > img.height && img.width > maxSize) {
                    newWidth = maxSize;
                    newHeight = Math.round(maxSize / ratio);
                } else if (img.height > maxSize) {
                    newHeight = maxSize;
                    newWidth = Math.round(maxSize * ratio);
                }

                canvas.width = newWidth;
                canvas.height = newHeight;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error("Error convirtiendo imagen"));

                        const webpFile = new File(
                            [blob],
                            file.name.replace(/\.\w+$/, ".webp"),
                            {
                                type: "image/webp",
                                lastModified: Date.now(),
                            }
                        );

                        resolve(webpFile);
                    },
                    "image/webp",
                    quality
                );
            };

            img.onerror = reject;
            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    },

    /*
    const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    const url = await supabaseService.uploadProductImage(
      file,
      restaurant.id,
      'prod456'
    );

        console.log('URL pública:', url);

    }
        <input type="file" accept="image/*" onChange={handleFileUpload} />
    */

    // Iniciar sesión con email y contraseña
    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('Login error:', error.message)
            return null
        }

        return data.user
    },

    // Cerrar sesión
    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            //console.error('Error al cerrar sesión:', error.message);
        } else {
            //console.log('✅ Sesión cerrada correctamente');
        }
    },

    // Obtener sesión actual
    async getCurrentUser() {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        return user
    },

}

export default supabaseService;