import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaExclamationCircle, FaSpinner } from "react-icons/fa";

const PaymentStatus = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const location = useLocation();
  const status = location.state?.status || "pending";

  useEffect(() => {
    if (status === "pending") return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    if (countdown <= 0) {
      navigate("/orders");
    }

    return () => clearInterval(timer);
  }, [countdown, navigate, status]);

  const handleNavigate = () => {
    navigate("/orders");
  };

  const getStatusContent = () => {
    switch (status) {
      case "success":
        return (
          <>
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-700 mb-4">
              Redirecting to transaction history in ({countdown}) seconds
            </p>
          </>
        );
      case "failure":
        return (
          <>
            <div className="mb-4">
              <FaExclamationCircle className="h-16 w-16 mx-auto text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Failed!
            </h1>
            <p className="text-gray-700 mb-4">
              An error occurred during the payment process. Please try again.
            </p>
          </>
        );
      case "pending":
      default:
        return (
          <>
            <div className="mb-4">
              <FaSpinner className="h-16 w-16 mx-auto text-yellow-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Processing Payment...
            </h1>
            <p className="text-gray-700 mb-4">
              Please wait while we process your payment.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {getStatusContent()}
        <div className="flex justify-center">
          <button
            onClick={handleNavigate}
            className="flex items-center justify-center py-2 px-4 mt-4 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg transition duration-300"
          >
            <span className="mr-2">Go to Orders</span>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
