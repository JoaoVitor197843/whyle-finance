import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/apiConnect";

interface AuthContextType {
    isAuthenticated: boolean | null
    loginSuccess: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verify = async () => {
            try {
                await api.get('/auth/me/')
                setIsAuthenticated(true)
            } catch {
                setIsAuthenticated(false)
            }
        }
        verify();
    }, [])

    const loginSuccess = () => setIsAuthenticated(true);

    return (
        <AuthContext.Provider value={{isAuthenticated, loginSuccess}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context
}