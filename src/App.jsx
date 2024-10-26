import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Cars from "./pages/Cars";
import Footer from "./components/Footer";
import Booking from "./pages/Booking";
import UserPrivateRoute from "./utils/UserPrivateRoute";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PaymentPage from "./pages/PaymentPage";
import { AuthProvider } from "./context/AuthContext";
import AuthRedirect from "./utils/AuthRedirect";
import AuthAdminRedirect from "./utils/AuthAdminRedirect";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastContainer />
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <AuthAdminRedirect>
                <Home />
              </AuthAdminRedirect>
            }
          />
          <Route
            path="/sign-in"
            element={
              <AuthRedirect>
                <SignIn />
              </AuthRedirect>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthRedirect>
                <SignUp />
              </AuthRedirect>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRedirect>
                <ForgotPassword />
              </AuthRedirect>
            }
          />
          <Route
            path="/reset"
            element={
              <AuthRedirect>
                <ResetPassword />
              </AuthRedirect>
            }
          />

          <Route
            path="/about"
            element={
              <AuthAdminRedirect>
                <About />
              </AuthAdminRedirect>
            }
          />
          <Route
            path="/cars"
            element={
              <AuthAdminRedirect>
                <Cars />
              </AuthAdminRedirect>
            }
          />

          <Route
            path="/booking/:carId"
            element={
              <UserPrivateRoute>
                <Booking />
              </UserPrivateRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <UserPrivateRoute>
                <PaymentPage />
              </UserPrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserPrivateRoute>
                <Profile />
              </UserPrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <AdminPrivateRoute>
                <Dashboard />
              </AdminPrivateRoute>
            }
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
