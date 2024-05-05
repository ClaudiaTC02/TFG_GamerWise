import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getAllRatingsOfUserRequest,
  getGamesWithSpecificRatingRequest,
} from "../api/rating";
import BarChart from "./BarChart";
import { GameSearch } from "./GameSearch";
import { getGameDetailsRequest } from "../api/igdb";

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
    const ratedDetailedGames = await Promise.all(
      ratedGames.map(async (game) => {
        const game_details = await getGameDetailsRequest(game.igdb_id);
        const details = {
          id: game_details[0].id,
          name: game_details[0].name,
          year: game_details[0].first_release_date,
          cover: game_details[0].cover,
        }
        return details; 
      })
    );
    console.log(ratedDetailedGames)
    setGames(ratedDetailedGames);
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
          <section className="rating-section-container">
            <h2 className="rating-title-clicked">{`Juegos Puntuados con ${value} estrella`}</h2>
            <hr className="rating-hr" />
            <div className="rating-games">
              <GameSearch games={games} />
            </div>
          </section>
        </>
      )}
    </>
  );
}
