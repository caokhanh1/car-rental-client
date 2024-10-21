import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import PropTypes from "prop-types";

const AuthRedirect = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated() ? <Navigate to="/" /> : children;
};

AuthRedirect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthRedirect;
