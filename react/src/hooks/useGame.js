/* eslint-disable no-unused-vars */
import { useRef, useState, useMemo, useCallback } from "react";
import { searchGame } from "../api/igdb.js";

export function useGames({ query, sort }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevSearch = useRef();

  const getGames = useCallback(async ({ query }) => {
    //inyectado para que solo se ejecute 1 vez
    if (query === prevSearch.current) return;
    try {
      prevSearch.current = query;
      setLoading(true);
      setError(null);
      const data = await searchGame(query);
      setGames(data);
    } catch (error) {
      setError(error.message);
    } finally {
      // esto es lo que entra tanto en el try y en catch
      setLoading(false);
    }
  }, []);

  const sortedGames = useMemo(() => {
    return sort
      ? [...games].sort((a, b) => a.title.localeCompare(b.title))
      : games;
  }, [sort, games]);

  return { games: sortedGames, getGames, loading };
}
