import { CarouselSection } from "../components/CarouselSection";
import { Header } from "../components/Header";
import {
  getUpcommingGamesRequest,
  getLatestGamesRequest,
} from "../api/igdb.js";

import { useEffect, useState } from "react";
import { SearchBar } from "../components/SearchBar.jsx";

export default function LandingLogged() {
  const [LatestgamesData, setLatestgamesData] = useState([]);
  const [UpcomminggamesData, setUpcomminggamesData] = useState([]);

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
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpcommingGames();
    fetchLatestGames();
  }, []);

  return (
    <>
      <Header />
      <h1>Explora el catálogo</h1>
      <SearchBar />
      <CarouselSection gamesData={LatestgamesData} text="Últimos estrenos" />
      <CarouselSection
        gamesData={UpcomminggamesData}
        text="Próximos lanzamientos"
      />
    </>
  );
}
