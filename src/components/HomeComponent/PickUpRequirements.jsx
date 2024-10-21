import { FaIdCard, FaCreditCard, FaPassport, FaTabletAlt } from "react-icons/fa";

export default function PickUpRequirement() {
  return (
    <div className="bg-blue-50 pt-20 pb-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Những gì bạn cần để nhận xe?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {/* Bằng Lái Xe */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-200 p-4 rounded-full">
              <FaIdCard className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Bằng Lái Xe</h3>
              <p className="text-gray-600">
                Một bằng lái xe hợp lệ đứng tên tài xế chính. 
                <a href="#" className="text-blue-500">Tôi cần loại bằng lái xe nào?</a>
              </p>
            </div>
          </div>

          {/* Thẻ Tín Dụng */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-200 p-4 rounded-full">
              <FaCreditCard className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Thẻ Tín Dụng</h3>
              <p className="text-gray-600">
                Thẻ tín dụng đứng tên tài xế chính với đủ số dư.
                <a href="#" className="text-blue-500">Tôi không có thẻ tín dụng — liệu tôi có thể thuê xe không?</a>
              </p>
            </div>
          </div>

          {/* Giấy Tờ Tuỳ Thân */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-200 p-4 rounded-full">
              <FaPassport className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Giấy Tờ Tuỳ Thân</h3>
              <p className="text-gray-600">
                Hộ chiếu hoặc một loại giấy tờ tùy thân khác.
                <a href="#" className="text-blue-500">Tôi có cần hộ chiếu để nhận xe không?</a>
              </p>
            </div>
          </div>

          {/* Phiếu Nhận Xe */}
          <div className="flex items-start space-x-4">
            <div className="bg-blue-200 p-4 rounded-full">
              <FaTabletAlt className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Phiếu Nhận Xe</h3>
              <p className="text-gray-600">
                Phiếu in hoặc e-Phiếu, nếu có.
                <a href="#" className="text-blue-500">Phiếu nhận xe là gì và tôi có thể tìm thấy nó ở đâu?</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
