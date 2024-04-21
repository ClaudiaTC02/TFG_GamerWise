import "../styles/GameCarousel.css";
import "../styles/GameSearch.css";

import { defaultCoverIcon } from "./Icons";
import moment from "moment";
import { Link } from "react-router-dom";

export function GameSearch({ games }) {
  const hasGames = games?.length > 0;

  return hasGames ? <ListOfGames games={games} /> : <NoGameResults />;
}

function ListOfGames({ games }) {
  return (
    <ul className="games-search">
      {games.map((games) => {
        const date = moment.unix(games.year).format("DD/MM/YYYY");
        return (
          <li className="game-li" key={games.id}>
            <Link
              to={`/game/${games.id}`}
              className="game-link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="game-container">
                <div className="info-game-container">
                  <img
                    className="game-img"
                    src={
                      games.cover
                        ? games.cover.url.replace("t_thumb", "t_cover_big")
                        : defaultCoverIcon()
                    }
                    alt={games.name}
                  />
                  <div>
                    <h4 className="game-name">{games.name}</h4>
                  </div>
                  <p className="game-date">{date}</p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NoGameResults() {
  return <p className="no-found-games">No se encontraron juegos</p>;
}
