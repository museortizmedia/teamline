import { supabase } from "../lib/supabaseClient"

/*
await dbService.getAll("products");
await dbService.create("products", { name: "Pizza" });
await dbService.update("products", id, { price: 20 });
await dbService.remove("products", id);
*/

export const dbService = {

    async getAll(table, query = "*", filters = {}) {
        let req = supabase.from(table).select(query);

        Object.entries(filters).forEach(([key, value]) => {
            req = req.eq(key, value);
        });

        const { data, error } = await req;

        if (error) throw error;
        return data;
    },

    async getById(table, id, keyName = "id") {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq(keyName, id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(table, payload) {
        const { data, error } = await supabase
            .from(table)
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async update(table, id, payload, keyName = "id") {
        const { data, error } = await supabase
            .from(table)
            .update(payload)
            .eq(keyName, id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async remove(table, id, keyName = "id") {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq(keyName, id);

        if (error) throw error;
        return true;
    }
};