import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import { toast } from "react-toastify";
import CommentsSection from "./CommentsSection";
import { FaArrowLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookingPage = () => {
  const api = useAxios();
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [drivingOption, setDrivingOption] = useState("withDriver");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, status } = await api.get("/me");
        if (status === 200) {
          setUser(data);
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
      }
    };

    const fetchCar = async () => {
      try {
        const { data, status } = await api.get(`/users/cars/${carId}`);
        if (status === 200) {
          setCar(data);
        }
      } catch (error) {
        toast.error("Failed to fetch car details");
      }
    };

    const fetchCoupons = async () => {
      try {
        const { data, status } = await api.get("/users/coupons");
        if (status === 200) {
          setCoupons(data);
        }
      } catch (error) {
        toast.error("Failed to fetch coupons");
      }
    };

    Promise.all([fetchCar(), fetchUser(), fetchCoupons()]).finally(() => {
      setLoading(false);
    });
  }, [carId]);

  useEffect(() => {
    if (returnDate && pickupDate) {
      const pickupDateTime = new Date(pickupDate);
      const returnDateTime = new Date(returnDate);

      if (
        pickupDateTime.toDateString() === returnDateTime.toDateString() &&
        returnDateTime <= pickupDateTime
      ) {
        const adjustedReturnDate = new Date(pickupDateTime);
        adjustedReturnDate.setHours(pickupDateTime.getHours() + 1);
        setReturnDate(adjustedReturnDate);
      }
    }
  }, [pickupDate, returnDate]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (new Date(returnDate) <= new Date(pickupDate)) {
        toast.warn(
          "Returning date and time must be later than pick-up date and time"
        );
        return;
      }

      if (drivingOption === "selfDrive" && !user?.drivingLicense) {
        toast.warn(
          "You must update your driving license to book a self-drive option."
        );
        return;
      }

      const bookingData = {
        carID: car.id,
        carName: car.name,
        withDriver: drivingOption === "withDriver",
        startDate: pickupDate,
        endDate: returnDate,
        couponID: selectedCoupon || null,
        message: message,
      };

      const { status } = await api.post("/users/orders", bookingData);

      if (status === 200) {
        toast.success("Car booked successfully!", {
          onClose: () => {
            navigate("/orders");
          },
        });
      } else {
        toast.error("Failed to book car");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("Failed to book car");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Đang tải...</div>;
  }

  if (!car) {
    return <div className="text-center py-20">Không tìm thấy xe!</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 mt-1 space-y-12">
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow-md transition-colors duration-300"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>
      <div className="max-w-7xl mx-auto p-6 mt-1 flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0 items-stretch">
        <div className="flex-1 flex flex-col space-y-8">
          <div className="flex items-center justify-center">
            <img
              src={car.imageURL}
              alt="Car"
              className="w-full max-h-[400px] rounded-xl shadow-lg object-cover"
            />
          </div>

          <div className="bg-gray-100 p-6 rounded-xl shadow-md flex-grow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Mô tả về phương tiện
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tên</p>
                <h3 className="text-lg font-semibold">{car.name}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500"> Thương hiệu</p>
                <h3 className="text-lg font-semibold">{car.carBrand.brand}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500"> Loại nhiên liệu</p>
                <h3 className="text-lg font-semibold">{car.fuel}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500">Biển số xe</p>
                <h3 className="text-lg font-semibold">{car.licensePlate}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số lượng hành khách</p>
                <h3 className="text-lg font-semibold">{car.seats}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại xe</p>
                <h3 className="text-lg font-semibold">{car.carType.type}</h3>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Tỷ giá</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2">
                    Tỷ giá theo giờ (VND)
                    </th>
                    <th className="border border-gray-300 p-2">
                    Tỷ giá hằng ngày (VND)
                    </th>
                    <th className="border border-gray-300 p-2">
                    Tiền đặt cọc cho xe (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border text-center border-gray-300 p-2">
                      {car.pricePerHour}
                    </td>
                    <td className="border text-center border-gray-300 p-2">
                      {car.pricePerDay}
                    </td>
                    <td className="border text-center border-gray-300 p-2">
                      30
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-xl lg:max-w-md border border-gray-200 flex flex-col justify-between flex-grow">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Đặt ngay</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
              Họ và tên
              </label>
              <input
                type="text"
                value={user.username || ""}
                readOnly
                placeholder="Write Your Name Here"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Số điện thoại
              </label>
              <input
                type="text"
                value={user.phone || ""}
                readOnly
                placeholder="Write Your Phone Here"
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="drivingOption"
                  value="selfDrive"
                  className="mr-2"
                  checked={drivingOption === "selfDrive"}
                  onChange={() => setDrivingOption("selfDrive")}
                />
                <span>  Tự lái</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="drivingOption"
                  value="withDriver"
                  className="mr-2"
                  checked={drivingOption === "withDriver"}
                  onChange={() => setDrivingOption("withDriver")}
                />
                <span>Có tài xế</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                Ngày & giờ nhận hàng
                </label>
                <DatePicker
                  selected={pickupDate}
                  onChange={(date) => setPickupDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholderText="Select date & time"
                  onKeyDown={(e) => e.preventDefault()}
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2 text-gray-700">
                Ngày & giờ trả về
                </label>
                <DatePicker
                  selected={returnDate}
                  onChange={(date) => setReturnDate(date)}
                  minDate={pickupDate}
                  filterDate={(date) => {
                    return new Date(date) >= new Date(pickupDate);
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholderText="Select return date & time"
                  disabled={!pickupDate}
                  onKeyDown={(e) => e.preventDefault()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Phiếu giảm giá
              </label>
              <select
                value={selectedCoupon}
                onChange={(e) => setSelectedCoupon(e.target.value)}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Select a coupon</option>
                {coupons.map((coupon) => (
                  <option key={coupon.id} value={coupon.id}>
                    {coupon.code} - {coupon.discountPercent}%
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Bạn có ý kiến gì muốn thêm
              </label>
              <textarea
                placeholder="Write Your Message Here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                rows="4"
              ></textarea>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
              Tôi đồng ý với{" "}
                <a href="/terms" className="text-blue-500 underline">
                điều khoản và điều kiện
                </a>
                .
              </label>
            </div>
            <button
              onClick={handleBooking}
              className={`w-full py-3 mt-6 rounded-lg shadow-md transition-colors duration-300 ${
                !user.isActive
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : car.isInUse ||
                    !termsAccepted ||
                    !pickupDate ||
                    !returnDate ||
                    isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
              }`}
              disabled={
                !user?.isActive ||
                car?.isInUse ||
                !termsAccepted ||
                !pickupDate ||
                !returnDate ||
                isSubmitting
              }
            >
              {isSubmitting
                ? "Processing..."
                : !user.isActive
                ? "Account Not Activated"
                : car.isInUse
                ? "Currently Booked"
                : "Book Now"}
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-300 max-w-7xl mx-auto p-6 mt-1">
        <h2 className="text-3xl font-bold italic mb-4 text-gray-800">
        Điều khoản sử dụng
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <p className="text-gray-800 text-lg font-semibold mb-4">
            Quy định khác:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 leading-7">
            <li>Sử dụng xe đúng mục đích.</li>
            <li>Không sử dụng xe thuê vào mục đích bất hợp pháp.</li>
            <li>Không sử dụng xe thuê để cầm cố hoặc thế chấp.</li>
            <li>Không hút thuốc, nhai kẹo cao su, hoặc xả rác trong xe.</li>
            <li>Không vận chuyển hàng hóa cấm hoặc dễ cháy nổ.</li>
            <li>Không mang trái cây hoặc thực phẩm có mùi nặng vào xe.</li>
            <li>
              Khi trả xe, nếu xe bẩn hoặc có mùi, vui lòng vệ sinh xe hoặc thanh
              toán thêm phí vệ sinh.
            </li>
          </ul>
        </div>
      </div>
      <CommentsSection carId={carId} />
    </div>
  );
};

export default BookingPage;
