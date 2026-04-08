import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("budget_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
