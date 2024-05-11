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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const { query, setQuery, error, setSortSearch } = useSearch();
  const { games, getGames, loading } = useGames({ query, sort });

  const debounceGetGames = useCallback(
    debounce((query, category, platform) => {
      getGames({ query, category, platform });
    }, 500),
    [getGames]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    getGames({ query, category: selectedCategory, platform: selectedPlatform });
  };

  const handleChange = (event) => {
    if (event.target.value.startsWith(" ")) return;
    setQuery(event.target.value);
    debounceGetGames(event.target.value, selectedCategory, selectedPlatform);
  };

  const handleSort = () => {
    setSort(!sort);
    setSortSearch(!sort);
    setSelectedCategory("");
    setSelectedPlatform("");
    debounceGetGames(query, selectedCategory, selectedPlatform);
  };
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    debounceGetGames(query, event.target.value, selectedPlatform);
  };
  const handlePlatformChange = (event) => {
    setSelectedPlatform(event.target.value);
    debounceGetGames(query, selectedCategory, event.target.value);
    console.log(event.target.value);
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
      </form>
      {sort && (
        <div className="container-select-filters">
          <div className="container-select">
            <p>Género: </p>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All</option>
              <option value="Shooter">Shooter</option>
              <option value="Adventure">Adventure</option>
              <option value="Indie">Indie</option>
              <option value="MOBA">MOBA</option>
              <option value="Point-and-click">Point-and-click</option>
              <option value="Music">Music</option>
              <option value="Fighting">Fighting</option>
              <option value="Puzzle">Puzzle</option>
              <option value="Racing">Racing</option>
              <option value="Simulator">Simulator</option>
              <option value="Strategy">Strategy</option>
              <option value="Tactical">Tactical</option>
              <option value="Arcade">Arcade</option>
              <option value="Visual Novel">Visual Novel</option>
            </select>
          </div>
          <div className="container-select">
            <p>Plataforma: </p>
            <select
              className="form-select"
              value={selectedPlatform}
              onChange={handlePlatformChange}
            >
              <option value="">All</option>
              <option value="PC (Microsoft Windows)">
                PC (Microsoft Windows)
              </option>
              <option value="Mac">Mac</option>
              <optgroup label="Nintendo">
                <option value="Nintendo Switch">Nintendo Switch</option>
                <option value="Nintendo 3DS">Nintendo 3DS</option>
                <option value="Nintendo DS">Nintendo DS</option>
                <option value="Wii">Wii</option>
                <option value="Nintendo 64">Nintendo 64</option>
              </optgroup>
              <optgroup label="PlayStation">
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="PlayStation 4">PlayStation 4</option>
                <option value="PlayStation 3">PlayStation 3</option>
              </optgroup>
              <optgroup label="Nintendo">
                <option value="Xbox Series X|S">Xbox Series X|S</option>
                <option value="Xbox One">Xbox One</option>
                <option value="Xbox 360">Xbox 360</option>
              </optgroup>
              <optgroup label="VR">
                <option value="SteamVR">SteamVR</option>
                <option value="Oculus VR">Oculus VR</option>
                <option value="PlayStation VR2">PlayStation VR2</option>
                <option value="PlayStation VR">PlayStation VR</option>
              </optgroup>
            </select>
          </div>
        </div>
      )}
      {error && <p className="error-search">{error}</p>}
      {loading && !error && <p>Loading...</p>}
      {!loading && !error && (
        <main className="super-search-container">
          <GameSearch games={games} />
        </main>
      )}
    </>
  );
}
