import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

const ProtectedRoute = ({ element, role }) => {
    const { currentUser } = useContext(UserContext);
    const [storedUser, setStoredUser] = useState(null);

    useEffect(() => {
        const userFromStorage = sessionStorage.getItem("user");
        if (userFromStorage) {
            setStoredUser(JSON.parse(userFromStorage));
        }
    }, []);

    const user = currentUser || storedUser;

    console.log("ProtectedRoute: Checking user:", user);

    if (!user) {
        console.warn("ProtectedRoute: No user found. Redirecting to login.");
        return <Navigate to="/Login" replace />;
    }

    if (role && user.role.toLowerCase() !== role.toLowerCase()) {
        console.warn(`ProtectedRoute: Role mismatch. Expected: ${role}, Found: ${user.role}`);
        return <Navigate to="/" replace />;
    }

    return element;
};

export default ProtectedRoute;
