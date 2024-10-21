import CarList from "../components/HomeComponent/CarList";
import ComparePrices from "../components/HomeComponent/ComparePrices";
import Hero from "../components/HomeComponent/Hero";
import PickUpRequirement from "../components/HomeComponent/PickUpRequirements";
import ServiceHome from "../components/HomeComponent/ServiceHome";
import Testimonial from "../components/HomeComponent/Testimonial";


export default function Home() {
  return (
    <div>
      <Hero />
      <ServiceHome />
      <ComparePrices/>
      <CarList />
      <PickUpRequirement/>
      <Testimonial/>
    </div>
  );
}
