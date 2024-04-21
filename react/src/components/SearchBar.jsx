/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/SearchBar.css";

import { useCallback, useState } from "react";
import { GameSearch } from "./GameSearch";
import { useSearch } from "../hooks/useSearch";
import { useGames } from "../hooks/useGame";
import debounce from "just-debounce-it";
import { filterIcon, searchIcon } from "./Icons";

export function SearchBar() {
  const [sort, setSort] = useState(false);
  const { query, setQuery, error } = useSearch();
  const { games, getGames, loading } = useGames({ query, sort });

  const debounceGetMovies = useCallback(
    debounce((query) => {
      getGames({ query });
    }, 500),
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
      <form className="form-search" onSubmit={handleSubmit}>
        <div className="container-search">
          <span className="icon_search">{searchIcon()}</span>
          <input
            className="input-search"
            onChange={handleChange}
            name="query"
            placeholder="GTA, Skyrim, Mario"
            value={query}
          ></input>
        </div>
        <div className="container-filter">
          <button className="button-filter">{filterIcon()}</button>
        </div>
      </form>
      {error && <p className="error-search">{error}</p>}
      {loading && !error && <p>Loading...</p>}
      {!loading && !error && (
        <main>
          <GameSearch games={games} />
        </main>
      )}
    </>
  );
}
