import { Link } from "react-router-dom";
import car1 from "../../assets/car1.png";

const BookingPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 space-y-12">
      {/* Image and Booking Form Section */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Car Image */}
        <div className="flex-1">
          <img
            src={car1}
            alt="Car"
            className="w-full h-auto rounded-xl shadow-lg transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Booking Form */}
        <div className="bg-white p-8 rounded-xl shadow-xl flex-1 lg:max-w-sm border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Book Now</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Write Your Name Here"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Address
              </label>
              <input
                type="text"
                placeholder="Write Your Address Here"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Pick-up Date
                </label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Returning Date
                </label>
                <input
                  type="date"
                  className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Your Message
              </label>
              <textarea
                placeholder="Write Your Message Here"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                rows="4"
              ></textarea>
            </div>
            <Link to="/payment">
            <button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition-colors duration-300">
              Book Now
            </button>
            </Link>
            
          </form>
        </div>
      </div>

      {/* Vehicle Overview */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Vehicle Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-500">Body</p>
            <h3 className="text-lg font-semibold">BMW X3</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-500">Make</p>
            <h3 className="text-lg font-semibold">Nissan</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-500">Transmission</p>
            <h3 className="text-lg font-semibold">Automatic</h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-sm text-gray-500">Fuel Type</p>
            <h3 className="text-lg font-semibold">Diesel</h3>
          </div>
        </div>
      </div>

      {/* Price Details */}
      <div className="border-t border-gray-300 pt-6">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Price Details</h2>
        <ul className="space-y-3 text-lg">
          <li>Rent/Day: <span className="font-semibold">$300</span> (Negotiable)</li>
          <li>Rent/Month: <span className="font-semibold">$3000</span> (Negotiable)</li>
          <li>Service Charge: <span className="font-semibold">$50</span> (Service providing)</li>
          <li>Extra Service: <span className="font-semibold">As per Service Taken</span></li>
          <li>Security Deposit: <span className="font-semibold">$3000</span></li>
        </ul>
      </div>

      {/* Terms of Use */}
      <div className="border-t border-gray-300 pt-6">
        <h2 className="text-3xl font-bold italic mb-4 text-gray-800">Terms of Use</h2>
        <p className="text-gray-700 leading-7">
          Quy định khác: - Sử dụng xe đúng mục đích. - Không sử dụng xe thuê vào
          mục đích phi pháp, trái pháp luật. - Không sử dụng xe thuê để cầm cố,
          thế chấp. - Không hút thuốc, nhả kẹo cao su, xả rác trong xe. - Không
          chở hàng quốc cấm dễ cháy nổ. - Không chở hoa quả, thực phẩm nặng mùi
          trong xe. - Khi trả xe, nếu xe bẩn hoặc có mùi trong xe, khách hàng
          vui lòng vệ sinh xe sạch sẽ hoặc gửi phụ thu phí vệ sinh xe.
        </p>
      </div>
    </div>
  );
};

export default BookingPage;
