import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "../Auth/Features/authService"

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const login = async (email, password) => {

        const user = await authService.login(email, password)
        setUser(user)

    }

    const register = async (payload) => {

        const user = await authService.register(payload)
        setUser(user)

    }

    const logout = async () => {

        await authService.logout()
        setUser(null)

    }

    useEffect(() => {

        async function init() {

            const user = await authService.getCurrentUser()
            setUser(user)
            setLoading(false)

        }

        init()

    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}