import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
