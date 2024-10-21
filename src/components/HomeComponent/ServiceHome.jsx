import { FaCameraRetro } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
const skillsData = [
    {
      name: "Giá tốt nhất",
      icon: (
        <FaCameraRetro className="text-5xl text-primary group-hover:text-black duration-300" />
      ),
      link: "#",
      description: "Chúng tôi cung cấp mức giá cạnh tranh nhất trên thị trường.",
      aosDelay: "0",
    },
    {
      name: "Nhanh chóng và an toàn",
      icon: (
        <GiNotebook className="text-5xl text-primary group-hover:text-black duration-300" />
      ),
      link: "#",
      description: "Dịch vụ an toàn, nhanh chóng với thủ tục đơn giản.",
      aosDelay: "500",
    },
    {
      name: "Tài xế chuyên nghiệp",
      icon: (
        <SlNote className="text-5xl text-primary group-hover:text-black duration-500" />
      ),
      link: "#",
      description: "Đội ngũ tài xế có kinh nghiệm, thông thạo địa phương.",
      aosDelay: "1000",
    },
  ];
const ServiceHome = () => {
  return (
    <div>
       <span id="about"></span>
      <div className="dark:bg-black dark:text-white py-14 sm:min-h-[600px] sm:grid sm:place-items-center">
        <div className="container">
          <div className="pb-12">
            <h1
              data-aos="fade-up"
              className="text-3xl font-semibold text-center sm:text-4xl font-serif"
            >
              Tại sao chọn chúng tôi?
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {skillsData.map((skill) => (
              <div
                key={skill.name}
                data-aos="fade-up"
                data-aos-delay={skill.aosDelay}
                className="card text-center group space-y-3 sm:space-y-6 p-4 sm:py-16 bg-dark  hover:bg-primary duration-300 text-white hover:text-black rounded-lg"
              >
                <div className="grid place-items-center">{skill.icon}</div>
                <h1 className="text-2xl font-bold">{skill.name}</h1>
                <p>{skill.description}</p>
                <a
                  href={skill.link}
                  className="inline-block text-lg font-semibold py-3 text-primary group-hover:text-black duration-300"
                >
                  Tìm hiểu thêm
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceHome;
