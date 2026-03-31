import Gallery from "../components/Gallery";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
import Hero from "../components/hero/Hero";
import CarouselMin from "../components/CarouselMin";

function Home() {
  return (
    <>
      <Carousel />
      <Gallery />
      <Hero />
      <CarouselMin />
      <Footer />
    </>
  );
}

export default Home;
