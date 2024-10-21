import { useState } from "react";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false); // State to track if the user agrees to the contract

  const handlePayment = (e) => {
    e.preventDefault();
    if (!isAgreed) {
      setError("You must agree to the terms and conditions before proceeding.");
      return;
    }
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      alert("Payment Successful!");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br to-red-500 p-6">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-purple-700">
          Complete Transaction
        </h1>
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-2">
            <li className="flex justify-between text-lg font-medium">
              <span>Car Model:</span>
              <span>BMW X3</span>
            </li>
            <li className="flex justify-between text-lg font-medium">
              <span>Rental Duration:</span>
              <span>3 Days</span>
            </li>
            <li className="flex justify-between text-lg font-medium">
              <span>Total Amount:</span>
              <span>$900</span>
            </li>
            <li className="flex justify-between text-lg font-medium">
              <span>Service Charge:</span>
              <span>$50</span>
            </li>
            <li className="flex justify-between text-lg font-bold">
              <span>Grand Total:</span>
              <span>$950</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="creditCard"
              name="paymentMethod"
              value="creditCard"
              checked={paymentMethod === "creditCard"}
              onChange={() => setPaymentMethod("creditCard")}
              className="mr-2 focus:ring-purple-500"
            />
            <label htmlFor="creditCard" className="text-lg font-medium text-purple-700">
              Credit/Debit Card
            </label>
          </div>

          {paymentMethod === "creditCard" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9101 1121"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === "paypal"}
              onChange={() => setPaymentMethod("paypal")}
              className="mr-2 focus:ring-purple-500"
            />
            <label htmlFor="paypal" className="text-lg font-medium text-purple-700">
              PayPal
            </label>
          </div>

          {paymentMethod === "paypal" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">PayPal Email</label>
              <input
                type="email"
                placeholder="example@paypal.com"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                required
              />
            </div>
          )}

          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="bankTransfer"
              name="paymentMethod"
              value="bankTransfer"
              checked={paymentMethod === "bankTransfer"}
              onChange={() => setPaymentMethod("bankTransfer")}
              className="mr-2 focus:ring-purple-500"
            />
            <label htmlFor="bankTransfer" className="text-lg font-medium text-purple-700">
              Bank Transfer
            </label>
          </div>

          {paymentMethod === "bankTransfer" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
              <input
                type="text"
                placeholder="Your Account Number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-purple-500 shadow-sm"
                required
              />
            </div>
          )}

          {/* Terms and Conditions Section */}
          <div className="mt-4">
            <label className="inline-flex items-start">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 mr-2 focus:ring-purple-500"
              />
              <span className="text-gray-700">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-purple-700 hover:underline"
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
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg w-full mt-6 shadow-lg hover:opacity-90 transition duration-200"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
