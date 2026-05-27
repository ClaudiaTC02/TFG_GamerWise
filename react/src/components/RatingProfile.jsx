import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getAllRatingsOfUserRequest,
  getGamesWithSpecificRatingRequest,
} from "../api/rating";
import { GameSearch } from "./GameSearch";
import { getGameDetailsRequest } from "../api/igdb";
import { HorizontalBars } from "./BarChart"; 
import '../styles/RatingSection.css';

export function RatingProfile() {
  const [ratings, setRatings] = useState();
  const [value, setValue] = useState(null);
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ratingsResponse = await getAllRatingsOfUserRequest(token);
        setRatings(ratingsResponse);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [token]);

  const getGamesRated = async (stars) => {
    setLoading(true);
    try {
      const ratedGames = await getGamesWithSpecificRatingRequest(token, stars);
      const ratedDetailedGames = await Promise.all(
        ratedGames.map(async (game) => {
          const game_details = await getGameDetailsRequest(game.igdb_id);
          return {
            id: game_details[0].id,
            name: game_details[0].name,
            year: game_details[0].first_release_date,
            cover: game_details[0].cover,
          };
        })
      );
      setGames(ratedDetailedGames);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarClick = async (label, count) => {
    console.log(`Clic en barra ${label} con valor ${count}`);
    setValue(label);
    setGames(null);
    await getGamesRated(label);
  };

  return (
    <div className="rating-profile-outer">
      <div className="rating-profile-wrapper">
        <div className="bar-chart-container">
          {ratings && (
            <HorizontalBars
              scores={ratings}
              onBarClick={handleBarClick}
              activeValue={value}
            />
          )}
        </div>
        
        <section className="rating-section-container">
          {!value && (
            <div className="rating-empty-state">
              <span className="rating-empty-icon">☆</span>
              <p>Selecciona una puntuación para ver los juegos</p>
            </div>
          )}

          {value && loading && (
            <div className="rating-empty-state">
              <p>Cargando juegos...</p>
            </div>
          )}

          {value && !loading && games && (
            <>
              <div className="rating-header">
                <h2 className="rating-title-clicked">
                  ☆ {value} estrella{value !== 1 ? "s" : ""}
                  <span className="rating-count-badge">{games.length} juegos</span>
                </h2>
                <hr className="rating-hr" />
              </div>
              <div className="rating-games">
                <GameSearch games={games} />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}