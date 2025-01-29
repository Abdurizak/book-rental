import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem("token"));
  const [current_user, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null); // Store user role

  // Add User
  const addUser = (username, email, password, grade, role) => {
    toast.loading("...Adding User");
    fetch("http://127.0.0.1:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, grade, role }),
    })
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);

        if (response.success) {
          toast.dismiss();
          toast.success(response.success);
          navigate("/Login");
        } else if (response.error) {
          toast.dismiss();
          toast.error(response.error);
        } else {
          toast.dismiss();
          toast.error("Failed to add");
        }
      });
  };

  // Login
  const login = async (email, password, role) => {
    try {
      toast.loading("Logging you in...");
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.access_token) {
        toast.dismiss();

        sessionStorage.setItem("token", data.access_token);
        setAuthToken(data.access_token);
        setUser({ role: data.role }); // Store the user's role

        fetch("http://127.0.0.1:5000/current_user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access_token}`,
          },
        })
          .then((res) => res.json())
          .then((resData) => {
            if (resData.email) {
              setCurrentUser(resData); // Set current user data
            }
          });

        toast.success("Successfully Logged in");

        // After successful login, redirect based on role
        if (data.role === "admin") {
          navigate("/admin-dashboard");  // Redirect to admin dashboard
        } else {
          navigate("/user-dashboard");  // Redirect to user dashboard
        }
      } else if (data.error) {
        toast.dismiss();
        toast.error(data.error);
      } else {
        toast.dismiss();
        toast.error("Failed to login");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  // Logout
  const logout = async () => {
    sessionStorage.removeItem("token");
    setAuthToken(null);
    setCurrentUser(null);
    setUser(null); // Clear user role
    toast.success("Successfully logged out!");
    navigate("/Login");
  };

  // Fetch Current User
  const fetchCurrentUser = () => {
    console.log("Current user function ", authToken);

    if (authToken) {
      fetch("http://127.0.0.1:5000/current_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.email) {
            setCurrentUser(response); // Set current user data
          }
        });
    }
  };

  // Fetch All Users
  const getUsers = () => {
    console.log("Fetching all Users");
  };

  // Update User
  const updateUser = (userId, updatedData) => {
    console.log("Update User", userId, updatedData);
  };

  // Delete User
  const deleteUser = async (userId) => {
    console.log("Delete user:", userId);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const data = {
    login,
    logout,
    fetchCurrentUser,
    getUsers,
    deleteUser,
    updateUser,
    addUser,
    current_user,
    user, // Exposes the user role
  };

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
