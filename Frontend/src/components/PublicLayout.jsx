import { Outlet, Link, useLocation } from "react-router-dom";
import logo from "../assets/HNBG-new-logo.png";
import { Home, LogIn, Lock, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Public Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src={logo} alt="HNBGU Logo" className="h-10" />
              <span className="hidden md:inline text-xl font-semibold text-gray-800">
                Library System
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <NavLink to="/" icon={<Home className="w-5 h-5" />}>
                Home
              </NavLink>
              <NavLink to="/librarian-login" icon={<LogIn className="w-5 h-5" />}>
                Librarian Login
              </NavLink>
              <NavLink to="/student-login" icon={<LogIn className="w-5 h-5" />}>
                Student Login
              </NavLink>
              <NavLink to="/forgot-password" icon={<Lock className="w-5 h-5" />}>
                Forgot Password
              </NavLink>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-96 py-2" : "max-h-0 overflow-hidden"
            }`}
          >
            <div className="flex flex-col space-y-1 pt-2 pb-4">
              <MobileNavLink 
                to="/" 
                icon={<Home className="w-5 h-5" />}
                active={location.pathname === "/"}
              >
                Home
              </MobileNavLink>
              <MobileNavLink 
                to="/librarian-login" 
                icon={<LogIn className="w-5 h-5" />}
                active={location.pathname === "/librarian-login"}
              >
                Librarian Login
              </MobileNavLink>
              <MobileNavLink 
                to="/student-login" 
                icon={<LogIn className="w-5 h-5" />}
                active={location.pathname === "/student-login"}
              >
                Student Login
              </MobileNavLink>
              <MobileNavLink 
                to="/forgot-password" 
                icon={<Lock className="w-5 h-5" />}
                active={location.pathname === "/forgot-password"}
              >
                Forgot Password
              </MobileNavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} HNBGU Library Management System
          </div>
        </div>
      </footer>
    </div>
  );
};

// Reusable NavLink component for desktop
const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

// Reusable MobileNavLink component
const MobileNavLink = ({ to, icon, children, active }) => (
  <Link
    to={to}
    className={`flex items-center px-4 py-3 text-base font-medium rounded-md ${
      active
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <span className="mr-3">{icon}</span>
    {children}
  </Link>
);

export default PublicLayout;
