import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const login = (email, password) => {

        // aquí normalmente iría la llamada al backend

        if (email && password) {
            setUser({
                name: "Coach Miller",
                email: email,
                avatar: "https://i.pravatar.cc/100"
            });
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);