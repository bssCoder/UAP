import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userActions";
import logo from "../Images/logo.jpeg";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Redirect to login after logout
  };

  const handleDashboardClick = () => {
    const path = user?.role === "admin" ? "admin-dashboard" : "dashboard";
    navigate(`/${path}`);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="UAP Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-semibold text-gray-800">
              UAP
            </span>
          </Link>

          {/* Mobile Hamburger */}
          <div className="flex sm:hidden">
            {/* Add mobile hamburger menu here if needed */}
          </div>

          <div className="flex items-center">
            {user ? (
              <>
                <button
                  onClick={handleDashboardClick}
                  className="px-4 py-2 rounded-md text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  aria-label="Logout"
                  className="ml-4 px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login" // Simply use "to" for navigation
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
