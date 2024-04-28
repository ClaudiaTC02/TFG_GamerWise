import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllRatingsOfUserRequest } from "../api/rating";
import BarChart from "./BarChart";
import { CarouselSection } from "./CarouselSection";

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

  const getGamesRated = async () => {
    
  }

  // Función para manejar el clic en la barra
  const handleBarClick = (label, value) => {
    console.log(`Se ha hecho clic en la barra ${label} con valor ${value}`);
    setValue(value);
  };
  return (
    <>
      {ratings && <BarChart scores={ratings} onBarClick={handleBarClick} />}
      {value && games && (
        <CarouselSection
          gamesData={games}
          text={`Juegos Puntuados con ${value} estrella`}
        />
      )}
    </>
  );
}
