import { useEffect, useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { HiPlus } from "react-icons/hi";
import useAxios from "../../utils/useAxios";

export default function DashDriver() {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    age: 0,
    gender: "Nam",
    name: "",
  });
  const api = useAxios();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await api.get("/admins/drivers");
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers;

  const handleChange = (e) => {
    setNewDriver({
      ...newDriver,
      [e.target.id]: e.target.value,
    });
  };

  const handleCreateDriver = async () => {
    if (!newDriver.age) {
      alert("Vui lòng điền đầy đủ thông tin tài xế.");
      return;
    }

    try {
      const response = await api.post("/admins/drivers", newDriver);
      setDrivers([...drivers, response.data]);
      setNewDriver({ age: 0, gender: "Nam", name: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating driver:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 mt-6">
      <div className="py-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold leading-tight">Drivers</h2>
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
                <HiPlus className="mr-2" /> Add Driver
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
                    Name
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Age
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Gender
                  </th>
                  <th className="px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {driver.id}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {driver.name}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {driver.age}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {driver.gender}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`px-3 py-1 font-semibold leading-tight ${
                          driver.status === "Rãnh"
                            ? "text-green-900 bg-green-200"
                            : "text-red-900 bg-red-200"
                        } rounded-full`}
                      >
                        {driver.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create New Driver</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" value="Name" />
              <TextInput
                id="name"
                type="string"
                placeholder="Enter driver name"
                value={newDriver.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="age" value="Age" />
              <TextInput
                id="age"
                type="number"
                placeholder="Enter discount percent"
                value={newDriver.age}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="gender"
                value="Gender"
                className="block text-sm font-medium text-gray-700 mb-2"
              />
              <select
                id="gender"
                className="w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newDriver.gender}
                onChange={(e) =>
                  setNewDriver({
                    ...newDriver,
                    gender: e.target.value == "Nam",
                  })
                }
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCreateDriver}
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
