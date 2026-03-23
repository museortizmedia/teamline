import { supabase } from "../../services/supabase/lib/supabaseClient"

export const authService = {

    async register({ email, password, username }) {

        // 1 verificar username disponible
        const { data: existing } = await supabase
            .from("users")
            .select("username")
            .eq("username", username)
            .maybeSingle()

        if (existing) {
            throw new Error("Username already taken")
        }

        // 2 crear usuario en auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) throw error

        const user = data.user

        // 3 crear perfil
        const { error: profileError } = await supabase
            .from("users")
            .insert({
                id: user.id,
                username: username,
                email: email,
                role: "user"
            })

        if (profileError) throw profileError

        return user
    },

    async login(email, password) {

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            })

        if (error) throw error

        return data.user
    },

    async logout() {
        await supabase.auth.signOut()
    },

    async getCurrentUser() {

        const { data } = await supabase.auth.getUser()

        if (!data.user) return null

        const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single()

        return {
            ...data.user,
            profile
        }
    }

}