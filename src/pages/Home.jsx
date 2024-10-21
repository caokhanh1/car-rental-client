import CarList from "../components/HomeComponent/CarList";
import Hero from "../components/HomeComponent/Hero";
import ServiceHome from "../components/HomeComponent/ServiceHome";
import Testimonial from "../components/HomeComponent/Testimonial";


export default function Home() {
  return (
    <div>
      <Hero />
      <ServiceHome />
      <CarList />
      <Testimonial/>
    </div>
  );
}
