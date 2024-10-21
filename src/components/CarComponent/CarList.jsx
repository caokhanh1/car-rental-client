import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const categories = ["All", "Sedan", "SUV", "Luxury", "Convertible", "Hatchback", "Van"];

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("https://localhost:5130/api/cars");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);


  const filteredData = cars.filter((car) => {
    const matchesSearch = 
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || car.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl sm:text-4xl font-bold font-serif text-center mb-8">
        Car Rental
      </h1>

      {/* Categories */}
      <div className="flex flex-wrap justify-center mb-8 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-md border ${
              selectedCategory === category
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition duration-300`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by name or category..."
          className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
        {filteredData.map((data, index) => (
          <div
            key={index}
            className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
          >
            <div className="w-full h-[120px]">
              <img
                src={data.imageUrl} // Sử dụng image URL từ API
                alt={data.name}
                className="w-full h-[120px] object-contain sm:translate-x-8 group-hover:sm:translate-x-16 duration-700"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-primary font-semibold">{data.name}</h1>
              <p className="text-gray-600">{data.category}</p>
              <div className="flex justify-between items-center text-xl font-semibold">
                <p>${data.price}/Day</p>
                <Link to="/booking">
                  <button className="border border-yellow-700 text-black py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300">
                    Rent Now
                  </button>
                </Link>
              </div>
            </div>
            <p className="text-xl font-semibold absolute top-0 left-3">{data.distance}Km</p>
          </div>
        ))}
        {filteredData.length === 0 && (
          <p className="text-center col-span-full text-gray-500">No cars found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default CarList;
