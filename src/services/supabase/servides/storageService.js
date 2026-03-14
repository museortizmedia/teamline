import { supabase } from "../lib/supabaseClient";

/*
await storageService.upload(
  "productos",
  "123/image.webp",
  file
);
*/

export const storageService = {

    getPublicUrl(bucket, path) {
        const { data } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    },

    async upload(bucket, path, file, cache = 3600) {

        const { error } = await supabase
            .storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: `${cache}`,
                upsert: false
            });

        if (error) throw error;

        return this.getPublicUrl(bucket, path);
    },

    async remove(bucket, path) {

        const { error } = await supabase
            .storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;

        return true;
    },

    async list(bucket, folder) {

        const { data, error } = await supabase
            .storage
            .from(bucket)
            .list(folder);

        if (error) throw error;

        return data;
    }

};