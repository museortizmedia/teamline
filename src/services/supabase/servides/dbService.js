import { supabase } from "../lib/supabaseClient"

/*
await dbService.getAll("products");
await dbService.create("products", { name: "Pizza" });
await dbService.update("products", id, { price: 20 });
await dbService.remove("products", id);
*/

export const dbService = {

    async getAll(table, query = "*") {
        const { data, error } = await supabase
            .from(table)
            .select(query);

        if (error) throw error;
        return data;
    },

    async getById(table, id) {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq("id", id)
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

    async update(table, id, payload) {
        const { data, error } = await supabase
            .from(table)
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async remove(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    }
};