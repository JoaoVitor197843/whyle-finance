import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ type }: { type: boolean }) => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === null) return null;

    if (type && !isAuthenticated) return <Navigate to='/login' replace/>
    if (!type && isAuthenticated) return <Navigate to='/home' replace/>

    return <Outlet />
}

export default ProtectedRoute