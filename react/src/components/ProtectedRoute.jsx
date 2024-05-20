import { useAuth } from "../hooks/useAuth"
import {Navigate, Outlet} from 'react-router-dom'
import { Loading } from "./Loading"
export function ProtectedRoute() {

    const {loading, isAuthenticated} = useAuth()
    if(loading) return (<Loading/>)
    if(!loading && !isAuthenticated) return <Navigate to='/login' replace/>

    return <Outlet/>
}