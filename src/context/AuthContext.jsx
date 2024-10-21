import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, provider, signInWithPopup } from "../config/firebase";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated = () => !!user;
  const isAdmin = () => user && user.role === "Admin";

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/auths/sign-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: e.target.email.value,
            password: e.target.password.value,
          }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setAuthTokens(data);
        const decode = jwtDecode(data.token);
        setUser(decode);
        localStorage.setItem("authTokens", JSON.stringify(data));
        if (decode.role === "Admin") {
          navigate("/dashboard?tab=dash");
        } else {
          navigate("/");
        }
      } else {
        toast.error(await response.text());
      }
    } catch (err) {
      if (err.response?.data?.code === "USER_IS_NOT_VERIFIED") {
        setIsVerifying(true);
        setLoading(false);
      } else {
        toast.error(err.response?.data?.message || err.message);
        setLoading(false);
      }
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/sign-in");
  };

  const handleVerifyCode = async (e, email) => {
    e.preventDefault();
    setLoading(true);

    try {
      const verificationResponse = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/auths/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code: e.target.verificationCode.value,
          }),
        }
      );

      if (verificationResponse.status === 200) {
        const verificationData = await verificationResponse.json();
        toast.success(verificationData.message);
      } else {
        toast.error(await verificationResponse.text());
      }
    } catch (err) {
      toast.error("An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/auths/sign-in/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken,
          }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwtDecode(data.token));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        toast.error(await response.text());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const contextData = {
    user,
    authTokens,
    setAuthTokens,
    setUser,
    loginUser,
    logoutUser,
    isVerifying,
    setIsVerifying,
    handleVerifyCode,
    loading,
    handleGoogleLogin,
    isAuthenticated,
    isAdmin,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.token));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      <ToastContainer />
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
