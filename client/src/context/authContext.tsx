import { userDetailsApi } from "@/api/authApi";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  userId: number;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  role: string | null;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>,
  login: (role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  role: null,
  user: null,
  setUser: () => { },
  login: () => { },
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const response = await userDetailsApi();
    setUser(response);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (token) {
      fetchUser();
      setIsAuthenticated(true);
      setRole(storedRole);
      if (!location.pathname.startsWith("/status/") && !location.pathname.startsWith("/dashboard/")) {
        navigate(storedRole === "admin" ? "/admin" : "/dashboard");
      }
    }
  }, []);

  const login = (userRole: string) => {
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
