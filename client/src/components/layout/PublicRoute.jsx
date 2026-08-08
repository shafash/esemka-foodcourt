import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Loader from "../common/Loader";

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader centered label="Memeriksa sesi login..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
