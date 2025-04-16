import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginWithEmail } from "../redux/userActions";
import axios from "axios";
import logo from "../Images/logo.jpeg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    orgId: "",
  });
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dispatch(
        loginWithEmail(formData.email, formData.password, formData.orgId)
      );

      if (response.mfaRequired) {
        setMfaRequired(true);
        setLoading(false);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/mfa/verify", {
        userId: response.userId,
        token: mfaToken,
      });

      if (response.data.message === "MFA verified") {
        navigate("/dashboard");
      } else {
        alert("Invalid MFA token");
        setLoading(false);
      }
    } catch (error) {
      alert("Failed to verify MFA");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white rounded-2xl p-8 md:p-10 w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <img src={logo} alt="UAP Logo" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to UAP
          </h1>
          <p className="text-gray-600">
            Unified Access Platform - Single Sign-On
          </p>
        </div>

        {mfaRequired ? (
          <form onSubmit={handleMfaSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="mfaToken"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                MFA Token
              </label>
              <input
                type="text"
                id="mfaToken"
                name="mfaToken"
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                placeholder="Enter your MFA token"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-blue-400"
            >
              {loading ? "Verifying..." : "Verify MFA"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="orgId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Organization ID
              </label>
              <input
                type="text"
                id="orgId"
                name="orgId"
                value={formData.orgId}
                onChange={handleChange}
                placeholder="Enter your organization ID"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-blue-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center space-y-4">
          <div>
            <a
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </a>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-gray-600">Are you an administrator?</p>
            <button
              onClick={() => navigate("/admin-login")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Admin Login
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Need help? Contact your organization administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
