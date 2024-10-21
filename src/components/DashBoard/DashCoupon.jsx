import { useEffect, useState } from "react";
import axios from "axios"; 
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { HiOutlineExclamationCircle, HiPlus } from "react-icons/hi"; 

export default function DashCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountAmount: '',
    expiryDate: '',
    status: 'Active',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [couponIdToDelete, setCouponIdToDelete] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('/api/coupon');
        setCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.discountAmount.toString().includes(searchTerm.toLowerCase()) ||
      coupon.expiryDate.includes(searchTerm)
  );


  const handleChange = (e) => {
    setNewCoupon({
      ...newCoupon,
      [e.target.id]: e.target.value,
    });
  };


  const handleCreateCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discountAmount || !newCoupon.expiryDate) {
      alert("Vui lòng điền đầy đủ thông tin mã giảm giá.");
      return;
    }

    try {
      const response = await axios.post('/api/coupon', newCoupon); 
      setCoupons([...coupons, response.data]); 
      setNewCoupon({ code: '', discountAmount: '', expiryDate: '', status: 'Active' });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      await axios.delete(`/api/coupon/${couponIdToDelete}`); 
      setCoupons((prevCoupons) => prevCoupons.filter((coupon) => coupon.id !== couponIdToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        {/* Tiêu đề và tìm kiếm */}
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">Coupons</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={() => setShowModal(true)} gradientDuoTone="cyanToBlue">
              <HiPlus className="mr-2" /> Add Coupon
            </Button>
          </div>
        </div>

        {/* Cảnh báo (nếu cần) */}
        {coupons.length === 0 && (
          <div className="flex items-center text-red-600 mb-4">
            <HiOutlineExclamationCircle className="mr-2" />
            <span>Không có mã giảm giá nào hiện có.</span>
          </div>
        )}

        {/* Bảng hiển thị coupons */}
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    ID
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Code
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Discount Amount (%)
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Expiry Date
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Status
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{coupon.id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{coupon.code}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{coupon.discountAmount}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {coupon.status === 'Active' ? (
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                          <span className="relative">{coupon.status}</span>
                        </span>
                      ) : (
                        <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                          <span aria-hidden="true" className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                          <span className="relative">{coupon.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => {
                          setShowDeleteModal(true);
                          setCouponIdToDelete(coupon.id);
                        }}
                        className="text-red-600 hover:text-red-900 mr-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tạo Mã Giảm Giá */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create New Coupon</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code" value="Coupon Code" />
              <TextInput
                id="code"
                type="text"
                placeholder="Enter coupon code"
                value={newCoupon.code}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="discountAmount" value="Discount Amount (%)" />
              <TextInput
                id="discountAmount"
                type="number"
                placeholder="e.g., 10 for 10%"
                value={newCoupon.discountAmount}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="expiryDate" value="Expiry Date" />
              <TextInput
                id="expiryDate"
                type="date"
                value={newCoupon.expiryDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="status" value="Status" />
              <select
                id="status"
                value={newCoupon.status}
                onChange={(e) => setNewCoupon({ ...newCoupon, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCreateCoupon}>Create</Button>
          <Button onClick={() => setShowModal(false)} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xóa Mã Giảm Giá */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Coupon</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa mã giảm giá này không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDeleteCoupon} color="red">
            Yes
          </Button>
          <Button onClick={() => setShowDeleteModal(false)} color="gray">
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
