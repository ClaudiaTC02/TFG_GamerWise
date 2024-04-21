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
    if (query.match(/^\d+$/)) {
      setError("No se puede buscar un juego sólo con un número");
      return;
    }

    if (query.length < 3) {
      setError("No se puede buscar un juego con menos de 3 carácteres");
      return;
    }
    setError(null);
  }, [query]);
  return { query, setQuery, error };
}