import "../styles/LandingLoggedPage.css";
import { CarouselSection } from "../components/CarouselSection";
import { Header } from "../components/Header";
import {
  getUpcommingGamesRequest,
  getLatestGamesRequest,
} from "../api/igdb.js";

import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar.jsx";
import { pixelsIcon } from "../components/Icons.jsx";
import { Footer } from "../components/Footer.jsx";
import { getLandingRecommendationsLogic } from "../logic/recommendationsLogic.js";
import { useAuth } from "../hooks/useAuth.js";

export default function LandingLogged() {
  const [LatestgamesData, setLatestgamesData] = useState([]);
  const [UpcomminggamesData, setUpcomminggamesData] = useState([]);
  const [RecommendationsLanding, setRecommendationsLanding] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchLatestGames = async () => {
      try {
        const games = await getLatestGamesRequest();
        setLatestgamesData(games);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUpcommingGames = async () => {
      try {
        const games = await getUpcommingGamesRequest();
        setUpcomminggamesData(games);
        console.log(games)
      } catch (error) {
        console.log(error);
      }
    };

    const fetchLandingRecommendations = async () => {
      try {
          const games = await getLandingRecommendationsLogic(token)
          console.log(games)
          setRecommendationsLanding(games)
      } catch (error) {
        console.log(error);
      }
    }

    fetchUpcommingGames();
    fetchLatestGames();
    fetchLandingRecommendations();
  }, [token]);

  return (
    <>
      <Header isLogged={true} />
      <section className="logged-container-section">
        <div className="logged-section">
          <div className="logged-pixels-container">
            <img className="logged-pixels" src={pixelsIcon()} alt="pixeles" />
          </div>
          <div className="logged-title-container">
            <h1 className="logged-title">
              <span className="highlited-text">Explora</span> el catálogo
            </h1>
            <h2 className="logged-subtitle">
              Tu <span className="underline-text">búsqueda</span> tus{" "}
              <span className="highlited-text">Reglas</span>
            </h2>
          </div>
          <div className="logged-pixels-container">
            <img
              className="logged-pixels flipped"
              src={pixelsIcon()}
              alt="pixeles"
            />
          </div>
        </div>
        <SearchBar />
      </section>
      {RecommendationsLanding.length == 0 ? null : <CarouselSection gamesData={RecommendationsLanding} text="Para ti"/>}
      <CarouselSection gamesData={LatestgamesData} text="Últimos estrenos" />
      <CarouselSection
        gamesData={UpcomminggamesData}
        text="Próximos lanzamientos"
      />
      <Footer />
    </>
  );
}
