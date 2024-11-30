import { FaCheckCircle, FaTimesCircle, FaHeadset, FaThumbsUp } from "react-icons/fa";

export default function ComparePrices() {
  return (
    <div className="dark:bg-black dark:text-white py-14 sm:min-h-[600px] sm:grid sm:place-items-center">
      <div className="container">
        <div className="pb-12">
          <h1 className="text-3xl font-semibold text-center sm:text-4xl font-serif">
            We Compare Car Rental Prices, You Save!
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Left Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm dark:bg-dark">
            <h2 className="font-bold text-lg mb-4">
              Find the Perfect Rental Car for Your Trip
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              CarRental.com is a leader in online car rental booking; we compare rental deals from multiple companies so you can choose the best option for your trip.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Many other websites hide fees and extra costs. DiscoverCars.com includes all mandatory fees, taxes, and costs in the quoted price, so there are no surprises when you get to the rental desk.
            </p>
          </div>

          {/* Middle Section */}
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm dark:bg-dark">
            <h2 className="font-bold text-lg mb-4">Why Book with Us?</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <FaTimesCircle className="text-blue-500 dark:text-blue-400" />
                <span>No Hidden Fees</span>
              </li>
              <li className="flex items-center gap-2">
                <FaHeadset className="text-blue-500 dark:text-blue-400" />
                <span>24/7 Multilingual Customer Support</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-500 dark:text-blue-400" />
                <span>Free Cancellations</span>
              </li>
              <li className="flex items-center gap-2">
                <FaThumbsUp className="text-blue-500 dark:text-blue-400" />
                <span>Information You Can Trust</span>
              </li>
            </ul>
          </div>

          {/* Right Section */}
          <div className="bg-yellow-50 p-6 rounded-lg shadow-sm dark:bg-dark">
            <h2 className="font-bold text-lg mb-4">Why Are Our Prices Lower?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Because we negotiate prices for multiple rental cars directly with car rental companies, we can offer lower rates to our customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
