import { useEffect, useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import useAxios from "../../utils/useAxios";

export default function DashCoupon() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    discountPercent: 0,
    isActive: true,
  });
  const api = useAxios();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await api.get("/admins/coupons");
        setCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const filteredCoupons = coupons;

  const handleChange = (e) => {
    setNewCoupon({
      ...newCoupon,
      [e.target.id]: e.target.value,
    });
  };

  const handleCreateCoupon = async () => {
    if (!newCoupon.discountPercent) {
      alert("Vui lòng điền đầy đủ thông tin mã giảm giá.");
      return;
    }

    try {
      const response = await api.post("/admins/coupons", newCoupon);
      setCoupons([...coupons, response.data]);
      setNewCoupon({ discountPercent: 0, isActive: true });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const handleToggleStatus = async (couponId) => {
    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === couponId
        ? { ...coupon, isActive: !coupon.isActive }
        : coupon
    );
    setCoupons(updatedCoupons);

    const couponToUpdate = updatedCoupons.find(
      (coupon) => coupon.id === couponId
    );

    try {
      await api.put(`/admins/coupons/${couponId}`, {
        isActive: couponToUpdate.isActive,
      });
    } catch (error) {
      console.error("Error updating coupon status:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
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
            <Button
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "rgb(41,55,70)" }}
              className="focus:outline-none focus:ring-2 focus:ring-gray-500 hover:ring-2 hover:ring-gray-400"
            >
              <div className="flex items-center">
                <HiPlus className="mr-2" /> Add Coupon
              </div>
            </Button>
          </div>
        </div>

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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {coupon.id}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {coupon.code}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {coupon.discountPercent}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm whitespace-nowrap">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={coupon.isActive}
                          onChange={() => handleToggleStatus(coupon.id)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span
                          className={`ml-3 text-sm font-medium ${
                            coupon.isActive ? "text-gray-900" : "text-gray-300"
                          } dark:text-gray-300`}
                        ></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create New Coupon</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discountPercent" value="Discount Amount (%)" />
              <TextInput
                id="discountPercent"
                type="number"
                placeholder="Enter discount percent"
                value={newCoupon.discountPercent}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="status"
                value="Status"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <select
                id="status"
                className="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newCoupon.status}
                onChange={(e) =>
                  setNewCoupon({ ...newCoupon, isActive: e.target.value == "Active" })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCreateCoupon}
            style={{ backgroundColor: "rgb(41,55,70)" }}
            className="focus:outline-none focus:ring-2 focus:ring-gray-500 hover:ring-2 hover:ring-gray-400"
          >
            Create
          </Button>
          <Button onClick={() => setShowModal(false)} color="gray">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
