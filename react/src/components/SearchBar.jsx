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
  const [selectedCategory, setSelectedCategory] = useState('');
  const { query, setQuery, error } = useSearch();
  const { games, getGames, loading } = useGames({ query, sort });

  const debounceGetGames = useCallback(
    debounce((query, category) => {
      getGames({ query, category });
    }, 500),
    [getGames]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    getGames({ query, category: selectedCategory });
  };

  const handleChange = (event) => {
    if (event.target.value.startsWith(" ")) return;
    setQuery(event.target.value);
    debounceGetGames(event.target.value, selectedCategory);
  };

  const handleSort = () => {
    setSort(!sort);
    debounceGetGames(query, selectedCategory);
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    debounceGetGames(query, event.target.value)
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
          <button className="button-filter" onClick={handleSort}>
            {filterIcon()}
          </button>
        </div>
        {sort && (
          <div>
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All</option>
              <option value="Shooter">Shooter</option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Terror">Terror</option>
              <option value="Indie">Indie</option>
            </select>
          </div>
        )}
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
