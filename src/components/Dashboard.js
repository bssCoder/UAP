import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userActions";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const toke = useSelector((state) => state.user.token);
  console.log(user);
  console.log(toke);


  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };


  return (
    <div className="min-h-screen bg-gray-100 pt-6">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
   

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Welcome, {user?.name || user?.email}
            </h2>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Profile Information
              </h3>
              <p>Email: {user?.email}</p>
              <p>Role: {user?.role}</p>
              <p>Organization ID: {user?.orgId}</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Access Details</h3>
              <p>Total Access Points: {user?.access?.length || 0}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Login History</h3>
              <p>
                Last Login:{" "}
                {new Date(
                  user?.loginHistory?.[0]?.timestamp
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
