const testimonialData = [
  {
    name: "Dilshad",
    image: "",
    description: "Dịch vụ tuyệt vời, xe sạch sẽ và đội ngũ hỗ trợ nhiệt tình.",
    aosDelay: "0",
  },
  {
    name: "Satya",
    image: "",
    description: "Giá cả hợp lý, thủ tục nhanh gọn và xe chất lượng tốt.",
    aosDelay: "300",
  },
  {
    name: "Sabir",
    image: "",
    description: "Tôi rất hài lòng với dịch vụ, chắc chắn sẽ thuê xe lại lần sau.",
    aosDelay: "1000",
  },
];

const Testimonial = () => {
return (
  <div>
     <span id="about"></span>
    <div className="dark:bg-black dark:text-white py-14 sm:pb-24">
      <div className="container">
        {/* Header */}
        <div className="space-y-4 pb-12">
          <p
            data-aos="fade-up"
            className="text-3xl font-semibold text-center sm:text-4xl font-serif"
          >
            Khách hàng nói gì về chúng tôi
          </p>
          <p data-aos="fade-up" className="text-center sm:px-44">
            Chúng tôi luôn nỗ lực mang đến những trải nghiệm thuê xe tốt nhất với dịch vụ chuyên nghiệp và tận tâm.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black">
          {testimonialData.map((skill) => (
            <div
              key={skill.name}
              data-aos="fade-up"
              data-aos-delay={skill.aosDelay}
              className="card text-center group space-y-3 sm:space-y-6 p-4 sm:py-12 dark:bg-white/20 bg-gray-200 duration-300  rounded-lg "
            >
              <div className="grid place-items-center ">
                <img
                  src="https://picsum.photos/200"
                  alt=""
                  className="rounded-full w-20 h-20"
                />
              </div>
              <div className="text-2xl">⭐⭐⭐⭐⭐</div>
              <p>{skill.description}</p>
              <p className="text-center font-semibold">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)
}

export default Testimonial;
