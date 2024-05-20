import { useEffect, useState, useRef } from "react";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [sortSearch, setSortSearch] = useState(false)
  const isFirst = useRef(true);

  useEffect(() => {
    // first time
    if (isFirst.current) {
      isFirst.current = query === "";
      return
    }
    if (query === "" & !sortSearch) {
      setError("No se puede buscar un juego vacio");
      return;
    }
    setError(null);
  }, [query, sortSearch]);
  return { query, setQuery, error, setSortSearch };
}