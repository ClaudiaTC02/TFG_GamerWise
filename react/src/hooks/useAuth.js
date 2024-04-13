import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth(){
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error('useAuth must be used with an AuthProvider')
    }
    return context
}