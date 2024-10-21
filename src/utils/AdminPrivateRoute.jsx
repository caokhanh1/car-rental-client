import { Navigate } from "react-router-dom";
import { useContext } from "react";
import PropTypes from "prop-types";
import AuthContext from "../context/AuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "Admin") {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};
AdminPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPrivateRoute;
