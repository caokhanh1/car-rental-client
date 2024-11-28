import CarPng from "../assets/car1.png";

const About = () => {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-6">
        {/* Giới Thiệu Chính */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-center">
          <div data-aos="zoom-in-right" data-aos-duration="1500">
            <img
              src={CarPng}
              alt="Xe"
              className="max-h-[400px] rounded-3xl shadow-xl"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-5xl sm:text-6xl font-bold text-black mb-6">
              Giới Thiệu Về Chúng Tôi
            </h1>
            <p className="leading-8 text-lg text-gray-700 mb-6">
              Chào mừng bạn đến với [Tên Công Ty]! Chúng tôi cam kết cung cấp dịch vụ thuê xe chất lượng cao, đáng tin cậy. 
            </p>
            <p className="leading-8 text-lg text-gray-700 mb-8">
              Công ty chúng tôi nổi bật nhờ vào cam kết cung cấp những chiếc xe tốt nhất, dịch vụ khách hàng xuất sắc.
            </p>
          </div>
        </div>

        {/* Các giá trị nổi bật */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div className="text-center p-6 rounded-xl shadow-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-primary mb-4">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-lg text-gray-700">
              Cung cấp trải nghiệm du lịch an toàn và liền mạch với dịch vụ chất lượng cao.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl shadow-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-primary mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-lg text-gray-700">
              Dịch vụ minh bạch, linh hoạt, hỗ trợ 24/7 là lý do tại sao khách hàng luôn tin tưởng chúng tôi.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl shadow-lg bg-gray-100">
            <h2 className="text-2xl font-semibold text-primary mb-4">Điều Gì Làm Chúng Tôi Khác Biệt?</h2>
            <p className="text-lg text-gray-700">
              Dịch vụ cá nhân hóa, đội xe đa dạng và cam kết chất lượng khiến chúng tôi nổi bật.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
