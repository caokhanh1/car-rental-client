import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("status");
    setStatus(paymentStatus);
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {status === "success" ? (
          <div>
            <h1 className="text-4xl font-bold text-green-600 mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-lg text-gray-700">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </p>
          </div>
        ) : status === "failure" ? (
          <div>
            <h1 className="text-4xl font-bold text-red-600 mb-4">
              Thanh toán thất bại!
            </h1>
            <p className="text-lg text-gray-700">
              Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl font-bold text-gray-600 mb-4">
              Đang xử lý thanh toán...
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
