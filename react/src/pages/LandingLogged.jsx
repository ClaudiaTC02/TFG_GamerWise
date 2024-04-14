import { CarouselSection } from "../components/CarouselSection";
import { Header } from "../components/Header";
import gamesData from "../mock/latestGame.json";

export default function LandingLogged() {
  return (
    <>
      <Header/>
      <CarouselSection gamesData = {gamesData}/>
    </>
  );
}
