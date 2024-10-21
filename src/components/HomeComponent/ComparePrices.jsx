import { FaCheckCircle, FaTimesCircle, FaHeadset, FaThumbsUp } from "react-icons/fa";

export default function ComparePrices() {
  return (
    <div className="dark:bg-black dark:text-white py-14 sm:min-h-[600px] sm:grid sm:place-items-center">
      <div className="container">
        <div className="pb-12">
          <h1 className="text-3xl font-semibold text-center sm:text-4xl font-serif">
            Chúng tôi so sánh giá thuê xe, bạn tiết kiệm!
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Left Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-dark">
            <h2 className="font-bold text-lg mb-4">
              Tìm chiếc xe thuê hoàn hảo cho chuyến đi của bạn
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              CarRental.com là đơn vị hàng đầu trong việc đặt xe thuê trực tuyến; chúng tôi so sánh
              các ưu đãi thuê xe từ nhiều công ty để bạn có thể chọn lựa phương án tốt nhất cho chuyến đi của mình.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Nhiều trang web khác ẩn các khoản phí và chi phí phụ. DiscoverCars.com bao gồm tất cả
              các khoản phí bắt buộc, thuế và chi phí trong giá báo, vì vậy sẽ không có bất kỳ điều bất ngờ
              nào khi bạn đến bàn thuê xe.
            </p>
          </div>

          {/* Middle Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm dark:bg-dark">
            <h2 className="font-bold text-lg mb-4">Tại sao bạn nên đặt xe với chúng tôi?</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <FaTimesCircle className="text-blue-500 dark:text-blue-400" />
                <span>Không có phí ẩn</span>
              </li>
              <li className="flex items-center gap-2">
                <FaHeadset className="text-blue-500 dark:text-blue-400" />
                <span>Hỗ trợ khách hàng 24/7 đa ngôn ngữ</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-500 dark:text-blue-400" />
                <span>Hủy miễn phí</span>
              </li>
              <li className="flex items-center gap-2">
                <FaThumbsUp className="text-blue-500 dark:text-blue-400" />
                <span>Thông tin bạn có thể tin cậy</span>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm dark:bg-dark">
            <h2 className="font-bold text-lg mb-4">Tại sao giá của chúng tôi thấp hơn?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Vì chúng tôi đàm phán giá cho nhiều chiếc xe thuê cùng lúc trực tiếp với các công ty cho
              thuê xe, chúng tôi có thể cung cấp mức giá thấp hơn cho khách hàng của mình.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
