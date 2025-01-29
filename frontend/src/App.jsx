import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "../context/UserContext";
import { BooksProvider } from "../context/BooksContext";
import MainLayout from "./Components/MainLayout";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import AdminDashboard from "./Components/AdminDashboard";
import UserDashboard from "./Components/UserDashboard";
import NoPage from "./Components/NoPage";
import ProtectedRoute from "./Components/ProtectedRoute"; // Import ProtectedRoute
import { ToastContainer } from "react-toastify";

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
              <Route
                path="user-dashboard"
                element={<ProtectedRoute element={<UserDashboard />} role="user" />}
              />
              <Route
                path="admin-dashboard"
                element={<ProtectedRoute element={<AdminDashboard />} role="admin" />}
              />
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
