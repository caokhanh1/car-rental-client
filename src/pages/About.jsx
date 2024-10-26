import CarPng from "../assets/car1.png";
const About = () => {
  return (
    <div>
      <div className="sm:min-h-[600px] sm:grid sm:place-items-center duration-300">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center">
            <div data-aos="slide-right" data-aos-duration="1500">
              <img
                src={CarPng}
                alt=""
                className="sm:scale-125 sm:-translate-x-11 max-h-[300px] drop-shadow-[2px_10px_6px_rgba(0,0,0,0.50)]"
              />
            </div>
            <div>
              <div className="space-y-5 sm:p-16 pb-6">
                <h1
                  data-aos="fade-up"
                  className="text-3xl sm:text-4xl font-bold font-serif"
                >
                  Về Chúng Tôi
                </h1>
                <p data-aos="fade-up" className="leading-8 tracking-wide">
                  Chúng tôi cung cấp dịch vụ thuê xe chuyên nghiệp với đa dạng các dòng xe 
                  từ xe du lịch, xe gia đình đến xe sang trọng. Với nhiều năm kinh nghiệm, 
                  chúng tôi cam kết mang đến sự hài lòng tối đa cho khách hàng.
                </p>
                <p data-aos="fade-up">
                  Dù bạn cần thuê xe cho chuyến đi công tác, kỳ nghỉ gia đình, 
                  hay các sự kiện đặc biệt, chúng tôi đều có giải pháp phù hợp với nhu cầu của bạn.
                </p>
                <button
                  data-aos="fade-up"
                  data-aos-delay="1500"
                  className="rounded-md bg-primary hover:bg-primary/80 transition duration-500 py-2 px-6 text-black"
                >
                  Bắt Đầu Thuê Xe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
