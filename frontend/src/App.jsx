import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Register from "./Components/Register";
import NoPage from "./Components/NoPage";
import MainLayout from "./Components/MainLayout";
import UserDashboard from "./Components/UserDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import { UserProvider, UserContext } from "../context/UserContext";
import { BooksProvider } from "../context/BooksContext";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = ({ element, role }) => {
  const { currentUser } = useContext(UserContext);
  const user = currentUser || JSON.parse(sessionStorage.getItem("user"));

  console.log("ProtectedRoute: Checking user:", user);

  if (!user) return <Navigate to="/Login" replace />;
  if (role && user.role.toLowerCase() !== role.toLowerCase()) return <Navigate to="/" replace />;

  return element;
};

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <BooksProvider>
          <MainLayout>
            <Routes>
              <Route index element={<Home />} />
              <Route path="Login" element={<Login />} />
              <Route path="Register" element={<Register />} />
              <Route path="UserDashboard" element={<ProtectedRoute element={<UserDashboard />} role="user" />} />
              <Route path="AdminDashboard" element={<ProtectedRoute element={<AdminDashboard />} role="admin" />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </MainLayout>
        </BooksProvider>
      </UserProvider>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
