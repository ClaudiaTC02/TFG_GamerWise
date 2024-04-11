import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export function useLanguage(){
    const context = useContext(LanguageContext)
    if(context === undefined){
        throw new Error('useLanguage must be used with an LanguageProvider')
    }
    return context
}