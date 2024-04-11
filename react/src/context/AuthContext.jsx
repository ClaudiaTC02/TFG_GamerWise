import { createContext, useState } from "react";
import { registerRequest } from "../api/auth";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null);

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
        } catch (error) {
            setError(error.message); 
        }
    }

    return (
        <AuthContext.Provider value={{
            signUp,
            user,
            error
        }}>
            {children}
        </AuthContext.Provider>
    )
}