import { useEffect, useRef, useState } from "react";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import useAxios from "../../utils/useAxios";
import { toast } from "react-toastify";
import Pagination from "../Pagination";

const DashVehicleType = () => {
  let api = useAxios();
  const [vehicleTypes, setVehicleTypesData] = useState([]);
  const didFetchData = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const { data, status } = await api.get("/car-types");
        if (status === 200) {
          setVehicleTypesData(data);
        }
      } catch (error) {
        toast.error("Error fetching vehicle types");
      }
    };

    if (!didFetchData.current) {
      fetchVehicleTypes();
      didFetchData.current = true;
    }
  }, []);

  const filteredVehicleTypes = vehicleTypes.filter(
    (vehicle) =>
      vehicle.type.includes(searchTerm.toLowerCase()) ||
      vehicle.detail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVehicleTypes.length / limit);

  const indexOfLastUser = currentPage * limit;
  const indexOfFirstUser = indexOfLastUser - limit;
  const currentVehicleTypes = filteredVehicleTypes.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">
            Vehicle Types
          </h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="bg-gray-600 text-white p-3 rounded-full flex items-center justify-center">
              <HiPlus className="text-2xl" />
            </button>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Type
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Detail
                  </th>
                  <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-center text-sm uppercase font-normal whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentVehicleTypes.map((vehicleType) => (
                  <tr key={vehicleType.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicleType.id}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicleType.type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <p className="text-gray-900">{vehicleType.detail}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center whitespace-nowrap">
                      <div className="flex justify-center items-center space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900 flex items-center">
                          <HiPencil className="mr-1" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 flex items-center">
                          <HiTrash className="mr-1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            pageSize={limit}
            totalEntries={filteredVehicleTypes.length}
          />
        </div>
      </div>
    </div>
  );
};

export default DashVehicleType;
