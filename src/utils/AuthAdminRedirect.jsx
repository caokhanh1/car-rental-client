import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import PropTypes from "prop-types";

const AuthAdminRedirect = ({ children }) => {
  const { isAdmin } = useContext(AuthContext);
  return isAdmin() ? <Navigate to="/dashboard?tab=dash" /> : children;
};

AuthAdminRedirect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthAdminRedirect;
