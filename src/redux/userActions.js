import axios from "axios";
import toast from "react-hot-toast";

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export const setUser = (user, token) => ({
  type: SET_USER,
  payload: { user, token },
});


export const clearUser = () => ({
  type: CLEAR_USER,
});

export const loginWithEmail = (email, password, orgId) => async (dispatch) => {
  const loadingToastId = toast.loading("⏳ Please Wait ...");

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/user/login`,
      {
        email,
        password,
        orgId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    const { user, token } = response.data;
    dispatch(setUser(user, token));
    toast.dismiss(loadingToastId);
    toast.success("✅ Login successful!");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Login failed. Please try again.";
    toast.dismiss(loadingToastId);
    toast.error(`❌ ${errorMessage}`);
    throw error;
  }
};

export const logout = () => (dispatch) => {
  dispatch(clearUser());
  toast.success("👋 Logged out successfully!");
};
