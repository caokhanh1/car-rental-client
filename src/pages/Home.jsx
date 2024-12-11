import CarList from "../components/HomeComponent/CarList";
import ChatWidget from "../components/HomeComponent/ChatWidget";
import Hero from "../components/HomeComponent/Hero";
import ServiceHome from "../components/HomeComponent/ServiceHome";
import Testimonial from "../components/HomeComponent/Testimonial";

const Home = () => {
  return (
    <div>
      <Hero />
      <ServiceHome />
      <CarList />
      <Testimonial />
      <ChatWidget />
    </div>
  );
};

export default Home;
