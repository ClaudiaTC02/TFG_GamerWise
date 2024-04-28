import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getAllRatingsOfUserRequest,
  getGamesWithSpecificRatingRequest,
} from "../api/rating";
import BarChart from "./BarChart";
import { GameSearch } from "./GameSearch";

export function RatingProfile() {
  const [ratings, setRatings] = useState();
  const [value, setValue] = useState(null);
  const [games, setGames] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ratingsResponse = await getAllRatingsOfUserRequest(token);
        setRatings(ratingsResponse);
        console.log(ratingsResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  const getGamesRated = async (value) => {
    const ratedGames = await getGamesWithSpecificRatingRequest(token, value);
    console.log(ratedGames);
    setGames(ratedGames);
  };

  // Función para manejar el clic en la barra
  const handleBarClick = async (label, value) => {
    console.log(`Se ha hecho clic en la barra ${label} con valor ${value}`);
    setValue(label);
    await getGamesRated(label);
  };
  return (
    <>
      {ratings && <BarChart scores={ratings} onBarClick={handleBarClick} />}
      {value && games && (
        <>
          <h2 className="rating-title-clicked">{`Juegos Puntuados con ${value} estrella`}</h2>
          <GameSearch games={games} />
        </>
      )}
    </>
  );
}
