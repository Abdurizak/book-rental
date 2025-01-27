import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Components/Home";
import Register from "./Components/Register";
import NoPage from "./Components/NoPage";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import MainLayout from "./Components/MainLayout";
import { UserProvider } from '../context/UserContext';
import { BooksProvider } from '../context/BooksContext';
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
