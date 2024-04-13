import { createContext, useState } from "react";
import { registerRequest, loginRequest } from "../api/auth";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const signUp = async (user) => {
        try {
            const newUser = {
                name: user.name,
                email: user.email,
                password: user.password
            }
            const res = await registerRequest(newUser)
            setUser(res.data);
            setError(null); 
            setIsAuthenticated(true)
        } catch (error) {
            setError(error.message); 
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    const signIn = async (user) => {
        try {
            const userToLogin = {
                email: user.email,
                password: user.password
            }
            const res = await loginRequest(userToLogin)
            console.log(res.user)
            setUser(res.user);
            setError(null); 
            setIsAuthenticated(true)
        } catch (error) {
            setError(error.message); 
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    return (
        <AuthContext.Provider value={{
            signUp,
            signIn,
            user,
            error,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}