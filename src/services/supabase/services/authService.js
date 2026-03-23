import { supabase } from "../lib/supabaseClient";

export const authService = {

    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    },

    async register(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;
        return data.user;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        const { data } = await supabase.auth.getUser();
        return data.user;
    }

};