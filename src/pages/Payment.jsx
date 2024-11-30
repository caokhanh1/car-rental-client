import { useEffect, useState } from "react";
import { usePayOS } from "payos-checkout";
import { Button } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useAxios from "../utils/useAxios";
import { toast } from "react-toastify";

const Payment = () => {
  const api = useAxios();
  const location = useLocation();
  const checkoutUrl = location.state?.checkoutUrl;
  const orderId = location.state?.orderId;
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("payos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const { data, status } = await api.get(`/users/orders/${orderId}`);
        if (status === 200) {
          setOrder(data);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const payOSConfig = {
    RETURN_URL: `${window.location.origin}/order-confirmation`,
    ELEMENT_ID: "payos-checkout",
    CHECKOUT_URL: checkoutUrl,
    embedded: true,
    onSuccess: (event) => {
      console.log(event);
      navigate("/order-confirmation", { state: { status: "success" } });
    },
    onCancel: (event) => {
      alert("You canceled the payment.");
      console.log(event);
    },
    onExit: (event) => {
      alert("You closed the payment window.");
      console.log(event);
    },
  };

  const { open, exit } = usePayOS(payOSConfig);

  const handlePayment = (e) => {
    e.preventDefault();
    if (!isAgreed) {
      setError("You must agree to the terms and conditions before proceeding.");
      return;
    }
    setError(null);

    setLoading(true);

    setShowForm(false);
    open();
  };

  const handleCancel = () => {
    exit();
    setShowForm(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md transition-colors duration-300"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Complete Transaction
        </h1>
        {showForm && order && (
          <div className="bg-gray-200 text-gray-800 p-6 rounded-lg mb-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <ul className="space-y-2">
              <li className="flex justify-between text-lg font-medium">
                <span>Start Time:</span>
                <span>{new Date(order.startDate).toLocaleString()}</span>
              </li>
              <li className="flex justify-between text-lg font-medium">
                <span>End Time:</span>
                <span>{new Date(order.endDate).toLocaleString()}</span>
              </li>
              <li className="flex justify-between text-lg font-medium">
                <span>Total Amount:</span>
                <span>{order.cost} VND</span>
              </li>
              <li className="flex justify-between text-lg font-bold">
                <span>Deposit:</span>
                <span>{order.deposit} VND</span>
              </li>
            </ul>
          </div>
        )}
        {showForm && (
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="flex items-center mb-4">
              <input
                type="radio"
                id="payos"
                name="paymentMethod"
                value="payos"
                checked={paymentMethod === "payos"}
                onChange={() => setPaymentMethod("payos")}
                className="mr-2 focus:ring-gray-500"
              />
              <label
                htmlFor="payos"
                className="text-lg font-medium text-gray-800"
              >
                PayOS
              </label>
            </div>

            <div className="mt-4">
              <label className="inline-flex items-start">
                <input
                  type="checkbox"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="mt-1 mr-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Rental Terms and Conditions
                  </a>
                  .
                </span>
              </label>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-lg w-full mt-6 shadow-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition duration-200"
            >
              Confirm Payment
            </button>
          </form>
        )}
        {!showForm && (
          <div className="flex flex-col items-center mt-6 space-y-4">
            <Button
              color="gray"
              onClick={handleCancel}
              className="py-3 px-6 rounded-lg w-full shadow-lg bg-red-500 hover:bg-red-600 text-white transition duration-200"
            >
              Cancel
            </Button>
          </div>
        )}
        <div
          id={payOSConfig.ELEMENT_ID}
          className={
            !showForm
              ? "w-full h-[350px] border border-gray-300 rounded-lg overflow-hidden"
              : ""
          }
        ></div>
      </div>
    </div>
  );
};

export default Payment;
