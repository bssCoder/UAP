import { SET_USER, CLEAR_USER } from "./userActions";

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

const cookieValue = getCookie("uapUser");
const tokenValue = getCookie("uapToken");

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
      setCookie("uapUser", JSON.stringify(user), 3650);
      setCookie("uapToken", token, 3650);
      return { ...state, user, token };
    case CLEAR_USER:
      setCookie("uapUser", "", -1);
      setCookie("uapToken", "", -1);
      return { ...state, user: null, token: null };

    default:
      return state;
  }
};

export default userReducer;
