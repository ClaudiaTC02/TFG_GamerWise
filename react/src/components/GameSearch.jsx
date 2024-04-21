import "../styles/GameCarousel.css";
import { defaultCoverIcon } from "./Icons";
import moment from "moment";
import { Link } from "react-router-dom";

export function GameSearch({ games }) {
  const hasGames = games?.length > 0;

  return hasGames ? <ListOfGames games={games} /> : <NoGameResults />;
}

function ListOfGames({ games }) {
  console.log(games);
  return (
    <>
      {games.map((games) => {
        const date = moment.unix(games.first_release_date).format("DD/MM/YYYY");
        return (
          <Link
            to={`/game/${games.id}`}
            key={games.id}
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
        );
      })}
    </>
  );
}

function NoGameResults() {
  return <p>No se encontraron juegos</p>;
}
