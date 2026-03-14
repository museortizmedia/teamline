import { supabaseService } from "../services/supabase/servides/supabaseService";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recuperar sesión y perfil al montar el provider
    useEffect(() => {
        const loadSession = async () => {
            try {
                const user = await supabaseService.auth.getCurrentUser();
                if (user) {
                    setUser(user);

                    // Traer profile
                    /*const { data, error } = await supabaseService.db.client
                        .from("profiles")
                        .select("*")
                        .eq("id", user.id)
                        .single();

                    if (!error) {
                        setProfile(data);
                    }*/
                }
            } catch (error) {
                console.error("Session recovery error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    const login = async (email, password) => {
        try {

            // login en supabase auth
            const user = await supabaseService.auth.login(email, password);

            setUser(user);

            /*
            Después de autenticar, consultamos la tabla profiles
            para traer todos los datos extendidos del usuario
            */

            /*const { data, error } = await supabaseService.db.client
                 .from("profiles")
                 .select("*")
                 .eq("id", user.id)
                 .single();
 
             if (error) throw error;
 
             setProfile(data);*/

            return user;

        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    };

    const register = async ({ email, password, username }) => {

        try {

            // registrar usuario en auth
            const user = await supabaseService.auth.register(email, password);

            if (!user) return;

            /*
            Crear el profile del usuario
            normalmente el id del profile es el mismo que el auth.user.id
            */

            /*const { data, error } = await supabaseService.db.client
                .from("profiles")
                .insert([
                    {
                        id: user.id,
                        email: email,
                        username: username,
                        avatar_url: null
                    }
                ])
                .select()
                .single();

            if (error) throw error;*/

            setUser(user);
            setProfile(data);

            return user;

        } catch (error) {

            console.error("Register error:", error.message);
            throw error;

        }

    };

    const logout = async () => {

        try {

            await supabaseService.auth.logout();

            setUser(null);
            setProfile(null);

        } catch (error) {

            console.error("Logout error:", error.message);

        }

    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);