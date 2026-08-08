import { Navigate, Route, Routes } from "react-router-dom";

import PublicRoute from "../components/layout/PublicRoute";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import MenuList from "../pages/menu/MenuList";
import CreateMenu from "../pages/menu/CreateMenu";
import EditMenu from "../pages/menu/EditMenu";

import NotFound from "../pages/NotFound";

import useAuth from "../hooks/useAuth";

function AuthLayoutRoute() {
  return <AuthLayout />;
}

function DashboardLayoutRoute() {
  const { role, logout } = useAuth();

  return (
    <DashboardLayout
      role={role}
      onLogout={logout}
    />
  );
}

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Navigate
      to={isAuthenticated ? "/dashboard" : "/login"}
      replace
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayoutRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayoutRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/menu" element={<MenuList />} />
          <Route path="/menu/create" element={<CreateMenu />} />
          <Route path="/menu/:id/edit" element={<EditMenu />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;