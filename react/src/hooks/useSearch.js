import { useEffect, useState, useRef } from "react";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const isFirst = useRef(true);

  useEffect(() => {
    // first time
    if (isFirst.current) {
      isFirst.current = query === "";
      return
    }
    if (query === "") {
      setError("No se puede buscar un juego vacio");
      return;
    }
    setError(null);
  }, [query]);
  return { query, setQuery, error };
}