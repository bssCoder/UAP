import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../redux/userActions";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  console.log(user);

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const enableMfa = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/mfa/toggle`, {

      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQrCodeUrl(response.data.qrCodeUrl);
      setMessage("MFA enabled successfully. Scan the QR code with your authenticator app.");
    } catch (error) {
      setMessage("Failed to enable MFA. Please try again.");
    }
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

          {!user.isMfaEnabled && (
            <button
              onClick={enableMfa}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-4"
            >
              Enable MFA
            </button>
          )}

          {qrCodeUrl && (
            <div className="mt-4">
              <p>Scan this QR code with your authenticator app:</p>
              <img src={qrCodeUrl} alt="MFA QR Code" className="mt-2" />
            </div>
          )}

          {message && <p className="mt-4 text-gray-700">{message}</p>}

          <div className="grid grid-cols-1 gap-6">
            {/* Access Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">
                Your Accessible Websites
              </h3>
              {user?.access && user.access.length > 0 ? (
                <div className="space-y-4">
                  {user.access.map((domain, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        <span className="text-gray-700 font-medium">
                          {domain}
                        </span>
                      </div>
                      <a
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Visit Website →
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No websites available for access.
                </p>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  Profile Information
                </h3>
                <p>Email: {user?.email}</p>
                <p>Role: {user?.role}</p>
                <p>Organization ID: {user?.orgId}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Access Summary</h3>
                <p>Total Access Points: {user?.access?.length || 0}</p>
                <p className="text-sm text-gray-600 mt-2">
                  You have access to {user?.access?.length || 0} websites
                  through UAP
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Login History</h3>
                {user?.loginHistory && user.loginHistory.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {user.loginHistory.map((login, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 border-b border-purple-100 pb-1"
                      >
                        {new Date(login.timestamp).toLocaleString()}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No login history</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
