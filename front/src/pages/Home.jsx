import Gallery from "../components/Gallery";
import Carousel from "../components/Carousel";
import Hero from "../components/hero/Hero";
import CarouselMin from "../components/CarouselMin";

function Home() {
  return (
    <>
      <Carousel />
      <Gallery />
      <Hero />
      <CarouselMin />
    </>
  );
}

export default Home;
