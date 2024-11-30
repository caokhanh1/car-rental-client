import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data, status } = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/guess/cars`,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        if (status === 200) setCars(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-center mb-8">
        Featured Vehicles
      </h1>

      {/* Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {cars.map((data, index) => (
          <div
            key={index}
            className="bg-gray-100 text-gray-800 rounded-xl overflow-hidden shadow-lg transform transition duration-300 p-4"
          >
            {/* Car Image */}
            <div className="flex justify-center items-center mb-4">
              <img
                src={data.imageURL}
                alt={data.name}
                className="w-40 h-40 object-contain"
              />
            </div>

            {/* Car Name and License Plate */}
            <div className="text-center mb-2">
              <h2 className="text-xl font-bold">{data.name}</h2>
              <p className="text-gray-500">
                License Plate: {data.licensePlate}
              </p>
            </div>

            {/* Price Display */}
            <div className="flex justify-around items-center mb-4">
              <div className="text-center">
                <p className="text-lg font-bold text-black">
                  {data.pricePerDay.toLocaleString("en-US")} VND
                </p>
                <p className="text-sm text-gray-500">/ Day</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-black">
                  {data.pricePerHour.toLocaleString("en-US")} VND
                </p>
                <p className="text-sm text-gray-500">/ Hour</p>
              </div>
            </div>

            {/* Rent Now Button */}
            <Link to={`/booking/${data.id}`}>
              <div className="flex justify-center">
                <button className="px-4 py-2 bg-white text-black border-2 border-black rounded-full hover:bg-gray-200 transition duration-300">
                  Rent Now
                </button>
              </div>
            </Link>
          </div>
        ))}
        {cars.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No cars found that match your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default CarList;
