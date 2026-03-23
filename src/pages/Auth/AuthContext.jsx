import { createContext, useContext, useEffect, useState } from "react";
import { supabaseService } from "../../services/supabase/services/supabaseService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recuperar sesión y perfil al montar
    useEffect(() => {
        const loadSession = async () => {
            try {
                const user = await supabaseService.auth.getCurrentUser();
                if (user) {
                    setUser(user);

                    // Traer perfil directamente por user_id
                    try {
                        const profileData = await supabaseService.db.getById(
                            "profiles",
                            user.id,
                            "user_id"
                        );
                        setProfile(profileData || null);
                    } catch {
                        setProfile(null);
                    }
                }
            } catch (error) {
                console.error("Session recovery error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, []);

    // LOGIN
    const login = async (email, password) => {
        try {
            const user = await supabaseService.auth.login(email, password);
            setUser(user);

            // Traer perfil por user_id
            const profileData = await supabaseService.db.getById(
                "profiles",
                user.id,
                "user_id",
            );
            setProfile(profileData || null);

            return user;
        } catch (error) {
            console.error("Login error:", error.message);
            throw error;
        }
    };

    // REGISTER
    const register = async ({ email, password, username }) => {
        try {
            // Validar username único
            try {
                const existing = await supabaseService.db.getById(
                    "profiles",
                    username,
                    "username",
                );
                if (existing) throw new Error("El username ya está en uso");
            } catch {
                // No existe → ok
            }

            // Crear usuario en Auth primero
            const user = await supabaseService.auth.register(email, password);
            if (!user) throw new Error("No se pudo crear el usuario en Auth");

            // Crear perfil solo con UID válido
            const profileData = await supabaseService.db.create("profiles", {
                user_id: user.id,
                username,
                display_name: username,
                profile_pic: null,
                birthday: null,
                deleted_at: null
            });

            setUser(user);
            setProfile(profileData);

            return user;
        } catch (error) {
            console.error("Register error:", error.message);
            throw error;
        }
    };

    // LOGOUT
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
                setProfile,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);