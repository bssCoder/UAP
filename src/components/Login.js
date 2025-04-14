import React, { useState } from "react";
import axios from "axios";
import logo from "../Images/logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    orgId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        formData
      );

      if (response.data.requireMFA) {
        alert("MFA code has been sent to your email");
      } else if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during login");
    } finally {
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
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

        <div className="mt-6 text-center">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot Password?
          </a>
          <p className="mt-4 text-sm text-gray-600">
            Need help? Contact your organization administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
