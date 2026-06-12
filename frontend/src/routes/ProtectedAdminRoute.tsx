import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedAdminRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
