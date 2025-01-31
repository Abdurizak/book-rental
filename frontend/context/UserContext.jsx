import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const addUser = async (username, email, password, grade, role) => {
    try {
      toast.loading("Adding User...");
      const response = await fetch("http://127.0.0.1:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, grade, role }),
      });
      const data = await response.json();

      toast.dismiss();
      if (data.success) {
        toast.success(data.success);
        navigate("/Login");
      } else {
        toast.error(data.error || "Failed to add user");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while adding user");
    }
  };

  const login = async (email, password, role) => {
    try {
      toast.loading("Logging you in...");
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      toast.dismiss();

      if (data.access_token && data.access_token.split('.').length === 3) {
        sessionStorage.setItem("token", data.access_token);
        console.log("Token saved:", data.access_token);
        setAuthToken(data.access_token);

        const userData = { email, role };
        sessionStorage.setItem("user", JSON.stringify(userData)); 
        setCurrentUser(userData);

        // Redirect user based on role
        if (role.toLowerCase() === "admin") {
          navigate("/AdminDashboard");
        } else if (role.toLowerCase() === "user") {
          navigate("/UserDashboard");
        } else {
          navigate("/");
        }

        toast.success("Successfully Logged in");
      } else {
        toast.error("Invalid login credentials");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Login failed. Please try again.");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setAuthToken(null);
    setCurrentUser(null);
    toast.success("Successfully logged out!");
    navigate("/Login");
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ login, logout, addUser, currentUser }}>
      {children}
    </UserContext.Provider>
  );
};
