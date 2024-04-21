/* eslint-disable react-hooks/exhaustive-deps */
import { CarouselSection } from "../components/CarouselSection";
import { Header } from "../components/Header";
import {
  getUpcommingGamesRequest,
  getLatestGamesRequest,
} from "../api/igdb.js";
import { useGames } from "../hooks/useGame.js";
import { useSearch } from "../hooks/useSearch.js";

import { useCallback, useEffect, useState } from "react";
import debounce from "just-debounce-it";
import { GameSearch } from "../components/GameSearch.jsx";

export default function LandingLogged() {
  const [LatestgamesData, setLatestgamesData] = useState([]);
  const [UpcomminggamesData, setUpcomminggamesData] = useState([]);
  const [sort, setSort] = useState(false);
  const { query, setQuery, error } = useSearch();
  const { games, getGames, loading } = useGames({ query, sort });

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

  // search
  const debounceGetMovies = useCallback(
    debounce((query) => {
      getGames({ query });
    }, 400),
    [getGames]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    getGames({ query });
  };

  const handleChange = (event) => {
    if (event.target.value.startsWith(" ")) return;
    setQuery(event.target.value);
    debounceGetMovies(event.target.value);
  };

  const handleSort = () => {
    setSort(!sort);
  };

  return (
    <>
      <Header />
      <h1>Explora el catálogo</h1>
      <form className="form" onSubmit={handleSubmit}>
          <input
            style={{
              border: "1px solid transparent",
              borderColor: error ? "red" : "transparent",
            }}
            onChange={handleChange}
            name="query"
            placeholder="GTA, Skyrim, Mario"
            value={query}
          ></input>
          <button type="submit" className="b_search">
            Buscar
          </button>
        </form>
        {error && (
          <p className="error" style={{ color: "red" }}>
            {error}
          </p>
        )}
        <main>{loading ? <p>Cargando...</p> : <GameSearch games={games} />}</main>
      <CarouselSection gamesData={LatestgamesData} text="Últimos estrenos" />
      <CarouselSection
        gamesData={UpcomminggamesData}
        text="Próximos lanzamientos"
      />
    </>
  );
}
