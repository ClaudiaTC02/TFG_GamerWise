/* eslint-disable no-unused-vars */
import { useRef, useState, useMemo, useCallback } from "react";
import { searchGame } from "../api/igdb.js";

export function useGames({ query, sort, category }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevSearch = useRef();
  const prevCategory = useRef();

  const getGames = useCallback(async ({ query, category }) => {
    //inyectado para que solo se ejecute 1 vez
    if (query === prevSearch.current & category === prevCategory.current) return;
    try {
      prevSearch.current = query;
      prevCategory.current = category;
      setLoading(true);
      setError(null);
      const data = await searchGame(query, category);
      setGames(data);
    } catch (error) {
      setError(error.message);
    } finally {
      // esto es lo que entra tanto en el try y en catch
      setLoading(false);
    }
  }, []);

  return { games, getGames, loading };
}
