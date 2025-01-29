import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from '../../context/UserContext';


// Protected Route Component
const ProtectedRoute = ({ element, role }) => {
    const { user } = useContext(UserContext);
  
    if (!user) return <Navigate to="/Login" />; // Redirect if not logged in
    if (role && user.role !== role) return <Navigate to="/" />; // Redirect if role doesn't match
  
    return element;
  };
  

export default ProtectedRoute;
