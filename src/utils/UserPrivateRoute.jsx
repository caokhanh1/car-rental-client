import { Navigate } from "react-router-dom";
import { useContext } from "react";
import PropTypes from "prop-types";
import AuthContext from "../context/AuthContext";

const UserPrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== "User") {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};
UserPrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserPrivateRoute;
