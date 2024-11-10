import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "../api/client";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  preferredNotification: "email" | "sms";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  preferredNotification: "email" | "sms";
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const { data } = await api.get("/users/me");
        setUser(data);
      }
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/users/login", { email, password });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      enqueueSnackbar("Successfully logged in", { variant: "success" });
      navigate("/dashboard");
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || "Login failed", {
        variant: "error",
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const { data } = await api.post("/users/register", userData);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      enqueueSnackbar("Successfully registered", { variant: "success" });
      navigate("/dashboard");
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || "Registration failed", {
        variant: "error",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    enqueueSnackbar("Successfully logged out", { variant: "success" });
    navigate("/login");
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { data: updatedUser } = await api.put("/users/me", data);
      setUser(updatedUser);
      enqueueSnackbar("Profile updated successfully", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(error.response?.data?.message || "Update failed", {
        variant: "error",
      });
      throw error;
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      await api.put("/users/me/password", { currentPassword, newPassword });
      enqueueSnackbar("Password updated successfully", { variant: "success" });
    } catch (error: any) {
      enqueueSnackbar(
        error.response?.data?.message || "Password update failed",
        {
          variant: "error",
        }
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        isAuthenticated: !!user,
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
