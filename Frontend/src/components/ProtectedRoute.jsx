import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ allowedRole }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/auth/check-session`, {
        withCredentials: true,
      })
      .then((res) => {
        const userRole = res.data.user?.role;
        if (userRole !== allowedRole) {
          const redirectPath =
            userRole === "librarian" ? "/admin-dashboard" : "/student-dashboard";
          navigate(redirectPath, { replace: true });
        } else {
          setAuthorized(true);
        }
      })
      .catch((err) => {
        console.error("Session check failed:", err);
        localStorage.removeItem("role");
        navigate("/", { replace: true });
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [allowedRole, navigate]);

  if (isChecking) return <div>Checking session...</div>;
  if (!authorized) return null; // Or redirect to home

  return <Outlet />;
};
export default ProtectedRoute;



