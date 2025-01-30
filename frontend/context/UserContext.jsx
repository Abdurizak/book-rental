import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);

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
  
      if (data.access_token && data.access_token.split('.').length === 3) { // Ensure it's a valid JWT
        sessionStorage.setItem("token", data.access_token);
        console.log("Token saved:", data.access_token);
        setAuthToken(data.access_token);
        setUser({ role: data.role });
  
        await fetchCurrentUser(data.access_token);
        toast.success("Successfully Logged in");
  
        if (data.role === "admin") {
          navigate("/AdminDashboard");
        } else if (data.role === "user") {
          navigate("/UserDashboard");
        }
      } else {
        toast.error("Invalid login credentials");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Login failed. Please try again.");
    }
  };
  
  const logout = () => {
    sessionStorage.removeItem("token");
    setAuthToken(null);
    setCurrentUser(null);
    setUser(null);
    toast.success("Successfully logged out!");
    navigate("/Login");
  };

  const fetchCurrentUser = async (token = authToken) => {
    if (!token || token.split('.').length !== 3) { // Check if it's a valid JWT format
      console.warn("Invalid or missing token! User is not authenticated.");
      return;
    }
  
    try {
      console.log("Fetching user with token:", token); // Debugging line
  
      const response = await fetch("http://127.0.0.1:5000/current_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      console.log("Fetched User Data:", data); // Debugging line
  
      if (data.email) {
        setCurrentUser(data);
      } else {
        console.error("Invalid user data received:", data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Error fetching user data");
    }
  };
  
  useEffect(() => {
    fetchCurrentUser();
  }, [authToken]);

  return (
    <UserContext.Provider value={{ login, logout, fetchCurrentUser, addUser, currentUser, user }}>
      {children}
    </UserContext.Provider>
  );
};
