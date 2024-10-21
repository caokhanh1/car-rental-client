import carIcon from "../../assets/car-icon.png";
const Hero = () => {
  return (
    <div>
      <div className="dark:bg-black dark:text-white duration-300">
        <div className="container min-h-[620px] flex">
          <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
            <div
              data-aos="zoom-in"
              data-aos-duration="1500"
              data-aos-once="false"
              className="order-1 sm:order-2"
            >
              <img
                src={carIcon}
                alt="Car Icon"
                className="sm:scale-125 relative -z-10 max-h-[600px] drop-shadow-[2px_20px_6px_rgba(0,0,0,0.50)]"
              />
            </div>
            <div className="space-y-5 order-2 sm:order-1 sm:pr-32">
              <p data-aos="fade-up" className="text-primary text-2xl font-serif">
                Nhanh chóng và tiện lợi
              </p>
              <h1
                data-aos="fade-up"
                data-aos-delay="600"
                className="text-5xl lg:text-7xl font-semibold font-serif"
              >
                Thuê xe dễ dàng
              </h1>
              <p data-aos="fade-up" data-aos-delay="1000">
                Trải nghiệm dịch vụ thuê xe linh hoạt, đáp ứng mọi nhu cầu di chuyển của bạn với sự an toàn và chất lượng hàng đầu.
              </p>
              <button
                data-aos="fade-up"
                data-aos-delay="1500"
                className="rounded-md bg-primary hover:bg-primary/80 transition duration-500 py-2 px-6 text-black"
              >
                Bắt đầu ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
