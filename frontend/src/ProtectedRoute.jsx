import { Navigate } from "react-router-dom"

// This wraps your route to prevent access if not logged in
export default function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
  return isLoggedIn ? children : <Navigate to="/login" replace />
}
