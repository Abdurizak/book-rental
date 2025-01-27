import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at the top */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Use Outlet for routing or directly render children */}
        {children || <Outlet />}
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
}

export default MainLayout;
