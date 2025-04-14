import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Images/logo.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchUserData = async () => {
      try {
        const storedUser =
          localStorage.getItem("user") || localStorage.getItem("adminData");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminData");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="UAP Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-semibold">UAP Dashboard</span>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{userData?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {userData?.name || userData?.email}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Profile Information
              </h3>
              <p>Email: {userData?.email}</p>
              <p>Role: {userData?.role}</p>
              <p>Organization ID: {userData?.orgId}</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Access Details</h3>
              <p>Total Access Points: {userData?.access?.length || 0}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Login History</h3>
              <p>
                Last Login:{" "}
                {new Date(
                  userData?.loginHistory?.[0]?.timestamp
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
