import whiteCar from "../../assets/white-car.png";
import car2 from "../../assets/car5.png";
import car3 from "../../assets/car6.png";
import { Link } from "react-router-dom";

const carList = [
  {
    name: "BMW UX",
    price: 100,
    image: whiteCar,
    aosDelay: "0",
  },
  {
    name: "KIA UX",
    price: 140,
    image: car2,
    aosDelay: "500",
  },
  {
    name: "BMW UX",
    price: 100,
    image: car3,
    aosDelay: "1000",
  },
];

const CarList = () => {
  return (
    <div>
      <div className="pb-24">
        <div className="container">
          {/* Heading */}
          <h1
            data-aos="fade-up"
            className="text-3xl sm:text-4xl font-semibold font-serif mb-3"
          >
            Lorem ipsum dolor
          </h1>
          <p data-aos="fade-up" className="text-sm pb-10">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor iure
            nemo ab?
          </p>
          {/* Car listing */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
              {carList.map((data, index) => (
                <div
                  key={index}
                  className="space-y-3 border-2 border-gray-300 hover:border-primary p-3 rounded-xl relative group"
                >
                  <div className="w-full h-[120px]">
                    <img
                      src={data.image}
                      alt={data.name}
                      className="w-full h-[120px] object-contain sm:translate-x-8 group-hover:sm:translate-x-16 duration-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-primary font-semibold">{data.name}</h1>
                    <div className="flex justify-between items-center text-xl font-semibold">
                      <p>${data.price}/Day</p>
                      <Link to="/booking">
                        <button className="border border-yellow-700 text-black py-2 px-4 rounded-md hover:bg-gray-100 transition duration-300">
                          Rent Now
                        </button>
                      </Link>
                    </div>
                  </div>
                  <p className="text-xl font-semibold absolute top-0 left-3">
                    12Km
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* End of car listing */}
          <Link to="/cars">
            <div className="grid place-items-center mt-8">
              <button
                data-aos="fade-up"
                data-aos-delay="1500"
                className="rounded-md bg-primary hover:bg-primary/80 transition duration-500 py-2 px-6 text-black"
              >
                Get Started
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarList;
