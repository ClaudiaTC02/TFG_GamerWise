import { Link, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { editIcon } from "../components/Icons";
import { ListGame } from "../components/ListGame";
import "../styles/ListPage.css";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getGamesOfListWithRatingLogic } from "../logic/listLogic";

export function ListPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        const list_result = await getGamesOfListWithRatingLogic(id, token);
        if (list_result) {
          console.log(list_result);
          setList(list_result.list);
          setGames(list_result.games);
        } else {
          console.log("No se encontraron detalles del juego");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListDetails();
  }, [id, token]);

  return (
    <>
      <Header isLogged={true} />
      <div className="list-titles-container">
        <div className="list-title-container">
          <h1 className="list-title">{list.name}</h1>
          <hr className="list-hr" />
        </div>
        <div className="list-edit-container">
          <a>{editIcon()}</a>
        </div>
      </div>
      <p className="list-description">{list.description}</p>
      <main className="list-games-container">
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.igdb_id}`}
            className="game-link"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListGame game={game}/>
          </Link>
        ))}
      </main>
    </>
  );
}
