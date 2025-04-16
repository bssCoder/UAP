import { SET_USER, CLEAR_USER, SET_USER_PAY } from "./userActions";

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

let initialState = {
  user: null,
  token: null,
};

const cookieValue = getCookie("paramUser");
const tokenValue = getCookie("paramToken");

if (cookieValue) {
  try {
    const parsedUser = JSON.parse(cookieValue);
    initialState.user = parsedUser || null;
  } catch (error) {
    // console.error("Failed to parse user from cookie:", error);
  }
}

if (tokenValue) {
  initialState.token = tokenValue;
}
 
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      const { user, token } = action.payload;
      setCookie("paramUser", JSON.stringify(user), 3650);
      setCookie("paramToken", token, 3650);
      return { ...state, user, token }; 
    case CLEAR_USER:
      setCookie("paramUser", "", -1); 
      setCookie("paramToken", "", -1); 
      return { ...state, user: null, token: null }; 
    case SET_USER_PAY:
      const { formData } = action.payload;

      const updatedUser = {
        ...state.user,
        name: formData.name,
        email: formData.email,
        state: formData.state,
        district: formData.district, 
        contactNo: formData.contactNo,
        pincode: formData.pincode,
        address: formData.address,
      };

      setCookie("paramUser", JSON.stringify(updatedUser), 3650); 
      return {
        ...state,
        user: updatedUser, 
        token: state.token,
      };

    default:
      return state;
  }
};

export default userReducer;