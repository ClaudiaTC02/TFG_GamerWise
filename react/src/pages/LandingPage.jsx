import { FooterLanding } from "../components/Footer";
import { Header } from "../components/Header";
import "../styles/Footer.css";

export default function LandingPage() {
  return (
    <>
      <Header isLanding={true} />
      <div>
        <h1>CADA JUGADOR MERECE SU JUEGO PERFECTO</h1>
      </div>
      <FooterLanding />
    </>
  );
}
