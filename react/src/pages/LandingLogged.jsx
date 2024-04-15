import { CarouselSection } from "../components/CarouselSection";
import { Header } from "../components/Header";
import { getUpcommingGamesRequest, getLatestGamesRequest } from "../api/igdb.js";
import { useEffect, useState } from "react";

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

    fetchUpcommingGames()
    fetchLatestGames();
  }, []);

  return (
    <>
      <Header/>
      <CarouselSection gamesData = {LatestgamesData}/>
      <CarouselSection gamesData = {UpcomminggamesData}/>
    </>
  );
}
