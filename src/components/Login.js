import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, setUser } from "../redux/userActions";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import logo from "../Images/logo.jpeg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const user = useSelector((state) => state.user.user);
  useState(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await dispatch(
        loginWithEmail(formData.email, formData.password)
      );

      if (response.mfaRequired) {
        setMfaRequired(true);
        setUserId(response.userId);
        setLoading(false);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Failed to login");
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/mfa/verify`,
        {
          userId: userId,
          token: mfaToken,
        }
      );

      if (response.data.success) {
        // Complete the login process after MFA verification
        await dispatch(setUser(response.data.user, response.data.token));
        navigate("/dashboard");
      } else {
        alert("Invalid MFA token");
        setLoading(false);
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      alert(error.response?.data?.message || "Failed to verify MFA");
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/google-login`,
        {
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub,
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user, response.data.token));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert(error.response?.data?.message || "Failed to login with Google");
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
          <div className="space-y-6">
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
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    console.log("Login Failed");
                    alert("Google login failed. Please try again.");
                  }}
                  shape="pill"
                  theme="filled_blue"
                />
              </div>
            </div>
          </>
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
